<template lang="pug">
  .dialog-drag(
    :id='id'
    :draggable='drag && dropEnabled'
    :class='(!drag) ? "fixed":""'
    :style='dialogStyle'
    @click='focus'
    @dragstart.stop='dragStart'
    @mousedown='mouseDown'
    @mousemove='mouseMove'
    @mouseup.prevent='mouseUp'
    @touchstart.prevent='touchStart'
    @touchmove.stop='touchMove'
    @touchend.stop='touchEnd'
    @dragend.prevent='dragEnd'
    ) 
    .dialog-header(@dragstart.stop='')
      .title
        //- Title slot
        slot(name='title')
          //- render title prop, if title slot is empty
          span(v-if='title') {{title}}
          span(v-else) &nbsp
      .buttons
        //- Pin Button
        button.pin(v-if='buttonPin' @click='setDrag' @touchstart='setDrag')
          //- Button pin slot
          slot(name="button-pin" v-if='drag')
          //- Buton pinned slot
          slot(name="button-pinned" v-if='!drag')
             //- Render button-pin slot if button-pinned slot is empty
             slot(name="button-pin" v-if='!drag')
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
  props: ['id', 'title', 'options', 'eventCb'],
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
      centered: false,
      dropEnabled: true,
      dragging: false,
      availableOptions: [
        'left',
        'top',
        'width',
        'height',
        'buttonPin',
        'buttonClose',
        'centered',
        'dropEnabled'
      ]
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
    if (!this.dropEnabled) {
      window.addEventListener('mouseover', this.mouseOver)
    }
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
    if (!this.dropEnabled) {
      window.removeEventListener('mouseover', this.mouseOver)
    }
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
      if (this.drag) style['user-select'] = 'none'
      return style
    }
  },
  methods: {
    dragOver (event) {
      if (this.dropEnabled) {
        this.overEvent = event
        this.emit('move')
      }
    },
    mouseOver (event) {
      setTimeout(this.mouseMove(event), 100)
    },
    close () {
      this.emit('close')
    },
    setDrag () {
      if (this.dragEnabled) {
        this.drag = !this.drag
        this.emit('pin')
      }
    },
    dragStart (event) {
      if (this.drag && this.dragEnabled && this.dropEnabled) {
        event.dataTransfer.setData('text', event.target.id)
        this.startMove(event)
      }
    },
    dragEnd (event) {
      if (this.dropEnabled) {
        this.move(event)
        this.emit('drag-end')
      }
    },
    mouseDown (event) {
      if (!this.dropEnabled) {
        if (this.drag) event.preventDefault()
        this.emit('focus')
        this.startMove(event)
      }
    },
    mouseMove (event) {
      if (!this.dropEnabled && this.dragging && this.drag) {
        event.preventDefault()
        event.stopPropagation()
        setTimeout(this.move(event), 100)
      }
    },
    mouseUp (event) {
      if (!this.dropEnabled) {
        this.dragging = false
        this.emit('dragEnd')
      }
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
      this.dragging = false
    },
    emit (eventName, data) {
      data = data || {
        id: this.id,
        left: this.left,
        top: this.top,
        x: this.left,
        y: this.top,
        z: this.zIndex,
        pinned: !this.drag,
        width: this.width,
        height: this.height
      }
      if (this.eventCb) {
        let ef = this.eventCb
        if (ef && typeof (ef) === 'function') {
          data = ef(data)
        } else {
          console.warn('Error: eventCb prop must be a function')
        }
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
    clearSelection () {
      if (document.selection) {
        document.selection.empty()
      } else if (window.getSelection) {
        window.getSelection().removeAllRanges()
      }
    },
    startMove (event) {
      let x = this.left - event.clientX
      let y = this.top - event.clientY
      this.offset = { x, y }
      this.dragging = true
      this.emit('drag-start')
    },
    focus (event) {
      if (this.drag) this.clearSelection()
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
        this.drag = (this.options.pinned) ? false : this.drag
        // available options
        let ops = this.availableOptions
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
