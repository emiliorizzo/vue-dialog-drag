<template lang="pug">
  #app      
    .menu-container
      .menu
        h1 Vue Draggable Dialog
        button.btn(@click='newDialog(style)') new dialog
        .set
          label Dialog Style:  
          select(v-model='style')
            option(value='') random
            option(v-for='style in styles' :value='style') {{style}}
      
      .git-hub
        .octicon
    
    .console(v-if='selected')
      p Dialog Selected
      small {{selected}}
    
    .dialogs
      dialog-drag(v-for='dialog,key in dialogs' :class='dialog.style'
        :key='dialog.id' 
        :id='dialog.id' 
        @close='removeDialog' 
        @dragEnd='dialogDragEnd'
        @dragStart='selectDialog'
        @move='dialogDragEnd'
        :options='dialog.options')
        
        span(slot='title') {{ dialog.name }}  
        p {{dialog.content}}
        small
          strong Random style: {{dialog.style}}
          p
            small double click to enable-disable dialog drag
</template>


<script>
import DialogDrag from '../vue-dialog-drag.vue'
import rndText from './randomText.js'

export default {
  name: 'example',
  components: {
    DialogDrag
  },
  data () {
    return {
      dialogs: [],
      dialogId: 1,
      styles: ['dialog-1', 'dialog-2', 'dialog-3'],
      style: '',
      selected: null,
      dialogWidth: 400
    }
  },
  created () {
    for (let style of this.styles) {
      let index = this.newDialog(style) - 1
      this.dialogs[index].options.left = (index * this.dialogWidth) + 50 * index + 1
    }
  },
  methods: {
    newDialog (style) {
      if (!style) style = this.randomStyle()
      return this.dialogs.push(this.dialog(style))
    },
    removeDialog (id) {
      let index = this.findDialog(id)
      this.dialogs.splice(index, 1)
      if (this.selected && this.selected.id === id) this.selected = null
    },
    findDialog (id) {
      let index = this.dialogs.findIndex((val) => {
        return val.id === id
      })
      return index
    },
    dialog (style) {
      let id = this.dialogId
      this.dialogId++
      let name = 'Dialog ' + id
      let content = rndText()
      let options = {
        left: 30 * id,
        top: 30 * id,
        width: this.dialogWidth
      }
      return { id, name, content, style, options }
    },
    dialogDragEnd (obj) {
      let index = this.findDialog(obj.id)
      this.$set(this.dialogs[index].options, 'left', obj.left)
      this.$set(this.dialogs[index].options, 'top', obj.top)
    },
    randomStyle () {
      return this.styles[Math.floor(Math.random() * this.styles.length)]
    },
    selectDialog (obj) {
      let index = this.findDialog(obj.id)
      this.selected = this.dialogs[index]
    }
  }
}
</script>
<style lang="stylus">
$color = #1aad8d
$color2 = #e59e0d
$dark = lightness($color,20%)

$sh = 1px 1px 1px rgba(0,0,0,.5)
  body 
    font-family: 'Asap', sans-serif
    background-color: #e6ede9
    font-size: 16px
  h1
    font-family: 'Belgrano', serif
    text-shadow: $sh, $sh
    font-size: 1.5em
    text-shadow: $sh
  label
    font-size: .8em
    display:block
    margin-bottom: .5em
  
  .menu-container
    position:fixed
    bottom: 0
    z-index:50
    margin: 5em

  .menu
    border: $dark 1px solid
    padding: 2em
    background-color: $color
    color: white
    box-shadow: $sh
  
  .git-hub 
    margin-top: 1em
    .octicon
      padding: 0.1em
      background-color: white
      border-radius: 50%
      display: inline-block
      path
        fill: $color
  
  .set 
    margin: 1em
    display: inline-block
  
  .console
    display: block
    max-width: 20em
    position: fixed
    margin: 5em
    right: 0
    bottom: 0
    color: $dark

  button, select, option
    border: none
    box-shadow: none 
    background-color: white
    outline: 0
    &:focus
      outline: 0
  
  select
    -webkit-appearance: none
    -moz-appearance: none
    appereance: none
    box-sizing: border-box
    line-height: 1.5em
    padding: 0.5em 3.5em 0.5em 1em
    color: $color
    background-image:
      linear-gradient(45deg, transparent 50%, $color 50%),
      linear-gradient(135deg, $color 50%, transparent 50%),
      linear-gradient(to right, #ccc, #ccc)
    background-position:
      calc(100% - 20px) calc(1em + 2px),
      calc(100% - 15px) calc(1em + 2px),
      calc(100% - 2.5em) 0.5em
    background-size:
      5px 5px,
      5px 5px,
      1px 1.5em;
    background-repeat: no-repeat
  
  button.btn 
    padding: .5em 2em
    font-size: 1em
  
  button.btn, select
    border: lightness($color,35%) solid 1px
    box-shadow: $sh
    border-radius: 0.25em
    color: $color
    font-weight:bold
    background-color: white
  
  #app
    text-align:center
  
  .dialog-drag
    min-width: 10em
    background-color: #e6eee9
    box-shadow: 2px 2px 1px rgba(0,0,0,.5)

// Dialog style 1

.dialog-1.dialog-drag
  border: $color dashed 2px
  background-color: white
  .dialog-header
    background-color: transparent
    button.close
      color: $color
    .dialog-title
      display:none

// style 1 drag disabled
.dialog-drag.dialog-1.fixed
  border: $color solid 2px

// Dialog style 2

.dialog-2.dialog-drag
  border-color: $color
  
  .dialog-header
    background-color: $color
    color: white 
    button.close
      color: white

// Dialog style 3

.dialog-3.dialog-drag
  border: none
  background-color: lightness($color2,97%)
  animation-name: dialog-3-anim
  .dialog-header
    background-color: $color2
    color: white 
    button.close
      color:  lightness($color2,90%)
      text-shadow: none
      &:hover
        color: white
        text-shadow: $sh

// style 3 drag disabled
.dialog-drag.dialog-3.fixed
  maring: 2em
  outline: $color 2px dashed
  outline-offset: .25em

@keyframes dialog-3-anim
  0%
    opacity: 0
    transform: scaleX(.1) scaleX(3)
  100%
    opacity: 1

</style>

