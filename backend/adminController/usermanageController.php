<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include '../utility/object.php'; // Database utility file

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$response = [];
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET': // Fetch all users
        $result = $d->select('users');
        $users = [];

        while ($row = mysqli_fetch_assoc($result)) {
            $users[] = [
                'id' => $row['userid'], // Ensure field name matches DB
                'name' => $row['name'],
                'email' => $row['email'],
                'role' => $row['role'],
                'created_at' => $row['created_at'],
            ];
        }

        $response = [
            'status' => 200,
            'message' => 'Users retrieved successfully',
            'data' => $users
        ];

        echo json_encode($response);
        exit;

    case 'POST': // Add a new user
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['name'], $data['email'], $data['password'])) {
            $name = trim($data['name']);
            $email = trim($data['email']);
            $password = trim($data['password']);
            $role = isset($data['role']) ? trim($data['role']) : 'user';

            if (strlen($password) < 8) {
                echo json_encode(['message' => 'Password must be at least 8 characters', 'status' => 400]);
                exit;
            }

            // Check if email exists
            $existingUser = $d->select('users', "email = '$email'");

            if (mysqli_num_rows($existingUser) > 0) {
                echo json_encode(['message' => 'Email already registered', 'status' => 409]);
                exit;
            }

            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

            $insertData = [
                'name' => $name,
                'email' => $email,
                'password_hash' => $hashedPassword, // Ensure this field matches DB
                'role' => $role,
                'created_at' => date('Y-m-d H:i:s')
            ];

            $result = $d->insert('users', $insertData);

            if ($result) {
                echo json_encode(['message' => 'User added successfully', 'status' => 201]);
            } else {
                echo json_encode(['message' => 'Failed to add user', 'status' => 500]);
            }
        } else {
            echo json_encode(['message' => 'Missing required fields', 'status' => 400]);
        }
        exit;

    case 'PUT': // Update user
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['id'], $data['name'], $data['email'], $data['role'])) {
            $id = (int) $data['id'];
            $name = trim($data['name']);
            $email = trim($data['email']);
            $role = trim($data['role']);

            $updateData = [
                'name' => $name,
                'email' => $email,
                'role' => $role
            ];

            // Check if password is being updated
            if (!empty($data['password'])) {
                if (strlen($data['password']) < 8) {
                    echo json_encode(['message' => 'Password must be at least 8 characters', 'status' => 400]);
                    exit;
                }
                $updateData['password_hash'] = password_hash($data['password'], PASSWORD_BCRYPT);
            }

            $result = $d->update('users', $updateData, "userid = $id"); // Ensure correct field name

            if ($result) {
                echo json_encode(['message' => 'User updated successfully', 'status' => 200]);
            } else {
                echo json_encode(['message' => 'Failed to update user', 'status' => 500]);
            }
        } else {
            echo json_encode(['message' => 'Missing required fields', 'status' => 400]);
        }
        exit;

        case 'DELETE': // Delete user
            if (isset($_GET['id'])) {
                $id = (int) $_GET['id']; // Get ID from URL
        
                error_log("Delete Request Received for ID: " . $id); // Debugging
        
                if ($id > 0) {
                    $result = $d->delete('users', "userid = $id"); // Ensure field matches DB
        
                    if ($result) {
                        echo json_encode(['message' => 'User deleted successfully', 'status' => 200]);
                    } else {
                        echo json_encode(['message' => 'Failed to delete user', 'status' => 500]);
                    }
                } else {
                    echo json_encode(['message' => 'Invalid user ID', 'status' => 400]);
                }
            } else {
                echo json_encode(['message' => 'Missing user ID', 'status' => 400]);
            }
            exit;
        
}
// <?php
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");

// include '../utility/object.php';

// // Handle preflight requests
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     http_response_code(200);
//     exit();
// }

// $response = [];
// $uploadDirectory = '../uploads/products/';

// // Create upload directory if needed
// if (!file_exists($uploadDirectory)) {
//     mkdir($uploadDirectory, 0777, true);
// }

// // File upload handler function (same as before)
// function handleFileUpload($existingImage = null) {
//     global $uploadDirectory;
//     if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
//         $file = $_FILES['image'];
//         $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//         if (!in_array($file['type'], $allowedTypes)) {
//             return ['error' => 'Only JPG, PNG, and GIF images are allowed'];
//         }
//         if ($file['size'] > 2097152) {
//             return ['error' => 'Image size must be less than 2MB'];
//         }
//         $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
//         $filename = uniqid() . '.' . $extension;
//         $destination = $uploadDirectory . $filename;
//         if (move_uploaded_file($file['tmp_name'], $destination)) {
//             if ($existingImage && file_exists($uploadDirectory . $existingImage)) {
//                 unlink($uploadDirectory . $existingImage);
//             }
//             return ['filename' => $filename];
//         }
//         return ['error' => 'Failed to upload image'];
//     }
//     return $existingImage ? ['filename' => $existingImage] : ['filename' => null];
// }

