<?php
// Error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
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
    echo json_encode(["status" => 500, "message" => "Database Connection Failed: " . $e->getMessage()]);
    exit();
}

switch ($method) {
    case 'GET':
        if (!isset($_GET['user_id'])) {
            echo json_encode(["status" => 400, "message" => "Missing user_id"]);
            exit();
        }

        $user_id = intval($_GET['user_id']);

        $stmt = $pdo->prepare("SELECT c.cart_id, c.user_id, c.product_id, c.quantity, c.price, c.total,
                                      p.name, p.image 
                               FROM cart c 
                               JOIN products p ON c.product_id = p.id 
                               WHERE c.user_id = ?");
        $stmt->execute([$user_id]);
        $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["status" => 200, "data" => $cartItems]);
        break;

    case 'DELETE':
        if (!isset($_GET['cart_id'])) {
            echo json_encode(["status" => 400, "message" => "Missing cart_id"]);
            exit();
        }

        $cart_id = intval($_GET['cart_id']);

        $stmt = $pdo->prepare("DELETE FROM cart WHERE cart_id = ?");
        $stmt->execute([$cart_id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(["status" => 200, "message" => "Item deleted"]);
        } else {
            echo json_encode(["status" => 404, "message" => "Item not found or already deleted"]);
        }
        break;

        case 'POST':
            $rawData = file_get_contents("php://input");
            $data = json_decode($rawData, true);
    
            if (!$data) {
                echo json_encode(["status" => 400, "message" => "Invalid JSON"]);
                exit();
            }
    
            $requiredFields = ['user_id', 'product_id', 'quantity', 'price'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field])) {
                    echo json_encode(["status" => 400, "message" => "Missing: $field"]);
                    exit();
                }
            }
    
            $user_id = intval($data['user_id']);
            $product_id = intval($data['product_id']);
            $quantity = intval($data['quantity']);
            $price = floatval($data['price']);
    
            // Check if product already exists in cart
            $checkStmt = $pdo->prepare("SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?");
            $checkStmt->execute([$user_id, $product_id]);
            $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
            if ($existing) {
                // Product exists — update quantity and total
                $newQuantity = $existing['quantity'] + $quantity;
                $newTotal = $price * $newQuantity;
    
                $updateStmt = $pdo->prepare("UPDATE cart SET quantity = ?, price = ?, total = ? WHERE user_id = ? AND product_id = ?");
                $updated = $updateStmt->execute([$newQuantity, $price, $newTotal, $user_id, $product_id]);
    
                echo json_encode([
                    "status" => $updated ? 200 : 500,
                    "message" => $updated ? "Cart updated" : "Update failed"
                ]);
            } else {
                // Product not in cart — insert new row
                $total = $price * $quantity;
    
                $insertStmt = $pdo->prepare("INSERT INTO cart (user_id, product_id, quantity, price, total) 
                                             VALUES (?, ?, ?, ?, ?)");
                $inserted = $insertStmt->execute([$user_id, $product_id, $quantity, $price, $total]);
    
                echo json_encode([
                    "status" => $inserted ? 200 : 500,
                    "message" => $inserted ? "Added to cart" : "Insert failed"
                ]);
            }
    
            break;

    default:
        echo json_encode(["status" => 405, "message" => "Method not allowed"]);
        break;
}
