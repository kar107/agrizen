<?php
session_start();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Destroy session and unset all session variables
    session_unset();
    session_destroy();
    
    // Clear any authentication-related cookies if set
    if (isset($_COOKIE['PHPSESSID'])) {
        setcookie('PHPSESSID', '', time() - 3600, '/');
    }

    echo json_encode(["status" => "200", "message" => "Logout successful"]);
} else {
    echo json_encode(["status" => "405", "message" => "Method Not Allowed"]);
}
