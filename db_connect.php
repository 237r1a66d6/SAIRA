<?php
// ============================================================================
// SAIRA ACAD - Centralized Database Connection
// For Hostinger Hosting
// ============================================================================

// IMPORTANT: Update these with your actual Hostinger database credentials
// Find these in: Hostinger hPanel > Databases > Manage

$servername = "localhost";  // Always "localhost" for Hostinger
$username = "u642524181_DB_1";  // YOUR DATABASE USERNAME
$password = "Siri@23$46";       // YOUR DATABASE PASSWORD
$database = "u642524181_SairaAcad";  // YOUR DATABASE NAME

// Create connection with error handling
$conn = new mysqli($servername, $username, $password, $database);

// Set charset to UTF-8 for proper character support
$conn->set_charset("utf8mb4");

// Check connection
if ($conn->connect_error) {
    // Log error (in production, log to file instead of displaying)
    error_log("Database connection failed: " . $conn->connect_error);
    
    // Return JSON error for API calls
    if (strpos($_SERVER['REQUEST_URI'], '/api/') !== false) {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database connection failed. Please try again later.'
        ]);
        exit();
    }
    
    // For regular pages, show user-friendly error
    die("Unable to connect to database. Please try again later.");
}

// Set timezone (adjust as needed)
$conn->query("SET time_zone = '+05:30'");  // IST timezone, change if needed

// Enable error reporting in development (disable in production)
// Uncomment the line below for debugging during development
// mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// Helper function to prevent SQL injection
function sanitize_input($data) {
    global $conn;
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $conn->real_escape_string($data);
}

// Helper function to send JSON response
function sendJsonResponse($success, $data = [], $message = '', $statusCode = 200) {
    header('Content-Type: application/json');
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit();
}

// Enable CORS for API requests (adjust origin as needed)
if (strpos($_SERVER['REQUEST_URI'], '/api/') !== false) {
    header('Access-Control-Allow-Origin: *');  // Change * to your domain in production
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}
?>