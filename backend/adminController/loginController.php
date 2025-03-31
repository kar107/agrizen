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

if (isset($_POST['tag']) && $_POST['tag'] == "login") {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    if (!empty($email) && !empty($password)) {
        // Fetch user details
        $s = $d->select('users', "email = '$email'");
        
        if (mysqli_num_rows($s) > 0) {
            $user = mysqli_fetch_assoc($s);

            // Verify password
            if (password_verify($password,$user['password_hash'])) {
                    $_SESSION['userid'] = $user['userid'];
                    $_SESSION['role'] = $user['role'];

                    $response['message'] = 'Login successful';
                    $response['status'] = '200';
                    $response['data'] = [
                        'userid' => $user['userid'],
                        'name' => $user['name'],
                        'email' => $user['email'],
                        'role' => $user['role'],
                        'created_at' => $user['created_at']
                    ];
               
            } else {
                $response['message'] = 'Invalid password';
                $response['status'] = '401';
            }
        } else {
            $response['message'] = 'User not found';
            $response['status'] = '404';
        }
    } else {
        $response['message'] = 'Email and password are required';
        $response['status'] = '400';
    }
} else {
    $response['message'] = 'Invalid request';
    $response['status'] = '400';
}

echo json_encode($response);
exit;
