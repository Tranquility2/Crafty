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
        // Find the index of the "→"
        let arrowIndex = -1;
        for (let i = 0; i < build_area.childNodes.length; i++) {
            if (build_area.childNodes[i].textContent === "→") {
                arrowIndex = i;
                break;
            }
        }
        build_area.insertBefore(BuildIconElement(icon_url = "", count = "1", icon_type = IconType.Input), build_area.childNodes[arrowIndex]);
        // Insert the '+' before the newly added input icon, but only if it's not the first element
        if (arrowIndex > 0) {
            build_area.insertBefore(document.createTextNode("+"), build_area.childNodes[arrowIndex]);
        }
    } else if (icon_type == IconType.Output) {
        // Find the index of the "→"
        let arrowIndex = -1;
        for (let i = 0; i < build_area.childNodes.length; i++) {
            if (build_area.childNodes[i].textContent === "→") {
                arrowIndex = i;
                break;
            }
        }
        // Insert the '+' before the output icon if it's not the last element
        build_area.appendChild(document.createTextNode("+"));
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
        // Find the first instance of a '+' followed by an input icon and remove both
        for (let i = 0; i < build_area.childNodes.length; i++) {
            const node = build_area.childNodes[i];
            // Check if the current node is a '+' and the next node is an input icon
            if (node.textContent === "+" && i + 1 < build_area.childNodes.length &&
                build_area.childNodes[i + 1].classList && build_area.childNodes[i + 1].classList.contains('factorio-icon') &&
                build_area.childNodes[i + 1].dataset.iconType === IconType.Input) {
                // Remove the '+'
                build_area.removeChild(node);
                // Remove the input icon (which is now at index i)
                build_area.removeChild(build_area.childNodes[i]);
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