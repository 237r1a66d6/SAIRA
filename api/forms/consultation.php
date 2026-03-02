<?php
// Consultation Request Form API
require_once '../../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, [], 'Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['fullName', 'email', 'phone', 'consultationType'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        sendJsonResponse(false, [], "Field '$field' is required", 400);
    }
}

// Sanitize inputs
$fullName = sanitize_input($input['fullName']);
$email = sanitize_input($input['email']);
$phone = sanitize_input($input['phone']);
$consultationType = sanitize_input($input['consultationType']);
$preferredDate = isset($input['preferredDate']) ? sanitize_input($input['preferredDate']) : null;
$preferredTime = isset($input['preferredTime']) ? sanitize_input($input['preferredTime']) : null;
$message = isset($input['message']) ? sanitize_input($input['message']) : null;

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse(false, [], 'Invalid email address', 400);
}

// Insert into database
$sql = "INSERT INTO consultation_requests (full_name, email, phone, consultation_type, preferred_date, preferred_time, message) 
        VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssss", $fullName, $email, $phone, $consultationType, $preferredDate, $preferredTime, $message);

if ($stmt->execute()) {
    sendJsonResponse(true, ['id' => $stmt->insert_id], 'Consultation request submitted successfully', 201);
} else {
    error_log("Consultation request error: " . $stmt->error);
    sendJsonResponse(false, [], 'Failed to submit consultation request', 500);
}

$stmt->close();
$conn->close();
?>
