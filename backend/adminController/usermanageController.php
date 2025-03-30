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
