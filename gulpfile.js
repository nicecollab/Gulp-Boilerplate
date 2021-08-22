const gulp = require('gulp');
const fileinclude = require('gulp-file-include');
const cache = require('gulp-cached');
const notify = require("gulp-notify");
const sass = require('gulp-sass')(require('sass'));
const cssmin = require('gulp-cssmin');
const gulpif = require('gulp-if');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const pngcrush = require('imagemin-pngcrush');
const concat = require('gulp-concat');
const copy = require('gulp-copy');
const sourcemaps = require('gulp-sourcemaps');
const cssbeautify = require('gulp-cssbeautify');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
const argv = require('yargs').argv;
const rename = require('gulp-rename');
const babel = require('gulp-babel');

const distDir = './dist/'
const sourceDir = './src/'



const clean = function (cb) {
    // body omitted
    cb();
}

const build = function (cb) {
    // body omitted
    cb();
}


const html = function (cb) {
    gulp.src([sourceDir + 'html/**/*.*'])
        // .pipe(cache('html'))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(distDir))
        .pipe(notify({
            "title": "HTML Task",
            "message": "html task is completed"
        }))
        .pipe(browserSync.stream());
    // body omitted
    cb();
}


const scss = function (cb) {
    gulp.src(sourceDir + "scss/*.scss")
        .pipe(gulpif(!argv.production, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(!argv.production, sourcemaps.write()))
        .pipe(gulpif(argv.production, cssmin()))
        .pipe(gulpif(!argv.production, cssbeautify({
            indent: '  ',
            openbrace: 'separate-line',
            autosemicolon: true
        })))
        // .pipe(autoprefixer({
        //     browsers: ['last 2 versions'],
        //     cascade: false
        // }))
        .pipe(rename({
            suffix: '.min'
        }))
        // .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(distDir + "css/"))
        .pipe(notify({
            "title": "SCSS Task",
            "message": "scss task is completed"
        }))
        .pipe(browserSync.stream());
    // body omitted
    cb();
}


const js = function (cb) {
    gulp.src(['node_modules/babel-polyfill/dist/polyfill.js']).pipe(gulp.dest(distDir + 'js'))

    gulp.src(
        [
            sourceDir + 'js/**/*.js'
        ], {
            allowEmpty: true
        })
        .pipe(plumber())
        // .pipe(newer(distDir + 'js/*.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(rename({
            extname: '.min.js'
        }))
        // .pipe(buffer())
        // .pipe(sourcemaps.init({
        //     loadmaps: true
        // }))
        // .pipe(uglify())
        // .pipe(sourcemaps.write('./'))

        // .pipe(javascriptObfuscator({
        //     compact: true,
        //     splitStrings: true,
        //     renameGlobals: true,
        //     // optionsPreset: 'high-obfuscation',
        //     transformObjectKeys: true
        // }))
        //   .pipe(concat('all.js'))
        .pipe(gulp.dest(distDir + 'js/'))
        .pipe(notify({
            "title": "JS Task",
            "message": "js task is completed"
        }))
        .pipe(browserSync.stream());
    // body omitted
    cb();
}

const images = function (cb) {
    gulp.src(sourceDir + 'images/**/*.*')
        .pipe(newer(distDir + 'images'))
        .pipe(imagemin({
            optimizationLevel: 7,
            interlaced: true,
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest(distDir + 'images'))
        .pipe(notify({
            "title": "IMG Task",
            "message": "img task is completed"
        }))
        .pipe(browserSync.stream());
    // body omitted
    cb();
}

const fontscp = function (cb) {
    gulp.src(sourceDir + 'fonts/**/*.*')
        .pipe(newer(distDir + 'fonts'))
        .pipe(gulp.dest(distDir + 'fonts/'))
        .pipe(notify({
            "title": "Fonts Task",
            "message": "fonts task is completed"
        }))
        .pipe(browserSync.stream());
    // body omitted
    cb();
}

const prettify = function(cb) {
    gulp.src([gulp.sources.dist + '/*.html'])
        .pipe(prettify({
            indent_char: ' ',
            indent_size: 4
        }))
        .pipe(gulp.dest(gulp.sources.dist));
};

const serve = gulp.parallel(html, function (cb) {
    browserSync.init({
        server: distDir
    });
    gulp.watch(sourceDir + "**/*.html", gulp.series(html));
    gulp.watch(sourceDir + "**/*.scss", gulp.series(scss));
    gulp.watch(sourceDir + "**/*.js", gulp.series(js));
    gulp.watch(sourceDir + "images/**/*.*", gulp.series(images));
    gulp.watch(sourceDir + "fonts/**/*.*", gulp.series(fontscp));
    cb();
})

// exports.build = build;
exports.default = gulp.series(
    clean,
    gulp.parallel(
        html,
        scss,
        js,
        images,
        fontscp
    ),
    serve
);
