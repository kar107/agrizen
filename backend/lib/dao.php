<?php
include_once 'dbconnect.php';
include_once  'interface1.php';

class dao implements interface1 
{    
    private $conn;

     

    function __construct() 
    {
        //include_once './config.php';
       
        $db=new DbConnect();
        $this->conn=$db->connect();
    }



    function dbCon() {
      $db=new dbconnect();
      return  $this->conn=$db->connect();
    }

    //data insert funtion
    function insert($table,$value)
    {
        $field="";
        $val="";
        $i=0;
        
        foreach ($value as $k => $v)
        {
            $v = $this->conn->real_escape_string($v);
            if($i == 0)
            {
                $field.=$k;
                $val.="'".$v."'";
            }
            
            else 
            {
                $field.=",".$k;
                $val.=",'".$v."'";
                
            }
            $i++;
            
        }
        mysqli_set_charset($this->conn,"utf8mb4");
        // print_r("INSERT INTO $table($field) VALUES($val)");exit;
        return mysqli_query($this->conn,"INSERT INTO $table($field) VALUES($val)") or die(mysqli_error($this->conn));
    }
    
    // insert log
    /*function insert_log($recident_user_id,$admin_id,$user_name,$log_name)
    {   
      $log_name = $this->conn->real_escape_string($log_name);
      $user_name = $this->conn->real_escape_string($user_name);
        $now=date("Y-m-d H:i:s");
        $val="'$recident_user_id','$admin_id','$user_name','$log_name','$now'";
        mysqli_set_charset($this->conn,"utf8mb4");
        return mysqli_query($this->conn,"INSERT INTO log_master(recident_user_id,admin_id,user_name,log_name,log_time) VALUES($val)") or die(mysqli_error($this->conn));
    }*/

    function insert_log($recident_user_id,$admin_id,$user_name,$log_name, $is_support=0)
    {   
      $log_name = $this->conn->real_escape_string($log_name);
      $user_name = $this->conn->real_escape_string($user_name);
        $now=date("Y-m-d H:i:s");
        $val="'$recident_user_id','$admin_id','$user_name','$log_name','$now','$is_support'";
        mysqli_set_charset($this->conn,"utf8mb4");
        return mysqli_query($this->conn,"INSERT INTO log_master(recident_user_id,admin_id,user_name,log_name,log_time, is_support) VALUES($val)") or die(mysqli_error($this->conn));
    }

    // insert log With JSON
    function insert_log_with_json($recident_user_id,$society_id,$user_id,$user_name,$log_name,$common_id = 0, $old_data = '', $new_data = '', $module_name = '')
    {   
      $log_name = $this->conn->real_escape_string($log_name);
      $user_name = $this->conn->real_escape_string($user_name);
        $now=date("Y-m-d H:i:s");
        $val="'$recident_user_id','$society_id','$user_id','$user_name','$log_name','$now','$common_id','$old_data','$new_data','$module_name'";
        mysqli_set_charset($this->conn,"utf8mb4");
        return mysqli_query($this->conn,"INSERT INTO log_master(recident_user_id,society_id,user_id,user_name,log_name,log_time,common_id,old_data,new_data,module_name) VALUES($val)") or die(mysqli_error($this->conn));
    }
    
    function insert_myactivity($recident_user_id,$society_id,$user_id,$user_name,$log_name,$log_img)
    {   
      $log_name = $this->conn->real_escape_string($log_name);
      $user_name = $this->conn->real_escape_string($user_name);
        $now=date("Y-m-d H:i:s");
        $val="'$recident_user_id','$society_id','$user_id','$user_name','$log_name','$now','$log_img'";
        mysqli_set_charset($this->conn,"utf8mb4");
        return mysqli_query($this->conn,"INSERT INTO log_master(recident_user_id,society_id,user_id,user_name,log_name,log_time,log_img) VALUES($val)") or die(mysqli_error($this->conn));
    }

     function insertGuardNotification($notification_logo,$title,$description,$click_action,$society_id,$block_id)
    { 
        $select = mysqli_query($this->conn,"SELECT default_time_zone FROM `society_master` WHERE society_id=$society_id") or die(mysqli_error($this->conn));
        $row=mysqli_fetch_array($select);
        $default_time_zone=$row['default_time_zone'];
        
        date_default_timezone_set("$default_time_zone");

        $today=date('Y-m-d H:i');
          
        mysqli_set_charset($this->conn,"utf8mb4");
        return mysqli_query($this->conn,"INSERT INTO guard_notification_master(society_id,guard_notification_title,guard_notification_desc,employee_id,guard_notification_date,click_action,notification_logo) SELECT employee_master.society_id, '$title','$description',employee_master.emp_id,'$today','$click_action','$notification_logo' FROM employee_master,employee_block_master  WHERE employee_master.emp_id=employee_block_master.emp_id AND employee_master.emp_type_id='0' AND employee_master.society_id='$society_id' AND employee_block_master.block_id='$block_id'") or die(mysqli_error($this->conn));
    }


     function insertUserNotification($society_id,$title,$description,$notification_action,$notification_icon,$append_query)
    { 

        $select = mysqli_query($this->conn,"SELECT default_time_zone FROM `society_master` WHERE society_id=$society_id") or die(mysqli_error($this->conn));
        $row=mysqli_fetch_array($select);
        $default_time_zone=$row['default_time_zone'];
        
        date_default_timezone_set("$default_time_zone");

        $today=date('Y-m-d H:i');

        if ($append_query!="") {
            $append_query= " AND ".$append_query;
        }
          
        $title = $this->conn->real_escape_string($title);
        $description = $this->conn->real_escape_string($description);
        mysqli_set_charset($this->conn,"utf8mb4");
        return mysqli_query($this->conn,"INSERT INTO user_notification(society_id,user_id,notification_title,notification_desc,notification_date,notification_action,notification_logo) SELECT '$society_id', users_master.user_id,'$title','$description','$today','$notification_action','$notification_icon' FROM users_master,unit_master,block_master  WHERE users_master.delete_status=0 AND block_master.block_id=unit_master.block_id AND users_master.unit_id=unit_master.unit_id AND users_master.user_status='1' AND users_master.user_token!='' AND users_master.society_id='$society_id' $append_query") or die(mysqli_error($this->conn));
    }


