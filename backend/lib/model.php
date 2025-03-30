<?php
class model
{
    private $ary;
    function set_data($name, $value)
    {
        $this->ary[$name]=$value;
    }
    function get_data($name)
    {
        return $this->ary[$name];
    }

    function base_url() {
        $base_url="http://localhost/agrizen/backend/";

                return $base_url;
    }
    function api_key() {
        return "laundryapikey";
    }
}
//for filter data
 function test_input($data)
{
    $data = trim($data);
    $data = stripslashes($data);
     $data = strip_tags($data);
     $data = htmlspecialchars($data);
     return $data;

}
function custom_echo($x, $length)
{
  if(strlen($x)<=$length)
  {
    echo $x;
  }
  else
  {
    $y=substr($x,0,$length) . '...';
    echo $y;
  }
}

// count time 
function time_elapsed_string($datetime, $full = false) {
    $now = new DateTime;
    $ago = new DateTime($datetime);
    $diff = $now->diff($ago);

    $diff->w = floor($diff->d / 7);
    $diff->d -= $diff->w * 7;

    $string = array(
        'y' => 'year',
        'm' => 'month',
        'w' => 'week',
        'd' => 'day',
        'h' => 'hour',
        'i' => 'minute',
        's' => 'second',
    );
    foreach ($string as $k => &$v) {
        if ($diff->$k) {
            $v = $diff->$k . ' ' . $v . ($diff->$k > 1 ? 's' : '');
        } else {
            unset($string[$k]);
        }
    }

    if (!$full) $string = array_slice($string, 0, 1);
    return $string ? implode(', ', $string) . ' ago' : 'just now';
}


/*function imageResize($imageSrc,$imageWidth,$imageHeight,$newImageWidth,$newImageHeight) {

    $newImageLayer=imagecreatetruecolor($newImageWidth,$newImageHeight);
    imagecopyresampled($newImageLayer,$imageSrc,0,0,0,0,$newImageWidth,$newImageHeight,$imageWidth,$imageHeight);

    return $newImageLayer;
    // echo $newImageLayer;
}*/

function imageResize($resourceType, $image_width, $image_height, $resizeWidth, $resizeHeight){
        $imageLayer = imagecreatetruecolor($resizeWidth, $resizeHeight);
        imagealphablending($imageLayer, false);
        imagesavealpha($imageLayer,true);
        $transparency = imagecolorallocatealpha($imageLayer, 255, 255, 255, 127);
        imagefilledrectangle($imageLayer, 0, 0, $resizeWidth, $resizeHeight, $transparency);
        imagecopyresampled($imageLayer, $resourceType, 0, 0, 0, 0, $resizeWidth, $resizeHeight, $image_width, $image_height);
        return $imageLayer;
    }

?>