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
$$user_id = $_SESSION['userid'];
$response = [];
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
      case 'POST': // Add new category
            $input = json_decode(file_get_contents("php://input"), true);

            error_log(print_r($input, true)); // Debugging: Check received data in error log
            $user_id = isset($input['user_id']) ? intval($input['user_id']) : null;
           
            if (!isset($input['name']) || empty($input['name'])) {
                  echo json_encode(["status" => 400, "message" => "Category name is required"]);
                  exit;
            }

            $name = trim($input['name']);
            $description = isset($input['description']) ? trim($input['description']) : '';
            $status = isset($input['status']) ? trim($input['status']) : 'active';

            $insertData = [
                  'name' => $name,
                  'description' => $description,
                  'status' => $status,
                  'user_id' => $user_id,  // Assign logged-in user
                  'created_at' => date('Y-m-d H:i:s')
            ];
            // print_r ($insertData);
            $result = $d->insert('categories', $insertData);

            if ($result) {
                  echo json_encode(["status" => 200, "message" => "Category added successfully"]);
            } else {
                  echo json_encode(["status" => 500, "message" => "Failed to add category"]);
            }
            exit();

      case 'GET': // Fetch all categories
            $result = $d->select('categories');
            $categories = [];

            while ($row = mysqli_fetch_assoc($result)) {
                  $categories[] = [
                        'id' => $row['id'],
                        'name' => $row['name'],
                        'description' => $row['description'],
                        'user_id' => $row['user_id'],
                        'status' => $row['status'],
                        'created_at' => $row['created_at'],
                  ];
            }

            $response = [
                  'status' => 200,
                  'message' => 'Categories retrieved successfully',
                  'data' => $categories
            ];
            break;

      case 'PUT': // Update category
            $input = json_decode(file_get_contents("php://input"), true);

            if (isset($input['id'])) {
                  $id = intval($input['id']);
                  $updateData = [];

                  if (!empty($input['name'])) {
                        $updateData['name'] = trim($input['name']);
                  }
                  if (!empty($input['description'])) {
                        $updateData['description'] = trim($input['description']);
                  }
                  if (!empty($input['status'])) {
                        $updateData['status'] = trim($input['status']);
                  }

                  if (!empty($updateData)) {
                        $updateStatus = $d->update('categories', $updateData, "id = $id");

                        if ($updateStatus) {
                              $response['message'] = 'Category updated successfully';
                              $response['status'] = 200;
                        } else {
                              $response['message'] = 'Category update failed';
                              $response['status'] = 500;
                        }
                  } else {
                        $response['message'] = 'No fields to update';
                        $response['status'] = 400;
                  }
            } else {
                  $response['message'] = 'Category ID is required';
                  $response['status'] = 400;
            }
            break;


      case 'DELETE': // Delete category
            if (isset($_GET['id'])) {
                  $id = intval($_GET['id']);
                  $deleteStatus = $d->delete('categories', "id = $id");

                  if ($deleteStatus) {
                        $response['message'] = 'Category deleted successfully';
                        $response['status'] = 200;
                  } else {
                        $response['message'] = 'Category deletion failed';
                        $response['status'] = 500;
                  }
            } else {
                  $response['message'] = 'Category ID is required';
                  $response['status'] = 400;
            }
            break;
}
echo json_encode($response);
exit;
