import { INPUT_MODES, SVG_NS } from "./utils";
import { state } from "./state";

export class SVGPanel {
    constructor(parent){
        this.parent = parent;
        this.el = document.createElementNS(SVG_NS, "svg");
        this.el.classList.add("svgPanel");

        window.addEventListener("resize", () => {
            this.resize();
        });

        this.el.addEventListener("pointerdown", e => this.handlePointerDown(e))

        const observer = new MutationObserver(this.handleChildrenMutation)

        observer.observe(this.el, {
            childList: true,
            subtree: true
        })

        this.parent.append(this.el);
        this.resize();
    }

    resize() {
        let dimensions = this.el.getBoundingClientRect()
        this.el.setAttribute("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`)
    }

    handleChildrenMutation(mutationsList, observer){
        for (const mutation of mutationsList){
            if (mutation.type == "childList"){
                const childrenChangeEvent = new Event("childrenchange")
                mutation.target.dispatchEvent(childrenChangeEvent)
            }
        }
    }

    handlePointerDown(e) {
        const inputMode = state.inputMode;

        switch (inputMode) {
            case INPUT_MODES.RECT:
                this.handleRect(e);
                break;
            case INPUT_MODES.ELLIPSE:
                this.handleEllipse(e);
                break;
        }
        
    }

    handleRect(e){
        let startX = e.clientX;
        let startY = e.clientY;
        let fillColor = document.documentElement.style.getPropertyValue("--fill-color");
        let strokeColor = document.documentElement.style.getPropertyValue("--stroke-color");
        fillColor = fillColor ? fillColor : "none";
        strokeColor = strokeColor ? strokeColor : "none";
        
        let rect = document.createElementNS(SVG_NS, "rect")
        rect.setAttribute("stroke", strokeColor == "none" & fillColor == "none" ? "black" : strokeColor)
        rect.setAttribute("fill", fillColor)
        rect.setAttribute("x", `${startX}`)
        rect.setAttribute("y", `${startY}`)
        this.el.append(rect)

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
            rect.setAttribute("stroke", strokeColor);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        }
        
        window.addEventListener('pointermove', onPointerMove)
        window.addEventListener('pointerup', onPointerUp)
    }

    handleEllipse(e){
        let startX = e.clientX;
        let startY = e.clientY;
        let fillColor = document.documentElement.style.getPropertyValue("--fill-color");
        let strokeColor = document.documentElement.style.getPropertyValue("--stroke-color");
        fillColor = fillColor ? fillColor : "none";
        strokeColor = strokeColor ? strokeColor : "none";

        let ellipse = document.createElementNS(SVG_NS, "ellipse")
        ellipse.setAttribute("stroke", strokeColor == "none" & fillColor == "none" ? "black" : strokeColor)
        ellipse.setAttribute("fill", fillColor)
        ellipse.setAttribute("cx", `${startX}`)
        ellipse.setAttribute("cy", `${startY}`)
        ellipse.setAttribute("rx", `0`)
        ellipse.setAttribute("ry", `0`)
        this.el.append(ellipse)

        function onPointerMove(moveE){
            let moveX = moveE.clientX;
            let moveY = moveE.clientY;

            if (moveE.shiftKey){
                const distance = Math.sqrt(
                    ((moveX-startX)**2)+
                    ((moveY-startY)**2)
                )
                ellipse.setAttribute("cx", `${(startX+moveX)/2}`);
                ellipse.setAttribute("cy", `${(startY+moveY)/2}`);
                ellipse.setAttribute("rx", `${distance/2}`);
                ellipse.setAttribute("ry", `${distance/2}`);
            } else {
                ellipse.setAttribute("cx", `${(startX+moveX)/2}`);
                ellipse.setAttribute("cy", `${(startY+moveY)/2}`);
                ellipse.setAttribute("rx", `${Math.abs(moveX-startX)/2}`);
                ellipse.setAttribute("ry", `${Math.abs(moveY-startY)/2}`);
            }
        }

        function onPointerUp(upE){
            ellipse.setAttribute("stroke", strokeColor);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        }
        
        window.addEventListener('pointermove', onPointerMove)
        window.addEventListener('pointerup', onPointerUp)
    }
}