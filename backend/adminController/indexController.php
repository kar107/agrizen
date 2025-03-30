<?php
include '../utility/object.php';
      // if(isset($_POST) && !empty($_POST) && $_POST['token']==$_SESSION['token'])//it can be $_GET doesn't matter
      // {
$response = array();
if (isset($tag) && !empty($tag) && $tag == "getuser") {
      $s = $d->select('users', 'userid > 0');
      if (mysqli_num_rows($s) > 0) {
            $data = mysqli_fetch_assoc($s);
            $response['data'] = $data;
            $response['message'] = 'success';
            $response['status'] = '200';
            echo json_encode($response);
            exit;
      } else {
            $response['message'] = 'fail';
            $response['status'] = '400';
            echo json_encode($response);
            exit;
      }
} else {
      $response['message'] = 'tag not found';
      $response['status'] = '400';
      echo json_encode($response);
      exit;
}
