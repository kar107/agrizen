<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../utility/object.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(["status" => 405, "message" => "Method Not Allowed"]);
    exit();
}

if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode(["status" => 400, "message" => "Product ID is required"]);
    exit();
}

$product_id = intval($_GET['id']);

$result = $d->select('products', "id = $product_id");

if ($result && mysqli_num_rows($result) > 0) {
    $product = mysqli_fetch_assoc($result);
    echo json_encode([
        "status" => 200,
        "message" => "Product retrieved successfully",
        "data" => $product
    ]);
} else {
    echo json_encode([
        "status" => 404,
        "message" => "Product not found"
    ]);
}
