<?php
// Enrollment Form API
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
$currentStatus = isset($input['currentStatus']) ? sanitize_input($input['currentStatus']) : null;
$programInterest = isset($input['programInterest']) ? sanitize_input($input['programInterest']) : null;
$preferredSchedule = isset($input['preferredSchedule']) ? sanitize_input($input['preferredSchedule']) : null;
$message = isset($input['message']) ? sanitize_input($input['message']) : null;

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse(false, [], 'Invalid email address', 400);
}

// Insert into database
$sql = "INSERT INTO enrollment_applications (full_name, email, phone, qualification, current_status, program_interest, preferred_schedule, message) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssss", $fullName, $email, $phone, $qualification, $currentStatus, $programInterest, $preferredSchedule, $message);

if ($stmt->execute()) {
    sendJsonResponse(true, ['id' => $stmt->insert_id], 'Enrollment application submitted successfully', 201);
} else {
    error_log("Enrollment error: " . $stmt->error);
    sendJsonResponse(false, [], 'Failed to submit enrollment application', 500);
}

$stmt->close();
$conn->close();
?>
