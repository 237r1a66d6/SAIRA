<?php
// Teacher Application Form API
require_once '../../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, [], 'Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['fullName', 'email', 'phone', 'qualification'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        sendJsonResponse(false, [], "Field '$field' is required", 400);
    }
}

// Sanitize inputs
$fullName = sanitize_input($input['fullName']);
$email = sanitize_input($input['email']);
$phone = sanitize_input($input['phone']);
$qualification = sanitize_input($input['qualification']);
$experienceYears = isset($input['experienceYears']) ? intval($input['experienceYears']) : null;
$subjects = isset($input['subjects']) ? sanitize_input($input['subjects']) : null;
$currentSchool = isset($input['currentSchool']) ? sanitize_input($input['currentSchool']) : null;
$city = isset($input['city']) ? sanitize_input($input['city']) : null;
$state = isset($input['state']) ? sanitize_input($input['state']) : null;
$coverLetter = isset($input['coverLetter']) ? sanitize_input($input['coverLetter']) : null;

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse(false, [], 'Invalid email address', 400);
}

// Insert into database
$sql = "INSERT INTO teacher_applications (full_name, email, phone, qualification, experience_years, subjects, current_school, city, state, cover_letter) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssisssss", $fullName, $email, $phone, $qualification, $experienceYears, $subjects, $currentSchool, $city, $state, $coverLetter);

if ($stmt->execute()) {
    sendJsonResponse(true, ['id' => $stmt->insert_id], 'Teacher application submitted successfully', 201);
} else {
    error_log("Teacher application error: " . $stmt->error);
    sendJsonResponse(false, [], 'Failed to submit teacher application', 500);
}

$stmt->close();
$conn->close();
?>
