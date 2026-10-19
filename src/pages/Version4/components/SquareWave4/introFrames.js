const framesContext = require.context(
  "../../../../assets/splashanimation_frames",
  false,
  /\.png$/,
);

const sortedKeys = framesContext
  .keys()
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

let loadedFrames = null;
let loadPromise = null;

function resolveFrameSrc(key) {
  const mod = framesContext(key);
  return mod && mod.default ? mod.default : mod;
}

export function loadIntroFrames() {
  if (loadedFrames) return Promise.resolve(loadedFrames);
  if (loadPromise) return loadPromise;

  const urls = sortedKeys.map(resolveFrameSrc);

  loadPromise = Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          if (typeof Image === "undefined") {
            resolve(src);
            return;
          }

          const img = new Image();
          img.onload = () => resolve(src);
          img.onerror = () => resolve(src);
          img.src = src;
        }),
    ),
  ).then((frames) => {
    loadedFrames = frames;
    return frames;
  });

  return loadPromise;
}

export function getIntroFrames() {
  return loadedFrames;
}

export function resetIntroFramesCache() {
  loadedFrames = null;
  loadPromise = null;
}
