vue build src/vue-dialog-drag.vue --prod --lib 
vue build src/drop-area.vue --prod --lib --dist dist/drop-area
mv ./dist/drop-area/* ./dist
rm -rf ./dist/drop-area