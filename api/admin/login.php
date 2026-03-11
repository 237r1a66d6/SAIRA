<?php
// Admin Login API
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

// Get admin from database
$sql = "SELECT id, username, email, password, role, status FROM admins WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // Log failed attempt
    $logSql = "INSERT INTO login_attempts (user_type, username_or_email, ip_address, success, failure_reason) 
               VALUES ('admin', ?, ?, 0, 'Admin not found')";
    $logStmt = $conn->prepare($logSql);
    $logStmt->bind_param("ss", $username, $ipAddress);
    $logStmt->execute();
    $logStmt->close();
    
    sendJsonResponse(false, [], 'Invalid credentials', 401);
}

$admin = $result->fetch_assoc();
$stmt->close();

// Check if account is active
if ($admin['status'] !== 'active') {
    sendJsonResponse(false, [], 'Account is not active', 403);
}

// Verify password
if (!password_verify($password, $admin['password'])) {
    // Log failed attempt
    $logSql = "INSERT INTO login_attempts (user_type, username_or_email, ip_address, success, failure_reason) 
               VALUES ('admin', ?, ?, 0, 'Invalid password')";
    $logStmt = $conn->prepare($logSql);
    $logStmt->bind_param("ss", $username, $ipAddress);
    $logStmt->execute();
    $logStmt->close();
    
    sendJsonResponse(false, [], 'Invalid credentials', 401);
}

// Update last login
$updateSql = "UPDATE admins SET last_login = NOW() WHERE id = ?";
$updateStmt = $conn->prepare($updateSql);
$updateStmt->bind_param("i", $admin['id']);
$updateStmt->execute();
$updateStmt->close();

// Log successful login
$logSql = "INSERT INTO login_attempts (user_type, username_or_email, ip_address, success) 
           VALUES ('admin', ?, ?, 1)";
$logStmt = $conn->prepare($logSql);
$logStmt->bind_param("ss", $username, $ipAddress);
$logStmt->execute();
$logStmt->close();

// Create session token
$sessionToken = bin2hex(random_bytes(32));
$expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));
$userAgent = $_SERVER['HTTP_USER_AGENT'];

$sessionSql = "INSERT INTO user_sessions (user_type, user_id, session_token, ip_address, user_agent, expires_at) 
               VALUES ('admin', ?, ?, ?, ?, ?)";
$sessionStmt = $conn->prepare($sessionSql);
$sessionStmt->bind_param("issss", $admin['id'], $sessionToken, $ipAddress, $userAgent, $expiresAt);
$sessionStmt->execute();
$sessionStmt->close();

// Return success with admin data (exclude password)
unset($admin['password']);

// Prepare response with all admin data
$response = [
    'success' => true,
    'message' => 'Login successful',
    'token' => $sessionToken,
    'admin' => $admin
];

header('Content-Type: application/json');
http_response_code(200);
echo json_encode($response);

$conn->close();
?>
