var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var useref = require('gulp-useref');
var connect = require('gulp-connect');
var proxyMiddleware = require('http-proxy-middleware');

// cnpm  i  gulp gulp-concat gulp-uglify gulp-autoprefixer gulp-useref gulp-connect http-proxy-middleware --save-dev

// 跨域代理  将localhost:8088/api 映射到 https://api.shujumohe.com/  代理src目录
gulp.task('server', ['listen'], function() {
    var middleware = proxyMiddleware(['/medapp'], {
        target: 'http://www.medcircle.top/medapp',
        changeOrigin: true,
        pathRewrite: {
            '^/medapp': '/'
        }
    });
    connect.server({
        root: './src' ,
        port: 8088,
        livereload: true,
        middleware: function(connect, opt) {
            return [middleware]
        }
    });
});

// 代理dist目录
gulp.task('server:dist', ['listen'], function() {
    var middleware = proxyMiddleware(['/api'], {
        target: 'https://api.shujumohe.com/',
        changeOrigin: true,
        pathRewrite: {
            '^/api': '/'
        }
    });
    connect.server({
        root: './dist',
        port: 8088,
        livereload: true,
        middleware: function(connect, opt) {
            return [middleware]
        }

    });
});

gulp.task('html', function() {
    gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});


gulp.task('css', function() {
    gulp.src('src/css/main.css')
        .pipe(concat('main.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css/'));

    gulp.src('src/css/share.css')
        .pipe(concat('share.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css/'));

    gulp.src('src/vendors/css/*.css')
        .pipe(concat('vendors.min.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/vendors/css'));



    return gulp
});

gulp.task('js', function() {
    return gulp.src('src/vendors/js/*.js')
        .pipe(concat('vendors.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/vendors/js'));
});

gulp.task('img', function() {
    gulp.src('src/imgs/*')
        .pipe(gulp.dest('dist/imgs'));
});

gulp.task('listen', function() {
    gulp.watch('./src/css/*.css', function() {
        gulp.src(['./src/css/*.css'])
            .pipe(connect.reload());
    });
    gulp.watch('./src/js/*.js', function() {
        gulp.src(['./src/js/*.js'])
            .pipe(connect.reload());
    });
    gulp.watch('./src/*.html', function() {
        gulp.src(['./src/*.html'])
            .pipe(connect.reload());
    });
});

gulp.task('default', ['html', 'css', 'js', 'img']);