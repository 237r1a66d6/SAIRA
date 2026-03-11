<?php
// Contact Form Submission API
require_once '../../db_connect.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, [], 'Method not allowed', 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Map frontend field names to backend field names
$name = isset($input['contactName']) ? $input['contactName'] : (isset($input['name']) ? $input['name'] : '');
$email = isset($input['contactEmail']) ? $input['contactEmail'] : (isset($input['email']) ? $input['email'] : '');
$phone = isset($input['contactPhone']) ? $input['contactPhone'] : (isset($input['phone']) ? $input['phone'] : null);
$subject = isset($input['contactSubject']) ? $input['contactSubject'] : (isset($input['subject']) ? $input['subject'] : 'Contact Form Submission');
$message = isset($input['contactMessage']) ? $input['contactMessage'] : (isset($input['message']) ? $input['message'] : '');
$contactType = isset($input['contactType']) ? $input['contactType'] : 'general';

// Validate required fields
if (empty($name) || empty($email) || empty($message)) {
    sendJsonResponse(false, [], 'Name, email, and message are required', 400);
}

// Sanitize inputs
$name = sanitize_input($name);
$email = sanitize_input($email);
$phone = $phone ? sanitize_input($phone) : null;
$subject = sanitize_input($subject);
$message = sanitize_input($message);
$contactType = sanitize_input($contactType);

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse(false, [], 'Invalid email address', 400);
}

// Insert into database (updated to include contact_type)
$sql = "INSERT INTO contact_submissions (name, email, phone, subject, message, contact_type, status) 
        VALUES (?, ?, ?, ?, ?, ?, 'new')";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssss", $name, $email, $phone, $subject, $message, $contactType);

$dbSuccess = $stmt->execute();
$insertId = $stmt->insert_id;
$stmt->close();

// Send email notification to admin
$to = "bvsrigautam@gmail.com";
$emailSubject = "New Contact Form Submission: " . $subject;

// Create email body
$emailBody = "You have received a new message from the SAIRA ACAD contact form.\n\n";
$emailBody .= "Contact Details:\n";
$emailBody .= "================\n";
$emailBody .= "Name: " . $name . "\n";
$emailBody .= "Email: " . $email . "\n";
$emailBody .= "Phone: " . ($phone ? $phone : 'Not provided') . "\n";
$emailBody .= "Contact Type: " . ucfirst($contactType) . "\n";
$emailBody .= "Subject: " . $subject . "\n\n";
$emailBody .= "Message:\n";
$emailBody .= "--------\n";
$emailBody .= $message . "\n\n";
$emailBody .= "================\n";
$emailBody .= "Submitted on: " . date('F j, Y, g:i a') . "\n";
$emailBody .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";

// Email headers
$headers = "From: SAIRA ACAD <noreply@sairaacad.com>\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$mailSent = mail($to, $emailSubject, $emailBody, $headers);

// Log email status
if (!$mailSent) {
    error_log("Failed to send contact form email for submission ID: " . $insertId);
}

if ($dbSuccess) {
    sendJsonResponse(true, [
        'id' => $insertId,
        'emailSent' => $mailSent
    ], 'Contact form submitted successfully', 201);
} else {
    error_log("Contact form error: Failed to insert into database");
    sendJsonResponse(false, [], 'Failed to submit contact form', 500);
}

$conn->close();
?>