     function insertAdminNotification($society_id,$admin_notification_id,$title,$description,$notification_action,$notification_icon,$append_query)
    { 

        $select = mysqli_query($this->conn,"SELECT default_time_zone FROM `society_master` WHERE society_id=$society_id") or die(mysqli_error($this->conn));
        $row=mysqli_fetch_array($select);
        $default_time_zone=$row['default_time_zone'];
        
        date_default_timezone_set("$default_time_zone");

        $today=date('Y-m-d H:i:s');
          
        $title = $this->conn->real_escape_string($title);
        $description = $this->conn->real_escape_string($description);
        mysqli_set_charset($this->conn,"utf8mb4");
        return mysqli_query($this->conn,"INSERT INTO admin_notification(admin_id,society_id,notification_tittle,notification_description,notifiaction_date,notification_action,admin_click_action,notification_logo) SELECT bms_admin_master.admin_id,bms_admin_master.society_id,
            '$title','$description','$today','$notification_action','$notification_action','$notification_icon' FROM bms_admin_notification_master, bms_admin_master WHERE bms_admin_notification_master.admin_id = bms_admin_master.admin_id AND bms_admin_master.society_id = '$society_id' AND bms_admin_notification_master.admin_notification_id = '$admin_notification_id' $append_query") or die(mysqli_error($this->conn));
    }


     function insertAdminNotificationWithAdminClick($society_id,$admin_notification_id,$title,$description,$notification_action,$admin_click_action,$notification_icon,$append_query)
    { 

        $select = mysqli_query($this->conn,"SELECT default_time_zone FROM `society_master` WHERE society_id=$society_id") or die(mysqli_error($this->conn));
        $row=mysqli_fetch_array($select);
        $default_time_zone=$row['default_time_zone'];
        
        date_default_timezone_set("$default_time_zone");

        $today=date('Y-m-d H:i:s');
          
        $title = $this->conn->real_escape_string($title);
        $description = $this->conn->real_escape_string($description);
        mysqli_set_charset($this->conn,"utf8mb4");
        return mysqli_query($this->conn,"INSERT INTO admin_notification(admin_id,society_id,notification_tittle,notification_description,notifiaction_date,notification_action,admin_click_action,notification_logo) SELECT bms_admin_master.admin_id,bms_admin_master.society_id,
            '$title','$description','$today','$notification_action','$admin_click_action','$notification_icon' FROM bms_admin_notification_master, bms_admin_master WHERE bms_admin_notification_master.admin_id = bms_admin_master.admin_id AND bms_admin_master.society_id = '$society_id' AND bms_admin_notification_master.admin_notification_id = '$admin_notification_id' $append_query") or die(mysqli_error($this->conn));
    }

     function insertUserNotificationWithId($society_id,$title,$description,$notification_action,$notification_icon,$append_query,$actionId)
    { 

        $select = mysqli_query($this->conn,"SELECT default_time_zone FROM `society_master` WHERE society_id=$society_id") or die(mysqli_error($this->conn));
        $row=mysqli_fetch_array($select);
        $default_time_zone=$row['default_time_zone'];
        
        date_default_timezone_set("$default_time_zone");

        $today=date('Y-m-d H:i');

        if ($append_query!="") {
            $append_query= "AND ".$append_query;
        }
          
        $title = $this->conn->real_escape_string($title);
        $description = $this->conn->real_escape_string($description);
        mysqli_set_charset($this->conn,"utf8mb4");
        return mysqli_query($this->conn,"INSERT INTO user_notification(society_id,user_id,notification_title,notification_desc,notification_date,notification_action,notification_logo,feed_id) SELECT '$society_id', users_master.user_id,'$title','$description','$today','$notification_action','$notification_icon','$actionId' FROM users_master,unit_master,block_master  WHERE users_master.delete_status=0 AND block_master.block_id=unit_master.block_id AND users_master.unit_id=unit_master.unit_id AND users_master.user_status='1' AND users_master.user_token!='' AND users_master.society_id='$society_id' $append_query") or die(mysqli_error($this->conn));
    }

     function insertUserNotificationWithJsonData($society_id,$title,$description,$notification_action,$notification_icon,$jsonData,$append_query)
    { 

        $select = mysqli_query($this->conn,"SELECT default_time_zone FROM `society_master` WHERE society_id=$society_id") or die(mysqli_error($this->conn));
        $row=mysqli_fetch_array($select);
        $default_time_zone=$row['default_time_zone'];
        
        date_default_timezone_set("$default_time_zone");

        $today=date('Y-m-d H:i');

        if ($append_query!="") {
            $append_query= " AND ".$append_query;
        }
          
        $title = $this->conn->real_escape_string($title);
        $description = $this->conn->real_escape_string($description);
        $jsonData = $this->conn->real_escape_string($jsonData);
        
        
        mysqli_set_charset($this->conn,"utf8mb4");
        return mysqli_query($this->conn,"INSERT INTO user_notification(society_id,user_id,notification_title,notification_desc,notification_date,notification_action,notification_logo,notification_data_ids) SELECT '$society_id', users_master.user_id,'$title','$description','$today','$notification_action','$notification_icon','$jsonData' FROM users_master,unit_master,block_master  WHERE users_master.delete_status=0 AND block_master.block_id=unit_master.block_id AND users_master.unit_id=unit_master.unit_id AND users_master.user_status='1' AND users_master.user_token!='' AND users_master.society_id='$society_id' $append_query") or die(mysqli_error($this->conn));
    }

    function insertUserNotificationVendor($society_id,$title,$description,$notification_action,$notification_icon,$append_query,$service_provider_users_id)
    { 

        $select = mysqli_query($this->conn,"SELECT default_time_zone FROM `society_master` WHERE society_id=$society_id") or die(mysqli_error($this->conn));
        $row=mysqli_fetch_array($select);
        $default_time_zone=$row['default_time_zone'];
        
        date_default_timezone_set("$default_time_zone");

        $today=date('Y-m-d H:i');

        if ($append_query!="") {
            $append_query= "AND ".$append_query;
        }
          
        $title = $this->conn->real_escape_string($title);
        $description = $this->conn->real_escape_string($description);
        mysqli_set_charset($this->conn,"utf8mb4");
        return mysqli_query($this->conn,"INSERT INTO user_notification(society_id,user_id,notification_title,notification_desc,notification_date,notification_action,notification_logo,feed_id) SELECT '$society_id', users_master.user_id,'$title','$description','$today','$notification_action','$notification_icon','$service_provider_users_id' FROM users_master,unit_master,block_master  WHERE block_master.block_id=unit_master.block_id AND users_master.unit_id=unit_master.unit_id AND users_master.user_status='1' AND users_master.user_token!='' AND users_master.society_id='$society_id' $append_query") or die(mysqli_error($this->conn));
    }

    //using insert funtion for procedures 
    function insert1($table, $value)
    {
        $field="";
        $val="";
        $i = 0;
        
          foreach($value as $k => $v)
          {
            $v = $this->conn->real_escape_string($v);
              if($i==0)
             
               {
                  $field.=$k;
                  $val.="'" . $v . "'";
              }
              else 
              {
                  $field.="," . $k ;
                  $val.=", '" . $v . "'";
              }
              $i++;
          }
          mysqli_set_charset($this->conn,"utf8mb4");
          return mysqli_query($this->conn,"CALL $table($val)")or die(mysqli_error($this->conn));;
    }
    
      //select funtion display data
    function select($table, $where='', $other='')
    {
        if($where != '')
        {
            $where= 'where ' .$where;
        }
        mysqli_set_charset($this->conn,"utf8mb4");
        // print_r("SELECT * FROM $table $where $other");
        $select = mysqli_query($this->conn,"SELECT * FROM $table $where $other") or die(mysqli_error($this->conn));
        return $select;
    }

    function check_auth($auth_user_name,$auth_password)
    {
        mysqli_set_charset($this->conn,"utf8mb4");
        $select = mysqli_query($this->conn,"SELECT * FROM users_master WHERE user_id='$auth_user_name'") or die(mysqli_error($this->conn));
        $data=  mysqli_fetch_array($select);
        if ($data>0) {
            $last3Digit=  $newstring = substr($data['user_mobile'], -3);
            $myPassword= $data['user_id'].'@'.$last3Digit.'@'.$data['society_id'];
            if ($myPassword==$auth_password) {
                return 'true';
            } else {
                return 'false';
            }
        } else {
            return 'false';
        }
    }


    function selectAdmin($where='')
    {
        if($where != '')
        {
            $where= 'where ' .$where;
        }
        mysqli_set_charset($this->conn,"utf8mb4");
        $select = mysqli_query($this->conn,"SELECT * FROM `bms_admin_master` WHERE admin_active_status=0 AND `admin_id` not in (SELECT admin_id FROM admin_block_master) UNION SELECT a.* FROM `bms_admin_master` as a inner JOIN admin_block_master as ab on a.`admin_id`=ab.admin_id $where") or die(mysqli_error($this->conn));
        return $select;
    }

    function getTimezone($society_id)
    {
        
        return 'Asia/Calcutta';
        
    }


      //select funtion display data
    function selectRow($colum,$table, $where='', $other='')
    {
        if($where != '')
        {
            $where= 'where ' .$where;
        }
        mysqli_set_charset($this->conn,"utf8mb4");
        // print_r("SELECT $colum FROM $table $where $other");
        $select = mysqli_query($this->conn,"SELECT $colum FROM $table $where $other") or die(mysqli_error($this->conn));
        return $select;
    }
      //select funtion display data
    function selectMultipleCount($colum)
    {
        if($where != '')
        {
            $where= 'where ' .$where;
        }
        mysqli_set_charset($this->conn,"utf8mb4");
        $select = mysqli_query($this->conn,"SELECT $colum") or die(mysqli_error($this->conn));
        return $select;
    }
    function select_row($table, $where='', $other='')
    {
        if($where != '')
        {
            $where= 'where ' .$where;
        }
        mysqli_set_charset($this->conn,"utf8mb4");
        $select = mysqli_query($this->conn,"SELECT COUNT(*) as num_rows FROM $table $where $other") or die(mysqli_error($this->conn));
        return $select;
    }
     //select funtion display data with DISTINCT  (not show duplicate)
    function select1($table, $column, $where='',$other='')
    {
        if($where != '')
        {
            $where= 'where ' .$where;
        }
        mysqli_set_charset($this->conn,"utf8mb4");
        $select = mysqli_query($this->conn,"SELECT DISTINCT $column FROM $table $where $other") or die(mysqli_error($this->conn));
        return $select;
    }
    function select2($table, $where='',$other='')
    {
        if($where != '')
        {
            $where= 'where ' .$where;
        }
        mysqli_set_charset($this->conn,"utf8mb4");
        $select = mysqli_query($this->conn,"SELECT DISTINCT * FROM $table $where $other") or die(mysqli_error($this->conn));
        return $select;
    }
    function selectColumnWise($table,$columnName='',$where=''){
        if($where != '')
        {
           $where= 'where ' .$where;
        }
        mysqli_set_charset($this->conn,"utf8mb4");
         $select = mysqli_query($this->conn,"SELECT $columnName FROM $table $where") or die(mysqli_error($this->conn));
        return $select;
    }
  
    // using sp   
    function selectSp($spName) {

      mysqli_set_charset($this->conn, "utf8mb4");
      $result = mysqli_query($this->conn, "CALL $spName");
      return $result;
      // return mysqli_query($this->conn,"CALL $table")or die(mysqli_error($this->conn));;
    }
   
    function selectSpArray($spName) {

      $dataArray=array();
      mysqli_set_charset($this->conn, "utf8mb4");
      $result = mysqli_query($this->conn, "CALL $spName");
      while($data_countries_list=mysqli_fetch_array($result)) {
        array_push($dataArray, $data_countries_list);
      }
      mysqli_next_result($this->conn);
      return $dataArray;
      // return mysqli_query($this->conn,"CALL $table")or die(mysqli_error($this->conn));;
    }
      //delete using update query(active_flag)
     function delete1($table ,$var, $where)
    {
        if($where != '')
        {
            $where= 'where ' .$where;
        }
        if($var != '')
        {
            $var= 'active_flag= ' .$var;
        }
        mysqli_set_charset($this->conn,"utf8mb4");
        return mysqli_query($this->conn,"update $table set $var $where");
    }

    //Update Product View (view_status)
     function view_status($table ,$var, $where)
    {
        if($where != '')
        {
            $where= 'where ' .$where;
        }
        if($var != '')
        {
            $var= 'view_status= ' .$var;
        }
        mysqli_set_charset($this->conn,"utf8mb4");
        return mysqli_query($this->conn,"update $table set $var $where");
    }


     //Comment ()
     function comment($table ,$var, $where)
    {
        if($where != '')
        {
            $where= 'where ' .$where;
        }
        if($var != '')
        {
            $var= 'status= ' .$var;
        }
        mysqli_set_charset($this->conn,"utf8mb4");
        return mysqli_query($this->conn,"update $table set $var $where");
    }
     //delete permanataly  function
    function delete($table , $where='')
    {
        if($where != '')
        {
        $where= 'where ' .$where;
        }
        mysqli_set_charset($this->conn,"utf8mb4");
        return mysqli_query($this->conn,"delete FROM $table $where")or die(mysqli_error($this->conn));
    }

    //Upadate funtion
    function update($table ,$value, $where)
    {
        if($where != '')
        {
            $where= 'where ' .$where;
        }


        $val="";
        $i=0;
        foreach ($value as $k => $v)
        {
            $v = $this->conn->real_escape_string($v);
            if($i == 0)
            {
              $val.=$k."='".$v."'";    
            }
            
            else 
            {
              $val.=",".$k."='".$v."'";
            }
            $i++;
            
        }
        mysqli_set_charset($this->conn,"utf8mb4");
        return mysqli_query($this->conn,"update $table SET $val $where");
    }
     //select next auto_increment_id
    function last_auto_id($table)
    {
        mysqli_set_charset($this->conn,"utf8mb4");
        $select_id = mysqli_query($this->conn,"SHOW TABLE STATUS LIKE '$table'" ) or die(mysqli_error($this->conn));
        return $select_id;
    }

        //Count Data of Table
    function count_data($field='' ,$table='' ,$where='')
    {
        if($where != '')
        {
            $where= 'where ' .$where;
        }
        mysqli_set_charset($this->conn,"utf8mb4");
        $count_data = mysqli_query($this->conn,"SELECT $field,COUNT(*)  FROM $table $where" ) or die(mysqli_error($this->conn));
        return $count_data;

    }

    //Count Data of Table
    function count_data_direct($field='' ,$table='' ,$where='')
    {
        if($where != '')
        {
            $where= 'where ' .$where;
        }
        mysqli_set_charset($this->conn,"utf8mb4");
        // $temp = mysqli_query($this->conn,"SELECT $field,COUNT(*)  FROM $table $where" ) or die(mysqli_error($this->conn));
        // while($rowCount=mysqli_fetch_array($temp)) {
        // $totalCount=$rowCount['COUNT(*)'];
        
        $result=mysqli_query($this->conn,"SELECT count(*) as $field from $table $where") or die(mysqli_error($this->conn));
        $data=mysqli_fetch_assoc($result);
        $totalCount= $data[$field];
        return $totalCount;
        // }

    }
     //Count sum of  Table field
    function sum_data($field='' ,$table='' ,$where='')
    {
        if($where != '')
        {
            $where= 'where ' .$where;
        }
        mysqli_set_charset($this->conn,"utf8mb4");
        $sum_data = mysqli_query($this->conn,"SELECT SUM($field) from $table $where" ) or die(mysqli_error($this->conn));
        return $sum_data;

    }

    function sum_groupby_data($field,$field1,$table,$where='',$groupby='',$other='')
    {
        if($where != '')
        {
            $where= 'where ' .$where;
        }
        if($groupby != '')
        {
            $groupby= 'GROUP BY ' .$groupby;
        }
        mysqli_set_charset($this->conn,"utf8mb4");
        $sum_data = mysqli_query($this->conn,"SELECT $field, SUM($field1) as total_amount from $table $where $groupby $other") or die(mysqli_error($this->conn));
        return $sum_data;
    }


   

    // get fcm token
    function getFcm($fildName,$table,$where){
     mysqli_set_charset($this->conn,"utf8mb4");
     $sql="SELECT $fildName FROM $table WHERE $where";
     $temp=mysqli_query($this->conn,$sql);
     $data=mysqli_fetch_array($temp);
       if($data > 0){
        $fcm=$data[$fildName];
        return $fcm;
       }
       else{
        return false;
       }
      }


    function get_android_fcm($table,$where) {
        if($where != '')
        {
            $where= 'where ' .$where;
        }
        mysqli_set_charset($this->conn,"utf8mb4");
        $select = mysqli_query($this->conn,"SELECT * FROM $table $where") or die(mysqli_error($this->conn));
        $fcmArray=array();
        while ($row=mysqli_fetch_array($select)) {
            $user_token= $row['user_token'];
            array_push($fcmArray, $user_token);
        }
        $fcmArray = array_unique($fcmArray);
        $fcmArray = array_values($fcmArray); 
        return $fcmArray;

    }
   

    function formatSizeUnits($bytes)
    {
        if ($bytes >= 1073741824)
        {
            $bytes = number_format($bytes / 1073741824, 2) . ' GB';
        }
        elseif ($bytes >= 1048576)
        {
            $bytes = number_format($bytes / 1048576, 0) . ' MB';
        }
        elseif ($bytes >= 1024)
        {
            $bytes = number_format($bytes / 1024, 0) . ' KB';
        }
        elseif ($bytes > 1)
        {
            $bytes = $bytes . ' bytes';
        }
        elseif ($bytes == 1)
        {
            $bytes = $bytes . ' byte';
        }
        else
        {
            $bytes = '0 bytes';
        }

        return $bytes;
    }
    //update counter
    function updateCounter($table ,$value='')
    {
        mysqli_set_charset($this->conn,"utf8mb4");
        return mysqli_query($this->conn,"update $table SET $value");
    }


      //select funtion display data
    function dbSize()
    {
       
        mysqli_set_charset($this->conn,"utf8mb4");
        $select = mysqli_query($this->conn,"SHOW TABLE STATUS") or die(mysqli_error($this->conn));
        return $select;
    }

    
    function selectArray($table, $where='', $other='')
    {
      if($where != '')
      {
          $where= 'where ' .$where;
      }
      mysqli_set_charset($this->conn,"utf8");
      mysqli_set_charset($this->conn,"utf8");
      $select = mysqli_query($this->conn,"SELECT * FROM $table $where $other") or die(mysqli_error($this->conn));
      $data = mysqli_fetch_array($select);
      return $data;
    }

    // get applicable leave count


    function GetCurrencySymbol($society_id){
        $qry = $this->selectRow("currency", "society_master", "society_id = '$society_id'");
        $data = mysqli_fetch_array($qry);
        return $data['currency'];
    }



    function number_format_short( $n ) {
        if ($n > 0 && $n < 1000) {
            // 1 - 999
            $n_format = floor($n);
            $suffix = '';
        } else if ($n >= 1000 && $n < 1000000) {
            // 1k-999k
            $n_format = floor($n / 1000);
            $suffix = 'K+';
        } else if ($n >= 1000000 && $n < 1000000000) {
            // 1m-999m
            $n_format = floor($n / 1000000);
            $suffix = 'M+';
        } else if ($n >= 1000000000 && $n < 1000000000000) {
            // 1b-999b
            $n_format = floor($n / 1000000000);
            $suffix = 'B+';
        } else if ($n >= 1000000000000) {
            // 1t+
            $n_format = floor($n / 1000000000000);
            $suffix = 'T+';
        }

        return !empty($n_format . $suffix) ? $n_format . $suffix : 0;
    }

    function haversineGreatCircleDistance($latitudeFrom, $longitudeFrom, $latitudeTo, $longitudeTo, $earthRadius = 6371000)
    {
      // convert from degrees to radians
      $latFrom = deg2rad($latitudeFrom);
      $lonFrom = deg2rad($longitudeFrom);
      $latTo = deg2rad($latitudeTo);
      $lonTo = deg2rad($longitudeTo);

      $latDelta = $latTo - $latFrom;
      $lonDelta = $lonTo - $lonFrom;

      $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
        cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));
      return $angle * $earthRadius;
    }


