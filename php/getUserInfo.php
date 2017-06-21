<?php
include_once "MyDB.php";
require_once "Message.php";
session_start();
$msg = new Message();
$db = new MyDB();
$arr = [];

if (isset($_POST['uid'])){
    $uid = $_POST['uid'];
}else{
    $msg -> code = 0;
    echo json_encode($msg);
    return;
}
if(empty($_SESSION['user'])){
    $msg -> data2 = 0;
}elseif($_SESSION['user']!=null){
    $u = $_SESSION['user'];
    $cuid = $u->uid;
    $checkFollowSQL = "SELECT * FROM follow WHERE use_uid = '$cuid' AND uid ='$uid'";
    $res = $db->execSQL($checkFollowSQL);
    if ($res->num_rows > 0){
        $row = $res->fetch_object();
        $msg->data2 = 1;
    }else{
        $msg -> data2 = 0;
    }
}

//获取用户信息。
$getUserSQL = "SELECT uid,username,gender,img FROM `user` WHERE uid='$uid'";

$result = $db->execSQL($getUserSQL);
if ($result->num_rows > 0){
    $row = $result->fetch_object();
    $msg->code = 1;
    $msg->data = $row;
}else{
    $msg -> code = 0;
}
//获取攻略列表
$getStrategySQl = "SELECT strategies.sid,title,DATA,COUNT(cid) COUNT 
              FROM `user`, strategies LEFT JOIN `comment` ON strategies.sid=comment.sid 
              WHERE user.uid=strategies.uid AND user.uid = '$uid' GROUP BY strategies.sid ORDER BY top,COUNT DESC";
$results = $db->execSQL($getStrategySQl);
if ($results->num_rows > 0) {
    while ($row = $results->fetch_object())
        array_push($arr, $row);
    $msg->data3 = $arr;
} else {

}
echo json_encode($msg);
