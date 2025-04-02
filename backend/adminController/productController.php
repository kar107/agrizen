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

// Directory where product images will be stored
$uploadDirectory = '../uploads/products/';

// Create directory if it doesn't exist
if (!file_exists($uploadDirectory)) {
    mkdir($uploadDirectory, 0777, true);
}

function handleFileUpload($existingImage = null)
{
    global $uploadDirectory;

    // Check if file was uploaded
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['image'];

        // Validate file type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($file['type'], $allowedTypes)) {
            return ['error' => 'Only JPG, PNG, and GIF images are allowed'];
        }

        // Validate file size (max 2MB)
        if ($file['size'] > 2097152) {
            return ['error' => 'Image size must be less than 2MB'];
        }

        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '.' . $extension;
        $destination = $uploadDirectory . $filename;

        // Move uploaded file
        if (move_uploaded_file($file['tmp_name'], $destination)) {
            // Delete old image if it exists
            if ($existingImage && file_exists($uploadDirectory . $existingImage)) {
                unlink($uploadDirectory . $existingImage);
            }
            return ['filename' => $filename];
        } else {
            return ['error' => 'Failed to upload image'];
        }
    }

    // If no new file uploaded but existing image exists, keep the existing one
    if ($existingImage) {
        return ['filename' => $existingImage];
    }

    return ['filename' => null];
}

switch ($method) {
    case 'POST': // Add new product
        // Check if this is a multipart form (file upload)
        if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'multipart/form-data') !== false) {
            $inputData = $_POST;
            $fileResult = handleFileUpload();

            if (isset($fileResult['error'])) {
                echo json_encode(["status" => 400, "message" => $fileResult['error']]);
                exit;
            }
        } else {
            $inputData = json_decode(file_get_contents("php://input"), true);
            if (!$inputData) {
                echo json_encode(["status" => 400, "message" => "Invalid JSON format"]);
                exit;
            }
        }

        $user_id = isset($inputData['user_id']) ? intval($inputData['user_id']) : null;

        if (!isset($inputData['name']) || empty($inputData['name'])) {
            echo json_encode(["status" => 400, "message" => "Product name is required"]);
            exit;
        }

        $insertData = [
            'name' => trim($inputData['name']),
            'description' => isset($inputData['description']) ? trim($inputData['description']) : '',
            'category_id' => isset($inputData['category_id']) ? intval($inputData['category_id']) : null,
            'price' => isset($inputData['price']) ? floatval($inputData['price']) : 0,
            'stock_quantity' => isset($inputData['stock_quantity']) ? intval($inputData['stock_quantity']) : 0,
            'unit' => isset($inputData['unit']) ? trim($inputData['unit']) : '',
            'status' => isset($inputData['status']) ? trim($inputData['status']) : 'active',
            'user_id' => $user_id,
            'created_at' => date('Y-m-d H:i:s')
        ];

        // Add image filename if available
        if (isset($fileResult['filename']) && $fileResult['filename']) {
            $insertData['image'] = $fileResult['filename'];
        }

        $result = $d->insert('products', $insertData);

        echo json_encode($result ? [
            "status" => 200,
            "message" => "Product added successfully",
            "data" => $insertData
        ] : [
            "status" => 500,
            "message" => "Failed to add product"
        ]);
        exit();

    case 'GET': // Fetch all products
        $result = $d->select('products');
        $products = [];

        while ($row = mysqli_fetch_assoc($result)) {
            $products[] = $row;
        }

        echo json_encode([
            "status" => 200,
            "message" => "Products retrieved successfully",
            "data" => $products
        ]);
        exit();

    case 'PUT': // Update product
        // Check if this is a multipart form (file upload)
        if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'multipart/form-data') !== false) {
            $inputData = $_POST;
            $id = isset($inputData['id']) ? intval($inputData['id']) : null;

            // Get existing image filename
            $existingImage = null;
            if ($id) {
                $existingProduct = $d->select('products', "id = $id");
                if ($existingProduct && mysqli_num_rows($existingProduct) > 0) {
                    $product = mysqli_fetch_assoc($existingProduct);
                    $existingImage = $product['image'] ?? null;
                }
            }

            $fileResult = handleFileUpload($existingImage);

            if (isset($fileResult['error'])) {
                echo json_encode(["status" => 400, "message" => $fileResult['error']]);
                exit;
            }
        } else {
            $inputData = json_decode(file_get_contents("php://input"), true);
            if (!$inputData) {
                echo json_encode(["status" => 400, "message" => "Invalid JSON format"]);
                exit;
            }
        }

        if (isset($inputData['id'])) {
            $id = intval($inputData['id']);
            $updateData = [];

            foreach (["name", "description", "category_id", "price", "stock_quantity", "unit", "status"] as $field) {
                if (isset($inputData[$field])) {
                    $updateData[$field] = $inputData[$field];
                }
            }

            // Add image filename if available
            if (isset($fileResult['filename'])) {
                $updateData['image'] = $fileResult['filename'];
            }

            if (!empty($updateData)) {
                $updateStatus = $d->update('products', $updateData, "id = $id");
                echo json_encode($updateStatus ? [
                    "status" => 200,
                    "message" => "Product updated successfully"
                ] : [
                    "status" => 500,
                    "message" => "Product update failed"
                ]);
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

            // First get the product to delete its image
            $product = $d->select('products', "id = $id");
            if ($product && mysqli_num_rows($product) > 0) {
                $productData = mysqli_fetch_assoc($product);
                if ($productData['image'] && file_exists($uploadDirectory . $productData['image'])) {
                    unlink($uploadDirectory . $productData['image']);
                }
            }

            $deleteStatus = $d->delete('products', "id = $id");

            echo json_encode($deleteStatus ? [
                "status" => 200,
                "message" => "Product deleted successfully"
            ] : [
                "status" => 500,
                "message" => "Product deletion failed"
            ]);
        } else {
            echo json_encode(["status" => 400, "message" => "Product ID is required"]);
        }
        exit();
}
