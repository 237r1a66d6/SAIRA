<?php
// Get Mentor Applications for School Partner
require_once '../../../db_connect.php';

// Simple authentication check
$authHeader = '';
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
} elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
} elseif (function_exists('getallheaders')) {
    $h = getallheaders();
    $authHeader = isset($h['Authorization']) ? $h['Authorization'] : '';
}

if (empty($authHeader)) {
    sendJsonResponse(false, [], 'Authentication required', 401);
}

$token = str_replace('Bearer ', '', $authHeader);

// Verify token
$sql = "SELECT user_id, user_type FROM user_sessions WHERE session_token = ? AND user_type = 'school' AND expires_at > NOW()";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    sendJsonResponse(false, [], 'Invalid or expired token', 401);
}

$session = $result->fetch_assoc();
$stmt->close();

// Get mentor applications
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT id, full_name, email, phone, qualification, experience_years, 
            expertise_area, current_position, organization, city, state, status, created_at 
            FROM mentor_applications 
            ORDER BY created_at DESC";
    
    $result = $conn->query($sql);
    $applications = [];
    
    while ($row = $result->fetch_assoc()) {
        $applications[] = $row;
    }
    
    sendJsonResponse(true, $applications, 'Mentor applications retrieved', 200);
} else {
    sendJsonResponse(false, [], 'Method not allowed', 405);
}

$conn->close();
?>
