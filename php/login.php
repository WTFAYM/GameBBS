<?php
header("Content-type:application/json;charset=utf-8");
include_once "MyDB.php";
require_once "Message.php";

if(!isset($_POST['user'])){
    return ;
}
$user = $_POST['user'];
$psw = $_POST['psw'];
//连接数据库；
$db = new MyDB();
$msg = new Message();

//查询用户是否处在
$checkSQL = "SELECT * FROM `user` WHERE uid = '$user 'AND  psd = '$psw'";
$result = $db->execSQL($checkSQL);
if ($result->num_rows > 0){
    session_start();
    $row = $result->fetch_object();
    $row->psd = '';
    $_SESSION['user'] = $row;
    $msg->code = 1;
    $msg->data = $row;
}else{
    $msg -> code = 0;
}
echo json_encode($msg);
