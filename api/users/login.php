<?php
// User Login API
require_once '../../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, [], 'Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
// Accept both 'identifier' (from API) or 'username' (from direct calls)
$identifier = isset($input['identifier']) ? $input['identifier'] : (isset($input['username']) ? $input['username'] : '');
if (empty($identifier) || empty($input['password'])) {
    sendJsonResponse(false, [], 'Username/email and password are required', 400);
}

$usernameOrEmail = sanitize_input($identifier);
$password = $input['password'];
$ipAddress = $_SERVER['REMOTE_ADDR'];

// Get user from database
$sql = "SELECT id, username, email, phone, qualification, password, status, created_at, last_login FROM users WHERE (username = ? OR email = ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $usernameOrEmail, $usernameOrEmail);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // Log failed attempt
    $logSql = "INSERT INTO login_attempts (user_type, username_or_email, ip_address, success, failure_reason) 
               VALUES ('user', ?, ?, 0, 'User not found')";
    $logStmt = $conn->prepare($logSql);
    $logStmt->bind_param("ss", $usernameOrEmail, $ipAddress);
    $logStmt->execute();
    $logStmt->close();
    
    sendJsonResponse(false, [], 'Invalid credentials', 401);
}

$user = $result->fetch_assoc();
$stmt->close();

// Check if account is active
if ($user['status'] !== 'active') {
    sendJsonResponse(false, [], 'Account is not active', 403);
}

// Verify password
if (!password_verify($password, $user['password'])) {
    // Log failed attempt
    $logSql = "INSERT INTO login_attempts (user_type, username_or_email, ip_address, success, failure_reason) 
               VALUES ('user', ?, ?, 0, 'Invalid password')";
    $logStmt = $conn->prepare($logSql);
    $logStmt->bind_param("ss", $usernameOrEmail, $ipAddress);
    $logStmt->execute();
    $logStmt->close();
    
    sendJsonResponse(false, [], 'Invalid credentials', 401);
}

// Update last login
$updateSql = "UPDATE users SET last_login = NOW() WHERE id = ?";
$updateStmt = $conn->prepare($updateSql);
$updateStmt->bind_param("i", $user['id']);
$updateStmt->execute();
$updateStmt->close();

// Log successful login
$logSql = "INSERT INTO login_attempts (user_type, username_or_email, ip_address, success) 
           VALUES ('user', ?, ?, 1)";
$logStmt = $conn->prepare($logSql);
$logStmt->bind_param("ss", $usernameOrEmail, $ipAddress);
$logStmt->execute();
$logStmt->close();

// Log activity
$activitySql = "INSERT INTO user_activity_log (user_type, user_id, activity_type, activity_description, ip_address) 
                VALUES ('user', ?, 'login', 'User logged in', ?)";
$activityStmt = $conn->prepare($activitySql);
$activityStmt->bind_param("is", $user['id'], $ipAddress);
$activityStmt->execute();
$activityStmt->close();

// Create session token
$sessionToken = bin2hex(random_bytes(32));
$expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));
$userAgent = $_SERVER['HTTP_USER_AGENT'];

$sessionSql = "INSERT INTO user_sessions (user_type, user_id, session_token, ip_address, user_agent, expires_at) 
               VALUES ('user', ?, ?, ?, ?, ?)";
$sessionStmt = $conn->prepare($sessionSql);
$sessionStmt->bind_param("issss", $user['id'], $sessionToken, $ipAddress, $userAgent, $expiresAt);
$sessionStmt->execute();
$sessionStmt->close();

// Return success with user data (exclude password)
unset($user['password']);

// Prepare response with all user data
$response = [
    'success' => true,
    'message' => 'Login successful',
    'token' => $sessionToken,
    'user' => $user
];

header('Content-Type: application/json');
http_response_code(200);
echo json_encode($response);

$conn->close();
?>
