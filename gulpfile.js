var gulp = require('gulp'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglifyjs'),
    uglifycss = require('gulp-uglifycss'),
    concat = require('gulp-concat'),
    version = require('gulp-version-number'),
    inject = require('gulp-inject'),
    sass = require('gulp-sass'),
    bump = require('gulp-bump'),
    header = require('gulp-header'),
    pkg = require('./package.json'),
    mainBowerFiles = require('main-bower-files'),
    stripDebug = require('gulp-strip-debug'),
    gulpFilter = require('gulp-filter'),
    onError = function onError(err) {
        console.log(err);
    };
var config = {
    root: '.',
    app: 'app',
    assets: 'assets',
    bower: 'bower_components'
};
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.v.app %>',
  ' * @compile-time: ' + new Date().toString(),
  ' */',
  ''].join('\n');

var scriptsFilter = gulpFilter(["**/*.js"]);

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

gulp.task("minify-scripts", function(){
    // Globbing patterns
    var patterns = [
        "!" + config.app + '/**/*.template.js',
        config.app + '/app.module.js',
        config.app + '/app.settings.js', 
        config.app + '/**/*.js'
    ];

    //JS - minify own js
    gulp.src(patterns)
        .pipe(uglify())
        .pipe(concat({ path: 'nk_scripts.min.js'}))
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest(config.assets + '/js/minified'));

    //JS - minify vendor js
    return gulp.src(mainBowerFiles())
        .pipe(scriptsFilter)
        .pipe(concat({ path: 'nk_vendor_scripts.min.js'}))
        .pipe(uglify())
        .pipe(stripDebug())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest(config.assets + '/js/minified'));
});


gulp.task('inject-minified', ['minify-scripts', 'sass-compile'], function(){
    //Inject in header and footer
    var stream = gulp.src(config.root + '/*.html')
    .pipe(
        inject(
            gulp.src([
                config.assets + '/css/minified/*.*',
                config.assets + '/css/plugins/**/*.css',
                config.assets + '/minified/*.min.js'
                ], {
                    read: false
                }
            ), 
            {
                relative: true
            }
        )
    )
    .pipe(gulp.dest(config.root));

    //Callback
    return stream;
});

gulp.task('inject-raw', ['sass-compile'], function(){
    //Inject in header and footer
    var stream = gulp.src(config.root + '/*.html')
    .pipe(
        inject(
            gulp.src([
                config.assets + '/css/minified/*.*',
                config.assets + '/css/plugins/**/*.css',
                config.bower + '/jquery/dist/jquery.js',
                config.bower + '/angular/angular.js',
                config.bower + '/angular-ui-router/release/angular-ui-router.js',
                "!" + config.app + "/**/*.template.js",
                config.app + '/*.js',
                config.app + '/**/*.js'
                ], {
                    read: false
                }
            ), 
            {
                relative: true
            }
        )
    )
    .pipe(gulp.dest(config.root));

    //Callback
    return stream;
});

gulp.task('watch', function(){
    gulp.watch([
        config.assets + '/scss/**/*.scss',
    ], ['sass-compile', 'inject-minified']);
});

gulp.task('dev',['sass-compile', 'minify-scripts', 'inject-raw']);
gulp.task('prod',['sass-compile', 'minify-scripts', 'inject-minified']);


