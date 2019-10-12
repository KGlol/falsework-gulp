/**
 * 使用说明：
 * gulp 进行项目编译
 * ENV=prod gulp 进行发布编译
 */

// 依赖的导入
const gulp = require('gulp'),
  concat = require('gulp-concat'),
  gif = require('gulp-if'),
  minifyCss = require('gulp-minify-css'), // 压缩css
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'), // js压缩&混淆
  // minify = require('gulp-minify'), // js压缩
  cleanCss = require('gulp-clean-css'), // 压缩css
  sass = require('gulp-sass'); // gulp-sass会自动加载所有关联的sass文件

// 路径管理
const sassSrc = './src/assets/sass',
  htmlSrc = './src/html',
  imageSrc = './src/assets/images',
  buildSrc = './build';

// 执行环境
const isProduction = process.env.ENV === 'prod';

// gulp task

// 文件重命名(压缩)
gulp.task('rename', () => {
  Path.basename += '.min'
})

// sass编译  css压缩
gulp.task('sass', () => {
  gulp.src(sassSrc + '/*.scss')
  .pipe(concat('main.scss'))
  .pipe(sass())
  // .pipe(minifyCss())
  .pipe(gulp.dest(buildSrc + '/css/'))
  console.log('完成了sass');
})

// 监视sass
gulp.task('sass:watch', () => {
  gulp.watch(sassSrc + '/*.scss', ['sass'])
  console.log('完成了sass:watch');
})

// 默认执行任务
gulp.task('default', gulp.series([
  // 'sass',
  'sass:watch',
]))