<?php
// Get Educator Contacts (Admin)
require_once '../../../db_connect.php';

// Simple admin authentication check
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

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

// Handle GET - Get all educator contacts
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM educator_contacts ORDER BY created_at DESC";
    $result = $conn->query($sql);
    $educators = [];
    
    while ($row = $result->fetch_assoc()) {
        $educators[] = $row;
    }
    
    sendJsonResponse(true, $educators, 'Educator contacts retrieved', 200);
}

// Handle DELETE - Delete an educator contact
else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Get ID from URL path
    $path = $_SERVER['REQUEST_URI'];
    preg_match('/\/educators\/(\d+)/', $path, $matches);
    
    if (!isset($matches[1])) {
        sendJsonResponse(false, [], 'Invalid educator ID', 400);
    }
    
    $educatorId = intval($matches[1]);
    
    $sql = "DELETE FROM educator_contacts WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $educatorId);
    
    if ($stmt->execute()) {
        sendJsonResponse(true, [], 'Educator contact deleted', 200);
    } else {
        sendJsonResponse(false, [], 'Failed to delete educator contact', 500);
    }
    
    $stmt->close();
}

// Handle PUT - Update educator contact status
else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $path = $_SERVER['REQUEST_URI'];
    preg_match('/\/educators\/(\d+)/', $path, $matches);
    
    if (!isset($matches[1])) {
        sendJsonResponse(false, [], 'Invalid educator ID', 400);
    }
    
    $educatorId = intval($matches[1]);
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (strpos($path, '/status') !== false) {
        $status = isset($input['status']) ? sanitize_input($input['status']) : null;
        
        if (!$status) {
            sendJsonResponse(false, [], 'Status is required', 400);
        }
        
        $sql = "UPDATE educator_contacts SET status = ?, updated_at = NOW() WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $status, $educatorId);
        
        if ($stmt->execute()) {
            sendJsonResponse(true, [], 'Status updated', 200);
        } else {
            sendJsonResponse(false, [], 'Failed to update status', 500);
        }
        
        $stmt->close();
    }
}

else {
    sendJsonResponse(false, [], 'Method not allowed', 405);
}

$conn->close();
?>
