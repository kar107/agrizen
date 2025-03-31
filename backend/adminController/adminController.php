<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include '../utility/object.php'; // Include your database object

$response = ["status" => 500, "message" => "No response generated"];

try {
    // Fetch total users
    $userQuery = $d->select("users", "1"); // Select all users
    $totalUsers = mysqli_num_rows($userQuery);

    // Fetch total products
    $productQuery = $d->select("products", "1"); // Select all products
    $totalProducts = mysqli_num_rows($productQuery);

    // Fetch total orders
//     $orderQuery = $d->select("orders", "1"); // Select all orders
//     $totalOrders = mysqli_num_rows($orderQuery);

    // Fetch active alerts
//     $alertQuery = $d->select("alerts", "status = 'active'");
//     $activeAlerts = mysqli_num_rows($alertQuery);

    // Return data
    $response = [
        "status" => 200,
        "message" => "Stats retrieved successfully",
        "data" => [
            "totalUsers" => $totalUsers,
            "totalProducts" => $totalProducts,
            "totalOrders" => $totalOrders,
            "activeAlerts" => $activeAlerts
        ]
    ];
} catch (Exception $e) {
    $response = [
        "status" => 500,
        "message" => "Error fetching stats: " . $e->getMessage()
    ];
}

echo json_encode($response);
exit();
