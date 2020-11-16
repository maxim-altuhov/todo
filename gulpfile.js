let project_folder = "dist";
// let project_folder = "E:/openserver/OpenServer/domains/localhost/project";
// let project_folder = "E:/Work/MAMP/htdocs/pro";
let source_folder = "#src";

let fs = require('fs');

const isDev = false;
// const isDev = true;
const isProd = !isDev;

let path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/img/",
		fonts: project_folder + "/fonts/",
	},
	src: {
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
		originalcss: source_folder + "/css/*.css",
		css: source_folder + "/scss/style.scss",
		js: source_folder + "/js/",
		jsSimple: source_folder + "/js/simple_script/index.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
		fonts: source_folder + "/fonts/*.{ttf,woff,woff2}",
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
	},
	clean: "./" + project_folder + "/"
};

let {
	src,
	dest
} = require('gulp'),
	gulp = require('gulp'),
	babel = require("gulp-babel"),
	browsersync = require("browser-sync").create(),
	fileinclude = require("gulp-file-include"),
	del = require("del"),
	scss = require("gulp-sass"),
	autoprefixer = require("gulp-autoprefixer"),
	group_media = require("gulp-group-css-media-queries"),
	clean_css = require("gulp-clean-css"),
	rename = require("gulp-rename"),
	imagemin = require("gulp-imagemin"),
	uglify = require("gulp-uglify-es").default,
	webp = require('gulp-webp'),
	webphtml = require('gulp-webp-html'),
	webpcss = require("gulp-webpcss"),
	svgSprite = require('gulp-svg-sprite'),
	ttf2woff = require('gulp-ttf2woff'),
	ttf2woff2 = require('gulp-ttf2woff2'),
	fonter = require('gulp-fonter'),
	htmlmin = require('gulp-htmlmin'),
	gulpif = require('gulp-if'),
	sourcemaps = require('gulp-sourcemaps'),
	tildeImporter = require('node-sass-tilde-importer');

function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		port: 3000,
		notify: false
	});
}

function html() {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(webphtml())
		.pipe(gulpif(isProd, htmlmin({
			collapseWhitespace: true,
			removeComments: true
		})))
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream());
}

function css() {
	return src(path.src.css)
		.pipe(gulpif(isDev, sourcemaps.init()))
		.pipe(
			scss({
				importer: tildeImporter
			}).on('error', scss.logError)
		)
		.pipe(
			scss({
				outputStyle: "expanded"
			})
		)
		.pipe(
			group_media()
		)
		.pipe(
			autoprefixer({
				grid: true,
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)
		.pipe(gulpif(isProd, webpcss({
			noWebpClass: '.no_webp'
		}))) //замена на webp изображения
		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(gulpif(isDev, sourcemaps.write()))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}

function originalcss() {
	return src(path.src.originalcss)
		.pipe(dest(path.build.css));
}

function js() {
	return src(path.src.js)
		// return src(path.src.jsSimple)
		// .pipe(fileinclude())
		// .pipe(babel())
		.pipe(dest(path.build.js))
		// .pipe(
		// 	uglify()
		// )
		// .pipe(
		// 	rename({
		// 		extname: ".min.js"
		// 	})
		// )
		// .pipe(babel())
		// .pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}

function images() {
	return src(path.src.img)
		.pipe(
			webp({
				quality: 70
			})
		)
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{
					removeViewBox: false
				}],
				interlaced: true,
				optimizationLevel: 3 // 0 to 7
			})
		)
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream());
}

function fonts() {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts));
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts));
}

function favicon() {
	return src([source_folder + '/*.+(ico|png)'])
		.pipe(dest(project_folder + '/'));
}

function mailer() {
	return src([source_folder + '/mailer/**/*'])
		.pipe(dest(project_folder + '/mailer'));
}

function scriptsCopy() {
	return src([source_folder + '/scripts/**/*'])
		.pipe(dest(project_folder + '/scripts'));
}

function filesCopy() {
	return src([source_folder + '/files/**/*'])
		.pipe(dest(project_folder + '/files'));
}

gulp.task('lcopy', function () {
	return src([project_folder + '/**/*'])
		.pipe(dest('E:/openserver/OpenServer/domains/localhost/project'));
	// .pipe(dest('E:/Work/MAMP/htdocs/pro'));
});

gulp.task('otf2ttf', function () {
	return src([source_folder + '/fonts/*.otf'])
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest(source_folder + '/fonts/'));
});

gulp.task('svgSprite', function () {
	return gulp.src([source_folder + '/iconsprite/*.svg'])
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../img/icons/sprite.svg", //sprite file name
					example: true
				}
			},
		}))
		.pipe(dest(path.build.img));
});

function fontsStyle(params) {
	let file_content = fs.readFileSync(source_folder + '/scss/base/fonts.scss');
	if (file_content == '') {
		fs.writeFile(source_folder + '/scss/base/fonts.scss', '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(source_folder + '/scss/base/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		});
	}
}

function cb() {

}

function watchFiles(params) {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
}

function clean(params) {
	return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(originalcss, js, css, html, images, fonts, favicon, mailer, scriptsCopy, filesCopy), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fontsStyle = fontsStyle;
exports.originalcss = originalcss;
exports.mailer = mailer;
exports.scriptsCopy = scriptsCopy;
exports.filesCopy = filesCopy;
exports.favicon = favicon;
exports.fonts = fonts;
exports.images = images;
exports.css = css;
exports.js = js;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;