    function add_sms_log($mobile,$message_name,$country_code,$sms_count) {
       
        $now=date("Y-m-d H:i:s");
        $val="'$mobile','$message_name','$sms_count','$now','$country_code'";
          mysqli_set_charset($this->conn,"utf8mb4");
          return mysqli_query($this->conn,"INSERT INTO sms_log_master(user_mobile,sms_log,used_credit,log_time,country_code) VALUES($val)") or die(mysqli_error($this->conn));
    }

    function add_whatsapp_log($mobile,$message_name,$society_id,$country_code) {
       
        $now=date("Y-m-d H:i:s");
        $val="'$society_id','$mobile','$message_name','0','$now','$country_code', '1'";
          mysqli_set_charset($this->conn,"utf8mb4");
          return mysqli_query($this->conn,"INSERT INTO sms_log_master(society_id,user_mobile,sms_log,used_credit,log_time,country_code,log_type) VALUES($val)") or die(mysqli_error($this->conn));


    }

    function get_encrypt_key() {
        $common_key = "4c5cfefcc958f1748eb31dcc609736FK";
        return $common_key;
    } 

    function get_encrypt_iv() {
        $iv_master = "K8Csuc2GiKvetPZg";
        return $iv_master;
    }   
 
    function executeSql($sql, $type)
    {
      
        $query = mysqli_query($this->conn, $sql);
        $result01=array();
        switch ($type) {

            case 'result_array':
                while ( $data=mysqli_fetch_array($query)) {
                    array_push($result01,$data);
                }
                $result = $result01;
                break;
            case 'row_array':
                $result = mysqli_fetch_assoc($query);
                break;
            case 'num_rows':
                $result = mysqli_num_rows($query);
                break;
            default:
                $result = 'Failed';
                break;
        }
        return $result;

    }
   
     

