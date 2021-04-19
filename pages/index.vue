<template>
  <div class="container">
    <h1>Image set generator</h1>
    <form action="">
      <fieldset class="user-input">
        <label>
          <span>Maximum width</span>
          <input v-model.number="maxWidth" type="number" />
        </label>
        <label :class="{ error: minWidthError }">
          <span>Minimum width</span>
          <input v-model.number="minWidth" type="number" />
        </label>
        <label>
          <span>File prefix</span>
          <input v-model="filePrefix" />
        </label>
        <label>
          <span>Folder</span>
          <input v-model="folderPrefix" />
        </label>
        <label>
          <span>Image set count: {{ imageCount }}</span>
          <input
            v-model.number="imageCount"
            type="range"
            min="2"
            max="10"
            step="1"
          />
        </label>
        <label>
          <span>Keep settings: {{ keepSettings ? "yes" : "no" }}</span>
          <input
            v-model.number="keepSettings"
            type="range"
            min="0"
            max="1"
            step="1"
          />
        </label>
        <Label class="image-quality">
          <span>Image quality: {{ imageQuality }}</span>
          <input
            v-model.number="imageQuality"
            type="range"
            min="0"
            max="1"
            step="0.05"
          />
        </Label>
      </fieldset>
      <upload-drag-drop />
      <upload-button />
      <a class="download-button" :class="{ show: zipURL !== '' }" :href="zipURL" @click="handleDownload">
        <span>Generate / download ZIP</span>
        <img v-if="generating" src="~assets/svg/spinner-solid.svg" alt="Loading" class="generating" />
        <img v-if="zipURL !==''" src="~assets/svg/download-solid.svg" alt="Download"/>
        <img v-if="!generating && zipURL ===''" src="~assets/svg/play-circle-solid.svg" alt="Generate" />
      </a>
    </form>
    <picture-pre />
    <p>Current image</p>
    <img class="user-uploaded-img" ref="img" :src="objectURL" alt="Uploaded image" @load="handleImgLoad" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    let minWidthError: boolean = false;
    let generating: boolean = false;
    return {
      minWidthError,
      generating,
    };
  },
  computed: {
    filePrefix: {
      get() {
        return this.$store.state.filePrefix;
      },
      set(value) {
        this.$store.commit("setFilePrefix", value);
      },
    },
    folderPrefix: {
      get() {
        return this.$store.state.folderPrefix;
      },
      set(value) {
        this.$store.commit("setFolderPrefix", value);
      },
    },
    imageCount: {
      get() {
        return this.$store.state.imageCount;
      },
      set(value) {
        this.$store.commit("setImageCount", value);
      },
    },
    maxWidth: {
      get() {
        return this.$store.state.maxWidth;
      },
      set(value) {
        if((value as number) <= this.minWidth) {
          this.minWidthError = true;
        } else {
          this.minWidthError = false;
        }
        this.$store.commit("setMaxWidth", value);
      },
    },
    minWidth: {
      get() {
        return this.$store.state.minWidth;
      },
      set(value) {
        if((value as number) >= this.maxWidth) {
          this.minWidthError = true;
        } else {
          this.minWidthError = false;
        }
        this.$store.commit("setMinWidth", value);
      },
    },
    imageQuality: {
      get() {
        return this.$store.state.imageQuality;
      },
      set(value) {
        this.$store.commit("setImageQuality", value);
      },
    },
    objectURL() {
      return this.$store.state.objectURL;
    },
    keepSettings: {
      get() {
        return this.$store.state.keepSettings;
      },
      set(value) {
        this.$store.commit("setKeepSettings", value);
      },
    },
    zipURL() {
      return this.$store.state.zipURL;
    }
  },
  mounted() {
    this.$store.commit("setImg", this.$refs.img);
  },
  methods: {
    handleImgLoad() {
      this.$store.commit("setImg", this.$refs.img);
    },
    async handleDownload(evt: Event) {
      if(this.zipURL !== "") {
        return true;
      }
      evt.preventDefault();
      this.generating = true;
      await this.$store.dispatch("generateZip");
      this.generating = false;
    }
  }
});
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 10px;
  font-size: 1.25rem;
}

.user-input {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 40px 0;
}

.user-input span {
  font-weight: 700;
}

.user-input input {
  display: block;
  border: solid 1px #555;
  width: 100%;
  padding: 10px;
}

.user-input input[type="range"] {
  padding: 0;
}

.image-quality {
  grid-column: 1 / 3;
}

.download-button {
  display: flex;
  color: red;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.download-button span {
  margin-left: auto;
}

.download-button img {
  width: 30px;
  height: 30px;
  will-change: transform;
  margin-right: auto;
}

.download-button img.generating {
  animation: 1s infinite spin;
}

.download-button.show {
  color: blue;
}

.error,
.error input {
  background: orangered;
  color: #fff;
}

.user-uploaded-img {
  border: solid 1px #555;
  padding: 10px;
  width: 100%;
  height: auto;
}

@keyframes spin {
  from {
    transform:rotate(0deg);
  }
  to {
    transform:rotate(360deg);
  }
}
</style>
