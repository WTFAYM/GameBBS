<?php
include_once "MyDB.php";
require_once "Message.php";

if (isset($_POST['type'])){
    $type = $_POST['type'];
}else{
    $msg -> code = 0;
    echo json_encode($msg);
    return;
}
$page = 1;
$text = "";
if($type==0){
    $page = $_POST['page'];
}
if ($type==2){
    $text = $_POST['search'];
}

$msg = new Message();
$db = new MyDB();
$arr = [];
$page = $page*5;
//查询前五条热门攻略
$serachSQL = "SELECT strategies.sid,user.uid,user.username,user.img,title,`data`,COUNT(cid) COUNT 
              FROM `user`, strategies LEFT JOIN `comment` ON strategies.sid=comment.sid 
              WHERE user.uid=strategies.uid GROUP BY strategies.sid ORDER BY top,COUNT DESC LIMIT $page";
$serachAllSQL = "SELECT strategies.sid,user.uid,user.username,user.img,title,`data`,COUNT(cid) COUNT 
              FROM `user`, strategies LEFT JOIN `comment` ON strategies.sid=comment.sid 
              WHERE user.uid=strategies.uid GROUP BY strategies.sid ORDER BY top,COUNT DESC";

$getSearchSQL = "SELECT strategies.sid,user.uid,user.username,user.img,title,`data`,COUNT(cid) COUNT 
              FROM `user`, strategies LEFT JOIN `comment` ON strategies.sid=comment.sid 
              WHERE user.uid=strategies.uid AND title LIKE \"%".$text."%\" GROUP BY strategies.sid ORDER BY top,COUNT DESC";

if($type==0){
    $result = $db->execSQL($serachSQL);
}elseif ($type==1){
    $result = $db->execSQL($serachAllSQL);
}elseif ($type==2){
    $result = $db->execSQL($getSearchSQL);
}
if ($result->num_rows > 0) {
    $msg->code = 1;
    while ($row = $result->fetch_object())
        array_push($arr, $row);
    $msg->data = $arr;
} else {
    $msg->code = 0;
}
echo json_encode($msg);