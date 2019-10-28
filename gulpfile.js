var gulp              = require('gulp');
var sass              = require('gulp-sass');
var sassGlob          = require('gulp-sass-glob');
var sourcemaps        = require('gulp-sourcemaps');
var cleanCss          = require('gulp-clean-css');
var del               = require('del');
var rename            = require('gulp-rename');
var postcss           = require('gulp-postcss');
var atImport          = require('postcss-easy-import')
var postcssPresetEnv  = require('postcss-preset-env');
var autoprefixer      = require('autoprefixer');

function clean () {
  return del(['build']);
}

function scss() {
  var plugins = [
    //atImport({extensions: '.scss'}),
    //postcssPresetEnv({ stage: 2 }),
  	autoprefixer({cascade: true})
  ];
  return gulp.src('src/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss(plugins, {syntax: require('postcss-scss')}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/css/')
  );
}

function css() {
  return gulp.src('build/css/*.css')
    .pipe(cleanCss({debug: true}, (details) => {
      console.log(`${details.name}: ${details.stats.originalSize}`);
      console.log(`${details.name}: ${details.stats.minifiedSize}`);
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/css/')
  );
}

function js() {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/popper.js/dist/umd/popper.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js'
    ])
    .pipe(gulp.dest('build/js/lib/'));
}

var build = gulp.series(clean, js, scss, css);

function watch() {
  gulp.watch(['src/scss/**/*.scss'], scss);
}

// If you get errors, you may also need to install gulp in the project directory here:
// npm install gulp --save-dev
// but you can run local gulp-cli directly:
// `node ./node_modules/gulp/bin/gulp.js`

exports.build = build;
exports.watch = watch;

// Default task
exports.default = gulp.series(build, watch);
