<?php
// Get All Contact Submissions (Admin)
require_once '../../db_connect.php';

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
$adminId = $session['user_id'];
$stmt->close();

// Handle GET - Get all contact submissions
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM contact_submissions ORDER BY created_at DESC";
    $result = $conn->query($sql);
    $contacts = [];
    
    while ($row = $result->fetch_assoc()) {
        $contacts[] = $row;
    }
    
    sendJsonResponse(true, $contacts, 'Contact submissions retrieved', 200);
}

// Handle PUT - Update contact status or reply
else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Get ID from URL path
    $path = $_SERVER['REQUEST_URI'];
    preg_match('/\/contact\/(\d+)/', $path, $matches);
    
    if (!isset($matches[1])) {
        sendJsonResponse(false, [], 'Invalid contact ID', 400);
    }
    
    $contactId = intval($matches[1]);
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Check if it's a status update or reply
    if (strpos($path, '/status') !== false) {
        // Status update
        $status = isset($input['status']) ? sanitize_input($input['status']) : null;
        
        if (!$status) {
            sendJsonResponse(false, [], 'Status is required', 400);
        }
        
        $sql = "UPDATE contact_submissions SET status = ?, updated_at = NOW() WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $status, $contactId);
        
        if ($stmt->execute()) {
            sendJsonResponse(true, [], 'Status updated', 200);
        } else {
            sendJsonResponse(false, [], 'Failed to update status', 500);
        }
        
        $stmt->close();
    } else if (strpos($path, '/reply') !== false) {
        // Reply to contact
        $replyMessage = isset($input['reply']) ? sanitize_input($input['reply']) : null;
        
        if (!$replyMessage) {
            sendJsonResponse(false, [], 'Reply message is required', 400);
        }
        
        $sql = "UPDATE contact_submissions 
                SET reply_message = ?, replied_at = NOW(), replied_by_admin_id = ?, status = 'replied', updated_at = NOW() 
                WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sii", $replyMessage, $adminId, $contactId);
        
        if ($stmt->execute()) {
            sendJsonResponse(true, [], 'Reply sent', 200);
        } else {
            sendJsonResponse(false, [], 'Failed to send reply', 500);
        }
        
        $stmt->close();
    } else {
        sendJsonResponse(false, [], 'Invalid endpoint', 400);
    }
}

else {
    sendJsonResponse(false, [], 'Method not allowed', 405);
}

$conn->close();
?>