    function getTotalHours($startDate, $endDate, $startTime, $endTime) {

        $sDTime = $startDate." ".$startTime;
        $eDTime = $endDate." ".$endTime;

        $pTime = date('Y-m-d h:i A',strtotime($sDTime));
        $eTime = date('Y-m-d h:i A',strtotime($eDTime));

        $date_a = new DateTime($pTime);
        $date_b = new DateTime($eTime);

        $interval = $date_a->diff($date_b);
       
        $days = $interval->format('%d')*24;
        $hours = $interval->format('%h');
        $hours = $hours+$days;
        $minutes = $interval->format('%i');
        $sec = $interval->format('%s');

        return sprintf('%02d:%02d', $hours, $minutes);
    }

    function getTotalHoursWithNames($startDate, $endDate, $startTime, $endTime) {
   
        $sDTime = $startDate." ".$startTime;
        $eDTime = $endDate." ".$endTime;

        $pTime = date('Y-m-d h:i A',strtotime($sDTime));
        $eTime = date('Y-m-d h:i A',strtotime($eDTime));

        $date_a = new DateTime($pTime);
        $date_b = new DateTime($eTime);

        $interval = $date_a->diff($date_b);
       
        $days = $interval->format('%d')*24;
        $hours = $interval->format('%h');
        $hours = $hours+$days;
        $minutes = $interval->format('%i');
        $sec = $interval->format('%s');

        if ($hours > 0 && $minutes) {
            return sprintf('%02d hr %02d min', $hours, $minutes);
        }else if ($hours > 0 && $minutes <= 0) {
            return sprintf('%02d hr', $hours);
        }else if ($hours <= 0 && $minutes > 0) {
            return sprintf('%02d min', $minutes);
        }else{
            return "No Data";
        }

    }

