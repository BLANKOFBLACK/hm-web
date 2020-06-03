 
 //服务器host
// var httpurl = 'http://175.24.103.144/:8081/';
 var httpurl = 'http://127.0.0.1:8081/';
// var nginxurl = 'http://localhost:8888/web/';
   
      var nginxurl = 'http://localhost:8089/web/';

 //显示异常
 function showException(modular,exception){
	 swal("["+modular+"]程序异常!", "抱歉！您访问的页面出现异常，请稍后重试或联系管理员 "+exception, "warning");
 }