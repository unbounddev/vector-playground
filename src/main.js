import './style.css'
import { SVGPanel } from './SVGPanel';
import { Toolbar } from './Toolbar';
import { state } from './state';
import { reactiveStore } from './utils';
// Required for exported svg
// <?xml version="1.0" encoding="utf-8"?>
// <svg xmlns="http://www.w3.org/2000/svg"

const svgContainer = document.querySelector(".svgContainer");
const svgPanel = (new SVGPanel(svgContainer)).el;
const sidebar = document.querySelector(".sidebar");

class SVGTree {
    constructor(){
        this.el = document.createElement("div");
        this.el.classList.add("layers")
        sidebar.append(this.el)

        svgPanel.addEventListener("childrenchange", () => this.render());
        this.render();
    }

    render(){
        this.el.replaceChildren()
        for (const child of svgPanel.children){
            const childDiv = document.createElement("div");
            childDiv.classList.add("layer")
            childDiv.innerText = child.tagName;
            if (state.selected == child){
                childDiv.classList.toggle("active", true);
            }

            childDiv.addEventListener("click", () => {
                state.selected = child
                Array.from(this.el.children).forEach((c) => {
                    c.classList.toggle("active", false);
                })
                childDiv.classList.toggle("active", true);
            })
            
            this.el.append(childDiv)
        }
    }
}

class PropertiesPanel {
    constructor(){
        this.panel = document.createElement("div");
        this.panel.classList.add("properties-panel");
        sidebar.append(this.panel);
        
        state.subscribe("selected", (obj, key) => {
            let selected = obj[key];
            this.panel.replaceChildren();
            createPropertiesForm(this.panel, selected);
        })
    }
}

const ATTRIBUTES = {
    rect: [
        { name: "x", type: "text" },
        { name: "y", type: "text" },
        { name: "width", type: "text" },
        { name: "height", type: "text" },
        { name: "rx", type: "text" },
        { name: "ry", type: "text" },
        { name: "fill", type: "text" },
        { name: "stroke", type: "text" },
    ]
}

function createPropertiesForm(panel, el){
    const form = document.createElement("form");
    for (const attribute of ATTRIBUTES[el.tagName]){
        const label = document.createElement("label");
        label.textContent = attribute.name;
        const input = document.createElement("input");
        input.type = attribute.type;
        input.value = el.getAttribute(attribute.name);
        form.append(label, input);
    }

    panel.append(form)
}


const tree = new SVGTree()
const propPanel = new PropertiesPanel();
const toolbar = new Toolbar(svgContainer);

