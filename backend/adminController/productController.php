<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


include '../utility/object.php';

// Handle preflight requests (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
      http_response_code(200);
      exit();
}

$response = [];
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
      case 'POST': // Add new product
            $inputData = json_decode(file_get_contents("php://input"), true);
            if (!$inputData) {
                echo json_encode(["error" => "Invalid JSON format"]);
                exit;
            }
            
            // print_r ($input);
            // print_r($inputData);
            // exit(); // Debugging: Check received data in error log
            $user_id = isset($input['user_id']) ? intval($input['user_id']) : null;
            
            if (!isset($inputData['name']) || empty($inputData['name'])) {
                  echo json_encode(["status" => 400, "message" => "Product name is required"]);
                  exit;
            }

            $insertData = [
                  'name' => trim($inputData['name']),
                  'description' => isset($input['description']) ? trim($input['description']) : '',
                  'category_id' => isset($input['category_id']) ? intval($input['category_id']) : null,
                  'price' => isset($input['price']) ? floatval($input['price']) : 0,
                  'stock_quantity' => isset($input['stock_quantity']) ? intval($input['stock_quantity']) : 0,
                  'unit' => isset($input['unit']) ? trim($input['unit']) : '',
                  'supplier_id' => isset($input['supplier_id']) ? intval($input['supplier_id']) : null,
                  'user_id' => $user_id,  // Assign logged-in user
                  'created_at' => date('Y-m-d H:i:s')
            ];
            
            $result = $d->insert('products', $insertData);

            echo json_encode($result ? ["status" => 200, "message" => "Product added successfully"] : ["status" => 500, "message" => "Failed to add product"]);
            exit();

      case 'GET': // Fetch all products
            $result = $d->select('products');
            $products = [];

            while ($row = mysqli_fetch_assoc($result)) {
                  $products[] = $row;
            }

            echo json_encode(["status" => 200, "message" => "Products retrieved successfully", "data" => $products]);
            exit();

      case 'PUT': // Update product
            $input = json_decode(file_get_contents("php://input"), true);

            if (isset($input['id'])) {
                  $id = intval($input['id']);
                  $updateData = [];

                  foreach (["name", "description", "category_id", "price", "stock_quantity", "unit", "supplier_id"] as $field) {
                        if (isset($input[$field])) {
                              $updateData[$field] = $input[$field];
                        }
                  }

                  if (!empty($updateData)) {
                        $updateStatus = $d->update('products', $updateData, "id = $id");
                        echo json_encode($updateStatus ? ["status" => 200, "message" => "Product updated successfully"] : ["status" => 500, "message" => "Product update failed"]);
                  } else {
                        echo json_encode(["status" => 400, "message" => "No fields to update"]);
                  }
            } else {
                  echo json_encode(["status" => 400, "message" => "Product ID is required"]);
            }
            exit();

      case 'DELETE': // Delete product
            if (isset($_GET['id'])) {
                  $id = intval($_GET['id']);
                  $deleteStatus = $d->delete('products', "id = $id");

                  echo json_encode($deleteStatus ? ["status" => 200, "message" => "Product deleted successfully"] : ["status" => 500, "message" => "Product deletion failed"]);
            } else {
                  echo json_encode(["status" => 400, "message" => "Product ID is required"]);
            }
            exit();
}
?>
