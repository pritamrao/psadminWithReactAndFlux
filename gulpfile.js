"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect');//runs a local dev server
var open = require('gulp-open'); //open a url in a web browser
var browserify = require('browserify'); //Bundle JS
var reactify = require('reactify'); //Transforms JSX to JS
var source = require('vinyl-source-stream'); //use conventional text streams with Gulp

var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths:{
        html: './src/*.html',
        js: './src/**/*.js',
        dist: './dist',
        mainJs: './src/main.js'
    }
}

//Start a local dev server
gulp.task('connect', function(){
    connect.server({
        root:['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
})

gulp.task('open', ['connect'], function(){
    gulp.src('dist/index.html')
        .pipe(open({uri: config.devBaseUrl + ':' + config.port + '/'}))
});

gulp.task('html', function(){
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

gulp.task('js', function(){
    browserify(config.paths.mainJs)
        .transform(reactify) //transforms outputs from reactify
        .bundle() //bundle all JS into single package
        .on('error', console.error.bind(console)) //redirect errors encountered during the bundling to console
        .pipe(source('bundle.js')) //name of the bundle
        .pipe(gulp.dest(config.paths.dist  + '/scripts')) //copy bundled file to specified destination
        .pipe(connect.reload()); //reload the server
});

gulp.task('watch', function(){
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.html, ['js']);
});

gulp.task('default',['html','js','open','watch']);