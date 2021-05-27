<template>
  <pre class="pre">
&lt;picture&gt;
  &lt;source sizes=&quot;(max-width: {{ maxWidth }}px) 100vw, {{ maxWidth }}px&quot; srcset=&quot;{{ setSrcWebp }}&quot; type=&quot;image/webp&quot;&gt;
  &lt;source sizes=&quot;(max-width: {{ maxWidth }}px) 100vw, {{ maxWidth }}px&quot; srcset=&quot;{{ setSrcJpeg }}&quot; type=&quot;image/jpeg&quot;&gt;
  &lt;img alt=&quot;&quot; loading=&quot;lazy&quot; width=&quot;{{ imgWidth }}&quot; height=&quot;{{ imgHeight() }}&quot; sizes=&quot;(max-width: {{ maxWidth }}px) 100vw, {{ maxWidth }}px&quot; src=&quot;{{ folderPrefix }}{{ filePrefix }}{{ imageCount }}.jpg&quot;&gt;
&lt;/picture&gt;
  </pre>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  computed: {
    imgWidth(): number {
      return this.$store.state.maxWidth;
    },
    // imgHeight(): number {
    //   return this.$store.state.maxHeight;
    // },
    maxWidth(): number {
      return this.$store.state.maxWidth;
    },
    filePrefix(): string {
      return this.$store.state.filePrefix;
    },
    folderPrefix(): string {
      return this.$store.state.folderPrefix;
    },
    imageCount(): number {
      return this.$store.state.imageCount;
    },
    setSrcWebp(): string {
      return this.formatSrcSet("webp");
    },
    setSrcJpeg(): string {
      return this.formatSrcSet("jpg");
    },
  },
  methods: {
    formatSrcSet(extension: string): string {
      const widths = this.$store.state.sizes;
      const ret: string[] = [];
      for (let i = 0, c = widths.length; i < c; i++) {
        ret[i] = `${this.$store.state.folderPrefix}${this.$store.state.filePrefix}${i + 1}.${extension} ${
          widths[i]
        }w`;
      }
      return ret.join(",");
    },
    imgHeight() {
      console.log(this.$store.state.maxHeight);
      return this.$store.state.maxHeight;
    }
  },
  // mounted() {
  //   this.$store.commit("setPictureElement", this.$el.textContent);
  // },
  watch: {
    setSrcWebp() {
      this.$store.commit("setPictureElement", this.$el.textContent);
    }
  }
})
</script>

<style scoped>
.pre {
  font-size: 0.6rem;
  white-space: pre-wrap;       /* css-3 */
  white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
  white-space: -pre-wrap;      /* Opera 4-6 */
  white-space: -o-pre-wrap;    /* Opera 7 */
  word-wrap: break-word;       /* Internet Explorer 5.5+ */
  border: solid 1px #555;
  padding: 5px;
  margin-bottom: 20px;
  font-weight: 700;
}
</style>
