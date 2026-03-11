<?php
// Mentor Application Form API
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
$expertiseArea = isset($input['expertiseArea']) ? sanitize_input($input['expertiseArea']) : null;
$currentPosition = isset($input['currentPosition']) ? sanitize_input($input['currentPosition']) : null;
$organization = isset($input['organization']) ? sanitize_input($input['organization']) : null;
$city = isset($input['city']) ? sanitize_input($input['city']) : null;
$state = isset($input['state']) ? sanitize_input($input['state']) : null;
$bio = isset($input['bio']) ? sanitize_input($input['bio']) : null;
$linkedinUrl = isset($input['linkedinUrl']) ? sanitize_input($input['linkedinUrl']) : null;

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse(false, [], 'Invalid email address', 400);
}

// Insert into database
$sql = "INSERT INTO mentor_applications (full_name, email, phone, qualification, experience_years, expertise_area, current_position, organization, city, state, bio, linkedin_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssisssssss", $fullName, $email, $phone, $qualification, $experienceYears, $expertiseArea, $currentPosition, $organization, $city, $state, $bio, $linkedinUrl);

if ($stmt->execute()) {
    sendJsonResponse(true, ['id' => $stmt->insert_id], 'Mentor application submitted successfully', 201);
} else {
    error_log("Mentor application error: " . $stmt->error);
    sendJsonResponse(false, [], 'Failed to submit mentor application', 500);
}

$stmt->close();
$conn->close();
?>
