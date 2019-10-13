/**
 * 使用说明：
 * gulp 进行项目编译
 * ENV=prod gulp 进行发布编译
 */

// 依赖的导入
const gulp = require('gulp'),
  concat = require('gulp-concat'),
  gulpIf = require('gulp-if'),
  rename = require('gulp-rename'),
  minifyCss = require('gulp-minify-css'), // 压缩css
  // cleanCss = require('gulp-clean-css'), // 压缩css
  sass = require('gulp-sass'), // gulp-sass会自动加载所有关联的sass文件
  autoprefixer = require('gulp-autoprefixer'),
  fs = require('fs'),
  uglify = require('gulp-uglify'), // js压缩&混淆
  // minify = require('gulp-minify'), // js压缩
  browserSync = require('browser-sync').create();


// 路径管理
const sassSrc = './src/assets/sass/**/*.scss',
  jsSrc = './src/assets/js/**/*.js',
  htmlSrc = './src/html',
  imageSrc = './src/assets/images',
  buildSrc = './build';

// 执行环境
// process.env.ENV
const isProduction = (process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'development';

// 文件重命名回调(压缩)
const renameMethod = path => path.basename += '.min';

// gulp task

// sass编译  css压缩
const compileSass = (done) => {
  gulp.src(sassSrc)
  .pipe(concat('main.scss'))
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(gulpIf(isProduction, minifyCss()))
  .pipe(gulpIf(isProduction, rename(renameMethod)))
  .pipe(gulp.dest(buildSrc + '/css/'))
  done() // 任务完成信号
}

// 监视
const watch = (done) => {
  gulp.watch(sassSrc, {
  ignoreInitial: false, // 提前执行回调
  // events: 'all',  // 监听所有事件
}, compileSass)
  done() // 任务完成信号
}

// 默认执行任务
gulp.task('default', watch)

/**
 * 备忘
 */
// autoprefixer设置
// autoprefixer({
  // browsers: ['> 1%'], // 全球使用率超过1%的浏览器
  // cascade: isProduction, // 如果css未压缩，是否美化属性值（默认true）
  // // -webkit-transform: rotate(45deg);
  // //         transform: rotate(45deg);
  // remove: true, // 是否去掉不必要的前缀（默认true）
// }