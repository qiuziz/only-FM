/*
 * @Author: qiuziz
 * @Date: 2017-04-26 14:58:01
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-05-02 11:45:10
 */

const encrypt = require('./crypto.js');
const http = require('http');

function createWebAPIRequest(path, method, data, cookie, success, error) {
	let music_req = '';
	const crypto_req = encrypt(data);
	const options = {
		hostname: 'music.163.com',
		path: path,
		method: method,
		headers: {
			'Accept': '*/*',
			'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
			'Connection': 'keep-alive',
			'Content-Type': 'application/x-www-form-urlencoded',
			'Referer': 'http://music.163.com',
			'Host': 'music.163.com',
			'Cookie': cookie,
			'X-Real-IP':'211.161.244.70',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36'
		}
	};
	const http_client = http.request(options, function (res) {
			res.on('error', function(err){
				error(err);
			});
			res.setEncoding('utf-8');
			if (res.statusCode != 200) {
				createWebAPIRequest(path, method, data, cookie, success);
				return;
			} else {
				res.on('data', function(chunk) {
					music_req += chunk;
				});
				res.on('end', function() {
					if (music_req === '') {
						createWebAPIRequest(path, method, data, cookie, success);
						return;
					}
					if (res.headers['set-cookie']) {
						success(music_req, res.headers['set-cookie']);
					} else {
						success(music_req);
					}
				});
			}
		});
	http_client.write('params=' + crypto_req.params + '&encSecKey=' + crypto_req.encSecKey);
	http_client.end();
		
}

module.exports = createWebAPIRequest;