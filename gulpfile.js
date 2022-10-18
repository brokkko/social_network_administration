import gulp from 'gulp';
import sass from 'sass';
import less from 'gulp-sass';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
// import del from 'del';
let scss_1 = less(sass);

const paths = {
    styles: {
        src: 'styles/*.scss',
        dest: 'dist/gulp/styles/'
    },
    scripts: {
        src: 'scripts/*.js',
        dest: 'dist/gulp/scripts/'
    }
};

/*
 * For small tasks you can export arrow functions
 */
// export const clean = () => del([ 'assets' ]);

/*
 * You can also declare named functions and export them as tasks
 */
export function styles() {
    return gulp.src(paths.styles.src)
        .pipe(scss_1())
        .pipe(cleanCSS())
        // pass in options to the stream
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest));
}

export function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest));
}

/*
 * You could even use `export as` to rename exported tasks
 */
function watchFiles() {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
}
export { watchFiles as watch };

const build = gulp.parallel(styles, scripts);
/*
 * Export a default task
 */
export {build};