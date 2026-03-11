<?php
// Get All Consultation Requests (Admin)
require_once '../../db_connect.php';

// Simple admin authentication check
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

// Verify token belongs to admin
$sql = "SELECT user_id, user_type FROM user_sessions WHERE session_token = ? AND user_type = 'admin' AND expires_at > NOW()";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    sendJsonResponse(false, [], 'Invalid or expired token', 401);
}

$session = $result->fetch_assoc();
$stmt->close();

// Handle GET - Get all consultations
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM consultation_requests ORDER BY created_at DESC";
    $result = $conn->query($sql);
    $consultations = [];
    
    while ($row = $result->fetch_assoc()) {
        $consultations[] = $row;
    }
    
    sendJsonResponse(true, $consultations, 'Consultations retrieved', 200);
}

// Handle DELETE - Delete a consultation
else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Get ID from URL path
    $path = $_SERVER['REQUEST_URI'];
    preg_match('/\/consultation\/(\d+)/', $path, $matches);
    
    if (!isset($matches[1])) {
        sendJsonResponse(false, [], 'Invalid consultation ID', 400);
    }
    
    $consultationId = intval($matches[1]);
    
    $sql = "DELETE FROM consultation_requests WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $consultationId);
    
    if ($stmt->execute()) {
        sendJsonResponse(true, [], 'Consultation deleted', 200);
    } else {
        sendJsonResponse(false, [], 'Failed to delete consultation', 500);
    }
    
    $stmt->close();
}

else {
    sendJsonResponse(false, [], 'Method not allowed', 405);
}

$conn->close();
?>
