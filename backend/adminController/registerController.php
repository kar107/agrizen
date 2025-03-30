<?php
header("Access-Control-Allow-Origin: *"); // Allow all origins (for development)
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../utility/object.php';

// Handle preflight requests (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$response = [];

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST': // Register a new user
        if (isset($_POST['tag']) && $_POST['tag'] == "uermanage") {
            $name = trim($_POST['name']);
            $email = trim($_POST['email']);
            $password = trim($_POST['password']);

            if (strlen($password) < 8) {
                $response['message'] = 'Password must be at least 8 characters';
                $response['status'] = 409; // Conflict
                echo json_encode($response);
                exit;
            }

            $role = isset($_POST['role']) ? trim($_POST['role']) : 'user'; // Default role: user
            $email_verified = 0; // Default email verification status

            if (!empty($name) && !empty($email) && !empty($password)) {
                // Check if email already exists
                $existingUser = $d->select('users', "email = '$email'");

                if (mysqli_num_rows($existingUser) > 0) {
                    $response['message'] = 'Email already registered';
                    $response['status'] = 409; // Conflict
                } else {
                    // Hash password before storing
                    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

                    // Insert new user
                    $insertData = [
                        'name' => $name,
                        'email' => $email,
                        'password_hash' => $hashedPassword,
                        'role' => $role,
                        'email_verified' => $email_verified,
                        'created_at' => date('Y-m-d H:i:s')
                    ];

                    $result = $d->insert('users', $insertData);

                    if ($result) {
                        $response['message'] = 'Registration successful';
                        $response['status'] = 200;
                    } else {
                        $response['message'] = 'Registration failed';
                        $response['status'] = 500;
                    }
                }
            } else {
                $response['message'] = 'All fields are required';
                $response['status'] = 400;
            }
        } else {
            $response['message'] = 'Invalid request';
            $response['status'] = 400;
        }
        break;

    case 'GET': // Fetch all users
        $result = $d->select('users');
        $users = [];

        while ($row = mysqli_fetch_assoc($result)) {
            $users[] = [
                'id' => $row['id'],
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
        break;

    case 'PUT': // Update user
        parse_str(file_get_contents("php://input"), $_PUT);
        if (isset($_PUT['id'])) {
            $id = intval($_PUT['id']);
            $updateData = [];

            if (!empty($_PUT['name'])) {
                $updateData['name'] = trim($_PUT['name']);
            }
            if (!empty($_PUT['role'])) {
                $updateData['role'] = trim($_PUT['role']);
            }

            if (!empty($updateData)) {
                $updateStatus = $d->update('users', $updateData, "id = $id");

                if ($updateStatus) {
                    $response['message'] = 'User updated successfully';
                    $response['status'] = 200;
                } else {
                    $response['message'] = 'User update failed';
                    $response['status'] = 500;
                }
            } else {
                $response['message'] = 'No fields to update';
                $response['status'] = 400;
            }
        } else {
            $response['message'] = 'User ID is required';
            $response['status'] = 400;
        }
        break;

    case 'DELETE': // Delete user
        parse_str(file_get_contents("php://input"), $_DELETE);
        if (isset($_DELETE['id'])) {
            $id = intval($_DELETE['id']);
            $deleteStatus = $d->delete('users', "id = $id");

            if ($deleteStatus) {
                $response['message'] = 'User deleted successfully';
                $response['status'] = 200;
            } else {
                $response['message'] = 'User deletion failed';
                $response['status'] = 500;
            }
        } else {
            $response['message'] = 'User ID is required';
            $response['status'] = 400;
        }
        break;

    default:
        $response['message'] = 'Invalid request method';
        $response['status'] = 405;
        break;
}

echo json_encode($response);
exit;
