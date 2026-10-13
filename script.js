// Keep the hero stable while mobile browser controls expand and collapse.
if (!CSS.supports("height", "100svh")) {
  const syncViewportHeight = () => {
    document.documentElement.style.setProperty("--viewport-height", `${window.innerHeight}px`);
  };
  syncViewportHeight();
  window.addEventListener("resize", syncViewportHeight, { passive: true });
}
