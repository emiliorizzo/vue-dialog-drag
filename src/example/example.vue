<template lang="pug">
  #app      
    .menu-container
      //- Droparea
      drop-area(@drop='drop')
        .icon(v-html='icons.download' slot='over')
        small(v-if='!droppeds.length') Drop dialog here 
        //- Dialogs container
        .dropped(v-for='dialog in droppeds' @click='unDrop(dialog.id)')
          .icon(v-html='icons.dialog')
          .name {{dialog.name}}
        
      //- Restore dialogs message
      small(v-if='droppeds.length') 
        em Click an icon to restore dialog
      
      //- Menu
      .menu
        .title
          h1 {{ app.name }}
          h2.subtitle {{ app.des }}
        button.btn(@click='newDialog(style)') new dialog
        .set
          label Dialog Style:  
          select(v-model='style')
            option(:value='null') random
            option(v-for='(style,key) in styles' :value='key') {{style.name}}
    //-Links
    ul.links
        li
          a(:href='app.repo')
            .icon(v-html='icons.gitHub')
        
    
    //- Console
    .console(v-if='selected')
      p Dialog Selected
      small {{selected}}

    //- DIALOGS
    .dialogs
      dialog-drag(v-for='dialog,key in dialogs' 
        :class='dialog.style.name'
        :key='dialog.id' 
        :id='dialog.id' 
        :ref='"dialog-" + dialog.id'
        @close='removeDialog' 
        @drag-end='dialogDragEnd'
        @drag-start='selectDialog'
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
import DropArea from '../drop-area.vue'
import rndText from './randomText.js'
import ghIcon from '!!raw-loader!../assets/github.svg'
import browserIcon from '!!raw-loader!../assets/browser.svg'
import dialogIcon from '!!raw-loader!../assets/dialog.svg'
import downloadIcon from '!!raw-loader!../assets/download.svg'

export default {
  name: 'example',
  components: {
    DialogDrag,
    DropArea
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
      droppeds: [],
      icons: {
        gitHub: ghIcon,
        browser: browserIcon,
        download: downloadIcon,
        dialog: dialogIcon
      },
      app: APP
    }
  },
  created () {
    for (let i = 0; i < this.styles.length; i++) {
      let index = this.newDialog(i) - 1
      this.dialogs[index].options.left = (index * this.dialogWidth) + 50 * index + 1
    }
  },
  methods: {
    drop (id) {
      let index = this.findDialog(id)
      if (index !== null) {
        this.droppeds.push(this.dialogs[index])
        this.dialogs.splice(index, 1)
      }
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
    removeDialog (dialog) {
      let id = dialog.id
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
@import './html.styl'
  body 
    font-family: 'Asap', sans-serif

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
    .title
      border: 1.5px $lightness
      border-style: dotted none
      padding: .5em 0 
      
      h1, h2
        margin:0 0 .5em 0
      h1
        font-size: 1.7em
        letter-spacing: 0.0325em
        font-family: 'Belgrano', serif
        text-shadow: $sh, $sh
      h2
        font-size: 0.8em
        font-style: italic
       letter-spacing: 0.0625em 
  
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

  #app
    text-align:center
    user-select: none

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

@import '../dialog-styles.styl'

</style>

