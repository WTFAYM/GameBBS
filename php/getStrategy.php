<?php
include_once "MyDB.php";
require_once "Message.php";
$msg = new Message();
$db = new MyDB();
$arr = [];

if (isset($_POST['sid'])) {
    $sid = $_POST['sid'];
} else {
    $msg->code = 0;
    echo json_encode($msg);
    return;
}

$getStrSQL = "SELECT user.uid,user.username,user.img,strategies.title,strategies.data,strategies.text 
             FROM strategies LEFT JOIN `user` ON strategies.uid = user.uid WHERE sid = '$sid'";
$getCommentSQL = "SELECT comment.uid,username,img,content,TIME 
                FROM `comment` LEFT JOIN `user` ON comment.uid=user.uid WHERE sid = '$sid' ORDER BY cid DESC LIMIT 10";
$res = $db->execSQL($getStrSQL);
if ($res->num_rows > 0){
    $msg->code=1;
    $row = $res->fetch_object();
    $msg->data = $row;
}else{
    $msg->code=0;
}
$result =  $db->execSQL($getCommentSQL);
if ($result->num_rows > 0){
    $msg -> code = 1;
    while ($row = $result->fetch_object())
        array_push($arr, $row);
    $msg->data2 = $arr;
}

echo json_encode($msg);