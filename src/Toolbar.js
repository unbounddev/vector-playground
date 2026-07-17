import { state } from "./state";
import { ToolSelect } from "./ToolSelect";
import { INPUT_MODES } from "./utils";

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
    });

    const selectionOptions = [
      {
        icon: "/hand.svg",
        label: "",
        value: INPUT_MODES.HAND
      },
    ]
    const selectionSelect = new ToolSelect(selectionOptions);
    selectionSelect.root.dataset.inputMode = selectionSelect.value;
    selectionSelect.root.addEventListener("selected", (e) => {
      state.inputMode = e.detail.value;
      selectionSelect.root.dataset.inputMode = e.detail.value;
      selectionSelect.root.classList.toggle("active", true);
    });

    selectionSelect.root.addEventListener("change", (e) => {
      state.inputMode = e.detail.value;
      selectionSelect.root.dataset.inputMode = e.detail.value;
      selectionSelect.root.classList.toggle("active", true);
    })

    const shapeOptions = [
      {
        icon: "/square.svg",
        label: "Rectangle",
        value: INPUT_MODES.RECT
      },
      {
        icon: "/circle.svg",
        label: "Ellipse",
        value: INPUT_MODES.ELLIPSE
      },
      {
        icon: "/slash.svg",
        label: "Line",
        value: INPUT_MODES.LINE
      }
    ]
    const shapeSelect = new ToolSelect(shapeOptions);
    shapeSelect.root.dataset.inputMode = shapeSelect.value;
    shapeSelect.root.addEventListener("selected", (e) => {
      state.inputMode = e.detail.value;
      shapeSelect.root.dataset.inputMode = e.detail.value;
      shapeSelect.root.classList.toggle("active", true);
    });

    shapeSelect.root.addEventListener("change", (e) => {
      state.inputMode = e.detail.value;
      shapeSelect.root.dataset.inputMode = e.detail.value;
      shapeSelect.root.classList.toggle("active", true);
    })

    this.el.append(fillColor, strokeColor, selectionSelect.root, shapeSelect.root);

    state.subscribe("inputMode", () => this.handleInputModeChange());
    // set default tool
    this.handleInputModeChange();
  }

  handleInputModeChange() {
    Array.from(this.el.children).forEach(c => {
          if (c.dataset.inputMode){
            c.classList.toggle("active", state.inputMode == c.dataset.inputMode)
          }
      })
  }
}