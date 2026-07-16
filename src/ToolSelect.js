export class ToolSelect {
    constructor(options = []){
        const changedEvent = new Event("change");
        const selectContainer = document.createElement("div");
        selectContainer.classList.add("toolselect");
        this.root = selectContainer;
        this.selectedBtn = document.createElement("button");
        this.selectedBtn.classList.add("toolselect-selected");
        this.selectedIcon = document.createElement("img");
        this.selectedBtn.append(this.selectedIcon);
        this.selectedIcon.src = options.length > 0 ? options[0].icon : "";
        this.value = options.length > 0 ? options[0].value : "";
        this.selectedBtn.addEventListener("click", () => {
            selectContainer.dispatchEvent(new CustomEvent("selected", {
                detail: {
                    value: this.value
                }
            }));
        })

        const moreBtn = document.createElement("button");
        moreBtn.classList.add("toolselect-more");
        const moreIcon = document.createElement("img");
        moreBtn.append(moreIcon);
        moreIcon.src = "/chevron-down.svg";
        selectContainer.append(this.selectedBtn, moreBtn);

        const menu = document.createElement("div");
        menu.classList.add("toolselect-menu");
        for (const option of options){
            const optionBtn = document.createElement("button");
            const optionLabel = document.createElement("span");
            optionLabel.innerText = option.label;
            const optionIcon = document.createElement("img");
            optionIcon.src = option.icon;
            optionBtn.append(optionIcon, optionLabel);
            menu.append(optionBtn);

            optionBtn.addEventListener("click", () => {
                this.root.dispatchEvent(new CustomEvent("change", {
                    detail: {
                        value: option.value
                    }
                }))
                this.value = option.value;
                this.selectedIcon.src = option.icon;
                menu.classList.toggle("open", false);
            })
        }

        selectContainer.append(menu);

        moreBtn.addEventListener("click", () => {
            menu.classList.toggle("open");
        })

        this.addEventListener = this.root.addEventListener.bind();
    }

    
}