<?php
// Error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
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

// ✅ GET METHOD — fetch orders by user_id
if ($method === 'GET') {
    if (!isset($_GET['user_id'])) {
        echo json_encode(["status" => 400, "message" => "Missing user_id"]);
        exit();
    }

    $user_id = intval($_GET['user_id']);

    try {
        $stmt = $pdo->prepare("SELECT order_id, total_amount, order_status, payment_status, payment_method, shipping_address, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$user_id]);

        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$orders) {
            echo json_encode(["status" => 404, "message" => "No orders found."]);
        } else {
            echo json_encode(["status" => 200, "data" => $orders]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => 500, "message" => "Database error: " . $e->getMessage()]);
    }
    exit();
}

// ✅ POST METHOD — place order
if ($method === 'POST') {
    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);

    if (!$data) {
        echo json_encode(["status" => 400, "message" => "Invalid JSON"]);
        exit();
    }

    $requiredFields = ['user_id', 'total_amount', 'payment_method', 'shipping_address', 'cart_items'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field])) {
            echo json_encode(["status" => 400, "message" => "Missing: $field"]);
            exit();
        }
    }

    $user_id = intval($data['user_id']);
    $total_amount = floatval($data['total_amount']);
    $payment_method = $data['payment_method'];
    $shipping_address = json_encode($data['shipping_address']);
    $cart_items = $data['cart_items'];

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("INSERT INTO orders (user_id, total_amount, payment_method, shipping_address) VALUES (?, ?, ?, ?)");
        $stmt->execute([$user_id, $total_amount, $payment_method, $shipping_address]);

        $order_id = $pdo->lastInsertId();

        $itemStmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
        foreach ($cart_items as $item) {
            $itemStmt->execute([
                $order_id,
                $item['product_id'],
                $item['quantity'],
                $item['price']
            ]);
        }

        $deleteStmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
        $deleteStmt->execute([$user_id]);

        $pdo->commit();

        echo json_encode(["status" => 200, "message" => "Order placed successfully."]);
    } catch (PDOException $e) {
        $pdo->rollBack();
        echo json_encode(["status" => 500, "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => 405, "message" => "Method not allowed"]);
    exit();
}
