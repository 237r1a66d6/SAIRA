<?php
// School Partner Login API
require_once '../../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, [], 'Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (empty($input['username']) || empty($input['password'])) {
    sendJsonResponse(false, [], 'Username and password are required', 400);
}

$username = sanitize_input($input['username']);
$password = $input['password'];
$ipAddress = $_SERVER['REMOTE_ADDR'];

// Get school from database
$sql = "SELECT id, username, school_name, email, password, status FROM schools WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // Log failed attempt
    $logSql = "INSERT INTO login_attempts (user_type, username_or_email, ip_address, success, failure_reason) 
               VALUES ('school', ?, ?, 0, 'School not found')";
    $logStmt = $conn->prepare($logSql);
    $logStmt->bind_param("ss", $username, $ipAddress);
    $logStmt->execute();
    $logStmt->close();
    
    sendJsonResponse(false, [], 'Invalid credentials', 401);
}

$school = $result->fetch_assoc();
$stmt->close();

// Check if account is active
if ($school['status'] !== 'active') {
    sendJsonResponse(false, [], 'Account is not active or pending approval', 403);
}

// Verify password
if (!password_verify($password, $school['password'])) {
    // Log failed attempt
    $logSql = "INSERT INTO login_attempts (user_type, username_or_email, ip_address, success, failure_reason) 
               VALUES ('school', ?, ?, 0, 'Invalid password')";
    $logStmt = $conn->prepare($logSql);
    $logStmt->bind_param("ss", $username, $ipAddress);
    $logStmt->execute();
    $logStmt->close();
    
    sendJsonResponse(false, [], 'Invalid credentials', 401);
}

// Update last login
$updateSql = "UPDATE schools SET last_login = NOW() WHERE id = ?";
$updateStmt = $conn->prepare($updateSql);
$updateStmt->bind_param("i", $school['id']);
$updateStmt->execute();
$updateStmt->close();

// Log successful login
$logSql = "INSERT INTO login_attempts (user_type, username_or_email, ip_address, success) 
           VALUES ('school', ?, ?, 1)";
$logStmt = $conn->prepare($logSql);
$logStmt->bind_param("ss", $username, $ipAddress);
$logStmt->execute();
$logStmt->close();

// Create session token
$sessionToken = bin2hex(random_bytes(32));
$expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));
$userAgent = $_SERVER['HTTP_USER_AGENT'];

$sessionSql = "INSERT INTO user_sessions (user_type, user_id, session_token, ip_address, user_agent, expires_at) 
               VALUES ('school', ?, ?, ?, ?, ?)";
$sessionStmt = $conn->prepare($sessionSql);
$sessionStmt->bind_param("issss", $school['id'], $sessionToken, $ipAddress, $userAgent, $expiresAt);
$sessionStmt->execute();
$sessionStmt->close();

// Return success with school data (exclude password)
unset($school['password']);
$school['token'] = $sessionToken;

sendJsonResponse(true, $school, 'Login successful', 200);

$conn->close();
?>
