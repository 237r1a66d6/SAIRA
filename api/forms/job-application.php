<?php
// Job Application Form API
require_once '../../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, [], 'Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['jobPosition', 'fullName', 'email', 'phone', 'qualification'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        sendJsonResponse(false, [], "Field '$field' is required", 400);
    }
}

// Sanitize inputs
$jobPosition = sanitize_input($input['jobPosition']);
$fullName = sanitize_input($input['fullName']);
$email = sanitize_input($input['email']);
$phone = sanitize_input($input['phone']);
$qualification = sanitize_input($input['qualification']);
$experienceYears = isset($input['experienceYears']) ? intval($input['experienceYears']) : null;
$currentCompany = isset($input['currentCompany']) ? sanitize_input($input['currentCompany']) : null;
$city = isset($input['city']) ? sanitize_input($input['city']) : null;
$state = isset($input['state']) ? sanitize_input($input['state']) : null;
$coverLetter = isset($input['coverLetter']) ? sanitize_input($input['coverLetter']) : null;
$expectedSalary = isset($input['expectedSalary']) ? sanitize_input($input['expectedSalary']) : null;
$availableFrom = isset($input['availableFrom']) ? sanitize_input($input['availableFrom']) : null;

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse(false, [], 'Invalid email address', 400);
}

// Insert into database
$sql = "INSERT INTO job_applications (job_position, full_name, email, phone, qualification, experience_years, current_company, city, state, cover_letter, expected_salary, available_from) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssisssssss", $jobPosition, $fullName, $email, $phone, $qualification, $experienceYears, $currentCompany, $city, $state, $coverLetter, $expectedSalary, $availableFrom);

if ($stmt->execute()) {
    sendJsonResponse(true, ['id' => $stmt->insert_id], 'Job application submitted successfully', 201);
} else {
    error_log("Job application error: " . $stmt->error);
    sendJsonResponse(false, [], 'Failed to submit job application', 500);
}

$stmt->close();
$conn->close();
?>