    // Function to get the client IP address
    function get_client_ip() {
        $ipaddress = '';
        if (getenv('HTTP_CLIENT_IP'))
            $ipaddress = getenv('HTTP_CLIENT_IP');
        else if(getenv('HTTP_X_FORWARDED_FOR'))
            $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
        else if(getenv('HTTP_X_FORWARDED'))
            $ipaddress = getenv('HTTP_X_FORWARDED');
        else if(getenv('HTTP_FORWARDED_FOR'))
            $ipaddress = getenv('HTTP_FORWARDED_FOR');
        else if(getenv('HTTP_FORWARDED'))
           $ipaddress = getenv('HTTP_FORWARDED');
        else if(getenv('REMOTE_ADDR'))
            $ipaddress = getenv('REMOTE_ADDR');
        else
            $ipaddress = 'UNKNOWN';
        return $ipaddress;
    }

    function get_sort_name($user_full_name) {
        $full_name_arr=explode(" ",$user_full_name); 
        $full_name_arr_end=end($full_name_arr); 
        $firstWord=!empty($full_name_arr[0])?$full_name_arr[0]:''; 
        $lastWord=!empty($full_name_arr_end[0])?$full_name_arr_end[0]:''; 
        $charF=!empty(mb_substr($firstWord,0,1, "utf-8"))?mb_substr($firstWord,0,1, "utf-8"):''; 
        $charL=!empty(mb_substr($lastWord,0,1, "utf-8"))?mb_substr($lastWord,0,1, "utf-8"):''; 
        $shortChar=strtoupper($charF.$charL); 
        return($shortChar);
    }

