<?php
// School Requirement Form API
require_once '../../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, [], 'Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['schoolName', 'contactPerson', 'email', 'phone', 'requirementType', 'details'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        sendJsonResponse(false, [], "Field '$field' is required", 400);
    }
}

// Sanitize inputs
$schoolName = sanitize_input($input['schoolName']);
$contactPerson = sanitize_input($input['contactPerson']);
$email = sanitize_input($input['email']);
$phone = sanitize_input($input['phone']);
$city = isset($input['city']) ? sanitize_input($input['city']) : null;
$state = isset($input['state']) ? sanitize_input($input['state']) : null;
$requirementType = sanitize_input($input['requirementType']);
$subjectArea = isset($input['subjectArea']) ? sanitize_input($input['subjectArea']) : null;
$details = sanitize_input($input['details']);

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse(false, [], 'Invalid email address', 400);
}

// Insert into database
$sql = "INSERT INTO school_requirements (school_name, contact_person, email, phone, city, state, requirement_type, subject_area, details) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssssss", $schoolName, $contactPerson, $email, $phone, $city, $state, $requirementType, $subjectArea, $details);

if ($stmt->execute()) {
    sendJsonResponse(true, ['id' => $stmt->insert_id], 'School requirement submitted successfully', 201);
} else {
    error_log("School requirement error: " . $stmt->error);
    sendJsonResponse(false, [], 'Failed to submit school requirement', 500);
}

$stmt->close();
$conn->close();
?>
