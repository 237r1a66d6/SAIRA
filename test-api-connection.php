<?php
// Quick API Test
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Test 1: PHP is working
echo json_encode([
    'success' => true,
    'message' => 'API is accessible!',
    'php_version' => phpversion(),
    'time' => date('Y-m-d H:i:s')
]);
?>
