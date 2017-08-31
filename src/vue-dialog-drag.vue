<template lang="pug">
  .dialog-drag(
    :id='id'
    :draggable='drag'
    :class='(!drag) ? "fixed":""'
    :style='dialogStyle'
    @click='focus'
    @dragstart.stop='dragStart'
    @touchstart.prevent='touchStart'
    @touchmove.stop='touchMove'
    @touchend.stop='touchEnd'
    @dragend.prevent='dragEnd'
    ) 
    .dialog-header(@dragstart.stop='')
      .title
        //- Title slot
        slot(name='title')
          //- render title prop, if title slot has not content
          span(v-if='title') {{title}}
          span(v-else) &nbsp
      .buttons
        //- Pin Button
        button.pin(v-if='buttonPin' @click='setDrag' @touchstart='setDrag' :title='(drag) ? "Disable drag" : "Enable drag"')
          slot(name="button-pin")
        //- Close Button
        button.close(v-if='buttonClose' @click='close' @touchstart='close')
          slot(name="button-close")
    //- default slot
    .dialog-body(@dragstart.stop='')
      slot
        .blank-body

</template>
<script>
export default {
  name: 'dialog-drag',
  props: ['id', 'title', 'options'],
  data () {
    return {
      width: 0,
      height: 0,
      zIndex: 0,
      offset: {
        x: 0,
        y: 0
      },
      left: 0,
      top: 0,
      buttonClose: true,
      buttonPin: true,
      dragEnabled: true,
      drag: true,
      touch: null,
      overEvent: null,
      centered: false
    }
  },
  created () {
    this.setOptions(this.options)
  },
  mounted () {
    this.width = this.$el.clientWidth
    this.height = this.$el.clientHeight
    // on dragend, firefox always returns 0 in clientX and clientY
    window.addEventListener('dragover', this.dragOver)
    if (this.centered) {
      let vm = this
      this.$nextTick(() => {
        vm.center()
        vm.emit('load')
      })
    } else {
      this.emit('load')
    }
  },
  beforeDestroy () {
    window.removeEventListener('dragover', this.dragOver)
  },
  watch: {
    options (newValue) {
      this.setOptions(newValue)
      if (newValue.centered) this.center()
    }
  },
  computed: {
    dialogStyle () {
      let style = { left: this.left + 'px', top: this.top + 'px' }
      if (this.width) style.width = this.width + 'px'
      if (this.height) style.height = this.height + 'px'
      if (this.zIndex) style['z-index'] = this.zIndex
      return style
    }
  },
  methods: {
    dragOver (event) {
      this.overEvent = event
      this.emit('move')
    },
    close () {
      this.emit('close', this.id)
    },
    setDrag () {
      if (this.dragEnabled) {
        this.drag = !this.drag
      }
    },
    dragStart (event) {
      if (this.drag && this.dragEnabled) {
        event.dataTransfer.setData('text', event.target.id)
        this.startMove(event)
      }
    },
    dragEnd (event) {
      this.move(event)
      this.emit('drag-end')
    },
    touchStart (event) {
      this.emit('focus')
      this.startMove(event.targetTouches[0])
    },
    touchMove (event) {
      this.move(event.targetTouches[0])
    },
    touchEnd (event) {
      this.emit('dragEnd')
    },
    emit (eventName, data) {
      data = data || {
        id: this.id,
        left: this.left,
        top: this.top,
        x: this.left,
        y: this.top,
        z: this.zIndex,
        width: this.width,
        height: this.height
      }
      this.$emit(eventName, data)
    },
    move (event) {
      if (this.drag && this.dragEnabled) {
        if (event.clientX === 0) event = this.overEvent // for firefox
        this.left = parseInt(event.clientX + this.offset.x)
        this.top = parseInt(event.clientY + this.offset.y)
        this.emit('move')
      }
    },
    startMove (event) {
      let x = this.left - event.clientX
      let y = this.top - event.clientY
      this.offset = { x, y }
      this.emit('drag-start')
    },
    focus (event) {
      this.emit('focus')
    },
    center (ww, wh) {
      ww = ww || this.$parent.$el.clientWidth
      wh = wh || this.$parent.$el.clientHeight
      let x = (ww / 2) - (this.width / 2)
      let y = (wh / 2) - (this.height / 2)
      this.left = x
      this.top = y
    },
    setOptions (options) {
      if (options) {
        if (options.x) options.left = options.x
        if (options.y) options.top = options.y
        let ops = ['left', 'top', 'width', 'height', 'buttonPin', 'buttonClose', 'centered'] // available options
        for (let op of ops) {
          if (this.options.hasOwnProperty(op)) {
            this.$set(this, op, this.options[op])
          }
        }
      }
    }
  }
}
</script>
<style lang="stylus">
@import 'vars.styl'

.dialog-drag
  z-index: 101
  width: auto
  position: absolute
  border: $color solid 2px
  background-color: white
  box-shadow: $sh
  height: auto
  animation-duration: 0.2s
  animation-name: dialog-anim
  animation-timing-function: ease-in
    
  .dialog-header
    position:relative
    text-align: left
    padding: .25em 3em .25em 1em
    width: auto
    font-size: 0.9em
    background-color: $color
    color: white
    
    .buttons 
      position: absolute
      right: 0
      top:0
      margin: .25em .25em 0 0
      z-index: 105

    button.close, button.pin
      background: transparent
      box-shadow: none
      border:none
      color: white
      
      &:hover
        color: $color2 
      
    button.close
      &:after
        content: '✖'
    button.pin 
      &:after
        content: '🔓'   
  
  .dialog-body
    padding: 1em   

.dialog-drag.fixed
  border-color: $color2
  user-select: auto 
  
  button.pin 
    font-weight: bold
    &:after
      content: '🔒'

@keyframes dialog-anim
  0%
    opacity: 0
    transform: scaleX(.1) 
  50%
    transform:   rotate(1deg)
  100%
    opacity: 1  

</style>
