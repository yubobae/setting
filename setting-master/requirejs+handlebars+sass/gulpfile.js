'use strict';

let browserSync = require('browser-sync').create();

// load all gulp-plugins in 'devDependencies' into the variable $
const $ = require('gulp-load-plugins')({
  pattern: ['*'],
  scope: ['devDependencies']
});

const pkg = require('./package.json');
const gulp = require('gulp');
const Prompt = require('prompt-list');
const cool = require('cool-ascii-faces'); 
const logs = require('gutil-color-log');
const runSequence = require('run-sequence');
const pump = require('pump');

if(!process.env.NODE_ENV) process.env.NODE_ENV = "development";
let isProd = ( process.env.NODE_ENV == "production" ) ? true : false;
let isLive = false;

// options
const path = pkg.paths;
const PORT = { 
  serve: pkg.serve.port[process.env.NODE_ENV], 
  live: pkg.serve.port['live'] 
};
const browserslist = require('./_config/browserslist');

const log = (color, msg) => logs(color, cool() + '*** ' + msg);
const onError = (err) => console.log(err);

const banner = [
    "/**",
    " * @project        <%= pkg.name %>",
    " * @author         <%= pkg.author %>",
    " * @build          " + $.moment().format("llll") + " ET",
    " * @release        " + $.gitRevSync.long() + " [" + $.gitRevSync.branch() + "]",
    " * @copyright      Copyright (c) " + $.moment().format("YYYY") + ", <%= pkg.copyright %>",
    " *",
    " */",
    ""
].join("\n");

gulp.task('browser-sync', function () {

  return $.browserSync.init({
    port: PORT.live,
    proxy: `localhost:${PORT.serve}`,
    startPath: '/'
  });

});

gulp.task('nodemon', (cb) => {

  let stream = $.nodemon({
    script: 'app.js',
    env: { 'NODE_ENV': process.env.NODE_ENV },
    ext: 'js ejs',
    // watch: ['app.js', 'routes/', 'config/', 'models/', 'views/'],
    watch: ['app.js'],
    ignore: ['webpack.config.js', 'path.js', 'browserslist.js'],
    tasks: function (changedFiles) {
      let tasks = [];
      changedFiles.forEach(function (file) {
        let filename = file.split('/');
        filename = filename[filename.length - 1];
        log('magenta', `file changed : ${filename}`);
        // if (path.extname(file) === '.js' && !~tasks.indexOf('lint')) tasks.push('lint')
        // if (path.extname(file) === '.css' && !~tasks.indexOf('cssmin')) tasks.push('cssmin')
      });
      return tasks;
    }
  });

  stream.on('start', function () {
    $.gutil.log(gutil.colors.green(cool() + ' Nodemon server started!'));
    if ($.browserSync.active) $.browserSync.reload();
  }).on('restart', function () {
    $.gutil.log($.gutil.colors.blue(cool() + ' Nodemon server restarted!'));
  }).on('crash', function () {
    $.gutil.log($.gutil.colors.red(cool() + ' Nodemon has crashed!'));
    stream.emit('restart', 10);  // restart the server in 10 seconds
  });

  if(isLive) {

    $.opn(`http://localhost:${PORT.live}`);

  } else {

    $.opn(`http://localhost:${PORT.serve}`);

  }
  
  return stream;

});


gulp.task('sass', () => {

  return gulp.src(path.SRC.SCSS + '/**/*.scss')
      .pipe( $.plumber({errorHandler: onError}) )
      .pipe( $.sourcemaps.init({loadMaps: true}) )
      .pipe( $.sass({
              outputStyle: 'compressed',
              sourceComments: false,
              includePaths: pkg.paths.scss
          })
          .on("error", $.sass.logError) )
      .pipe( $.cached("sass_compile") )
      .pipe( $.autoprefixer(browserslist) )
      .pipe( $.sourcemaps.write("./") )
      .pipe( $.size({gzip: true, showFiles: true}) )
      .pipe( gulp.dest(path.DEST.CSS) );

});

