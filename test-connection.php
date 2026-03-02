<?php
/**
 * SAIRA ACAD - Database Connection Test
 * Run this file to test your Hostinger database connection
 * Access via: https://yourdomain.com/test-connection.php
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>SAIRA ACAD - Database Connection Test</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .success { color: green; background: #d4edda; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .error { color: red; background: #f8d7da; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .info { color: blue; background: #d1ecf1; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .warning { color: orange; background: #fff3cd; padding: 15px; border-radius: 5px; margin: 10px 0; }
        h1 { color: #333; }
        h2 { color: #666; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background: #f2f2f2; }
        code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>🔧 SAIRA ACAD Database Connection Test</h1>

<?php
// Include database connection
require_once 'db_connect.php';

echo "<h2>✅ Step 1: Database Connection</h2>";
if ($conn->connect_error) {
    echo "<div class='error'>❌ Connection Failed: " . $conn->connect_error . "</div>";
    die();
} else {
    echo "<div class='success'>✅ Successfully connected to database!</div>";
    echo "<div class='info'>";
    echo "<strong>Server:</strong> " . htmlspecialchars($servername) . "<br>";
    echo "<strong>Database:</strong> " . htmlspecialchars($database) . "<br>";
    echo "<strong>Character Set:</strong> " . $conn->character_set_name() . "<br>";
    echo "</div>";
}

// Test 1: Check if tables exist
echo "<h2>📊 Step 2: Database Tables</h2>";
$tables = ['users', 'admins', 'teachers', 'schools', 'partners', 
           'user_sessions', 'login_attempts', 'user_activity_log', 'password_reset_tokens'];

echo "<table>";
echo "<tr><th>Table Name</th><th>Status</th><th>Row Count</th></tr>";

foreach ($tables as $table) {
    $result = $conn->query("SHOW TABLES LIKE '$table'");
    if ($result && $result->num_rows > 0) {
        $count_result = $conn->query("SELECT COUNT(*) as count FROM $table");
        $count = $count_result ? $count_result->fetch_assoc()['count'] : 0;
        echo "<tr><td>$table</td><td style='color:green'>✅ Exists</td><td>$count rows</td></tr>";
    } else {
        echo "<tr><td>$table</td><td style='color:red'>❌ Missing</td><td>-</td></tr>";
    }
}
echo "</table>";

// Test 2: Check admin account
echo "<h2>👤 Step 3: Admin Account Check</h2>";
$admin_result = $conn->query("SELECT id, username, email, role, status, created_at FROM admins WHERE username = 'admin'");

if ($admin_result && $admin_result->num_rows > 0) {
    $admin = $admin_result->fetch_assoc();
    echo "<div class='success'>✅ Admin account found!</div>";
    echo "<table>";
    echo "<tr><th>Field</th><th>Value</th></tr>";
    foreach ($admin as $key => $value) {
        echo "<tr><td>" . htmlspecialchars($key) . "</td><td>" . htmlspecialchars($value) . "</td></tr>";
    }
    echo "</table>";
    
    // Test password verification
    echo "<h3>🔐 Password Verification Test</h3>";
    $pwd_result = $conn->query("SELECT password FROM admins WHERE username = 'admin'");
    if ($pwd_result && $pwd_result->num_rows > 0) {
        $pwd_hash = $pwd_result->fetch_assoc()['password'];
        
        // Test with Admin@123
        $test_password = 'Admin@123';
        $is_valid = password_verify($test_password, $pwd_hash);
        
        if ($is_valid) {
            echo "<div class='success'>✅ Password 'Admin@123' is correctly configured!</div>";
        } else {
            echo "<div class='error'>❌ Password verification failed! The hash in database doesn't match 'Admin@123'</div>";
            echo "<div class='warning'>⚠️ <strong>ACTION REQUIRED:</strong><br>";
            echo "1. Run <code>generate-password-hash.php</code> to get a valid hash<br>";
            echo "2. Run <code>update-admin-password.sql</code> in phpMyAdmin<br>";
            echo "3. Or click the button below to fix it automatically</div>";
            
            // Auto-fix option
            echo "<form method='POST' style='margin:20px 0'>";
            echo "<input type='hidden' name='fix_password' value='1'>";
            echo "<button type='submit' style='padding:10px 20px; background:#28a745; color:white; border:none; cursor:pointer; border-radius:5px;'>";
            echo "🔧 Fix Admin Password Automatically</button>";
            echo "</form>";
        }
    }
} else {
    echo "<div class='error'>❌ Admin account not found!</div>";
    echo "<div class='warning'>⚠️ Please import <code>database.sql</code> into phpMyAdmin first.</div>";
}

// Auto-fix password if requested
if (isset($_POST['fix_password'])) {
    echo "<h2>🔧 Auto-Fix Admin Password</h2>";
    $new_password = 'Admin@123';
    $new_hash = password_hash($new_password, PASSWORD_BCRYPT);
    
    $update_stmt = $conn->prepare("UPDATE admins SET password = ?, status = 'active' WHERE username = 'admin'");
    $update_stmt->bind_param("s", $new_hash);
    
    if ($update_stmt->execute()) {
        echo "<div class='success'>✅ Admin password successfully updated to: <strong>Admin@123</strong></div>";
        echo "<div class='info'>You can now login with:<br>Username: <code>admin</code><br>Password: <code>Admin@123</code></div>";
    } else {
        echo "<div class='error'>❌ Failed to update password: " . $conn->error . "</div>";
    }
    $update_stmt->close();
}

// Test 3: Check users table structure
echo "<h2>📋 Step 4: Users Table Structure</h2>";
$columns_result = $conn->query("DESCRIBE users");
if ($columns_result) {
    echo "<table>";
    echo "<tr><th>Field</th><th>Type</th><th>Key</th><th>Extra</th></tr>";
    while ($col = $columns_result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . htmlspecialchars($col['Field']) . "</td>";
        echo "<td>" . htmlspecialchars($col['Type']) . "</td>";
        echo "<td>" . htmlspecialchars($col['Key']) . "</td>";
        echo "<td>" . htmlspecialchars($col['Extra']) . "</td>";
        echo "</tr>";
    }
    echo "</table>";
}

// Test 4: API Endpoint Test
echo "<h2>🌐 Step 5: API Endpoints Check</h2>";
$api_endpoints = [
    '/api/users/login.php' => 'User Login',
    '/api/admin/login.php' => 'Admin Login',
    '/api/users/register.php' => 'User Registration'
];

echo "<table>";
echo "<tr><th>Endpoint</th><th>Status</th></tr>";
foreach ($api_endpoints as $endpoint => $name) {
    $file_path = __DIR__ . $endpoint;
    if (file_exists($file_path)) {
        echo "<tr><td>$name</td><td style='color:green'>✅ File exists</td></tr>";
    } else {
        echo "<tr><td>$name</td><td style='color:red'>❌ File missing</td></tr>";
    }
}
echo "</table>";

// Final Summary
echo "<h2>📝 Summary & Next Steps</h2>";
echo "<div class='info'>";
echo "<strong>If all tests pass:</strong><br>";
echo "1. Login at <a href='admin-login.html'>admin-login.html</a> with username: <code>admin</code> and password: <code>Admin@123</code><br>";
echo "2. Change the default admin password immediately<br>";
echo "3. Delete this test file (<code>test-connection.php</code>) for security<br><br>";
echo "<strong>If tests fail:</strong><br>";
echo "1. Check <code>db_connect.php</code> has correct Hostinger credentials<br>";
echo "2. Import <code>database.sql</code> in phpMyAdmin if tables are missing<br>";
echo "3. Use the 'Fix Admin Password Automatically' button above if password test failed<br>";
echo "4. Check file permissions on your Hostinger server<br>";
echo "</div>";

$conn->close();
?>

<div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 5px;">
    <strong>⚠️ SECURITY WARNING:</strong><br>
    Delete this test file after confirming everything works!<br>
    This file exposes database information and should not be accessible in production.
</div>

</body>
</html>
