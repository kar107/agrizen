<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include '../utility/object.php'; // Include your database utility

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch products from the database
    $result = $d->select('products');
    $products = [];

    // Iterate over the result and format the data
    while ($row = mysqli_fetch_assoc($result)) {
        $categoryName = 'Uncategorized';

        // Check if category_id exists in products table
        if (!empty($row['category_id'])) {
            $categoryResult = $d->select("categories", "id = {$row['category_id']}");
            if ($categoryRow = mysqli_fetch_assoc($categoryResult)) {
                $categoryName = $categoryRow['name']; // Get category name
            }
        }

        $products[] = [
            "id" => $row['id'],
            "name" => $row['name'],
            "description" => $row['description'],
            "category" => $categoryName, // Assign category name from lookup
            "price" => (float) $row['price'],
            "stock_quantity" => (int) $row['stock_quantity'],
            "unit" => $row['unit'],
            "image" => $row['image'] ?: 'default-image-url.jpg', // Use default if no image is present
            "status" => $row['status']
        ];
    }

    // Return the data in JSON format
    echo json_encode([
        "status" => 200,
        "message" => "Products retrieved successfully",
        "data" => $products
    ]);
    exit();
}

http_response_code(405);
echo json_encode(["status" => 405, "message" => "Method Not Allowed"]);
exit();
?>
