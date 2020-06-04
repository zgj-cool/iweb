// iWeb项目后台API子系统必需的数据库连接池模块
const mysql=require('mysql');

let pool=mysql.createPool({
  host:'w.rdc.sae.sina.com.cn',		//数据库服务器的域名或IP地址
  port:'3306',			//端口号
  user:'ozxn52mloy',			//连接数据库服务器所需管理用户名
  password:'4i0ih1wxzmj2l3y04ijw2wyzl2wzlw5415yzhxh3',	//管理员密码
  database:'app_coolweb',		//项目数据库名
  connectionLimit:10    //连接池最大容量
})

module.exports=pool		//导出连接池模块，供其他模块使用