    function getBrowser() { 
      $u_agent = $_SERVER['HTTP_USER_AGENT'];
      $bname = 'Unknown';
      $platform = 'Unknown';
      $version= "";

      //First get the platform?
      if (preg_match('/linux/i', $u_agent)) {
        $platform = 'Linux';
      }elseif (preg_match('/macintosh|mac os x/i', $u_agent)) {
        $platform = 'MAC';
      }elseif (preg_match('/windows|win32/i', $u_agent)) {
        $platform = 'Windows';
      }

      // Next get the name of the useragent yes seperately and for good reason
      if(preg_match('/MSIE/i',$u_agent) && !preg_match('/Opera/i',$u_agent)){
        $bname = 'Internet Explorer';
        $ub = "MSIE";
      }elseif(preg_match('/Firefox/i',$u_agent)){
        $bname = 'Mozilla Firefox';
        $ub = "Firefox";
      }elseif(preg_match('/OPR/i',$u_agent)){
        $bname = 'Opera';
        $ub = "OPR";
      }elseif(preg_match('/Chrome/i',$u_agent) && !preg_match('/Edg/i',$u_agent)){
        $bname = 'Google Chrome';
        $ub = "Chrome";
      }elseif(preg_match('/Safari/i',$u_agent) && !preg_match('/Edg/i',$u_agent)){
        $bname = 'Apple Safari';
        $ub = "Safari";
      }elseif(preg_match('/Netscape/i',$u_agent)){
        $bname = 'Netscape';
        $ub = "Netscape";
      }elseif(preg_match('/Edg/i',$u_agent)){
        $bname = 'Edge';
        $ub = "Edg";
      }elseif(preg_match('/Trident/i',$u_agent)){
        $bname = 'Internet Explorer';
        $ub = "MSIE";
      }

      // finally get the correct version number
      $known = array('Version', $ub, 'other');
      $pattern = '#(?<browser>' . join('|', $known) .
    ')[/ ]+(?<version>[0-9.|a-zA-Z.]*)#';
      if (!preg_match_all($pattern, $u_agent, $matches)) {
        // we have no matching number just continue
      }
      // see how many we have
      $i = count($matches['browser']);
      if ($i != 1) {
        //we will have two since we are not using 'other' argument yet
        //see if version is before or after the name
        if (strripos($u_agent,"Version") < strripos($u_agent,$ub)){
            $version= $matches['version'][0];
        }else {
            $version= $matches['version'][1];
        }
      }else {
        $version= $matches['version'][0];
      }

      // check if we have a number
      if ($version==null || $version=="") {$version="?";}

      return array(
        'userAgent' => $u_agent,
        'name'      => $bname,
        'version'   => $version,
        'platform'  => $platform,
        'pattern'    => $pattern
      );
    }

