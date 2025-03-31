<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../utility/object.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$response = [];
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET': // Fetch user profile
        if (isset($_GET['userid'])) {
            $userid = intval($_GET['userid']);
            $result = $d->select('users', "userid = $userid");
            $user = mysqli_fetch_assoc($result);

            if ($user) {
                unset($user['password_hash']); // Remove password hash for security
                $response = [
                    'status' => 200,
                    'message' => 'User retrieved successfully',
                    'data' => $user
                ];
            } else {
                $response = [
                    'status' => 404,
                    'message' => 'User not found'
                ];
            }
        } else {
            $response = [
                'status' => 400,
                'message' => 'User ID is required'
            ];
        }
        break;

    case 'PUT': // Update profile or password
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['userid'])) {
            echo json_encode(['status' => 400, 'message' => 'User ID is required']);
            exit;
        }
        
        $userid = intval($data['userid']);
        $updateData = [];

        if (!empty($data['name'])) {
            $updateData['name'] = trim($data['name']);
        }
        if (!empty($data['email']) && filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $updateData['email'] = trim($data['email']);
        }
        if (!empty($data['role'])) {
            $allowedRoles = ['admin', 'user', 'editor']; // Define allowed roles
            if (in_array($data['role'], $allowedRoles)) {
                $updateData['role'] = trim($data['role']);
            }
        }

        if (!empty($data['password'])) {
            if (strlen($data['password']) < 8) {
                echo json_encode(['status' => 409, 'message' => 'Password must be at least 8 characters']);
                exit;
            }
            $updateData['password_hash'] = password_hash(trim($data['password']), PASSWORD_BCRYPT);
        }

        if (!empty($updateData)) {
            $updateStatus = $d->update('users', $updateData, "userid = $userid");
            echo json_encode([
                'status' => $updateStatus ? 200 : 500,
                'message' => $updateStatus ? 'Profile updated successfully' : 'Profile update failed'
            ]);
        } else {
            echo json_encode(['status' => 400, 'message' => 'No fields to update']);
        }
        break;

    default:
        echo json_encode(['status' => 405, 'message' => 'Invalid request method']);
        break;
}
exit;