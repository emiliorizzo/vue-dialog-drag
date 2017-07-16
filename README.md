# vue-dialog-drag

> Simple draggable dialog

demo: 

## Installation

``` bash
npm install vue-dialog-drag --save

```

 
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
### html
``` html
<script src="vue-dialog-drag/dist/vue-dialog-drag.js">
<link >
```

## Usage

```xml
<dialog-drag>
  <p> Dialog content </p>
</dialog-drag>
```

## Slots
  title

## Props
  - id: *Unique id for dialog*
  - title: *Dialog title*
  - options:
  - events:

## Events
  
  - dragStart
  - move
  - dragEnd
  - close


## Css