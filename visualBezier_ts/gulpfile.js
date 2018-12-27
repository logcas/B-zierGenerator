var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('./tsconfig.json');
var uglify = require('gulp-uglify');
var cssUglify = require('gulp-clean-css');
var sourceMap = require('gulp-sourcemaps');
var clean = require('gulp-clean');
var connect = require('gulp-connect');

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
    return gulp.src(scriptPath.src)
               .pipe(tsProject())
               .pipe(uglify())
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