// // Main request handling
// if ($_SERVER['REQUEST_METHOD'] === 'POST') {
//     if (!isset($_POST['tag'])) {
//         $response = ["status" => 400, "message" => "Tag parameter is required"];
//     } 
//     // ADD PRODUCT
//     elseif ($_POST['tag'] === 'add_product') {
//         $inputData = $_POST;
//         $fileResult = ['filename' => null];
        
//         // Handle file upload if present
//         if (isset($_FILES['image'])) {
//             $fileResult = handleFileUpload();
//             if (isset($fileResult['error'])) {
//                 $response = ["status" => 400, "message" => $fileResult['error']];
//             }
//         }

//         if (!isset($response)) { // Only proceed if no error yet
//             if (empty($inputData['name'])) {
//                 $response = ["status" => 400, "message" => "Product name is required"];
//             } else {
//                 $insertData = [
//                     'name' => trim($inputData['name']),
//                     'description' => $inputData['description'] ?? '',
//                     'category_id' => isset($inputData['category_id']) ? (int)$inputData['category_id'] : null,
//                     'price' => isset($inputData['price']) ? (float)$inputData['price'] : 0,
//                     'stock_quantity' => isset($inputData['stock_quantity']) ? (int)$inputData['stock_quantity'] : 0,
//                     'unit' => $inputData['unit'] ?? '',
//                     'status' => $inputData['status'] ?? 'active',
//                     'user_id' => isset($inputData['user_id']) ? (int)$inputData['user_id'] : null,
//                     'created_at' => date('Y-m-d H:i:s'),
//                     'image' => $fileResult['filename'] ?? null
//                 ];

//                 if ($d->insert('products', $insertData)) {
//                     $response = ["status" => 200, "message" => "Product added successfully", "data" => $insertData];
//                 } else {
//                     $response = ["status" => 500, "message" => "Failed to add product"];
//                 }
//             }
//         }
//     }
//     // GET PRODUCTS
//     elseif ($_POST['tag'] === 'get_products') {
//         $result = $d->select('products');
//         $products = [];
//         while ($row = mysqli_fetch_assoc($result)) {
//             $products[] = $row;
//         }
//         $response = ["status" => 200, "message" => "Products retrieved successfully", "data" => $products];
//     }
//     // UPDATE PRODUCT
//     elseif ($_POST['tag'] === 'update_product') {
//         $inputData = $_POST;
//         $fileResult = ['filename' => null];
//         $id = (int)($inputData['id'] ?? 0);

//         if (!$id) {
//             $response = ["status" => 400, "message" => "Product ID is required"];
//         } else {
//             // Get existing image if any
//             $existingImage = null;
//             $existingProduct = $d->select('products', "id = $id");
//             if ($existingProduct && mysqli_num_rows($existingProduct) > 0) {
//                 $product = mysqli_fetch_assoc($existingProduct);
//                 $existingImage = $product['image'] ?? null;
//             }

//             // Handle file upload if present
//             if (isset($_FILES['image'])) {
//                 $fileResult = handleFileUpload($existingImage);
//                 if (isset($fileResult['error'])) {
//                     $response = ["status" => 400, "message" => $fileResult['error']];
//                 }
//             }

//             if (!isset($response)) { // Only proceed if no error yet
//                 $updateData = [];
//                 $fields = ["name", "description", "category_id", "price", "stock_quantity", "unit", "status"];
//                 foreach ($fields as $field) {
//                     if (isset($inputData[$field])) {
//                         $updateData[$field] = $inputData[$field];
//                     }
//                 }
//                 if ($fileResult['filename']) {
//                     $updateData['image'] = $fileResult['filename'];
//                 }

//                 if (empty($updateData)) {
//                     $response = ["status" => 400, "message" => "No fields to update"];
//                 } elseif ($d->update('products', $updateData, "id = $id")) {
//                     $response = ["status" => 200, "message" => "Product updated successfully"];
//                 } else {
//                     $response = ["status" => 500, "message" => "Product update failed"];
//                 }
//             }
//         }
//     }
//     // DELETE PRODUCT
//     elseif ($_POST['tag'] === 'delete_product') {
//         $id = (int)($_POST['id'] ?? 0);
//         if (!$id) {
//             $response = ["status" => 400, "message" => "Product ID is required"];
//         } else {
//             // Get product to delete its image
//             $product = $d->select('products', "id = $id");
//             if ($product && mysqli_num_rows($product) > 0) {
//                 $productData = mysqli_fetch_assoc($product);
//                 if ($productData['image'] && file_exists($uploadDirectory . $productData['image'])) {
//                     unlink($uploadDirectory . $productData['image']);
//                 }
//             }

//             if ($d->delete('products', "id = $id")) {
//                 $response = ["status" => 200, "message" => "Product deleted successfully"];
//             } else {
//                 $response = ["status" => 500, "message" => "Product deletion failed"];
//             }
//         }
//     }
//     // INVALID TAG
//     else {
//         $response = ["status" => 400, "message" => "Invalid tag"];
//     }
// } 
// // INVALID METHOD
// else {
//     $response = ["status" => 405, "message" => "Method not allowed"];
// }

// echo json_encode($response);
// exit();