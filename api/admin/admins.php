<?php
// Admin API - Manage Admins
// Get, Create, Update, Delete admin accounts
require_once '../../db_connect.php';

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Fetch all admins from database
    $sql = "SELECT id, username, email, role, status, created_at, last_login 
            FROM admins 
            ORDER BY created_at DESC";
    
    $result = $conn->query($sql);
    
    if ($result) {
        $admins = [];
        while ($row = $result->fetch_assoc()) {
            $admins[] = [
                'id' => $row['id'],
                'username' => $row['username'],
                'email' => $row['email'],
                'role' => $row['role'],
                'status' => $row['status'],
                'created_at' => $row['created_at'],
                'createdAt' => $row['created_at'],
                'createdDate' => $row['created_at'],
                'last_login' => $row['last_login']
            ];
        }
        
        sendJsonResponse(true, ['admins' => $admins, 'count' => count($admins)], 'Admins fetched successfully', 200);
    } else {
        sendJsonResponse(false, [], 'Failed to fetch admins: ' . $conn->error, 500);
    }
    
} elseif ($method === 'POST') {
    // Create new admin
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['username']) || empty($input['password'])) {
        sendJsonResponse(false, [], 'Username and password are required', 400);
    }
    
    $username = sanitize_input($input['username']);
    $email = isset($input['email']) ? sanitize_input($input['email']) : $username . '@sairaacad.com';
    $password = password_hash($input['password'], PASSWORD_DEFAULT);
    $role = isset($input['role']) ? sanitize_input($input['role']) : 'admin';
    
    // Check if admin already exists
    $checkSql = "SELECT id FROM admins WHERE username = ? OR email = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("ss", $username, $email);
    $checkStmt->execute();
    $checkStmt->store_result();
    
    if ($checkStmt->num_rows > 0) {
        sendJsonResponse(false, [], 'Admin with this username or email already exists', 409);
    }
    $checkStmt->close();
    
    // Insert new admin
    $sql = "INSERT INTO admins (username, email, password, role, status) VALUES (?, ?, ?, ?, 'active')";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $username, $email, $password, $role);
    
    if ($stmt->execute()) {
        sendJsonResponse(true, ['id' => $stmt->insert_id], 'Admin created successfully', 201);
    } else {
        sendJsonResponse(false, [], 'Failed to create admin', 500);
    }
    
    $stmt->close();
    
} elseif ($method === 'PUT') {
    // Update admin
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id'])) {
        sendJsonResponse(false, [], 'Admin ID is required', 400);
    }
    
    $adminId = intval($input['id']);
    
    // Build update query
    $updates = [];
    $types = "";
    $params = [];
    
    if (isset($input['username'])) {
        $updates[] = "username = ?";
        $types .= "s";
        $params[] = sanitize_input($input['username']);
    }
    if (isset($input['email'])) {
        $updates[] = "email = ?";
        $types .= "s";
        $params[] = sanitize_input($input['email']);
    }
    if (isset($input['password'])) {
        $updates[] = "password = ?";
        $types .= "s";
        $params[] = password_hash($input['password'], PASSWORD_DEFAULT);
    }
    if (isset($input['status'])) {
        $updates[] = "status = ?";
        $types .= "s";
        $params[] = sanitize_input($input['status']);
    }
    
    if (empty($updates)) {
        sendJsonResponse(false, [], 'No fields to update', 400);
    }
    
    $types .= "i";
    $params[] = $adminId;
    
    $sql = "UPDATE admins SET " . implode(", ", $updates) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    
    if ($stmt->execute()) {
        sendJsonResponse(true, [], 'Admin updated successfully', 200);
    } else {
        sendJsonResponse(false, [], 'Failed to update admin', 500);
    }
    
    $stmt->close();
    
} elseif ($method === 'DELETE') {
    // Delete admin
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id'])) {
        sendJsonResponse(false, [], 'Admin ID is required', 400);
    }
    
    $adminId = intval($input['id']);
    
    // Prevent deleting the main admin
    $checkSql = "SELECT username FROM admins WHERE id = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("i", $adminId);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows > 0) {
        $admin = $result->fetch_assoc();
        if ($admin['username'] === 'admin') {
            sendJsonResponse(false, [], 'Cannot delete the default admin account', 403);
        }
    }
    $checkStmt->close();
    
    // Delete admin
    $sql = "DELETE FROM admins WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $adminId);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            sendJsonResponse(true, [], 'Admin deleted successfully', 200);
        } else {
            sendJsonResponse(false, [], 'Admin not found', 404);
        }
    } else {
        sendJsonResponse(false, [], 'Failed to delete admin', 500);
    }
    
    $stmt->close();
    
} else {
    sendJsonResponse(false, [], 'Method not allowed', 405);
}

$conn->close();
?>