gulp.task("css", ["scss"], () => {

    return gulp.src(path.DEST.CSS + '/**/*.css')
        .pipe( $.plumber({ errorHandler: onError }) )
        .pipe( $.newer({ dest: path.DEST.CSS }) )
        .pipe( $.print() )
        .pipe( $.sourcemaps.init({loadMaps: true}))
        .pipe( $.cssnano({
            discardComments: {
                removeAll: true
            },
            discardDuplicates: true,
            discardEmpty: true,
            minifyFontValues: true,
            minifySelectors: true
        }) )
        .pipe( $.header(banner, {pkg: pkg}) )
        .pipe( $.sourcemaps.write("./") )
        .pipe( $.size({gzip: true, showFiles: true}) )
        .pipe( gulp.dest(path.DEST.CSS) )
        .pipe( $.filter("**/*.css") );

});

gulp.task("js", (cb) => {

  return pump([
    gulp.src(path.SRC.JS + '/**/*.js'),
    $.uglify({ mangle : false}),
    gulp.dest(path.DEST.JS)
  ], cb);  
  
});

// Prism js 작업 - 자바스크립트와 컨피그 파일을 하나의 번들로 합칩니다
gulp.task("prism-js", () => {

    return gulp.src( pkg.globs.prismJs )
        .pipe( $.plumber({errorHandler: onError}) )
        .pipe( $.newer({dest: pkg.paths.build.js + "prism.min.js"}) )
        .pipe( $.concat("prism.min.js") )
        .pipe( $.uglify() )
        .pipe( $.size({gzip: true, showFiles: true}) )
        .pipe( gulp.dest(pkg.paths.build.js) );
});


gulp.task('watch', () => {
  
    gulp.watch([path.SRC.HTML + '/**/*.html'], (cb) => {

      let filename = cb.path.split('/');
      filename = filename[filename.length - 1];

      log('cyan', `${cb.type} : ${filename}`);
      if ($.browserSync.active) $.browserSync.reload();

    });

    gulp.watch([path.SRC.SCSS + '/**/*.scss'], (cb) => {

      let filename = cb.path.split('/'),
        type = cb.type;

      filename = filename[filename.length - 1];

      log('cyan', `Detected change: ${filename}`);
      return runSequence('sass');

    });

    gulp.watch(path.SRC.JS + '/**/*.js', (cb) => {

      let filename = cb.path.split('/'),
      type = cb.type;

      filename = filename[filename.length - 1];

      log('cyan', `Detected change: ${filename}`);
    
      gulp.src(path.SRC.JS + '/**/*.js')
        .pipe( $.sourcemaps.init())
        .pipe( $.changed(path.DEST.JS) )
        .pipe( $.uglify({ mangle : false}) )
        .pipe( $.sourcemaps.write('./'))        
        .pipe( gulp.dest(path.DEST.JS) );

    });


});

gulp.task('build', (callback) => {

    return $.del([path.DEST.RESOURCES])
      .then(paths => {
        log('red', `deleted build files and folders:\n${paths}`);
        runSequence(['sass', 'js']);
      });

});


gulp.task('default', (callback) => {

  console.log(`
                                   |
                                 /---\\
                                 : = :
                                 :   :
               :,','. '.         :   :---\\
  ..,,,',.',',;,'.';'.'.'.,.'.'..:.  :   :
  TASK runner start.
  `);
  

  let prompt = new Prompt({
    name: 'select_task',
    message: 'Please choose what you want.',
    choices: [
      '1) Run Development Mode',
      '2) Production Build',
      '3) open live-sync server',
      '-) Exit'
    ]
  });

  prompt.ask( (answer) => {

    switch ( answer.split(')')[0] ) {
      case '1':
        isProd = false;
        runSequence( ['build'], ['watch', 'nodemon'], ['browser-sync'] );
        break;
      case '2':
        isProd = true;
        runSequence( ['build'], () => log('green', 'Build was Complete.') );
        break;
      case '3':
        runSequence( ['nodemon'] );
        if (browserSync.active) browserSync.reload();
        else runSequence( ['browser-sync'] );
        break;
      default:
        log('green', 'Exit task runner.');
        break;
    }

  });

  // // runSequence(['build'], ['nodemon', 'watch'], cb);

});
