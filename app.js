/*
 * @Author: qiuziz
 * @Date: 2017-04-25 11:42:50
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-04-26 18:30:12
 */

var http = require('http');
var express = require('express');

var app = express();

//邮箱登录
app.use('/login', require('./router/login'));

//每日推荐
app.use('/recommend/songs', require('./router/recommendSongs'));

// 获取歌词
app.use('/lyric', require('./router/lyric'));


const port = process.env.PORT || 8888;


app.use(express.static('app'));

http.createServer(app).listen(port);