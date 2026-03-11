<?php
// Get Partner Contacts (Admin)
ob_start();

// Global error handler - ensures any crash returns JSON, never a blank 500
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    ob_clean();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $errstr, 'data' => []]);
    exit();
});
set_exception_handler(function($e) {
    ob_clean();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Exception: ' . $e->getMessage(), 'data' => []]);
    exit();
});

require_once __DIR__ . '/../../../db_connect.php';

// Get Authorization header - works on Apache mod_php AND PHP-FPM/FastCGI
$authHeader = '';
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
} elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
} elseif (function_exists('getallheaders')) {
    $allHeaders = getallheaders();
    $authHeader = isset($allHeaders['Authorization']) ? $allHeaders['Authorization'] : '';
}

// Auto-migrate: ensure contact_type column exists
$columnCheck = $conn->query("SHOW COLUMNS FROM contact_submissions LIKE 'contact_type'");
if ($columnCheck && $columnCheck->num_rows === 0) {
    $conn->query("ALTER TABLE contact_submissions ADD COLUMN contact_type ENUM('general','partner','educator') DEFAULT 'general' AFTER message");
    $conn->query("ALTER TABLE contact_submissions ADD INDEX idx_contact_type (contact_type)");
    error_log("Auto-migrated: added contact_type column to contact_submissions");
}

// Handle GET - Get all partner contacts
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $sql = "SELECT * FROM contact_submissions WHERE contact_type = 'partner' ORDER BY created_at DESC";
        $result = $conn->query($sql);
        
        if (!$result) {
            error_log("Partner contacts query failed: " . $conn->error);
            sendJsonResponse(false, [], 'Database query failed: ' . $conn->error, 500);
        }
        
        $contacts = [];
        while ($row = $result->fetch_assoc()) {
            $contacts[] = [
                'id' => $row['id'],
                'contactName' => $row['name'],
                'contactEmail' => $row['email'],
                'contactPhone' => $row['phone'] ?? 'N/A',
                'contactSubject' => $row['subject'] ?? 'No Subject',
                'contactMessage' => $row['message'],
                'status' => $row['status'],
                'createdAt' => $row['created_at']
            ];
        }
        
        error_log("Partner contacts retrieved: " . count($contacts));
        sendJsonResponse(true, ['contacts' => $contacts], 'Partner contacts retrieved', 200);
    } catch (Exception $e) {
        error_log("Error fetching partner contacts: " . $e->getMessage());
        sendJsonResponse(false, [], 'Error: ' . $e->getMessage(), 500);
    }
}

// Handle DELETE - Delete a partner contact
else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $partnerId = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    if (!$partnerId) {
        sendJsonResponse(false, [], 'Invalid partner ID', 400);
    }
    
    $sql = "DELETE FROM contact_submissions WHERE id = ? AND contact_type = 'partner'";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $partnerId);
    
    if ($stmt->execute()) {
        sendJsonResponse(true, [], 'Partner contact deleted', 200);
    } else {
        sendJsonResponse(false, [], 'Failed to delete partner contact', 500);
    }
    
    $stmt->close();
}

// Handle PUT - Update partner contact status
else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $partnerId = isset($_GET['id']) ? intval($_GET['id']) : 0;
    $action = isset($_GET['action']) ? $_GET['action'] : '';
    
    if (!$partnerId) {
        sendJsonResponse(false, [], 'Invalid partner ID', 400);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($action === 'status') {
        $status = isset($input['status']) ? sanitize_input($input['status']) : null;
        
        if (!$status) {
            sendJsonResponse(false, [], 'Status is required', 400);
        }
        
        $sql = "UPDATE contact_submissions SET status = ?, updated_at = NOW() WHERE id = ? AND contact_type = 'partner'";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $status, $partnerId);
        
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
