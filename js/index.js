/*
 * @Author: qiuziz
 * @Date: 2017-04-07 16:00:13
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-04-10 23:32:12
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
		const that = this;
		HttpRequest({
			url: "http://api.jirengu.com/fm/getSong.php",
			method: "get",
			success: function(res) {
					 that.song = res.song[0];
					 that._bind();
					 that._loadSong();
					 that._getLrc();
				}
		})
	},

	_bind: function() {
		const that = this;
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
		const soundBar = document.getElementsByClassName('sound-bar')[0],
		soundWidth = document.getElementsByClassName('sound-bar')[0].childNodes[0];
		soundBar.style = 'width: 100%';
		soundWidth.style = 'width: 50%';
		soundBar.onclick = function(event) {
			soundWidth.style = 'width: ' + that._sound(event) + '%';
			that.audio.volume = that._sound(event) / 100;
		}

	
	},

	_loadSong: function() {
		this.audio.src = this.song.url;
		// 播放/暂停
		const that = this;
		const playPause = document.getElementsByClassName('play')[0];
		playPause.onclick = function() {
			that._playPause();
		}
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
		const playPause = document.getElementsByClassName('play')[0];
		if (this.audio.paused) {
			this.audio.play();
			playPause.src = './images/pause.png';
		} else {
			this.audio.pause();
			playPause.src = './images/play.png';
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
		let x = event.clientX - event.currentTarget.getBoundingClientRect().left;
		return x / event.currentTarget.clientWidth * 100;
	},

	// 调整歌曲进度
	_songProgress: function(event) {
		let x = event.clientX - event.currentTarget.getBoundingClientRect().left;
		this.audio.currentTime = this.audio.duration * x / event.currentTarget.clientWidth;
	}
};

function bar(className, parents) {
	const progress = `<div class="` + className + `"><span class="btn-bar `+ parents + `-span"></span></div>`
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

function timeFormat(time) {
	const m = parseInt(time / 60);
	const s = Math.floor(time % 60);
	return (m > 0 ? (m >= 10 ? m : `0` + m) : `00`) + `:` + (s >= 10 ? s : `0` + s)
	
} 

new OnlyFM();