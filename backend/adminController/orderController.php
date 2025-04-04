<?php
// Error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = new PDO("mysql:host=localhost;dbname=agrizen", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => 500, "message" => "Database connection failed: " . $e->getMessage()]);
    exit();
}

if ($method === 'POST') {
    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);

    if (!$data) {
        echo json_encode(["status" => 400, "message" => "Invalid JSON"]);
        exit();
    }

    $requiredFields = ['user_id', 'total_amount', 'payment_method', 'shipping_address', 'items'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field])) {
            echo json_encode(["status" => 400, "message" => "Missing: $field"]);
            exit();
        }
    }

    $user_id = intval($data['user_id']);
    $total_amount = floatval($data['total_amount']);
    $payment_method = $data['payment_method'];
    $shipping_address = $data['shipping_address'];
    $items = $data['items'];

    try {
        $pdo->beginTransaction();

        // Insert into orders table
        $stmt = $pdo->prepare("INSERT INTO orders (user_id, total_amount, payment_method, shipping_address) VALUES (?, ?, ?, ?)");
        $stmt->execute([$user_id, $total_amount, $payment_method, $shipping_address]);

        $order_id = $pdo->lastInsertId();

        // Insert each item into order_items
        $itemStmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");

        foreach ($items as $item) {
            if (!isset($item['product_id'], $item['quantity'], $item['price'])) {
                throw new Exception("Missing product fields");
            }

            $product_id = intval($item['product_id']);
            $quantity = intval($item['quantity']);
            $price = floatval($item['price']);

            $itemStmt->execute([$order_id, $product_id, $quantity, $price]);
        }

        // Clear the user's cart after successful order
        $clearCartStmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
        $clearCartStmt->execute([$user_id]);

        $pdo->commit();

        echo json_encode(["status" => 200, "message" => "Order placed successfully", "order_id" => $order_id]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["status" => 500, "message" => "Order failed: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => 405, "message" => "Method not allowed"]);
}
?>