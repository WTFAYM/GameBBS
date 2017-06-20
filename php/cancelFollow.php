<?php
include_once "MyDB.php";
require_once "Message.php";
session_start();
$msg = new Message();
$db = new MyDB();
$arr = [];
if(empty($_SESSION['user'])||!isset($_POST['uid'])){
    $msg -> code = 0;
    echo json_encode($msg);
    return;
}
if($_SESSION['user']!=null){
    $u = $_SESSION['user'];
//    当前用户id
    $uid = $u->uid;
}
//要取消关注的用户id
$fuid = $_POST['uid'];

//删除follow表中相关数据
$canSQL = "DELETE FROM follow WHERE use_uid = '$uid' AND uid = '$fuid'";
//获取更新后数据
$getFollowSQL = "SELECT uid,username,img FROM USER WHERE uid IN (SELECT uid FROM follow WHERE use_uid='$uid')";

$results = $db->execSQL2($canSQL);
if($results>0){
    $msg->code=1;
    $result = $db->execSQL($getFollowSQL);
    if ($result->num_rows > 0){
        while ($row = $result->fetch_object())
            array_push($arr, $row);
        $msg->data = $arr;
    }
}else{
    $msg->code=0;
}
echo json_encode($msg);



