<?php
header("Content-type:application/json;charset=utf-8");
date_default_timezone_set('Asia/Shanghai');
include_once "MyDB.php";
require_once "Message.php";
session_start();
$msg = new Message();
$db = new MyDB();
$arr = [];

if(empty($_SESSION['user'])||!isset($_POST['sid'])){
    $msg -> code = 0;
    echo json_encode($msg);
    return;
}
if($_SESSION['user']!=null){
    $u = $_SESSION['user'];
//    当前用户id
    $uid = $u->uid;
}
$sid = $_POST['sid'];
$content = $_POST['content'];
$time = date("Y-m-d H:i:s");

$commentSQL = "INSERT INTO COMMENT(uid,sid,content,TIME) VALUE('$uid','$sid','$content','$time')";
$getCommentSQL = "SELECT comment.uid,username,img,content,TIME 
                FROM COMMENT LEFT JOIN USER ON comment.uid=user.uid WHERE sid = '$sid' ORDER BY cid DESC";
$results = $db->execSQL2($commentSQL);
if ($results > 0){
    $msg->code = 1;
    $result =  $db->execSQL($getCommentSQL);
    if ($result->num_rows > 0){
        $msg -> code = 1;
        while ($row = $result->fetch_object())
            array_push($arr, $row);
        $msg->data = $arr;
    }
} else{
    $msg->code=0;
}
echo json_encode($msg);