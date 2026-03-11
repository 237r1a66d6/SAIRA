<?php
/**
 * DEPRECATED: This file is no longer used
 * Registration is now handled by /api/users/register.php
 * 
 * This file is kept for backward compatibility only
 * DO NOT USE - Will be removed in future version
 */

// Redirect to proper registration page
header('Location: register.html');
exit();

/*
// OLD CODE - DEPRECATED
// Use centralized database connection
require_once 'db_connect.php';

// 2. Handle Form Submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $phone = $_POST['phone'];
    $qual = $_POST['qualification'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirmPassword'];

    // Basic validation
    if ($password !== $confirm_password) {
        die("Passwords do not match!");
    }

    // 3. Security: Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // 4. Insert into database
    $sql = "INSERT INTO users (username, phone, qualification, email, password) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $username, $phone, $qual, $email, $hashed_password);

    if ($stmt->execute()) {
        echo "Registration successful! <a href='login.html'>Click here to login</a>";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
*/
?>