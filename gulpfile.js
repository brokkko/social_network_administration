import gulp from 'gulp';
import sass from 'sass';
import image from 'gulp-image';
import less from 'gulp-sass';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';

let scss_1 = less(sass);

const paths = {
    styles: {
        src: 'styles/*.scss',
        dest: 'dist/gulp/styles/'
    },
    scripts: {
        src: 'scripts/client/*.js',
        dest: 'dist/gulp/scripts/'
    },
    images: {
        src: 'public/images/**/*',
        dest: 'dist/gulp/images/'
    },
    source: {
        src: 'styles/loads/*',
        dest: 'dist/gulp/loads/'
    }
};

export function loads() {
    return gulp.src(paths.source.src)
        .pipe(gulp.dest(paths.source.dest));
}

export function styles() {
    return gulp.src(paths.styles.src)
        .pipe(scss_1())
        .pipe(cleanCSS())
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest));
}

export function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest));
}

export function images() {
    return gulp.src(paths.images.src)
        .pipe(image({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            jpegRecompress: false,
            mozjpeg: true,
            gifsicle: true,
            svgo: true,
            concurrent: 10,
            quiet: true // defaults to false
        }))
        .pipe(gulp.dest(paths.images.dest));
}

function watchFiles() {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.images.src, images);
}
export { scripts as watch, styles as watch_style };

const build = gulp.parallel(styles, scripts, loads);
export {build};