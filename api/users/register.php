<?php
// User Registration API
require_once '../../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, [], 'Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['username', 'phone', 'qualification', 'email', 'password'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        sendJsonResponse(false, [], "Field '$field' is required", 400);
    }
}

// Sanitize inputs
$username = sanitize_input($input['username']);
$phone = sanitize_input($input['phone']);
$qualification = sanitize_input($input['qualification']);
$email = sanitize_input($input['email']);
$password = $input['password'];

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse(false, [], 'Invalid email address', 400);
}

// Validate password strength
if (strlen($password) < 6) {
    sendJsonResponse(false, [], 'Password must be at least 6 characters', 400);
}

// Check if user already exists
$checkSql = "SELECT id FROM users WHERE username = ? OR email = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("ss", $username, $email);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    sendJsonResponse(false, [], 'Username or email already exists', 409);
}
$checkStmt->close();

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert into database
$sql = "INSERT INTO users (username, phone, qualification, email, password, status) 
        VALUES (?, ?, ?, ?, ?, 'active')";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $username, $phone, $qualification, $email, $hashedPassword);

if ($stmt->execute()) {
    $userId = $stmt->insert_id;
    
    // Log activity
    $activitySql = "INSERT INTO user_activity_log (user_type, user_id, activity_type, activity_description, ip_address) 
                    VALUES ('user', ?, 'registration', 'User registered', ?)";
    $activityStmt = $conn->prepare($activitySql);
    $ipAddress = $_SERVER['REMOTE_ADDR'];
    $activityStmt->bind_param("is", $userId, $ipAddress);
    $activityStmt->execute();
    $activityStmt->close();
    
    sendJsonResponse(true, ['id' => $userId, 'username' => $username], 'Registration successful', 201);
} else {
    error_log("Registration error: " . $stmt->error);
    sendJsonResponse(false, [], 'Registration failed', 500);
}

$stmt->close();
$conn->close();
?>