    function range_date($first, $last)
    {
        $arr = array();
        $now = strtotime($first);
        $last = strtotime($last);

        while ($now <= $last) {
            $arr[] = date('Y-m-d', $now);
            $now = strtotime('+1 day', $now);
        }

        return $arr;
    }

    function removeGstAmountFromOriginalAmount ($originalAmount, $gstPercentage) {
        return round(($originalAmount * (100 / (100 + $gstPercentage ))), 2);
    }


    function minutes($time){
        $time = explode(':', $time);
        return ($time[0]*60) + ($time[1]) + ($time[2]/60);
    }

    function timeFormat($time){
        $time = explode(':', $time);
        $hours = $time[0];
        $minutes = $time[1];
        if ($hours > 0 && $minutes > 0) {
            return sprintf('%02d hr %02d min', $hours, $minutes);
        }else if ($hours > 0 && $minutes <= 0) {
            return sprintf('%02d hr', $hours);
        }else if ($hours <= 0 && $minutes > 0) {
            return sprintf('%02d min', $minutes);
        }else{
            return "";
        }
    }

    function timeFormatDot($time){
        $time = explode(':', $time);
        $hours = $time[0];
        $minutes = $time[1];
        return sprintf('%02d:%02d', $hours, $minutes);
    }

    function hoursandmins($time, $format = '%02d:%02d'){
        if ($time < 1) {
            return;
        }
        $hours = floor($time / 60);
        $minutes = ($time % 60);
        return sprintf($format, $hours, $minutes);
    }

    function sort_varible($var) {
            $var_len = strlen($var);
            if ($var_len>30) {
                $sort_varible_new = substr($var,0,27).'..';
                return($sort_varible_new);
            } else {
                return($var);
            }
    }

    function master_url() {
        $newIv = "https://laundry.chlplgroup.org/";
        return $newIv;
    }

    function map_key() {
        $newIv = "AIzaSyDpjaaSIKjEqdZA2brIuk6sG5rGEs6l5H4";
        // $newIv = "AIzaSyDFOOP_bfTGjI0AsnB6YMducjGplsOJOiw";
        // $newIv = "AIzaSyAD2GPPfRBeWjfTywSDNMGJ-90nsP34GcI";
        return $newIv;
    } 

    function get_server_key() {
        $newIv = "AAAAhDaKHP8:APA91bG3GtntfM0Bj5alVDTdkXzeB_7bC-prIIgJTtOvXex6bbfhOl1cHjbmTphLO6tC1vUP9PhVojN8PWeSzj_U83EBLdU92o753VKPjGPH2Qqs2YcKOQZDhPgKKyq6D_gLnvNVz62w";
        return $newIv;
    } 

    function get_project_id() {
        $newIv = "my-company-dbf3b";
        return $newIv;
    }

    function app_name() {
        $newIv = "OTeRri";
        return $newIv;
    }

    function imageupload($file,$folder,$maxsize="",$returnPath="",$acceptable_image)
    {
        $event_name = rand(1111,9999);
        $errors = array();
        if(($file['size'] > $maxsize) || ($file["size"] == 0))
        {
            $fileSize = round($maxsize / 1024 / 1024,4) . ' MB.';
            $_SESSION['msg1']="Image too large. Must be less than $fileSize";
            header("location:../$returnPath");
            exit();
        }
        if(!in_array($file['type'], $acceptable_image) && (!empty($file["type"])))
        {
            $data = implode(',', $acceptable_image);
            $data1 = str_replace("image/"," ",$data);
            $_SESSION['msg1']="Invalid  photo. Only ".$data1." are allowed.";
            header("location:../$returnPath");
            exit();
        }
        if(count($errors) === 0)
        {
            $image_Arr = $file;
            $temp = explode(".", $file["name"]);
            $product_photo = $event_name.'_'.round(microtime(true)) . '.' . end($temp);
            move_uploaded_file($file["tmp_name"],$folder.$product_photo);
        }
        return $product_photo;
    }

    function manage_encryption($status, $response){
        if($status==0){
            return json_encode($response);
        }else{
            $enc_key = $this->get_encrypt_key();
            $enc_iv = $this->get_encrypt_iv();
            return $encryptedString = base64_encode(openssl_encrypt(json_encode($response), 'AES-256-CBC', $enc_key, OPENSSL_RAW_DATA, $enc_iv));
        }
    }

    function is_dencrypted()
    {
        return $is_dencrypted = 1;
    }

