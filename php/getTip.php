<?php
include_once "MyDB.php";
require_once "Message.php";
$msg = new Message();
$db = new MyDB();
$arr = [];

if (isset($_POST['text'])){
    $text = $_POST['text'];
}else{
    $msg -> code = 0;
    echo json_encode($msg);
    return;
}
$getTipSQL = "SELECT user.username,strategies.title ,strategies.sid
            FROM strategies LEFT JOIN USER ON strategies.uid = user.uid 
            WHERE title LIKE \"%".$text."%\" GROUP BY strategies.uid ORDER BY top LIMIT 5";

$result = $db->execSQL($getTipSQL);
if ($result->num_rows > 0){
    $msg -> code = 1;
    while ($row = $result->fetch_object())
        array_push($arr, $row);
    $msg->data = $arr;
}else{
    $msg->code=0;
}
echo json_encode($msg);
