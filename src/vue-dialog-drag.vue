<template lang="pug">
  .dialog-drag(
    :id='id'
    :draggable='drag'
    :class='(!drag) ? "fixed":""'
    :style='dialogStyle'
    @mousedown='mouseDown'
    @touchstart.prevent='touchStart'
    @touchmove.passive='touchMove'
    @touchend.stop='touchEnd'
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
        button.close(v-if='buttonClose' @click.stop='close' @touchstart.passive='close')
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
      dragCursor: 'default',
      dragging: false,
      clickButton: false,
      pX: 0,
      pY: 0,
      availableOptions: [
        'left',
        'top',
        'width',
        'height',
        'buttonPin',
        'buttonClose',
        'centered',
        'dropEnabled',
        'dragCursor',
        'zIndex'
      ]
    }
  },
  created () {
    this.setOptions(this.options)
  },
  mounted () {
    if (this.dropEnabled) {
      this.$el.addEventListener('dragstart', this.dragStart)
      this.$el.addEventListener('dragend', this.dragEnd)
      window.addEventListener('dragover', this.dragOver)
    } else {
      document.addEventListener('mousemove', this.mouseMove, { passive: true })
      document.addEventListener('mouseup', this.mouseUp)
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
    if (this.dropEnabled) {
      window.removeEventListener('dragover', this.dragOver)
    } else {
      document.removeEventListener('mousemove', this.mouseMove)
      document.removeEventListener('mouseup', this.mouseUp)
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
      if (this.zIndex) style.zIndex = this.zIndex
      if (this.drag) {
        style['user-select'] = 'none'
        style.cursor = this.dragCursor
      }
      return style
    }
  },
  methods: {
    mouseOut (event) {
      if (!this.dragEnabled && this.dragging) {
        this.move(event)
      }
    },
    dragOver (event) {
      if (this.dropEnabled) {
        this.overEvent = event
        this.emit('move')
      }
    },
    mouseOver (event) {
      setTimeout(this.mouseMove(event), 50)
    },
    close () {
      this.clickButton = 'close'
      this.emit('close')
    },
    setDrag () {
      if (this.dragEnabled) {
        this.drag = !this.drag
        this.emit('pin')
      }
    },
    dragStart (event) {
      event.stopPropagation()
      if (this.drag && this.dragEnabled && this.dropEnabled) {
        event.dataTransfer.setData('text', event.target.id)
        this.startMove(event)
      }
    },
    dragEnd (event) {
      event.preventDefault()
      if (this.dropEnabled) {
        this.move(event)
        this.emit('drag-end')
      }
    },
    mouseDown (event) {
      if (!this.dragging) this.focus()
      if (!this.dropEnabled) {
        if (this.drag) event.preventDefault()
        this.startMove(event)
      }
    },
    mouseMove (event) {
      // event.preventDefault()
      if (!this.dropEnabled && this.dragging && this.drag) {
        // event.stopPropagation()
        setTimeout(this.move(event), 50)
      }
    },
    mouseUp (event) {
      event.preventDefault()
      if (!this.dropEnabled) {
        this.stopMove()
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
      this.stopMove()
    },
    stopMove () {
      this.dragging = false
      this.pX = 0
      this.pY = 0
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
        width: this.$el.clientWidth,
        height: this.$el.clientHeight
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
        if (event && event.clientX && event.clientY) {
          let x = event.clientX
          let y = event.clientY
          this.left = (x + this.offset.x)
          this.top = (y + this.offset.y)
          this.dragging++
          this.emit('move')
        }
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
      this.dragging = 1
      this.emit('drag-start')
    },
    focus (event) {
      if (this.drag) this.clearSelection()
      let vm = this
      setTimeout(() => {
        if (!vm.clickButton) vm.emit('focus')
      }, 200)
    },
    center () {
      let ww, wh
      if (this.centered === 'window') {
        ww = window.innerWidth
        wh = window.innerHeight
      }
      if (this.centered === 'viewport') {
        let body = document.body
        ww = body.clientWidth + body.scrollLeft
        wh = body.clientHeight + body.scrollTop
      }
      ww = ww || this.$parent.$el.clientWidth
      wh = wh || this.$parent.$el.clientHeight
      this.left = (ww / 2) - (this.$el.clientWidth / 2)
      this.top = (wh / 2) - (this.$el.clientHeight / 2)
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
