<?php
/**
 * Password Hash Generator for SAIRA ACAD
 * Run this script to generate bcrypt password hashes for your accounts
 * 
 * Usage: php generate-password-hash.php
 * Or access via browser: http://localhost/generate-password-hash.php
 */

// Passwords to hash
$passwords = [
    'Admin@123' => 'Default admin password',
    'Test@123' => 'Test user password',
    'Teacher@123' => 'Test teacher password'
];

echo "<!DOCTYPE html>\n<html><head><title>Password Hash Generator</title></head><body>\n";
echo "<h1>SAIRA ACAD - Password Hash Generator</h1>\n";
echo "<p>Copy these hashes into your database.sql file:</p>\n";
echo "<pre>\n\n";

foreach ($passwords as $password => $description) {
    $hash = password_hash($password, PASSWORD_BCRYPT);
    echo "-- $description: $password\n";
    echo "Hash: $hash\n\n";
}

echo "</pre>\n";
echo "<hr>\n";
echo "<h2>For Custom Password:</h2>\n";

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['custom_password'])) {
    $customPassword = $_POST['custom_password'];
    $customHash = password_hash($customPassword, PASSWORD_BCRYPT);
    echo "<p><strong>Password:</strong> " . htmlspecialchars($customPassword) . "</p>\n";
    echo "<p><strong>Hash:</strong> <code>$customHash</code></p>\n";
}

echo "<form method='POST'>\n";
echo "  <input type='text' name='custom_password' placeholder='Enter password' required>\n";
echo "  <button type='submit'>Generate Hash</button>\n";
echo "</form>\n";
echo "</body></html>\n";
?>
