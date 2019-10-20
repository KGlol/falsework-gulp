/**
 * 使用说明：
 * gulp 进行项目编译
 */

// 依赖的导入
const gulp = require('gulp'),
  concat = require('gulp-concat'),
  gulpIf = require('gulp-if'),
  rename = require('gulp-rename'),
  replace = require('gulp-replace'),
  del = require('del'),
  // plumber = require('gulp-plumber'),
  imageMin = require('gulp-imagemin'), // 图片压缩(包括PNG、JPEG、GIF和SVG图片)
  minifyCss = require('gulp-minify-css'), // 压缩css
  // cleanCss = require('gulp-clean-css'), // 压缩css
  sass = require('gulp-sass'), // gulp-sass会自动加载所有关联的sass文件
  autoprefixer = require('gulp-autoprefixer'),
  sasslint = require('gulp-stylelint'),
  // fs = require('fs'),
  babel = require('gulp-babel'),
  eslint = require('gulp-eslint'),
  // babelPresetEnv = require('babel-preset-env'),
  uglify = require('gulp-uglify'), // js压缩&混淆
  // minify = require('gulp-minify'), // js压缩(未安装)
  browserSync = require('browser-sync').create();
// gulp-changed
// gulp - line - ending - corrector
// gulp-source-map

// [
//   'sass/**/*.scss',
//   '!sass/dont-watch-this.scss'
// ]
// 路径管理
// TODO 解决监控所有文件和sass导入重复编译的问题
const sassSrc = './src/assets/sass/**/*.{sass,scss}',
  // sassSrc = './src/assets/sass/**/*.s+(a|c)ss',
  jsSrc = './src/assets/js/**/*.js',
  htmlSrc = './src/html',
  imageSrc = './src/assets/images',
  buildSrc = './build';

// 执行环境
// process.env.ENV
const isProduction = (process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'development';

// 文件重命名回调(压缩)
const renameMethod = path => path.basename += '.min';
const renameConfigObj = { suffix: '.min' };

// gulp task

// const cleanBuild = async (done) => {
//   const deletedPaths = await del(buildSrc + '/**')
//   console.log('Deleted files and directories:\n', deletedPaths.join('\n'))
//   done()
// }

const cleanBuild = (done) => {
    const deletedPaths = del.sync(buildSrc + '/**')
    console.log('Deleted files and directories:\n', deletedPaths.join('\n'))
    done()
  }

// 图片压缩(TODO无效)
const compressImages  = (done) => {
  gulp.src(imageSrc)
  .pipe(imageMin({ verbose: true }))
  .pipe(gulp.dest(buildSrc))
  done()
}

// sass格式检查
const sassLint = (done) => {
  gulp.src(sassSrc)
    .pipe(sasslint(
      {
        failAfterError: false,
        reporters: [
          { formatter: 'string', console: true }
        ]
      }
  ))
  console.log('完成了sasslint');
  done()
}

// 自动修复sass格式
const stylelintFix = (done) => {
  gulp.src(sassSrc)
  .pipe(sassLint({ fix: true }))
  .pipe(gulp.dest('.'))
  done()
}

// sass编译  css压缩
const compileSass = (done) => {
  gulp.src(sassSrc)
  // .pipe(sasslint())
  // .pipe(sasslint.format())
  // .pipe(sasslint.failOnError())
  .pipe(concat('main.scss'))
  .pipe(sass({
    outputStyle: 'expanded'  // 大括号完全展开
  }).on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(gulpIf(isProduction, minifyCss()))
  .pipe(gulpIf(isProduction, rename(renameMethod)))
  .pipe(gulp.dest(buildSrc + '/css'))
  .pipe(browserSync.stream()) // 样式变化时并不会刷新页面, 只是实时更改样式值
  done() // 任务完成信号
}

// js格式检查
const jsLint = (done) => {
  gulp.src(jsSrc)
  // .pipe(plumber(onError))
  .pipe(eslint())
  .pipe(eslint.format())
  // .pipe(eslint.result()) // 可配置输出参数
  done()
}
// js压缩
const compileJs = (done) => {
  gulp.src(jsSrc)
  .pipe(concat('main.js'))
  .pipe(babel())
  .pipe(gulpIf(isProduction, uglify())) // TIP 无法直接压缩ES6语法
  .pipe(gulpIf(isProduction, rename(renameMethod)))
  .pipe(gulp.dest(buildSrc + '/js'))
  done()
}

// cachebusting task 解决浏览器缓存问题
const cbString = new Date().getTime();
const cacheBust = (done) => {
  gulp.src('index.html')
  .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
  .pipe(gulp.dest('.'))
  done()
}

// 监视
const watch = (done) => {
  browserSync.init({
    server: {
      baseDir: './'
    }
  })
  gulp.watch(sassSrc, {
  ignoreInitial: false, // false提前执行回调
  // events: 'all',  // 监听所有事件
  }, gulp.series(sassLint, compileSass))
  gulp.watch(jsSrc).on('change',  gulp.series(jsLint, browserSync.reload))
  gulp.watch('./**/*.html').on('change', browserSync.reload)
  gulp.watch(imageSrc).on('change', compressImages)
  done() // 任务完成信号
}

exports.stylelintFix = stylelintFix

// 默认执行开发环境编译 gulp
exports.default = gulp.series(
  cacheBust,
  watch
)

// 项目打包 gulp build
exports.build = gulp.series(
  cleanBuild,
  cacheBust,
  gulp.parallel(compileSass, compressImages, compileJs)
)

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

// 目标浏览器browserlist
  // 可以在 .babelrc 文件、package.json文件、browserslist中指定浏览器版本选项，
  // 优先级规则是.babelrc文件定义了则会忽略 browserslist、
  // .babelrc 没有定义则会搜索 browserslist 和 package.json 两者应该只定义一个，
  // 否则会报错。