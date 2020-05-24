export function PreventDefaultWindowDragDropEvents() {
  window.addEventListener("dragover", function (e) {
    e.preventDefault();
  }, false);
  window.addEventListener("drop", function (e) {
    e.preventDefault();
  }, false);
}
