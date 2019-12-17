let gulp=require('gulp');
let webserver=require('gulp-webserver');


function serve(cb) {
	gulp.src('./dist/web-angular-for-xiuxiu')//以哪个文件夹作为根服务器
	.pipe(webserver({
		livereload:false,//热部署，是否可以自动刷新
//		https:true,//默认是http 需要与请求接口协议一致
		port: 5555,//端口
		// host: '172.31.20.159',//域名
		host: 'localhost',//域名
		proxies:[
			{
				source:'/sys',
				target:'http://'
			}
		]
	}))
	cb();
}

function dist(cb) {
	gulp.src('dockerfile')
	.pipe(gulp.dest('dist'))
	cb();
}

// exports.serve = serve;
// exports.dist = dist;
exports.default = serve;