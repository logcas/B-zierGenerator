var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('./tsconfig.json');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');

var scriptPath = {
    src: 'src/**/*.ts',
    dist: 'dist/js',
};

var htmlPath = {
    src: 'src/**/*.html',
    dist: 'dist/'
};

function server() {
    return connect.server({
        root: 'dist/',
        livereload: true
    });
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

function reload() {
    return gulp.src('dist/*.html')
           .pipe(connect.reload());
}

function watch() {
    gulp.watch(scriptPath.src,tsc);
    gulp.watch(htmlPath.src,html);
    gulp.watch('dist/**/*.*',reload);
}

var build = gulp.series(tsc,html,gulp.parallel(server,watch));

exports.tsc = tsc;
exports.watch = watch;
exports.build = build;
exports.html = html;
exports.server = server;
exports.reload = reload;

exports.default = build;