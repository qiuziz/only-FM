/*
 * @Author: qiuziz
 * @Date: 2017-04-07 16:00:13
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-05-05 18:23:10
 */

function OnlyFM() {
	this.audio = document.getElementsByTagName('audio')[0];
	this._init();
}

OnlyFM.prototype = {
	_init: function() {
		this._getAllSongs();
	},

	_loginNetease: function() {
		var that = this;
		HttpRequest({
			url: "/login",
			method: "get",
			success: function(res) {
				localSet('__music_uid', res.account.id);
				that._getAllSongs();
			}
		})
	},

	_userPlaylist: function(uid) {
		var that = this;
		HttpRequest({
			url: "/user/playlist?uid=" + uid,
			method: "get",
			success: function(res) {
				that.myLikePlaylistId = res.playlist[0].id;
				that._playlistDetail(res.playlist[0].id);
			}
		})
	},

	_playlistDetail: function(id) {
		var that = this;
		HttpRequest({
			url: "/playlist/detail?id=" + id,
			method: "get",
			success: function(res) {
				var ids = [], len = res.privileges.length;
				res.privileges.forEach(function(item) {
					ids.push(item.id);
				});
				that.songTotal = ids.length;
				that._songDetail(ids);
			}
		})
	},

	_songDetail: function(ids) {
		var that = this;
		this.ids = ids || this.ids;
		this.index = random(0, this.songTotal);
		HttpRequest({
			url: "/music/songDetail?ids=" + this.ids[this.index],
			method: "get",
			success: function(res) {
				that._getSong(res.songs[0]);
			}
		})
	},

	_getAllSongs: function(ids) {
		var that = this;
		HttpRequest({
			url: "/recommend/songs",
			method: "get",
			success: function(res) {
				if (res.code !== 200) {
					that._loginNetease();
				} else if (res.recommend && res.recommend.length < 0){
					that.songTotal = res.recommend.length || 0;
					that.recommendSongs = res.recommend;
					that.index = random(0, that.songTotal);
					that._getSong(res.recommend[that.index]);
				} else {
					that._userPlaylist(localFetch('__music_uid'));
				}
			}
		})
	},

	_getSong: function(song) {
		var that = this;
		HttpRequest({
			url: "/music/url?id=" + song.id,
			method: "get",
			success: function(res) {
				that.song = {
					id: song.id,
					url: res.data[0].url,
					picUrl: song.album.picUrl,
					title: song.name,
					artist: song.artists[0].name
				};
				that._bind();
				that._loadSong();
				that._download();
				that.nextFlag = false;
			}
		})
	},

	_bind: function() {
		var that = this;
		// 设置歌曲图片
		this.musicImg = document.getElementsByClassName('pic-img')[0];
		this.musicImg.src = this.song.picUrl;
		

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
		playingWidth.style = 'width: 0';
		progressBar.style = 'width: 100%';
		progressBar.onclick = function(event) {
			that._songProgress(event);
		}

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
			that.lrc = '';
			!that.nextFlag &&
			(that.recommendSongs
			? that._getSong(that.recommendSongs[random(0, that.songTotal)])
			: that._songDetail());
			that.nextFlag = true;
		}

		var lrcShowHide = document.getElementsByClassName('lrc')[0];
		lrcShowHide.onclick = function() {
			that._getLrc();
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

		var like = document.getElementsByClassName('like')[0];
		like.onclick = function() {
			if (like.className.indexOf('active') > -1) {
				localRemove(that.song.title);
				like.className = 'like';
			} else {
				localSet(that.song.title, JSON.stringify(that.song));
			 	like.className = 'like active';
			}
			
		}
	
		var loop = document.getElementsByClassName('loop')[0];
		loop.onclick = function() {
			that.audio.loop = !that.audio.loop;
			loop.src = that.audio.loop ? './images/single-cycle.png' : './images/random.png';
		}

		this.audio.onended = function() {
			that._endedOrError();
		}
		this.audio.onerror = function() {
			that._endedOrError();
		}

		this.audio.addEventListener("timeupdate", function () {
			
				
			playingWidth.style = 'width: ' + that._progress() + '%';
			timeText.innerHTML = that._songTime();

			var lrcUl = document.getElementsByClassName('lrc-ul')[0],
			liList = (lrcUl && document.getElementsByClassName('lrc-ul')[0].getElementsByTagName('li')) || [],
			lrcText = document.getElementsByClassName('lrcText')[0];
			if (lrcText && lrcText.style.display === 'block') {
				for(var i = 0; i < liList.length; i++){
					var curTime = liList[i].getAttribute('data-time'),
					nextTime = i < liList.length - 1 && liList[i + 1].getAttribute('data-time');
					if (Math.ceil(that.audio.currentTime) == curTime && Math.ceil(that.audio.currentTime) < nextTime) {
						var top = parseInt(lrcUl.style.marginTop || 0) - 15;
						lrcUl.style.marginTop = top + 'px';
						liList[i].className = 'now-lrc';
						liList[i - 1].className = '';
					} else {
					}
				}
			}
		})

	
	},

	_loadSong: function() {
		this.audio.src = this.song.url;
		// 播放/暂停
		var that = this;
		var playPause = document.getElementsByClassName('play')[0];
		playPause.onclick = function() {
			that._playPause();
		}
		// that._playPause();
		if(localFetch(this.song.title)){
			var like = document.getElementsByClassName('like')[0];
					like.className = 'like active';
			}
	},

	_endedOrError: function() {
		if (this.recommendSongs) {
			this._getSong(this.recommendSongs[random(0, this.songTotal)]);
		} else {
			this._songDetail()
		}
	},

	_getLrc: function() {
		var that = this;
		!that.lrc ?
		HttpRequest({
			url: '/lyric?id=' + this.song.id,
			method: "get",
			header: ['Accept', 'application/json, text/javascript'],
			success: function(res) {
					that.lrc = res.nolyric ? '[00:00.01]暂无歌词\n' : res.lrc.lyric;
					that._showHideLrc();
				}
		})
		: this._showHideLrc();
	},

	_parseLrc: function(lrc) {
		if (!lrc) return;
		var lrcArray = lrc.split('\n'),
		reg = /^\[\d{2}\:\d{2}\.\d{2,3}\]/,
		lrcRender = [];

		lrcArray.forEach(function(item) {
			 if (!reg.test(item)) {              //剔除收到数据中没有时间的部分
				lrcArray.splice(item, 1);
				return;
      }
			var time = item.match(reg),      //把歌词分为：时间和歌词两个部分
			lyric = item.split(time),
			seconds = time && (time[0][1] * 600 + time[0][2] * 60 + time[0][4] * 10 + time[0][5] * 1);  //将时间换算为秒
			lrcRender.push([seconds, lyric[1]]);      //将整个歌词保存至二维数组中，形式为[时间，歌词]；
		});
		return lrcRender;
		
	},

	_renderLrc: function(lrc) {
		if (!lrc) return;
		var that = this,
		li = '';
		lrc.forEach(function(item, index) {
			if (!(index === 0 || (item[0] > lrc[index - 1][0]))) {
				lrc.splice(index,1);
			}
		})
		lrc.forEach(function(item, index) {
			if (item[1]) {
				li += '<li data-time="' +item[0] + '">' + item[1] + '</li>';
			}
		});
		this.lrcUl.innerHTML = li;
	},

	_showHideLrc: function() {
		
		var lrcText = document.getElementsByClassName('lrcText')[0],
		needle = document.getElementsByClassName('needle')[0];
		this.lrcUl = document.getElementsByClassName('lrc-ul')[0];

		
		if (lrcText.style.display === 'block') {
			lrcText.style.display = 'none';
			this.musicImg.style.display = 'block';
			this._renderLrc(this._parseLrc(this.lrc));
			needle.style.display = 'block';
		} else {
			lrcText.style.display = 'block';
			this.musicImg.style.display = 'none';
			needle.style.display = 'none';
			this._renderLrc(this._parseLrc(this.lrc));
		}
	},

	_playPause: function() {
		var playPause = document.getElementsByClassName('play')[0],
		needle = document.getElementsByClassName('needle')[0];
		needle.style.display = 'block';
		if (this.audio.paused) {
			this.audio.play();
			playPause.src = './images/pause.png';
			needle.className = "needle";
			this.musicImg.style.animationPlayState = 'running';
		} else {
			this.audio.pause();
			playPause.src = './images/play.png';
			needle.className += " needle-rotate";
			this.musicImg.style.animationPlayState = 'paused';
		}
	},

	// 歌曲播放时长
	_progress: function() {
		return this.audio.currentTime / this.audio.duration * 100 || 0;
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
		// console.log('参数只能为number');
		return '00:00';
	};
	var m = parseInt(time / 60) < 10 ? `0` + parseInt(time / 60) : parseInt(time / 60),
	h = parseInt(m / 60) < 10 ? `0` + parseInt(m / 60) : parseInt(m / 60);
	s = Math.floor(time % 60) < 10 ? `0` + Math.floor(time % 60) : Math.floor(time % 60);
	return (h > 0 ? (h + ':') : '') + m + `:` + s
	
}

function localFetch(key) {
	return window.localStorage.getItem(key);
}

function  localSet(key, value) {
	window.localStorage.setItem(key, value);
}

function localRemove(key) {
	window.localStorage.removeItem(key);
}

// 产生m 到 n 之间的随机数 and 不与之前的相等
function random(m, n, r) {
	var i = n - m;
	var f = Math.floor(Math.random() * i + m);
	return r ? (r === f ? random(m, n, r) : f) : f;
}

new OnlyFM();