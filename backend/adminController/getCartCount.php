<?php
header('Content-Type: application/json');
include '../db.php'; // your DB connection

$user_id = $_GET['user_id'] ?? null;

if ($user_id) {
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM cart WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    echo json_encode(['status' => 200, 'count' => $result['count']]);
} else {
    echo json_encode(['status' => 400, 'message' => 'User ID missing']);
}
?>
