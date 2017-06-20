<?php
class MyDB
{
    private $db = null;//数据库连接
    private function getConn()
    {
        if ($this ->db === null) {
            $this->db = new mysqli('127.0.0.1', 'root','root') or die('不能打开连接:');
            $this->db->query('SET NAMES "utf8"');
            $this->db->select_db('game')
            or die("数据库不能打开");
        }
    }
    public function execSQL($sql)
    { //获取查询记录集
        $this->getConn();
        return $this->db->query($sql);
    }
    public function execSQL2($sql){
        //用于插入数据
        $this->getConn();
        $this->db->query($sql);
        return $this->db->affected_rows;
    }
    public function close()
    { //析构函数
        if ($this->db !== null) $this->db->close();
    }
}
