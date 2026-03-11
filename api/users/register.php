<?php
// User Registration API
require_once '../../db_connect.php';

// Enable error logging for debugging
error_log("========== REGISTER.PHP CALLED ==========");
error_log("Method: " . $_SERVER['REQUEST_METHOD']);
error_log("Request Time: " . date('Y-m-d H:i:s'));

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_log("ERROR: Method not allowed");
    sendJsonResponse(false, [], 'Method not allowed', 405);
}

$rawInput = file_get_contents('php://input');
error_log("Raw Input: " . $rawInput);

$input = json_decode($rawInput, true);
error_log("Decoded Input: " . json_encode($input));

// Validate required fields
$required = ['username', 'phone', 'qualification', 'email', 'password'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        error_log("ERROR: Missing field: $field");
        sendJsonResponse(false, [], "Field '$field' is required", 400);
    }
}
error_log("✅ All required fields present");

// Sanitize inputs
$username = sanitize_input($input['username']);
$phone = sanitize_input($input['phone']);
$qualification = sanitize_input($input['qualification']);
$email = sanitize_input($input['email']);
$password = $input['password'];

error_log("Sanitized data - Username: $username, Email: $email, Phone: $phone, Qualification: $qualification");

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    error_log("ERROR: Invalid email");
    sendJsonResponse(false, [], 'Invalid email address', 400);
}

// Validate password strength
if (strlen($password) < 6) {
    error_log("ERROR: Password too short");
    sendJsonResponse(false, [], 'Password must be at least 6 characters', 400);
}
error_log("✅ Email and password validation passed");

// Check if user already exists
error_log("Checking for existing user...");
$checkSql = "SELECT id FROM users WHERE username = ? OR email = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("ss", $username, $email);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    error_log("ERROR: User already exists");
    sendJsonResponse(false, [], 'Username or email already exists', 409);
}
$checkStmt->close();
error_log("✅ No existing user found");

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
error_log("✅ Password hashed successfully");

// Insert into database
error_log("Attempting to insert user into database...");
$sql = "INSERT INTO users (username, phone, qualification, email, password, status) 
        VALUES (?, ?, ?, ?, ?, 'active')";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $username, $phone, $qualification, $email, $hashedPassword);

if ($stmt->execute()) {
    $userId = $stmt->insert_id;
    error_log("✅ SUCCESS! User inserted with ID: $userId");
    
    // Log activity
    error_log("Logging activity...");
    $activitySql = "INSERT INTO user_activity_log (user_type, user_id, activity_type, activity_description, ip_address) 
                    VALUES ('user', ?, 'registration', 'User registered', ?)";
    $activityStmt = $conn->prepare($activitySql);
    $ipAddress = $_SERVER['REMOTE_ADDR'];
    $activityStmt->bind_param("is", $userId, $ipAddress);
    $activityStmt->execute();
    $activityStmt->close();
    error_log("✅ Activity logged");
    
    error_log("Sending success response...");
    sendJsonResponse(true, ['id' => $userId, 'username' => $username], 'Registration successful', 201);
} else {
    error_log("❌ DATABASE ERROR: " . $stmt->error);
    error_log("❌ MySQL Error Code: " . $conn->errno);
    error_log("❌ MySQL Error: " . $conn->error);
    sendJsonResponse(false, [], 'Registration failed: ' . $stmt->error, 500);
}

$stmt->close();
$conn->close();
error_log("========== REGISTER.PHP COMPLETED ==========");
?>
