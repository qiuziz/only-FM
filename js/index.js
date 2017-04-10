/*
 * @Author: qiuziz
 * @Date: 2017-04-07 16:00:13
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-04-09 00:15:47
 */

function OnlyFM() {
	const audio = document.getElementsByTagName('audio')[0];
	this._init(audio);
}

OnlyFM.prototype = {
	_init: function(audio) {
		this._getSong(audio);
	},

	_getSong: function(audio) {
		const that = this;
		HttpRequest({
			url: "http://api.jirengu.com/fm/getSong.php",
			method: "get",
			success: function(res) {
					 that.song = res.song[0];
					 that._bind(audio);
					 that._loadSong(audio);
					 that._getLrc(audio);
				}
		})
	},

	_bind: function(audio) {
		// 设置歌曲图片
		const musicImg = document.getElementsByClassName('content')[0].childNodes[1];
		musicImg.src = this.song.picture;

		// 设置歌曲名/歌手
		const musicTitle = document.getElementsByClassName('title')[0],

		musicArtist = document.getElementsByClassName('artist')[0];
		musicTitle.innerHTML = this.song.title;
		musicArtist.innerHTML = this.song.artist;

		// 进度条
		bar('bar progress-bar', 'control-bar');
		const progressBar = document.getElementsByClassName('progress-bar')[0],
		playingWidth = document.getElementsByClassName('progress-bar')[0].childNodes[0];
		progressBar.style = 'width: 100%';
		playingWidth.style = 'width: 0';

		// 声音控制条
		bar('bar sound-bar', 'control-sound-bar');
		const soundBar = document.getElementsByClassName('sound-bar')[0],
		soundWidth = document.getElementsByClassName('sound-bar')[0].childNodes[0];
		soundBar.style = 'width: 100%';
		soundWidth.style = 'width: 50%';

	
	},

	_loadSong: function(audio) {
		audio.src = this.song.url;
		// 播放/暂停
		const that = this;
		const playPause = document.getElementsByClassName('play')[0];
		playPause.onclick = function() {
			that._playPause(audio);
		}
	},

	_getLrc: function(audion) {
		HttpRequest({
			url: 'http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.song.lry&songid=' + this.song.sid,
			method: "get",
			header: ['Content-Type', 'application/json'],
			success: function(res) {
					 console.log(res)
				}
		})
	},

	_playPause: function(audio) {
		const playPause = document.getElementsByClassName('play')[0];
		if (audio.paused) {
			audio.play();
			playPause.src = './images/pause.png';
		} else {
			audio.pause();
			playPause.src = './images/play.png';
		}
	}
};

function bar(className, parents) {
	const progress = `<div class="` + className + `"><span class="btn-bar"></span></div>`
	document.getElementsByClassName(parents)[0].innerHTML = progress;
}


function HttpRequest(options) {
	const args = {
		url: '',
		method: 'GET',
		header: [],
		success: function() {},
		async: true
	},
	
	http = new XMLHttpRequest();

	for (let i in args) {
		options[i] &&	(args[i] = options[i]);
	}

	if(!http) return;
	http.onreadystatechange = function() {
		if (http.readyState==4 && http.status==200) {
			args.success(JSON.parse(http.responseText));
		}
	}
	http.open(args.method, args.url, args.async);
	args.header.length > 0 && http.setRequestHeader(args.header[0], args.header[1]);
	http.send();
}

new OnlyFM();