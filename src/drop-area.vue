<template lang="pug">
.drop-area(ref='droparea' 
  @drop.stop='drop' 
  @dragover.prevent='dragEnter' 
  @dragleave.prevent='dragLeave')
  slot
  .over(v-if='isOver')
    slot(name='over')
  
</template>
<script>
export default {
  name: 'drop-area',
  data () {
    return {
      isOver: false
    }
  },
  methods: {
    drop (event) {
      this.isOver = false
      let id = event.dataTransfer.getData('text')
      this.$emit('drop', id)
    },
    dragEnter (event) {
      this.isOver = true
    },
    dragLeave (event) {
      this.isOver = false
    }
  }
}
</script>
<style lang="stylus">
@import './vars.styl'
  .drop-area, .over
    display: flex
    justify-content: center
    align-items: center
    flex-wrap: wrap
  
  .drop-area
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
</style>

