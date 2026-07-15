import './style.css'

const svgContainer = document.querySelector(".svgContainer");
const svgWrapper = document.querySelector(".svgWrapper");
const sidebar = document.querySelector(".sidebar");
const SVG_NS = "http://www.w3.org/2000/svg";


function resizeSVGWrapper() {
    let dimensions = svgWrapper.getBoundingClientRect()
    svgWrapper.setAttribute("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`)
}

resizeSVGWrapper()

window.addEventListener("resize", () => {
    resizeSVGWrapper()
})

svgWrapper.addEventListener("pointerdown", e => {
    let startX = e.clientX;
    let startY = e.clientY;
    
    let rect = document.createElementNS(SVG_NS, "rect")
    rect.setAttribute("stroke", "black")
    rect.setAttribute("fill", "transparent")
    rect.setAttribute("x", `${startX}`)
    rect.setAttribute("y", `${startY}`)
    svgWrapper.append(rect)

    function onPointerMove(moveE){
        let moveX = moveE.clientX;
        let moveY = moveE.clientY;

        if (moveX < startX){
            rect.setAttribute("x", `${moveX}`)
            rect.setAttribute("width", `${startX-moveX}`)
            
        } else {
            rect.setAttribute("width", `${moveX-startX}`)
        }

        if (moveY < startY){
            rect.setAttribute("y", `${moveY}`)
            rect.setAttribute("height", `${startY-moveY}`)
            
        } else {
            rect.setAttribute("height", `${moveY-startY}`)
        }
    }

    function onPointerUp(upE){
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
    }
    
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

})

const svgObserver = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList){
        if (mutation.type == "childList"){
            const childrenChangeEvent = new Event("childrenchange")
            mutation.target.dispatchEvent(childrenChangeEvent)
        }
    }
})

svgObserver.observe(svgWrapper, {
    childList: true,
    subtree: true
})

function reactiveStore(target){
    let subscribed = new Map();
    const store = new Proxy({
        ...target,
        subscribe(key, callback) {
            if (!subscribed.has(key)){
                subscribed.set(key, [])
            }

            subscribed.get(key).push(callback)
        }, 
    },
    {
        set(target, key, newValue, receiver) {
            const result = Reflect.set(target, key, newValue)

            if (subscribed.has(key)){
                subscribed.get(key).forEach(cb => cb(receiver, key))
            }
            
            return result;
        }
    })

    return store
}

let selectedElement = reactiveStore({ el: null });

class Tree {
    constructor(){
        this.el = document.createElement("div");
        sidebar.append(this.el)

        svgWrapper.addEventListener("childrenchange", () => this.render());
        this.render();
    }

    render(){
        this.el.replaceChildren()
        for (const child of svgWrapper.children){
            const childDiv = document.createElement("div");
            childDiv.innerText = child.tagName;
            
            this.el.append(childDiv)
        }
    }
}

class PropertiesPanel {
    constructor(el){
        this.panel = document.createElement("div");
        this.el = el;
        el.subscribe("el", (obj, key) => {
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

const tree = new Tree()
const propPanel = new PropertiesPanel(selectedElement);

