<?php
// School Partner API - Get All Partners
// Fetch all school partners from database
require_once '../../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJsonResponse(false, [], 'Method not allowed', 405);
}

// Fetch all school partners from database
$sql = "SELECT id, username, email, phone, organization_name, contact_person_name, 
        contact_person_phone, address, city, state, partner_type, status, created_at, last_login 
        FROM partners 
        ORDER BY created_at DESC";

$result = $conn->query($sql);

if ($result) {
    $partners = [];
    while ($row = $result->fetch_assoc()) {
        $partners[] = [
            'id' => $row['id'],
            '_id' => $row['id'],
            'schoolName' => $row['organization_name'],
            'school_name' => $row['organization_name'],
            'organization_name' => $row['organization_name'],
            'username' => $row['username'],
            'email' => $row['email'],
            'phone' => $row['phone'],
            'contactPerson' => $row['contact_person_name'],
            'contact_person_name' => $row['contact_person_name'],
            'contact_person_phone' => $row['contact_person_phone'],
            'address' => $row['address'],
            'city' => $row['city'],
            'state' => $row['state'],
            'partner_type' => $row['partner_type'],
            'status' => $row['status'],
            'created_at' => $row['created_at'],
            'createdAt' => $row['created_at'],
            'addedDate' => $row['created_at'],
            'last_login' => $row['last_login']
        ];
    }
    
    sendJsonResponse(true, ['partners' => $partners, 'count' => count($partners)], 'Partners fetched successfully', 200);
} else {
    sendJsonResponse(false, [], 'Failed to fetch partners: ' . $conn->error, 500);
}

$conn->close();
?>
