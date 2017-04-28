/*
 * @Author: qiuziz
 * @Date: 2017-04-25 11:42:50
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-04-28 21:27:05
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

// 获取用户歌单
app.use('/user/playlist', require('./router/userPlaylist'));


// 获取歌单内列表
app.use('/playlist/detail', require('./router/playlistDetail'));

// 获取音乐详情
app.use('/music/songDetail', require('./router/songDetail'));

// 获取音乐 url
app.use('/music/url', require('./router/musicUrl'))


const port = process.env.PORT || 8888;


app.use(express.static('app'));

http.createServer(app).listen(port);