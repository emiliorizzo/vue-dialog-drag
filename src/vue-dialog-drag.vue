<template lang="pug">
  .dialog-drag(
    :draggable='drag'
    :class='(!drag) ? "fixed":""'
    :style='dialogStyle'
    @dragstart.stop='dragStart'
    @touchstart='touchStart'
    @touchmove.prevent='touchMove'
    @touchend.stop='touchEnd'
    @dragend='dragEnd'
    @dblclick='setDrag'
    ) 
    .dialog-header
      .dialog-title
        //- Title slot
        slot(name='title')
          //- optional title if not slot title
          span(v-if='title') {{title}}
      button.close(@click='close' @touchstart='close')
    //- default slot
    .dialog-body
      slot
        .blank-body

</template>
<script>
export default {
  name: 'dialog-drag',
  props: ['id', 'title', 'options', 'events'],
  data () {
    return {
      width: 0,
      height: 0,
      offset: {
        x: 0,
        y: 0
      },
      left: 0,
      top: 0,
      dragEnabled: true,
      drag: true,
      touch: null,
      overEvent: null,
      dialog: {
        left: 0,
        top: 0
      }
    }
  },
  created () {
    if (this.options) {
      let ops = ['left', 'top', 'width', 'height'] // available options
      for (let op of ops) {
        if (this.options[op]) {
          this.$set(this, op, this.options[op])
        }
      }
    }
  },
  mounted () {
    this.width = this.$el.clientWidth
    this.height = this.$el.clientHeight
    // on dragend, firefox always returns 0 in clientX and clientY
    window.addEventListener('dragover', this.dragOver)
  },
  beforeDestroy () {
    window.removeEventListener('dragover', this.dragOver)
  },
  computed: {
    dialogStyle () {
      let style = { left: this.left + 'px', top: this.top + 'px' }
      if (this.width) style.width = this.width + 'px'
      if (this.height) style.height = this.height + 'px'
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
        // start drag in firefox
        event.dataTransfer.setData('text/plain', null)
        this.startMove(event)
      }
    },
    dragEnd (event) {
      this.move(event)
      this.emit('dragEnd')
    },
    touchStart (event) {
      this.startMove(event.targetTouches[0])
    },
    touchMove (event) {
      this.move(event.targetTouches[0])
    },
    touchEnd (event) {
      this.emit('dragEnd')
    },
    emit (eventName, data) {
      // events prop, conditional emition
      let emitEvent = (undefined === this.events || this.events[eventName] === undefined) ? true : this.events[eventName]
      if (emitEvent) {
        if (!data) data = { id: this.id, left: this.left, top: this.top }
        this.$emit(eventName, data)
      }
    },
    move (event) {
      if (this.drag && this.dragEnabled) {
        if (event.clientX === 0) event = this.overEvent // for firefox
        this.left = event.clientX + this.offset.x
        this.top = event.clientY + this.offset.y
        this.emit('move')
      }
    },
    startMove (event) {
      let x = this.left - event.clientX
      let y = this.top - event.clientY
      this.offset = { x, y }
      this.emit('dragStart')
    }
  }
}
</script>
<style lang="stylus">
$color = #1aad8d
$color2 = #e59e0d

.dialog-drag
  z-index: 101
  width: auto
  position: absolute
  border: $color solid 2px
  background-color: white
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
    
    button.close
      position:absolute
      right: 0
      top:0
      margin: .25em .25em 0 0
      background: transparent
      box-shadow: none
      border:none
      color: white
      z-index: 105
      text-shadow: 1px 1px 1px  rgba(0,0,0,.5), 1px 1px 1px  rgba(0,0,0,.5)
      &:after
        content: '✖'
      &:hover
        color: $color2  
  .dialog-body
    padding: 1em   

.dialog-drag.fixed
  border-color: $color2

@keyframes dialog-anim
  0%
    opacity: 0
    transform: scaleX(.1) 
  50%
    transform:   rotate(1deg)
  100%
    opacity: 1  

</style>
