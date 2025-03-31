<?php
header("Access-Control-Allow-Origin: *"); // Allow all origins (for development)
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow only necessary methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow required headers

include '../utility/object.php';

// Handle preflight requests (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$response = array();

if (isset($_POST['tag']) && $_POST['tag'] == "register") {
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $role = trim($_POST['role']);

    // Validate required fields
    if (!empty($name) && !empty($email) && !empty($password) && !empty($role)) {
        
        // Check if email already exists
        $checkEmail = $d->select('users', "email = '$email'");
        if (mysqli_num_rows($checkEmail) > 0) {
            $response['message'] = 'Email already registered';
            $response['status'] = '409';
        } else {
            // Hash password
            $passwordHash = password_hash($password, PASSWORD_BCRYPT);

            // Insert user data
            $data = [
                'name' => $name,
                'email' => $email,
                'password_hash' => $passwordHash,
                'role' => $role,
                'created_at' => date('Y-m-d H:i:s')
            ];

            $insert = $d->insert('users', $data);

            if ($insert) {
                $response['message'] = 'Registration successful';
                $response['status'] = '200';
            } else {
                $response['message'] = 'Registration failed';
                $response['status'] = '500';
            }
        }
    } else {
        $response['message'] = 'All fields are required';
        $response['status'] = '400';
    }
} else {
    $response['message'] = 'Invalid request';
    $response['status'] = '400';
}

echo json_encode($response);
exit;
?>
