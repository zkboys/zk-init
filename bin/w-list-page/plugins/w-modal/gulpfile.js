(function () {
    'use strict';
    var gulp = require('gulp'),
        rename = require('gulp-rename'),
        uglify = require('gulp-uglify'),
        del = require('del'),
        connect = require('gulp-connect'),
        open = require('gulp-open'),
        paths = {
            root: './',//当前路径
            source: {
                root: './',
                styles: './less/',
                scripts: './js/',
                fonts: './fonts/',
                img: './img/'
            },
            dist: {
                root: './dist',
                styles: './dist/css/',
                scripts: './dist/js/',
                fonts: './dist/fonts/',
                img: './dist/img/'
            }
        };
    gulp.task('scripts', function (cb) {
        gulp.src(paths.source.scripts + '*.js')
            .pipe(gulp.dest(paths.dist.scripts))
            .pipe(uglify())
            .pipe(rename(function (path) {
                path.basename = path.basename + '.min';
            }))
            .pipe(gulp.dest(paths.dist.scripts))
            .on('end', function () {//完成后的回调，继续执行其他任务？
                cb();
            });
    });

    gulp.task('img', function (cb) {
        gulp.src(paths.source.img + '*.*')
            .pipe(gulp.dest(paths.dist.img))
            .on('end', function () {//完成后的回调，继续执行其他任务？
                cb();
            });
    });


    gulp.task('watch', function () {
        gulp.watch(paths.source.scripts + '*.js', ['scripts']).on('change', function (event) {
            watcherLog(event);
        });
    });
    function watcherLog(event) {
        var filePath = event.path;
        var fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
        console.log('File ' + fileName + ' was ' + event.type + ', running tasks...');
    }

    gulp.task('clean', function (cb) {
        del([
            paths.dist.root + '/**/*'
        ], {force: true}, cb);
    });
    gulp.task('connect', function () {
        return connect.server({
            root: [__dirname],
            livereload: true,
            port: '3000'
        });
    });

    gulp.task('open', function () {
        return gulp.src('./demo.html').pipe(open({uri: 'http://localhost:3000/demo.html'}));
    });

    gulp.task('server', ['watch', 'connect', 'open']);

    gulp.task('default', ['scripts', 'img']);
})();