<?php
// Contact Form Submission API
require_once '../../db_connect.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, [], 'Method not allowed', 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['name', 'email', 'message'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        sendJsonResponse(false, [], "Field '$field' is required", 400);
    }
}

// Sanitize inputs
$name = sanitize_input($input['name']);
$email = sanitize_input($input['email']);
$phone = isset($input['phone']) ? sanitize_input($input['phone']) : null;
$subject = isset($input['subject']) ? sanitize_input($input['subject']) : null;
$message = sanitize_input($input['message']);

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse(false, [], 'Invalid email address', 400);
}

// Insert into database
$sql = "INSERT INTO contact_submissions (name, email, phone, subject, message, status) 
        VALUES (?, ?, ?, ?, ?, 'new')";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $name, $email, $phone, $subject, $message);

if ($stmt->execute()) {
    sendJsonResponse(true, ['id' => $stmt->insert_id], 'Contact form submitted successfully', 201);
} else {
    error_log("Contact form error: " . $stmt->error);
    sendJsonResponse(false, [], 'Failed to submit contact form', 500);
}

$stmt->close();
$conn->close();
?>
