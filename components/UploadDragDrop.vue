<template>
  <p
    class="dd"
    @dragenter.prevent="noop"
    @dragover.prevent="noop"
    @drop.prevent="handleDrop"
  >
    Drag and drop here
  </p>
</template>

<style scoped>
.dd {
  padding: 40px;
  bordeR: dotted 2px #555;
  text-align: center;
  margin: 20px 0;
  font-weight: 900;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    noop() {},
    handleDrop(evt: DragEvent) {
      this.$store.commit('setUpload', (evt.dataTransfer as DataTransfer).files[0]);
    }
  }
})
</script>