    function multipleimageupload($file,$folder,$maxsize,$returnPath,$acceptable_image,$fileSize,$fileType,$filestmp)
    {
        $event_name = rand(1111,9999);
        $errors = array();
        if(($fileSize > $maxsize) || ($fileSize == 0))
        {
            $fileSize1 = round($maxsize / 1024 / 1024,4) . ' MB.';
            $_SESSION['msg1']="Image too large. Must be less than $fileSize1";
            header("location:../$returnPath");
            exit();
        }
        if(!in_array($fileType, $acceptable_image) && (!empty($fileType)))
        {
            $data = implode(',', $acceptable_image);
            $data1 = str_replace("image/"," ",$data);
            $_SESSION['msg1']="Invalid  photo. Only ".$data1." are allowed.";
            header("location:../$returnPath");
            exit();
        }
        if(count($errors) === 0)
        {
            $temp = explode(".", $file);
            $product_photo = $event_name.'_'.round(microtime(true)) . '.' . end($temp);
            move_uploaded_file($filestmp,$folder.$product_photo);
        }
        return $product_photo;
    }

    function getWebFcm($table,$where) {
      if($where != '')
      {
          $where= 'where ' .$where;
      }
      mysqli_set_charset($this->conn,"utf8mb4");
      $select = mysqli_query($this->conn,"SELECT * FROM $table $where") or die(mysqli_error($this->conn));
      $totalUsers = mysqli_num_rows($select);
      $loopCount= $totalUsers/1000;
      $loopCount= round($loopCount)+1;

      for ($i=0; $i <$loopCount ; $i++) { 
          $limit_users = $i."000";
          $fcmArray=array();
          $q1 = mysqli_query($this->conn,"SELECT fcm_token FROM $table $where GROUP BY fcm_token") or die(mysqli_error($this->conn));
            while ($row=mysqli_fetch_array($q1)) {
              $fcm_token= $row['fcm_token'];
              array_push($fcmArray, $fcm_token);
            }
           return $fcmArray;
        }
    }

    function android_url() {
        $newIv = "https://play.google.com/store/apps/details?id=com.laundryapp.customer&hl=en&gl=US";
        return $newIv;
    }

    function ios_url() {
        $newIv = "https://apps.apple.com/kh/app/my-association-app/id1565765469";
        return $newIv;
    }

    function android_url_vendor() {
        $newIv = "https://play.google.com/store/apps/details?id=com.laundryapp.vendor&hl=en&gl=US";
        return $newIv;
    }

    function ios_url_vendor() {
        $newIv = "https://apps.apple.com/kh/app/my-association-app/id1565765469";
        return $newIv;
    }

    function powered_by() {
        $powered_by = "OTeRri";
        return $powered_by;
    }
    function emailurls(){
        $authVal = array(
            'facebook_url'=>'https://www.facebook.com/chpl',
            'instagram_url'=>'https://www.instagram.com/chpl/',
            'linked_in_url'=>'https://www.linkedin.com/company/chpl',
            'whatsapp_url'=>'',
            'powered_by_url'=>'https://www.chplgroup.org/',
            'support_email'=>'info@chplgroup.org'
        );
        return $authVal;
    }

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

    
    function numberinwords($number){
        $no = floor($number);
        $point = round($number - $no, 2) * 100;
        $hundred = null;
        $digits_1 = strlen($no);
        $i = 0;
        $str = array();
        $words = array('0' => '', '1' => 'One', '2' => 'Two', '3' => 'Three', '4' => 'Four', '5' => 'Five', '6' => 'Six', '7' => 'Seven', '8' => 'Eight', '9' => 'Nine', '10' => 'Ten', '11' => 'Eleven', '12' => 'Twelve', '13' => 'Thirteen', '14' => 'Fourteen', '15' => 'Fifteen', '16' => 'Sixteen', '17' => 'Seventeen', '18' => 'Eighteen', '19' =>'Nineteen', '20' => 'Twenty', '30' => 'Thirty', '40' => 'Forty', '50' => 'Fifty', '60' => 'Sixty', '70' => 'Seventy', '80' => 'Eighty', '90' => 'Ninety');
        $digits = array('', 'Hundred', 'Thousand', 'Lakh', 'Crore');
        while($i < $digits_1){
            $divider = ($i == 2) ? 10 : 100;
            $number = floor($no % $divider);
            $no = floor($no / $divider);
            $i += ($divider == 10) ? 1 : 2;
            if ($number) {
                $plural = (($counter = count($str)) && $number > 9) ? 's' : null;
                $hundred = ($counter == 1 && $str[0]) ? ' and ' : null;
                $str [] = ($number < 21) ? $words[$number] ." " . $digits[$counter] . $plural . " " . $hundred : $words[floor($number / 10) * 10] . " " . $words[$number % 10] . " " . $digits[$counter] . $plural . " " . $hundred;
            }else $str[] = null;
        }
        $str = array_reverse($str);
        $result = implode('', $str);
        $points = ($point) ? "." . $words[$point / 10] . " " . $words[$point = $point % 10] : '';
        return "INR " . $result . "Rupees Only";
    }
    

    function encryptDecrypt($action, $string){
        $output=false;
        $method = "AES-256-CBC";
        $enc_key = $this->get_encrypt_key();
        $enc_iv = $this->get_encrypt_iv();
        $key=hash("sha256", $enc_key);
        $iv=substr(hash("sha256", $enc_iv), 0, 16);
        if ($action=="encrypt"){
            $output=openssl_encrypt($string, $method, $key, 0, $iv);
            $output=base64_encode($output);
        }
        else if($action=="decrypt"){
            $output=openssl_decrypt($string, $method, $key, 0, $iv);
            $output=openssl_decrypt(base64_decode($string), $method, $key, 0, $iv);
        }
        return $output;
    }
}
?>