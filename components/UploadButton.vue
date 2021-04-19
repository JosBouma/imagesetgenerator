<template>
  <label class="upload-button">
    <span>Or choose a file:</span>
    <input type="file" @change="handleUpload">
  </label>
</template>

<style scoped>
.upload-button {
  display: block;
  margin: 20px 0;
  background: #555;
  color: #fff;
  padding: 20px 10px;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    handleUpload(evt: Event) {
      this.$store.commit('setUpload', ((evt.target as HTMLInputElement).files as FileList)[0]);
    },
  }
})
</script>
