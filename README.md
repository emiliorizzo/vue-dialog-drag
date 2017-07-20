# vue-dialog-drag

> Simple draggable dialog

[Demo](https://emiliorizzo.github.io/vue-dialog-drag/)

Features:

- 'Pin' mode, to lock drag.
- Touch support (only for drag)
- Drop area component  

## Installation

``` bash
npm install vue-dialog-drag --save

```
## Usage
 
Import and register component

``` javascript
import DialogDrag from 'vue-dialog-drag'

export default{
  ...
  components:{
    DialogDrag
  }
}
```

include css 
``` html
<style src='vue-dialog-drag/dist/vue-dialog-drag.css'></style>

```
Or import source component from: 'vue-dialog-drag/src/vue-dialog-drag.vue'
And install devDependencies. (stylus and pug) 
see [package.json](https://github.com/emiliorizzo/vue-dialog-drag/blob/master/package.json))

## Examples 

#### Single file component
```html
<template>
  <div id="app">
    <dialog-drag id="dialog-1">
      <p> Test dialog</p>
    </dialog-drag>
    <drop-area @drop='drop'>
      <p>Drop Here</p>
    </drop-area>
  </div>
</template>

<script>  
import DialogDrag from 'vue-dialog-drag'
import DropArea from 'vue-dialog-drag/dist/drop-area'
export default {
  name: 'app',
  components: {
    DialogDrag,
    DropArea
  },
  methods: {
    drop (id) {
      console.log('drop id:', id)
    }
  }
}
</script>

<style src="vue-dialog-drag/dist/vue-dialog-drag.css"></style>
<style src="vue-dialog-drag/dist/drop-area.css"></style>

<!-- optional dialog styles, see example -->
<style src="vue-dialog-drag/dist/dialog-styles.css"></style>

```
#### html
 
  [See this fiddle](https://jsfiddle.net/emii/g7hojq7m/)

## Dialog Component
### Slots

  - Title: dialog title. If you don't need formatted title, use 'title' prop.  

### Props

  - id: *Unique id for dialog*
  - title: *Dialog title*
  - options: **Object**
    - left: **Number**
    - top: **Number**
    - width: **Number**
    - height: **Number**
    - buttonPin: **Boolean**
    - buttonClose:**Boolean**
  - events:

### Events
  
 -  **drag-start**: fired on dragstart, emits: { id, left, top }
  - **move**: fired when move dialot, emits: { id, left, top }
  - **drag-end**: fired on dragend, emits: { id, left, top }
  - **close**: fired when close dialogs, emits dialog id


### Css
  
  The main container has class **.dialog-drag**, and .**dialog-drag** **.fixed** when dialog is pinned

  You can import extra dialog styles from dist/dialog-styles.css.

  view: [example styles](https://github.com/emiliorizzo/vue-dialog-drag/blob/master/src/example/dialog-styles.styl) 

## Drop area component

## Slots
  
  **Over**: content rendered when the dialog is dragged over drop area.

## Events
  
  **drop**: fired when drop the dialog, emits dialog id.

