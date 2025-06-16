time_icon_url = 'https://wiki.factorio.com/images/Time_icon.png'

// Size in pixels
icon_height = "32"
icon_width = "32"

var IconType = {
    Input: 'input',
    Output: 'output',
    Middle: 'middle',
};

function BuildIconElement(icon_url, count, icon_type) {
    console.log("Adding %s Icon (count=%s, url=%s)", icon_type, count, icon_url)
    var icon_elem = document.createElement("div");
    icon_elem.className = "factorio-icon";
    icon_elem.style.backgroundColor = "#999";
    icon_elem.onclick = function() {
        alert('t')
    };

    if (icon_url) {
        img_elem = document.createElement("IMG");
        img_elem.src = icon_url;
        img_elem.height = icon_height;
        img_elem.width = icon_width;
        icon_elem.appendChild(img_elem);
    }

    text_elem = document.createElement("div");
    text_elem.className = "factorio-icon-text"
    text_elem.append(count);
    icon_elem.appendChild(text_elem);

    icon_elem.dataset.iconType = icon_type;
    return icon_elem
}

function Reset() { // build_area must be defined
    build_area.appendChild(BuildIconElement(icon_url = "", count = "1", icon_type = IconType.Input));
    build_area.append("→");
    build_area.appendChild(BuildIconElement(icon_url = "", count = "1", icon_type = IconType.Output));
}

function AddIcon(icon_type) {
    if (icon_type == IconType.Input) {
        build_area.prepend("+")
        build_area.prepend(BuildIconElement(icon_url = "", count = "1", icon_type = IconType.Input));
    } else if (icon_type == IconType.Output) {
        build_area.append("+");
        build_area.appendChild(BuildIconElement(icon_url = "", count = "1", icon_type = IconType.Output));
    } else {
        console.log("%s is not a valid option", icon_type)
    }
}

function RemoveIcon(icon_type) {
    let iconElements = build_area.querySelectorAll('.factorio-icon');
    let inputCount = 0;
    let outputCount = 0;

    // Count current inputs and outputs
    for (let i = 0; i < iconElements.length; i++) {
        const node = iconElements[i];
        if (node.dataset.iconType === IconType.Input) {
            inputCount++;
        } else if (node.dataset.iconType === IconType.Output) {
            outputCount++;
        }
    }

    if (icon_type === IconType.Input) {
        if (inputCount <= 1) {
            console.log("Cannot remove last input icon.");
            return; // Prevent removal
        }
        // Find the last input icon and remove it
        for (let i = build_area.childNodes.length - 1; i >= 0; i--) {
            const node = build_area.childNodes[i];
            if (node.classList && node.classList.contains('factorio-icon') && node.dataset.iconType === IconType.Input) {
                build_area.removeChild(node);
                if (i > 0 && build_area.childNodes[i - 1].textContent === "+") {
                    build_area.removeChild(build_area.childNodes[i - 1]);
                }
                break;
            }
        }
    } else if (icon_type === IconType.Output) {
        if (outputCount <= 1) {
            console.log("Cannot remove last output icon.");
            return; // Prevent removal
        }
        // Find the first output icon and remove it
        for (let i = 0; i < build_area.childNodes.length; i++) {
            const node = build_area.childNodes[i];
            if (node.classList && node.classList.contains('factorio-icon') && node.dataset.iconType === IconType.Output) {
                build_area.removeChild(node);
                if (i < build_area.childNodes.length && build_area.childNodes[i].textContent === "+") {
                    build_area.removeChild(build_area.childNodes[i]);
                }
                break;
            }
        }
    } else {
        console.log("%s is not a valid option", icon_type);
    }
}

build_area = document.getElementById("build_area");
Reset();