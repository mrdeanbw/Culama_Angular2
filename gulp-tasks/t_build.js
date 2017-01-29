//  -------------------- BUILD --------------------------
'use strict';

var gulp = require('gulp'),
    plugins = require("gulp-load-plugins")({
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /\bgulp[\-.]/
    }),
    runSequence = require('run-sequence'),
    del = require('del'),
    stream = require('merge-stream');


var build_dir = './_dist/';

// clean release folder
gulp.task('build_clean', function() {
    return del.sync(
        [ build_dir+'**' ],
        { force: true },
        function (err, paths) {}
    );
});


gulp.task('build_copy_files',function() {

    var app_files = gulp.src(['app/**'])
        .pipe(gulp.dest(build_dir+'app/'));

    // copy files
    var root_files = gulp.src([
            'favicon.ico',
            'index.html',
            'package.json'
        ])
        .pipe(gulp.dest(build_dir));

    // copy bower_components
    var bower_files = gulp.src([
            'bower_components/**',
            '!bower_components/{fastclick,fastclick/**}',
            '!bower_components/{hammerjs,hammerjs/**}',
            '!bower_components/{jquery,jquery/**}',
            '!bower_components/{jquery.dotdotdot,jquery.dotdotdot/**}',
            '!bower_components/{jquery.scrollbar,jquery.scrollbar/**}',
            '!bower_components/{jquery-bez,jquery-bez/**}',
            '!bower_components/{modernizr,modernizr/**}',
            '!bower_components/{velocity,velocity/**}',
            '!bower_components/{waypoints,waypoints/**}'
        ])
        .pipe(gulp.dest(build_dir+'bower_components/'));

    // copy assets
    var assets_files = gulp.src([
            'assets/css/**/*.min.css',
            'assets/icons/**/*',
            'assets/img/**/*',
            'assets/js/**/*.min.js',
            'assets/skins/**/*'
        ],{base: './'})
        .pipe(gulp.dest(build_dir));

    // copy data
    var data_files = gulp.src([
            'data/**/*'
        ])
        .pipe(gulp.dest(build_dir+'data/'));

    // copy file manager
    var file_manager_files = gulp.src([
        'file_manager/**/*'
    ])
        .pipe(gulp.dest(build_dir+'file_manager/'));

    return stream(
        app_files,
        root_files,
        bower_files,
        assets_files,
        data_files,
        file_manager_files
    );

});

gulp.task('build',function(callback){
    return runSequence(
        ['default','build_clean'],
        'build_copy_files',
        callback
    );
});