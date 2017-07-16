<template lang="pug">
  #app      
    .menu-container

      //- Droparea
      .droparea(ref='droparea' 
        @drop.stop='drop' 
        @dragover.prevent='dragEnter' 
        @dragleave='dragLeave' 
        @dragend='dragEnd')
        .over(v-if='isOver')
          .icon(v-html='icons.download')
        
        //- Dropped dialogs
        small(v-if='!isOver && !droppeds.length') Drop dialog here 
        
        //- Dialogs
        .dropped(v-for='dialog in droppeds' @click='unDrop(dialog.id)')
          .icon(v-html='icons.dialog')
          .name {{dialog.name}}
      small(v-if='droppeds.length') 
        em Click an icon to restore dialog
      
      //- Menu
      .menu
        .title
          h1 Vue Draggable Dialog
        button.btn(@click='newDialog(style)') new dialog
        .set
          label Dialog Style:  
          select(v-model='style')
            option(:value='null') random
            option(v-for='(style,key) in styles' :value='key') {{style.name}}
    //-Links
    ul.links
        li
          a(href='asas')
            .icon(v-html='icons.gitHub')
            span.link GitHub
    
    //- Console
    .console(v-if='selected')
      p Dialog Selected
      small {{selected}}

    
    .dialogs
      dialog-drag(v-for='dialog,key in dialogs' 
        :class='dialog.style.name'
        :key='dialog.id' 
        :id='dialog.id' 
        :ref='"dialog-" + dialog.id'
        @close='removeDialog' 
        @dragEnd='dialogDragEnd'
        @dragStart='selectDialog'
        @move='dialogDragEnd'
        :options='dialog.options')
        
        span(slot='title') {{ dialog.name }}  
        p {{dialog.content}}
        small
          strong Style: {{dialog.style.name}}
          p
            strong options:
          p  
            small 
              em {{dialog.options}}
</template>


<script>
import DialogDrag from '../vue-dialog-drag.vue'
import rndText from './randomText.js'
import ghIcon from '!!raw-loader!../assets/github.svg'
import browserIcon from '!!raw-loader!../assets/browser.svg'
import dialogIcon from '!!raw-loader!../assets/dialog.svg'
import downloadIcon from '!!raw-loader!../assets/download.svg'

export default {
  name: 'example',
  components: {
    DialogDrag
  },
  data () {
    return {
      dialogs: [],
      dialogId: 1,
      styles: [
        { name: 'dialog-1', options: { width: 400 } },
        { name: 'dialog-2', options: { width: 150, buttonPin: false } },
        { name: 'dialog-3' }
      ],
      style: null,
      selected: null,
      dialogWidth: 400,
      isOver: false,
      droppeds: [],
      icons: {
        gitHub: ghIcon,
        browser: browserIcon,
        download: downloadIcon,
        dialog: dialogIcon
      }
    }
  },
  created () {
    for (let i = 0; i < this.styles.length; i++) {
      let index = this.newDialog(i) - 1
      this.dialogs[index].options.left = (index * this.dialogWidth) + 50 * index + 1
    }
  },
  methods: {
    drop (event) {
      this.isOver = false
      let id = event.dataTransfer.getData('text')
      let index = this.findDialog(id)
      if (index !== null) {
        this.droppeds.push(this.dialogs[index])
        this.dialogs.splice(index, 1)
      }
    },
    dragEnter (event) {
      this.isOver = true
    },
    dragLeave (event) {
      this.isOver = false
    },
    dragEnd (event) {
      event.target.classList.remove('over')
    },
    unDrop (id) {
      let index = this.findDialog(id, this.droppeds)
      if (index !== null) {
        this.dialogs.push(this.droppeds[index])
        this.droppeds.splice(index, 1)
      }
    },
    newDialog (sId) {
      if (sId === null) sId = Math.floor(Math.random() * this.styles.length)
      return this.dialogs.push(this.dialog(this.styles[sId]))
    },
    removeDialog (id) {
      let index = this.findDialog(id)
      this.dialogs.splice(index, 1)
      if (this.selected && this.selected.id === id) this.selected = null
    },
    findDialog (id, dialogs) {
      if (!dialogs) dialogs = this.dialogs
      let index = dialogs.findIndex((val) => {
        return val.id === id
      })
      return (index > -1) ? index : null
    },
    dialog (style) {
      let id = String(this.dialogId)
      this.dialogId++
      let name = 'Dialog ' + id
      let content = rndText()
      let options = {}
      if (style.options) options = Object.assign({}, style.options)
      if (!options.left) options.left = 30 * id
      if (!options.top) options.top = 30 * id
      return { id, name, content, style, options }
    },
    dialogDragEnd (obj) {
      let index = this.findDialog(obj.id)
      this.$set(this.dialogs[index].options, 'left', obj.left)
      this.$set(this.dialogs[index].options, 'top', obj.top)
    },
    selectDialog (obj) {
      let index = this.findDialog(obj.id)
      this.selected = this.dialogs[index]
    }
  }
}
</script>
<style lang="stylus">
@import '../vars.styl'
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
  a
   color: $color
   &:hover
    color:$color2
   &:visited
    color: $color
     
  .menu-container
    position:fixed
    bottom: 0
    z-index:50
    margin: 5em
    width: 25em
    max-width: 25em

  .menu
    border: $dark 1px solid
    border-top-width: 10px
    border-bottom-width: 5px
    padding: 1em 2em
    background-color: $color
    color: white
    box-shadow: $sh
    margin-top: 1em
  
  .links
    margin: 1em 5em 0 0
    position: absolute
    list-style: none
    top: 0
    right: 0

  .icon      
    svg
      padding: 0.1em
      background-color: white
      border-radius: 50%
      display: inline-block
      width: 3em
      height: 3em
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
    user-select: none

  .droparea, .over
    display: flex
    justify-content: center
    align-items: center
    flex-wrap: wrap
  
  .droparea
    position: relative
    border: $gray dotted 2px
    min-height: 10em
    text-align: center
    margin-bottom: .5em
    small
      color: $gray

  .over
    background-color: alpha($color2,.5)
    width: 100%
    height: 100%
    position:absolute
    top: 0
    left: 0
    z-index: 105
    pointer-events: none

  .dropped
    border: $color dashed 1px
    margin: .125em
    background-color: white
    cursor: pointer
    &:hover 
      border-color: $color2
      .icon svg
        fill: $color2
    .name
      font-size: .6em
      margin: 0 .5em .25em .5em
    .icon, .icon svg
      margin: 0
      padding: 0
    .icon svg
      fill: $color
      background: transparent

// general dialog style  
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
    .buttons button
      color: $color
    .title
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
    .buttons button
      color: white

// Dialog style 3

.dialog-3.dialog-drag
  border: none
  background-color: lightness($color2,97%)
  animation-name: dialog-3-anim
  .dialog-header
    background-color: $color2
    color: white 
    .buttons button
      color:  lightness($color2,90%)
      text-shadow: none
      &:hover
        color: white
        text-shadow: $sh

// style 3 drag disabled
.dialog-drag.dialog-3.fixed
  margin: 2em
  outline: $color 2px dashed
  outline-offset: .25em

@keyframes dialog-3-anim
  0%
    opacity: 0
    transform: scaleX(.1) scaleX(3)
  100%
    opacity: 1

</style>

