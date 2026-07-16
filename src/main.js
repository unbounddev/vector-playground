import './style.css'
import { SVGPanel } from './SVGPanel';
import { Toolbar } from './Toolbar';
import { state } from './state';
// Required for exported svg
// <?xml version="1.0" encoding="utf-8"?>
// <svg xmlns="http://www.w3.org/2000/svg"

const svgContainer = document.querySelector(".svgContainer");
const svgPanel = (new SVGPanel(svgContainer)).el;
const sidebar = document.querySelector(".sidebar");

class SVGTree {
    constructor(){
        this.el = document.createElement("div");
        sidebar.append(this.el)

        svgPanel.addEventListener("childrenchange", () => this.render());
        this.render();
    }

    render(){
        this.el.replaceChildren()
        for (const child of svgPanel.children){
            const childDiv = document.createElement("div");
            childDiv.innerText = child.tagName;
            
            this.el.append(childDiv)
        }
    }
}

class PropertiesPanel {
    constructor(){
        this.panel = document.createElement("div");
        
        state.subscribe("selected", (obj, key) => {
            let selected = obj[key]

            if (selected.tagName == "SVG"){
                createSVGForm(this.panel, selected)
            }
        })
    }
}

function createSVGForm(panel, el){
    const form = document.createElement("form");
    const heightLabel = document.createElement("label");
    heightLabel.innerText = "Height";
    const widthLabel = document.createElement("label");
    widthLabel.innerText = "Width";

    panel.append(el)

}

const tree = new SVGTree()
const propPanel = new PropertiesPanel();
const toolbar = new Toolbar(svgContainer);

