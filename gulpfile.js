var gulp = require('gulp');
var minifyHtml = require("gulp-minify-html");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var ngHtml2Js = require("gulp-ng-html2js");
var ngAnnotate = require('gulp-ng-annotate');
var minifyCss = require('gulp-minify-css');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var nib = require('nib');
var runSequence = require('run-sequence');
var series =  require('stream-series');
// var rimraf = require('rimraf');
var del = require('del');
var karma = require('karma').server;

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('clean', function(cb) {
  // rimraf('./dist', cb);
  del(['./dist'], cb);
});

gulp.task('buildJs', function() {
  var vendor = gulp.src([
    'node_modules/angular/angular.min.js',
    'node_modules/angular-route/angular-route.min.js',
    'node_modules/angular-resource/angular-resource.min.js',
    'node_modules/angular-aerobatic/angular-aerobatic.min.js'
  ]);

  var scripts = gulp.src('app/js/**/*.js')
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(concat('scripts.min.js'));

  // Compile all the partials into a 
  var partials = gulp.src("app/views/*.html")
    .pipe(ngHtml2Js({
        moduleName: "templates",
        prefix: "views/"
    }))
    .pipe(uglify());

  // Combine the scripts and partials into a single uglified app.min.js file.
  series(vendor, scripts, partials)
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('buildCss', function() {
  gulp.src(['bower_components/todomvc-common/base.css', 'app/css/style.css'])
    .pipe(concat('app.min.css'))
    .pipe(minifyCss({keepBreaks: true}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('copyAssets', function() {
  gulp.src(['app/favicon.*', 'app/*.html'], {base: 'app'})
    .pipe(gulp.dest('./dist'));

  gulp.src('bower_components/todomvc-common/bg.png')
    .pipe(gulp.dest('./dist'));
});

gulp.task('test', function (done) {
  karma.start({
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'app/js/**/*.js',
      'test/unit/**/*.js'
    ],
    frameworks: ['jasmine'],
    browsers: ['Chrome'],
    logLevel: 'INFO',
    plugins : [
      'karma-jasmine',
      'karma-chrome-launcher'
    ],
    reporters: 'dots',
    // configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('build', function(callback) {
  runSequence('clean', ['buildJs', 'buildCss', 'copyAssets'], callback);
});
