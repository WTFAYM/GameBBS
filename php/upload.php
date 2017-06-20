<?php
require_once 'autoload.php';
include_once "MyDB.php";
require_once "Message.php";
session_start();
$u = $_SESSION['user'];
$uid = $u->uid;
$msg = new Message();
$db = new MyDB();

if(!isset($_POST['image'])){
    echo json_encode([
        'code' => '101',
        'summary' => 'success',
        'data' => [
            'url' => 'http://localhost/GameBBS/public/images/2.jpg'
        ]
    ]);
    return;
}

$path = $_POST['image'];
$temp = rand(0,9999);



// 引入鉴权类
use Qiniu\Auth;
// 引入上传类
use Qiniu\Storage\UploadManager;
// 需要填写你的 Access Key 和 Secret Key
$accessKey = '6cBQMCrW95HkB86APiacAIYVl4--N9dkwE4BECSv';
$secretKey = 'maFpd4UjCUrVk-vbhcqmPqgtFo85sNddv0OosHR9';
// 构建鉴权对象
$auth = new Auth($accessKey, $secretKey);
// 要上传的空间
$bucket = 'gameimg';
// 生成上传 Token
$token = $auth->uploadToken($bucket);
// 要上传文件的本地路径
$filePath = $path;
// 上传到七牛后保存的文件名
$key = $uid.$temp.'.png';
// 初始化 UploadManager 对象并进行文件的上传
$uploadMgr = new UploadManager();
// 调用 UploadManager 的 putFile 方法进行文件的上传
list($ret, $err) = $uploadMgr->putFile($token, $key, $filePath);
$repath ="http://ord7ngzu4.bkt.clouddn.com/";
//http://ord7ngzu4.bkt.clouddn.com/5111.png
if ($err !== null) {
    echo json_encode([
        'code' => '102'
    ]);
} else {
    echo json_encode([
        'code' => '100',
        'summary' => 'success',
        'data' => [
            'url' =>$repath.$ret['key']
        ]
    ]);
}


