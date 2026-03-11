<?php
// Admin API - Get All Users
// Fetch all registered users from database for admin dashboard

// Set CORS headers FIRST - before any output or db connection
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../db_connect.php';

// Check if request is from admin (basic check)
// In production, verify admin session token from request headers

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Log request for debugging (can be removed in production)
    error_log("Users API: GET request received from " . ($_SERVER['HTTP_REFERER'] ?? 'unknown'));
    
    try {
        // Check if connection is still alive
        if (!$conn->ping()) {
            error_log("Users API: Database connection lost, attempting to reconnect...");
            $conn->close();
            $conn = new mysqli($servername, $username, $password, $database);
            if ($conn->connect_error) {
                throw new Exception("Database reconnection failed: " . $conn->connect_error);
            }
        }
        
        // Fetch all users from database
        $sql = "SELECT id, username, phone, qualification, email, status, created_at, last_login 
                FROM users 
                ORDER BY created_at DESC";
        
        $result = $conn->query($sql);
        
        if ($result) {
            $users = [];
            while ($row = $result->fetch_assoc()) {
                $users[] = [
                    'id' => $row['id'],
                    'username' => $row['username'],
                    'fullName' => $row['username'], // Using username as fullName for compatibility
                    'phone' => $row['phone'],
                    'phoneNumber' => $row['phone'], // Alias for compatibility
                    'qualification' => $row['qualification'],
                    'email' => $row['email'],
                    'status' => $row['status'],
                    'created_at' => $row['created_at'],
                    'createdDate' => $row['created_at'], // Alias for compatibility
                    'last_login' => $row['last_login']
                ];
            }
            
            error_log("Users API: Successfully fetched " . count($users) . " users");
            sendJsonResponse(true, ['users' => $users, 'count' => count($users)], 'Users fetched successfully', 200);
        } else {
            error_log("Users API: Query failed - " . $conn->error);
            sendJsonResponse(false, [], 'Failed to fetch users: ' . $conn->error, 500);
        }
    } catch (Exception $e) {
        error_log("Users API: Exception - " . $e->getMessage());
        sendJsonResponse(false, [], 'Database error: ' . $e->getMessage(), 500);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Delete user by ID
    error_log("Users API: DELETE request received");
    $input = json_decode(file_get_contents('php://input'), true);
    error_log("Users API: DELETE input data: " . json_encode($input));
    
    if (empty($input['id'])) {
        error_log("Users API: DELETE failed - User ID is required");
        sendJsonResponse(false, [], 'User ID is required', 400);
    }
    
    $userId = intval($input['id']);
    error_log("Users API: Attempting to delete user with ID: " . $userId);
    
    // Delete user
    $sql = "DELETE FROM users WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $userId);
    
    if ($stmt->execute()) {
        $affected = $stmt->affected_rows;
        error_log("Users API: DELETE query executed. Affected rows: " . $affected);
        
        if ($affected > 0) {
            error_log("Users API: User deleted successfully (ID: $userId)");
            sendJsonResponse(true, [], 'User deleted successfully', 200);
        } else {
            error_log("Users API: DELETE failed - User not found (ID: $userId)");
            sendJsonResponse(false, [], 'User not found', 404);
        }
    } else {
        error_log("Users API: DELETE query failed - " . $stmt->error);
        sendJsonResponse(false, [], 'Failed to delete user', 500);
    }
    
    $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Update user
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id'])) {
        sendJsonResponse(false, [], 'User ID is required', 400);
    }
    
    $userId = intval($input['id']);
    $username = isset($input['username']) ? sanitize_input($input['username']) : null;
    $phone = isset($input['phone']) ? sanitize_input($input['phone']) : null;
    $qualification = isset($input['qualification']) ? sanitize_input($input['qualification']) : null;
    $email = isset($input['email']) ? sanitize_input($input['email']) : null;
    $status = isset($input['status']) ? sanitize_input($input['status']) : null;
    $password = isset($input['password']) ? $input['password'] : null; // New password field
    
    // Build update query dynamically
    $updates = [];
    $types = "";
    $params = [];
    
    if ($username !== null) {
        $updates[] = "username = ?";
        $types .= "s";
        $params[] = $username;
    }
    if ($phone !== null) {
        $updates[] = "phone = ?";
        $types .= "s";
        $params[] = $phone;
    }
    if ($qualification !== null) {
        $updates[] = "qualification = ?";
        $types .= "s";
        $params[] = $qualification;
    }
    if ($email !== null) {
        $updates[] = "email = ?";
        $types .= "s";
        $params[] = $email;
    }
    if ($status !== null) {
        $updates[] = "status = ?";
        $types .= "s";
        $params[] = $status;
    }
    if ($password !== null && strlen($password) >= 6) {
        // Hash the password before storing
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $updates[] = "password = ?";
        $types .= "s";
        $params[] = $hashedPassword;
    }
    
    if (empty($updates)) {
        sendJsonResponse(false, [], 'No fields to update', 400);
    }
    
    $updates[] = "updated_at = NOW()";
    $types .= "i";
    $params[] = $userId;
    
    $sql = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            sendJsonResponse(true, [], 'User updated successfully', 200);
        } else {
            sendJsonResponse(false, [], 'No changes made or user not found', 404);
        }
    } else {
        sendJsonResponse(false, [], 'Failed to update user', 500);
    }
    
    $stmt->close();
} else {
    sendJsonResponse(false, [], 'Method not allowed', 405);
}

$conn->close();
?>
