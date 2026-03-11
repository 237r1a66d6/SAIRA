<?php
// Direct database test - bypasses all API logic
header('Content-Type: text/html; charset=utf-8');

// Load database connection
require_once 'db_connect.php';

echo "<h1>Direct Database Test</h1>";
echo "<h2>Testing Users Table</h2>";

// Test 1: Check database connection
if ($conn) {
    echo "<p style='color: green;'>✓ Database connection successful</p>";
} else {
    echo "<p style='color: red;'>✗ Database connection failed: " . mysqli_connect_error() . "</p>";
    exit;
}

// Test 2: Check if users table exists
$tableCheck = $conn->query("SHOW TABLES LIKE 'users'");
if ($tableCheck && $tableCheck->num_rows > 0) {
    echo "<p style='color: green;'>✓ 'users' table exists</p>";
} else {
    echo "<p style='color: red;'>✗ 'users' table not found</p>";
    exit;
}

// Test 3: Count users
$countResult = $conn->query("SELECT COUNT(*) as count FROM users");
if ($countResult) {
    $countRow = $countResult->fetch_assoc();
    echo "<p style='color: green;'>✓ Total users in database: <strong>" . $countRow['count'] . "</strong></p>";
} else {
    echo "<p style='color: red;'>✗ Failed to count users: " . $conn->error . "</p>";
}

// Test 4: Fetch all users
echo "<h3>User Data:</h3>";
$sql = "SELECT id, username, phone, qualification, email, status, created_at FROM users ORDER BY created_at DESC";
$result = $conn->query($sql);

if ($result) {
    if ($result->num_rows > 0) {
        echo "<table border='1' cellpadding='10' style='border-collapse: collapse;'>";
        echo "<tr style='background: #4CAF50; color: white;'>";
        echo "<th>ID</th><th>Username</th><th>Email</th><th>Phone</th><th>Qualification</th><th>Status</th><th>Created</th>";
        echo "</tr>";
        
        while ($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<td>" . htmlspecialchars($row['id']) . "</td>";
            echo "<td>" . htmlspecialchars($row['username']) . "</td>";
            echo "<td>" . htmlspecialchars($row['email']) . "</td>";
            echo "<td>" . htmlspecialchars($row['phone']) . "</td>";
            echo "<td>" . htmlspecialchars($row['qualification']) . "</td>";
            echo "<td>" . htmlspecialchars($row['status']) . "</td>";
            echo "<td>" . htmlspecialchars($row['created_at']) . "</td>";
            echo "</tr>";
        }
        
        echo "</table>";
        echo "<p style='color: green;'>✓ Successfully fetched " . $result->num_rows . " users</p>";
    } else {
        echo "<p style='color: orange;'>⚠ No users found in database</p>";
    }
} else {
    echo "<p style='color: red;'>✗ Failed to fetch users: " . $conn->error . "</p>";
}

// Test 5: Test the API endpoint format
echo "<h3>API Endpoint Test:</h3>";
echo "<p><a href='api/admin/users.php' target='_blank'>Click here to test api/admin/users.php directly</a></p>";

$conn->close();
?>

<style>
    body {
        font-family: Arial, sans-serif;
        margin: 20px;
        background: #f5f5f5;
    }
    h1 { color: #333; }
    h2 { color: #666; margin-top: 30px; }
    h3 { color: #888; }
    table {
        background: white;
        margin: 20px 0;
    }
</style>
