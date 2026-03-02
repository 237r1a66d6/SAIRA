<?php
// Get Job Applications for School Partner
require_once '../../../db_connect.php';

// Simple authentication check - verify session token
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if (empty($authHeader)) {
    sendJsonResponse(false, [], 'Authentication required', 401);
}

// Extract token from "Bearer <token>"
$token = str_replace('Bearer ', '', $authHeader);

// Verify token belongs to a school partner
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

// Get job applications
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT id, job_position, full_name, email, phone, qualification, experience_years, 
            current_company, city, state, expected_salary, available_from, status, created_at 
            FROM job_applications 
            ORDER BY created_at DESC";
    
    $result = $conn->query($sql);
    $applications = [];
    
    while ($row = $result->fetch_assoc()) {
        $applications[] = $row;
    }
    
    sendJsonResponse(true, $applications, 'Job applications retrieved', 200);
} else {
    sendJsonResponse(false, [], 'Method not allowed', 405);
}

$conn->close();
?>
