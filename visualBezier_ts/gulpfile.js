var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cssUglify = require('gulp-clean-css');
var sourceMap = require('gulp-sourcemaps');
var clean = require('gulp-clean');
var connect = require('gulp-connect');
var browserify = require('browserify');
var tsify = require('tsify');
var source  = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');


var scriptPath = {
    src: 'src/**/*.ts',
    dist: 'dist/',
};

var htmlPath = {
    src: 'src/**/*.html',
    dist: 'dist/'
};

var cssPath = {
    src: 'src/**/*.css',
    dist: 'dist/'
};

function server() {
    return connect.server({
        root: 'dist/',
        livereload: true
    });
}

function cleanDist() {
    return gulp.src('dist/*')
           .pipe(clean({force:true}))
}

function tsc() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/js/app.ts'],
        cache: {},
        packageCahe: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('js/bundle.js'))
        .pipe(buffer())
        .pipe(sourceMap.init({loadMaps:true}))
        .pipe(uglify())
        .pipe(sourceMap.write('./'))
        .pipe(gulp.dest(scriptPath.dist));
}

function html() {
    return gulp.src(htmlPath.src)
               .pipe(gulp.dest(htmlPath.dist))
               .pipe(connect.reload());
}

function css() {
    return gulp.src(cssPath.src)
               .pipe(sourceMap.init())
               .pipe(cssUglify())
               .pipe(sourceMap.write())
               .pipe(gulp.dest(cssPath.dist));
}

function reload() {
    return gulp.src('dist/*.html')
           .pipe(connect.reload());
}

function watch() {
    gulp.watch(scriptPath.src,tsc);
    gulp.watch(htmlPath.src,html);
    gulp.watch(cssPath.src,css);
    gulp.watch('dist/**/*.*',reload);
}

var build = gulp.series(cleanDist,tsc,css,html,gulp.parallel(server,watch));

module.exports = {
    tsc,
    watch,
    build,
    html,
    css,
    cleanDist,
    server,
    reload,
    default: build
}