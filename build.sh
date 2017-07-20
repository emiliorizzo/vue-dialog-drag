vue build src/vue-dialog-drag.vue --prod --lib vueDialogDrag
vue build src/drop-area.vue --prod --lib vueDropArea --dist dist/drop-area
mv ./dist/drop-area/* ./dist
rm -rf ./dist/drop-area
stylus --compress -I ./src < ./src/dialog-styles.styl > ./dist/dialog-styles.css