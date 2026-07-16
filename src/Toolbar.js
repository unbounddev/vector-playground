export class Toolbar {
  constructor(parent){
    this.container = document.createElement('div');
    this.container.classList.add("toolbar-container");
    this.el = document.createElement('div');
    this.parent = parent;
    this.el.classList.add("toolbar");
    this.container.append(this.el);
    this.parent.append(this.container);

    const fillColor = document.createElement("div");
    fillColor.classList.add("color-picker");
    const strokeColor = document.createElement("div");
    strokeColor.classList.add("color-picker");
    const strokeInner = document.createElement("div");
    strokeInner.classList.add("color-picker-stroke");
    strokeColor.append(strokeInner);

    const fillPicker = document.createElement("input");
    fillPicker.type = "color";
    fillColor.append(fillPicker);

    fillColor.addEventListener("click", () => {
      fillPicker.click();
    });

    fillPicker.addEventListener("change", (e) => {
      document.documentElement.style.setProperty("--fill-color", e.target.value);
    })

    const strokePicker = document.createElement("input");
    strokePicker.type = "color";
    strokeColor.append(strokePicker);

    strokeColor.addEventListener("click", () => {
      strokePicker.click();
    });

    strokePicker.addEventListener("change", (e) => {
      document.documentElement.style.setProperty("--stroke-color", e.target.value);
    })
    this.el.append(fillColor);
    this.el.append(strokeColor);
  }
}