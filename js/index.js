/*
 * @Author: qiuziz
 * @Date: 2017-04-07 16:00:13
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-04-13 17:20:37
 */

function OnlyFM() {
	this.audio = document.getElementsByTagName('audio')[0];
	this._init();
}

OnlyFM.prototype = {
	_init: function() {
		this._getSong();
	},

	_getSong: function() {
		var that = this;
		HttpRequest({
			url: "http://api.jirengu.com/fm/getSong.php",
			method: "get",
			success: function(res) {
					 that.song = res.song[0];
					 that._bind();
					 that._loadSong();
					 that._getLrc();
					 that._download();
				}
		})
	},

	_bind: function() {
		var that = this,
		// 设置歌曲图片
		musicImg = document.getElementsByClassName('content')[0];
		this.img = document.createElement('img');
		this.img.src = this.song.picture;
		musicImg.childNodes[3] ? musicImg.replaceChild(this.img, musicImg.childNodes[3]) : musicImg.appendChild(this.img);

		// 设置歌曲名/歌手
		var musicTitle = document.getElementsByClassName('title')[0],

		musicArtist = document.getElementsByClassName('artist')[0];
		musicTitle.innerHTML = this.song.title;
		musicArtist.innerHTML = this.song.artist;

		// 进度条
		bar('bar progress-bar', 'control-bar');
		var progressBar = document.getElementsByClassName('progress-bar')[0],
		playingWidth = document.getElementsByClassName('progress-bar')[0].childNodes[0],
		timeText = document.getElementsByClassName('time')[0];
		progressBar.style = 'width: 100%';
		playingWidth.style = 'width: 0';
		progressBar.onclick = function(event) {
			that._songProgress(event);
		}

		setInterval(function() {
			that._progress() >= 100 && that._getSong();
			playingWidth.style = 'width: ' + that._progress() + '%';
			timeText.innerHTML = that._songTime();
		},500)

		// 声音控制条
		bar('bar sound-bar', 'control-sound-bar');
		var soundBar = document.getElementsByClassName('sound-bar')[0],
		soundWidth = document.getElementsByClassName('sound-bar')[0].childNodes[0];
		soundBar.style = 'width: 100%';
		soundWidth.style = 'width: 50%';
		this.soundVolume = 0.5;
		this.soundWidthStyle = 'width: 50%';
		soundBar.onclick = function(event) {
			soundWidth.style = 'width: ' + that._sound(event) + '%';
			that.soundWidthStyle = 'width: ' + that._sound(event) + '%';
			that.audio.volume = that._sound(event) / 100;
			that.soundVolume = that._sound(event) / 100;
			
		}

		var next = document.getElementsByClassName('next')[0];
		next.onclick = function() {
			that._getSong();
		}

		var soundIcon = document.getElementsByClassName('sound-icon')[0];
		soundIcon.onclick = function() {
			if (that.audio.volume > 0) {
				that.audio.volume = 0;
				soundWidth.style = 'width: 0';
				soundIcon.src = './images/unsound.png';
			} else {
				that.audio.volume = that.soundVolume;
				soundWidth.style = that.soundWidthStyle;
				soundIcon.src = './images/sound.png';
			}
		
		}

	
	},

	_loadSong: function() {
		this.audio.src = this.song.url;
		// 播放/暂停
		var that = this;
		var playPause = document.getElementsByClassName('play')[0];
		playPause.onclick = function() {
			that._playPause();
		}
		that._playPause();
	},

	_getLrc: function() {
		HttpRequest({
			url: 'http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.song.lry&songid=' + this.song.sid,
			method: "get",
			header: ['Content-Type', 'application/json'],
			success: function(res) {
					 console.log(res)
				}
		})
	},

	_playPause: function() {
		var playPause = document.getElementsByClassName('play')[0],
		needle = document.getElementsByClassName('needle')[0];
		if (this.audio.paused) {
			this.audio.play();
			playPause.src = './images/pause.png';
			needle.className = "needle";
			this.img.style.animationPlayState = 'running';
		} else {
			this.audio.pause();
			playPause.src = './images/play.png';
			needle.className += " needle-rotate";
			this.img.style.animationPlayState = 'paused';
		}
	},

	// 歌曲播放时长
	_progress: function() {
		return this.audio.currentTime / this.audio.duration * 100;
	},

	// 歌曲时间显示
	_songTime: function() {
		return `<span>` + timeFormat(this.audio.currentTime) + `/` + timeFormat(this.audio.duration) + `</span>`
	},

	// 调整声音
	_sound: function(event) {
		var x = event.clientX - event.currentTarget.getBoundingClientRect().left;
		return x / event.currentTarget.clientWidth * 100;
	},

	// 调整歌曲进度
	_songProgress: function(event) {
		var x = event.clientX - event.currentTarget.getBoundingClientRect().left;
		this.audio.currentTime = this.audio.duration * x / event.currentTarget.clientWidth;
	},

	// 下载歌曲
	_download: function() {
		var aDown = document.getElementsByClassName('download')[0];
		aDown.href = this.song.url;
		aDown.download = this.song.title;
	}
};

function bar(className, parents) {
	var progress = `<div class="` + className + `"><span class="btn-bar `+ parents + `-span"></span></div>`
	document.getElementsByClassName(parents)[0].innerHTML = progress;
}


function HttpRequest(options) {
	var args = {
		url: '',
		method: 'GET',
		header: [],
		success: function() {},
		async: true
	},
	
	http = new XMLHttpRequest();

	for (var i in args) {
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

function timeFormat(time) {
	if (isNaN(Number(time))) {
		console.log('参数只能为number');
		return;
	};
	var m = parseInt(time / 60) < 10 ? `0` + parseInt(time / 60) : parseInt(time / 60),
	h = parseInt(m / 60) < 10 ? `0` + parseInt(m / 60) < 10 : parseInt(m / 60) < 10;
	s = Math.floor(time % 60) < 10 ? `0` + Math.floor(time % 60) : Math.floor(time % 60);
	return (m > 0 ? m : `00`) + `:` + s
	
} 

new OnlyFM();