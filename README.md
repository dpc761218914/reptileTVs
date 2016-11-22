# reptileTVs
爬取电影天堂电视剧，实现批量下载

###一、项目描述    
&emsp;&emsp;**引言：**在**电影天堂**下电视剧的下伙伴有木有发现，它没有提供批量下载功能，美剧英剧还好，10集左右，我就多点几下吧，可是我们国产局呢，少则三十集，多则四五十级。下载那叫一个痛苦，一个个点（应该有其他什么妙招，但是我们发现，知道的话告诉我一下呗）.....不过，想想迅雷不是提供批量下载吗？经过分析，发现迅雷批量下载只需将下载链接分行录入到下载框即可实现批量下载。  
&emsp;&emsp;**功能：**在网页中录入想看电视剧链接，在该页分行打印出下载链接地址，拷贝链接，迅雷粘贴下载.....


###二、项目截图
![前台页面](https://static.oschina.net/uploads/img/201611/22102812_KrMI.png "在这里输入图片标题")
![粘贴到迅雷下载](https://static.oschina.net/uploads/img/201611/22103012_jqmq.png "在这里输入图片标题")

###三、相关github开源工具
感谢开源：  
>    字符编码转换： https://github.com/magicdawn/superagent-charset  
类似于jquery操作dom元素工具： https://github.com/cheeriojs/cheerio  
配合node.js http请求：https://github.com/visionmedia/superagent  
前台：bootstrap+jquery


###四、关键代码
**5.1、分行抓取每集下载链接：**
![查看源码](https://static.oschina.net/uploads/img/201611/22103703_lF1V.png "在这里输入图片标题")    
![输入图片说明](https://static.oschina.net/uploads/img/201611/22104502_nD0a.png "在这里输入图片标题")

根据github上 cheerio API 文档。通过.each我们可以定位到我们想要的信息。这里我们可以看到每集下载链接就在** tbody >td> a**标签的href中，我们必须确保该链接下的href都是视频链接（第一次想直接通过td> a定位，但是抓取了无关的html链接。）

```
 /*express后台上代码*/
//爬电视剧前台页面
app.get('/tv_name',function (req, res, next) {
    res.render("index",{title:"express"});
});
//处理请求
app.post('/getTvs',function (req, res, next) {
    var url=req.body.url;
    superagent.get(url)
      .charset('gb2312') //这里设置编码
      .end(function (err, sres) {
        if (err) {
          return next(err);
        }
        var $ = cheerio.load(sres.text);
        var items = "";
        $('tbody td a').each(function (index, element) {
          var $element = $(element);
            items=items+$element.attr('href')+"<br/>"
        });
          res.send(items);
      });
});
```  
```
//这里我想用html页面，压根就不想用ejs或者jade模板引擎。所以需要在app.js中修改模板引擎配置。  
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
```   
```
 /*HTML前台*/
//网页，boottrap直接用cdn加速，无需下载文件、
<head>
    <meta charset="UTF-8">
    <title>电影天堂电视剧下载</title>
    <script src="//cdn.bootcss.com/jquery/3.1.1/jquery.min.js"></script>
    <link href="//cdn.bootcss.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

<div class="row" style="margin-top: 50px">
    <div class="col-md-3"></div>
    <div class="col-md-6">
        <h3 style="margin-bottom: 30px">电影天堂电视剧批量下载</h3>
        <div class="alert alert-warning" role="alert"><strong>提示!</strong> 链接生成后，复制到迅雷即可...</div>
        <input type="text" class="form-control" id="tv_link" placeholder="请输入电视剧网页链接"></br>
        <button type="button" class="btn btn-primary" onclick="getData()">点击查询</button>
        <!-- 为 地址列表 准备一个具备大小（宽高）的 DOM -->
        <div class="jumbotron" id="main" style="margin-top: 20px">
        </div>
    </div>
    <div class="col-md-3"></div>
</div>
</div>
<script>
    function getData(){
        var url = $("#tv_link").val(); //获取  
        $.post("/getTvs",{url:url},function(result){
            $("#main").html(result);
        });
    }
</script>
</body>
</html>
```     
&emsp;&emsp;前端录入点数据链接，发送post请求，后端解析请求爬取所需数据发送前台，前台通过拼接html将其展示出来。

###六、遇到的问题：
&emsp;&emsp;1、cheerio  注意数据解析定位问题。  
&emsp;&emsp;2、superagent-charset  电影天堂网页编码是gb2312，如果设置编码会出现乱码。（这里刚好看到就前一两天的博客，里面有关于乱码的介绍：http://www.jb51.net/article/97738.htm）

###六、最后相关网址分享：
直接导入到webstrom运行。访问http://localhost:3000/tv_name  即可；  
**项目源码：** 
https://github.com/dpc761218914/reptileTVs
