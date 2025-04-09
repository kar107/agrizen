<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../utility/object.php';

// Handle preflight (CORS OPTIONS) requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['order_id'])) {
            getOrderDetails($_GET['order_id']);
        } else {
            getAllOrders();
        }
        break;

    case 'PUT':
        handlePutRequest();
        break;

    case 'DELETE':
        if (isset($_GET['order_id'])) {
            deleteOrder($_GET['order_id']);
        } else {
            echo json_encode(['status' => 400, 'message' => 'Missing order_id for deletion']);
        }
        break;

    default:
        echo json_encode(['status' => 405, 'message' => 'Invalid request method']);
        break;
}

// Fetch all orders
function getAllOrders() {
    global $d;
    try {
        $orders = [];
        $result = $d->select("orders", "1 ORDER BY created_at DESC");
        while ($row = mysqli_fetch_assoc($result)) {
            $orders[] = $row;
        }
        echo json_encode([
            'status' => 200,
            'message' => 'Orders fetched successfully',
            'data' => $orders
        ]);
    } catch (Exception $e) {
        echo json_encode(['status' => 500, 'message' => $e->getMessage()]);
    }
}

// Fetch a specific order with product details
function getOrderDetails($order_id) {
    global $d;
    try {
        $orderQuery = $d->select("orders", "order_id = $order_id");
        if (mysqli_num_rows($orderQuery) > 0) {
            $order = mysqli_fetch_assoc($orderQuery);

            $items = [];
            $itemQuery = $d->rawQuery("SELECT oi.*, p.name, p.image, p.unit 
                                       FROM order_items oi 
                                       JOIN products p ON oi.product_id = p.id 
                                       WHERE oi.order_id = $order_id");
            while ($item = mysqli_fetch_assoc($itemQuery)) {
                $items[] = $item;
            }

            $order['items'] = $items;

            echo json_encode([
                'status' => 200,
                'message' => 'Order fetched successfully',
                'data' => $order
            ]);
        } else {
            echo json_encode(['status' => 404, 'message' => 'Order not found']);
        }
    } catch (Exception $e) {
        echo json_encode(['status' => 500, 'message' => $e->getMessage()]);
    }
}

// Update order (PUT)
function handlePutRequest() {
    global $d;

    $rawData = file_get_contents("php://input");
    $input = json_decode($rawData, true);

    if (!is_array($input)) {
        parse_str($rawData, $input);
    }

    if (!isset($input['order_id'])) {
        echo json_encode(['status' => 400, 'message' => 'Missing order_id']);
        return;
    }

    $order_id = intval($input['order_id']);
    $fieldsToUpdate = [];

    if (isset($input['order_status'])) {
        $fieldsToUpdate['order_status'] = $input['order_status'];
    }

    if (isset($input['payment_status'])) {
        $fieldsToUpdate['payment_status'] = $input['payment_status'];
    }

    if (empty($fieldsToUpdate)) {
        echo json_encode(['status' => 400, 'message' => 'Nothing to update']);
        return;
    }

    $fieldsToUpdate['updated_at'] = date('Y-m-d H:i:s');

    try {
        $update = $d->update("orders", $fieldsToUpdate, "order_id = $order_id");
        if ($update) {
            echo json_encode(['status' => 200, 'message' => 'Order updated successfully']);
        } else {
            echo json_encode(['status' => 500, 'message' => 'Failed to update order']);
        }
    } catch (Exception $e) {
        echo json_encode(['status' => 500, 'message' => $e->getMessage()]);
    }
}

// Delete order (DELETE)
function deleteOrder($order_id) {
    global $d;

    try {
        // First delete order items related to the order
        $d->delete("order_items", "order_id = $order_id");

        // Then delete the order
        $delete = $d->delete("orders", "order_id = $order_id");

        if ($delete) {
            echo json_encode(['status' => 200, 'message' => 'Order deleted successfully']);
        } else {
            echo json_encode(['status' => 500, 'message' => 'Failed to delete order']);
        }
    } catch (Exception $e) {
        echo json_encode(['status' => 500, 'message' => $e->getMessage()]);
    }
}
