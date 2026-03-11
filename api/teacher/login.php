<?php
// Teacher Login API
require_once '../../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, [], 'Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (empty($input['email']) || empty($input['password'])) {
    sendJsonResponse(false, [], 'Email and password are required', 400);
}

$email = sanitize_input($input['email']);
$password = $input['password'];
$ipAddress = $_SERVER['REMOTE_ADDR'];

// Get teacher from database
$sql = "SELECT id, email, username, password, status FROM teachers WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // Log failed attempt
    $logSql = "INSERT INTO login_attempts (user_type, username_or_email, ip_address, success, failure_reason) 
               VALUES ('teacher', ?, ?, 0, 'Teacher not found')";
    $logStmt = $conn->prepare($logSql);
    $logStmt->bind_param("ss", $email, $ipAddress);
    $logStmt->execute();
    $logStmt->close();
    
    sendJsonResponse(false, [], 'Invalid credentials', 401);
}

$teacher = $result->fetch_assoc();
$stmt->close();

// Check if account is active
if ($teacher['status'] !== 'active') {
    sendJsonResponse(false, [], 'Account is not active', 403);
}

// Verify password
if (!password_verify($password, $teacher['password'])) {
    // Log failed attempt
    $logSql = "INSERT INTO login_attempts (user_type, username_or_email, ip_address, success, failure_reason) 
               VALUES ('teacher', ?, ?, 0, 'Invalid password')";
    $logStmt = $conn->prepare($logSql);
    $logStmt->bind_param("ss", $email, $ipAddress);
    $logStmt->execute();
    $logStmt->close();
    
    sendJsonResponse(false, [], 'Invalid credentials', 401);
}

// Update last login
$updateSql = "UPDATE teachers SET last_login = NOW() WHERE id = ?";
$updateStmt = $conn->prepare($updateSql);
$updateStmt->bind_param("i", $teacher['id']);
$updateStmt->execute();
$updateStmt->close();

// Log successful login
$logSql = "INSERT INTO login_attempts (user_type, username_or_email, ip_address, success) 
           VALUES ('teacher', ?, ?, 1)";
$logStmt = $conn->prepare($logSql);
$logStmt->bind_param("ss", $email, $ipAddress);
$logStmt->execute();
$logStmt->close();

// Create session token
$sessionToken = bin2hex(random_bytes(32));
$expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));
$userAgent = $_SERVER['HTTP_USER_AGENT'];

$sessionSql = "INSERT INTO user_sessions (user_type, user_id, session_token, ip_address, user_agent, expires_at) 
               VALUES ('teacher', ?, ?, ?, ?, ?)";
$sessionStmt = $conn->prepare($sessionSql);
$sessionStmt->bind_param("issss", $teacher['id'], $sessionToken, $ipAddress, $userAgent, $expiresAt);
$sessionStmt->execute();
$sessionStmt->close();

// Return success with teacher data (exclude password)
unset($teacher['password']);
$teacher['token'] = $sessionToken;

sendJsonResponse(true, $teacher, 'Login successful', 200);

$conn->close();
?>
