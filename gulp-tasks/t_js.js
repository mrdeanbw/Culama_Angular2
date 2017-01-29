// -------------------- MINIFY/CONCATENATE JS FILES --------------------
'use strict';

var gulp = require('gulp'),
    plugins = require("gulp-load-plugins")({
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /\bgulp[\-.]/
    }),
    // chalk error
    chalk = require('chalk'),
    chalk_error = chalk.bold.red;


// commmon
gulp.task('js_common', function () {
    return gulp.src([
            "bower_components/jquery/dist/jquery.js",
            "bower_components/modernizr/modernizr.js",
            // moment
            "bower_components/moment/moment.js",
            // fastclick (touch devices)
            "bower_components/fastclick/lib/fastclick.js",
            // custom scrollbar
            "bower_components/jquery.scrollbar/jquery.scrollbar.js",
            // create easing functions from cubic-bezier co-ordinates
            "bower_components/jquery-bez/jquery.bez.min.js",
            // Get the actual width/height of invisible DOM elements with jQuery
            "bower_components/jquery.actual/jquery.actual.js",
            // waypoints
            "bower_components/waypoints/lib/jquery.waypoints.js",
            // velocityjs (animation)
            "bower_components/velocity/velocity.js",
            "bower_components/velocity/velocity.ui.js",
            // advanced cross-browser ellipsis
            "bower_components/jquery.dotdotdot/src/jquery.dotdotdot.js",
            // hammerjs
            "bower_components/hammerjs/hammer.js",
            // scrollbar width
            "assets/js/custom/jquery.scrollbarWidth.js",
            // jquery.debouncedresize
            "bower_components/jquery.debouncedresize/js/jquery.debouncedresize.js",
            // screenfull
            "bower_components/screenfull/dist/screenfull.js",
            // waves
            "bower_components/Waves/dist/waves.js"
        ])
        .pipe(plugins.concat('common.js'))
        .on('error', function(err) {
            console.log(chalk_error(err.message));
            this.emit('end');
        })
        .pipe(gulp.dest('assets/js/'))
        .pipe(plugins.uglify({
            mangle: true
        }))
        .pipe(plugins.rename('common.min.js'))
        .pipe(plugins.size({
            showFiles: true
        }))
        .pipe(gulp.dest('assets/js/'));
});

// angular common js
gulp.task('js_angular_common', function () {
    return gulp.src([
            "bower_components/angular/angular.js",
            "bower_components/angular-sanitize/angular-sanitize.js",
            "bower_components/angular-ui-router/release/angular-ui-router.js",
            "bower_components/oclazyload/dist/ocLazyLoad.js",
            "app/modules/angular-retina.js",
            "bower_components/angular-breadcrumb/dist/angular-breadcrumb.js"
        ])
        .pipe(plugins.concat('angular_common.js'))
        .pipe(gulp.dest('assets/js/'))
        .pipe(plugins.uglify({
            mangle: false
        }))
        .pipe(plugins.rename('angular_common.min.js'))
        .pipe(plugins.size({
            showFiles: true
        }))
        .pipe(gulp.dest('assets/js/'));
});

// angular app minify
gulp.task('js_app_minify', function () {
    return gulp.src([
            "app/**/*.js",
            "!app/**/*.min.js"
        ],{base: './'})
        .pipe(plugins.uglify({
            mangle: false
        }))
        .pipe(plugins.rename({
            extname: ".min.js"
        }))
        .pipe(gulp.dest('./'));
});

// app js
gulp.task('js_app', function () {
    return gulp.src([
            "app/app.js",
            "app/app.factory.js",
            "app/app.service.js",
            "app/app.directive.js",
            "app/app.filters.js",
            "app/app.states.js",
            "app/app.controller.js",
            "app/app.oc_lazy_load.js"
        ])
        .pipe(plugins.concat('altair_app.js'))
        .pipe(gulp.dest('assets/js/'))
        .pipe(plugins.uglify({
            mangle: false
        }))
        .pipe(plugins.rename('altair_app.min.js'))
        .pipe(plugins.size({
            showFiles: true
        }))
        .pipe(gulp.dest('assets/js/'));
});

// common/custom functions
gulp.task('js_minify', function () {
    return gulp.src([
            'assets/js/custom/*.js',
            '!assets/js/**/*.min.js'
        ])
        .pipe(plugins.uglify({
            mangle: true
        }))
        .pipe(plugins.rename({
            extname: ".min.js"
        }))
        .pipe(gulp.dest(function(file) {
            return file.base;
        }));
});