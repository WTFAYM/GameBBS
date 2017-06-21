<?php
header("Content-type:application/json;charset=utf-8");
include_once "MyDB.php";
require_once "Message.php";

$msg = new Message();
$db = new MyDB();

if(!isset($_POST['account'])||empty($_POST['account'])){
    return ;
}
$user = $_POST['account'];
$checkSQL = "SELECT * FROM `user` WHERE uid = '$user'";
$result = $db->execSQL($checkSQL);
if ($result->num_rows > 0){
    $msg->code = 0;
//    用户已存在
}else{
    $msg->code=1;
    //    用户不存在
}
echo json_encode($msg);
