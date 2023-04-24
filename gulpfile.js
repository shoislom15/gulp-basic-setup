const { src, dest, series, parallel, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const csso = require("gulp-csso");
const bulkSass = require("gulp-sass-bulk-importer");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify-es").default;
const include = require("gulp-file-include");
const sync = require("browser-sync").create();
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");

function html() {
  return src("src/**.html")
    .pipe(include({ prefix: "@@" }))
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(dest("dist"));
}

function scss() {
  return src("src/scss/main.scss")
    .pipe(bulkSass())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(concat("index.css"))
    .pipe(dest("dist"));
}

function js() {
  return src("src/js/**/**.js")
    .pipe(concat("main.min.js"))
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(uglify())
    .pipe(dest("dist"));
}

function serve() {
  sync.init({
    server: "./dist",
  });

  watch("src/**/**.html", series(html)).on("change", sync.reload);
  watch("src/scss/**/**.scss", series(scss)).on("change", sync.reload);
  watch("src/js/**/**.js", series(js)).on("change", sync.reload);
}

exports.build = series(html, scss);
// exports.clear = clear;
exports.serve = series(html, scss, js, serve);
