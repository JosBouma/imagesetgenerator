import JSZip from "jszip";

function calcSet(amount, min, max) {
  const ret = [];
  if (min >= max) {
    return [min];
  }
  if (max > 8000) {
    throw new Error("Image dimensions are too large !?");
  }
  const step = (max - min) / (amount - 1);
  for (let i = 0; i < amount; i++) {
    ret.push(Math.round(min + step * i));
  }
  return ret;
}

function createImgBlob(canvas, ctx, img, width, height, fileType, quality) {
  return new Promise((resolve, reject) => {
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    canvas.toBlob((blob) => {
      resolve(blob);
    }, fileType, quality);
  });
}

function calcHeight(targetWidth, naturalWidth, naturalHeight) {
  return Math.round(targetWidth * (naturalHeight / naturalWidth));
}

export const state = () => ({
  filePrefix: "image",
  folderPrefix: "~assets/images/",
  sizes: calcSet(5, 100, 700),
  imageCount: 5,
  maxWidth: 700,
  maxHeight: -1,
  minWidth: 100,
  naturalWidth: -1,
  naturalHeight: -1,
  img: null,
  upload: null,
  objectURL: "",
  pictureElement: '',
  imageQuality: 0.95,
  keepSettings: true,
  zipURL: ""
})

export const mutations = {
  setFilePrefix(state, filePrefix) {
    state.filePrefix = filePrefix;
    URL.revokeObjectURL(state.zipURL);
    state.zipURL = "";
  },
  setFolderPrefix(state, folderPrefix) {
    state.folderPrefix = folderPrefix;
    URL.revokeObjectURL(state.zipURL);
    state.zipURL = "";
  },
  setImageCount(state, imageCount) {
    state.imageCount = imageCount;
    state.sizes = calcSet(state.imageCount, state.minWidth, state.maxWidth);
    URL.revokeObjectURL(state.zipURL);
    state.zipURL = "";
  },
  setMaxWidth(state, maxWidth) {
    state.maxWidth = maxWidth;
    state.maxHeight = calcHeight(maxWidth, state.naturalWidth, state.naturalHeight);
    state.sizes = calcSet(state.imageCount, state.minWidth, state.maxWidth);
    URL.revokeObjectURL(state.zipURL);
    state.zipURL = "";
  },
  setMinWidth(state, minWidth) {
    state.minWidth = minWidth;
    state.sizes = calcSet(state.imageCount, state.minWidth, state.maxWidth);
    URL.revokeObjectURL(state.zipURL);
    state.zipURL = "";
  },
  setImg(state, img) {
    state.naturalWidth = img.naturalWidth;
    state.naturalHeight = img.naturalHeight;
    if(!state.keepSettings) {
      state.maxWidth = state.naturalWidth;
    }
    state.maxHeight = calcHeight(state.maxWidth, state.naturalWidth, state.naturalHeight);
    state.sizes = calcSet(state.imageCount, state.minWidth, state.maxWidth);
    state.img = img;
    URL.revokeObjectURL(state.zipURL);
    state.zipURL = "";
  },
  setUpload(state, upload) {
    state.upload = upload;
    URL.revokeObjectURL(state.zipURL);
    URL.revokeObjectURL(state.objectURL);
    state.zipURL = "";
    state.objectURL = URL.createObjectURL(upload);
  },
  setPictureElement(state, pictureElement) {
    state.pictureElement = pictureElement;
  },
  setImageQuality(state, imageQuality) {
    state.imageQuality = imageQuality;
    URL.revokeObjectURL(state.zipURL);
    state.zipURL = "";
  },
  setKeepSettings(state, keepSettings) {
    state.keepSettings = keepSettings;
  },
  setZipURL(state, zipURL) {
    state.zipURL = zipURL;
  }
}

export const actions = {
  async generateZip({ state, commit }) {
    const zip = new JSZip();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const widths = state.sizes;

    if(!state.upload) {
      return;
    }

    for (let i = 0, c = widths.length; i < c; i++) {
      zip.file(
        state.filePrefix + (i + 1) + ".webp",
        await createImgBlob(
          canvas,
          ctx,
          state.img,
          widths[i],
          calcHeight(widths[i], state.naturalWidth, state.naturalHeight),
          "image/webp",
          state.imageQuality
        )
      );
      zip.file(
        state.filePrefix + (i + 1) + ".jpg",
        await createImgBlob(
          canvas,
          ctx,
          state.img,
          widths[i],
          calcHeight(widths[i], state.naturalWidth, state.naturalHeight),
          "image/jpeg",
          state.imageQuality
        )
      );
    }

    zip.file(
      "HTMLPictureElement.txt",
      state.pictureElement
    );

    return commit("setZipURL", URL.createObjectURL(await zip.generateAsync({ type: "blob" })));
  }
}
