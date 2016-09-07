var gulp = require('gulp'),
    minifyCss = require('gulp-minify-css'),
    uglifycss = require('gulp-uglifycss'),
    concat = require('gulp-concat'),
    version = require('gulp-version-number'),
    inject = require('gulp-inject'),
    sass = require('gulp-sass'),
    bump = require('gulp-bump'),
    header = require('gulp-header'),
    pkg = require('./package.json'),
    stripDebug = require('gulp-strip-debug'),
    onError = function onError(err) {
        console.log(err);
    };
var config = {
    root: '.',
    assets: 'assets',
    bower: 'bower_components',
    pages: 'pages'
};
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.v.app %>',
  ' * @compile-time: ' + new Date().toString(),
  ' */',
  ''].join('\n');

gulp.task("sass-compile", function(){
    gulp.src([
        config.assets + '/scss/import.scss'
        ])
        .pipe(sass().on('error', sass.logError))
        .pipe(concat({ path: 'nightknight_stylesheet.css'}))
        .pipe(minifyCss({
            compatibility: 'ie8',
            keepSpecialComments: 0
        }))
        .pipe(uglifycss({
            "max-line-len": 80
        }))
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest(config.assets + '/css/minified'));

    //Update build-nr
    gulp.src(config.root + '/package.json')
    .pipe(bump({key: 'v.build', type: 'prerelease', preid: 'compile'}))
    .pipe(gulp.dest(config.root)); 
});


gulp.task('inject-minified', ['sass-compile'], function(){
    //Inject in header and footer
    var stream = gulp.src(config.pages + '/*.html')
    .pipe(
        inject(
            gulp.src([
                config.assets + '/css/minified/*.*',
                config.assets + '/css/plugins/**/*.css',
                config.bower + '/jquery/dist/jquery.min.js',
                config.assets + '/js/*.js'
                ], {
                    read: false
                }
            ), 
            {
                relative: true
            }
        )
    )
    .pipe(gulp.dest(config.pages));

    //Callback
    return stream;
});

gulp.task('watch', function(){
    gulp.watch([
        config.assets + '/scss/**/*.scss',
    ], ['sass-compile'/*, 'inject-minified'*/]);
});

