'use strict';

// Size in pixels
const icon_height = "32";
const icon_width = "32";

// Variable to store the currently edited icon element
let currentlyEditedIcon = null;

let build_area;

const IconType = {
    Input: 'input',
    Output: 'output',
    Middle: 'middle',
};

function BuildIconElement(icon_url, count, icon_type, emoji) {
    console.log("Adding %s Icon (count=%s, url=%s, emoji=%s)", icon_type, count, icon_url, emoji || "")
    var icon_elem = document.createElement("div");
    icon_elem.className = "factorio-icon";
    icon_elem.style.backgroundColor = "#999"; // Placeholder style
    icon_elem.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default click behavior
        event.stopPropagation(); // Stop the event from bubbling up
        const clickedIcon = event.currentTarget; // Get the clicked icon element
        currentlyEditedIcon = clickedIcon; // Store the clicked icon element

        const editFrame = document.getElementById('editFrame');
        document.getElementById('imageUrl').value = clickedIcon.querySelector('img') ? clickedIcon.querySelector('img').src : '';
        const emojiSpan = clickedIcon.querySelector('.factorio-icon-emoji');
        document.getElementById('emoji').value = emojiSpan ? emojiSpan.textContent : '';
        document.getElementById('count').value = clickedIcon.querySelector('.factorio-icon-text').textContent;
        editFrame.style.display = 'block'; // Show the edit frame
        editFrame.dataset.editingIcon = clickedIcon.dataset.iconId; // Store the ID of the icon being edited
    });

    // Add drag and drop event listeners
    icon_elem.addEventListener('dragover', function (event) {
        event.preventDefault(); // Prevent default behavior to allow dropping
        event.currentTarget.style.border = '2px dashed #000'; // Add visual indicator
    });

    icon_elem.addEventListener('dragleave', function (event) {
        event.currentTarget.style.border = 'none'; // Remove visual indicator
    });

    icon_elem.addEventListener('drop', function (event) {
        event.preventDefault(); // Prevent default behavior
        event.currentTarget.style.border = 'none'; // Remove visual indicator
        handleDroppedImage(event.dataTransfer.files[0], event.currentTarget);
    });


    if (icon_url) {
        const img_elem = document.createElement("IMG");
        img_elem.src = icon_url;
        img_elem.height = icon_height;
        img_elem.width = icon_width;
        icon_elem.appendChild(img_elem);
    } else if (emoji) {
        const emoji_elem = document.createElement("span");
        emoji_elem.className = "factorio-icon-emoji";
        emoji_elem.textContent = emoji;
        icon_elem.appendChild(emoji_elem);
    }

    const text_elem = document.createElement("div");
    text_elem.className = "factorio-icon-text"
    text_elem.append(count);
    icon_elem.appendChild(text_elem);

    icon_elem.dataset.iconType = icon_type;
    icon_elem.dataset.iconId = Date.now() + Math.random(); // Assign a unique ID
    return icon_elem
}

function handleDroppedImage(file, targetIconElement) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            setIconImage(targetIconElement, e.target.result);
        };
        reader.readAsDataURL(file); // Read the image file as a data URL
    } else {
        console.log("Dropped item is not an image file.");
    }
}

function imageFile(event) {
    console.log("New image file:" + event.target.files[0].name);
    const imageUrl = URL.createObjectURL(event.target.files[0]);
    const countInput = document.getElementById('count').value;
    currentlyEditedIcon.querySelector('.factorio-icon-text').textContent = countInput;

    setIconImage(currentlyEditedIcon, imageUrl);
    event.target.value = ''; // Clear the file input
    closeEditFrame();
}

function setIconEmoji(iconElement, emoji) {
    const existingImg = iconElement.querySelector('img');
    if (existingImg) iconElement.removeChild(existingImg);
    let span = iconElement.querySelector('.factorio-icon-emoji');
    if (emoji) {
        if (!span) {
            span = document.createElement('span');
            span.className = 'factorio-icon-emoji';
            iconElement.insertBefore(span, iconElement.querySelector('.factorio-icon-text'));
        }
        span.textContent = emoji;
    } else if (span) {
        iconElement.removeChild(span);
    }
}

function setIconImage(iconElement, url) {
    const span = iconElement.querySelector('.factorio-icon-emoji');
    if (span) iconElement.removeChild(span);
    let img_elem = iconElement.querySelector('img');
    if (url) {
        if (!img_elem) {
            img_elem = document.createElement('IMG');
            img_elem.height = icon_height;
            img_elem.width = icon_width;
            iconElement.insertBefore(img_elem, iconElement.querySelector('.factorio-icon-text'));
        }
        img_elem.src = url;
    } else if (img_elem) {
        iconElement.removeChild(img_elem);
    }
}

function closeEditFrame() {
    document.getElementById('editFrame').style.display = 'none';
    document.getElementById('imageUrl').value = '';
    document.getElementById('emoji').value = '';
    currentlyEditedIcon = null;
}

function updateIcon() {
    console.log("Updating icon");
    if (!currentlyEditedIcon) return;

    const newImageUrl = document.getElementById('imageUrl').value;
    const newEmoji = document.getElementById('emoji').value.trim();
    const newCount = document.getElementById('count').value;

    currentlyEditedIcon.querySelector('.factorio-icon-text').textContent = newCount;
    if (newEmoji) {
        setIconEmoji(currentlyEditedIcon, newEmoji);
    } else {
        setIconImage(currentlyEditedIcon, newImageUrl);
    }

    closeEditFrame();
    console.log("Icon updated");
}

function initIcon() {
    if (!currentlyEditedIcon) return;
    console.log("Initializing icon");

    setIconImage(currentlyEditedIcon, "");
    setIconEmoji(currentlyEditedIcon, "");
    currentlyEditedIcon.querySelector('.factorio-icon-text').textContent = "1";

    closeEditFrame();
}

function Reset() { // build_area must be defined
    build_area.appendChild(BuildIconElement("", "1", IconType.Input));
    build_area.append("→");
    build_area.appendChild(BuildIconElement("", "1", IconType.Output));
}

function getArrowNode() {
    for (const node of build_area.childNodes) {
        if (node.textContent === "→") return node;
    }
    return null;
}

function countIconsOfType(icon_type) {
    return build_area.querySelectorAll(`.factorio-icon[data-icon-type="${icon_type}"]`).length;
}

function AddIcon(icon_type) {
    const newIcon = BuildIconElement("", "1", icon_type);

    if (icon_type === IconType.Input) {
        const arrow = getArrowNode();
        // First input never gets a leading '+'; subsequent ones do.
        if (countIconsOfType(IconType.Input) > 0) {
            build_area.insertBefore(document.createTextNode("+"), arrow);
        }
        build_area.insertBefore(newIcon, arrow);
    } else if (icon_type === IconType.Output) {
        if (countIconsOfType(IconType.Output) > 0) {
            build_area.appendChild(document.createTextNode("+"));
        }
        build_area.appendChild(newIcon);
    } else {
        console.log("%s is not a valid option", icon_type);
    }
}

function RemoveIcon(icon_type) {
    if (icon_type !== IconType.Input && icon_type !== IconType.Output) {
        console.log("%s is not a valid option", icon_type);
        return;
    }
    if (countIconsOfType(icon_type) <= 1) {
        console.log("Cannot remove last %s icon.", icon_type);
        return;
    }

    const nodes = build_area.childNodes;
    if (icon_type === IconType.Input) {
        // Find the first '+' followed by an input icon and remove both,
        // so the leading input (which has no preceding '+') is preserved.
        for (let i = 0; i < nodes.length - 1; i++) {
            const node = nodes[i];
            const next = nodes[i + 1];
            if (node.textContent !== "+") continue;
            if (!next.classList || !next.classList.contains('factorio-icon')) continue;
            if (next.dataset.iconType !== IconType.Input) continue;
            build_area.removeChild(node);
            build_area.removeChild(nodes[i]); // next, now shifted to i
            return;
        }
    } else {
        // Find the first output icon, remove it and the following '+' if any,
        // so the trailing outputs collapse cleanly.
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (!node.classList || !node.classList.contains('factorio-icon')) continue;
            if (node.dataset.iconType !== IconType.Output) continue;
            build_area.removeChild(node);
            const next = nodes[i];
            if (next && next.textContent === "+") build_area.removeChild(next);
            return;
        }
    }
}

function captureBuildArea() {
    const buildArea = document.getElementById('build_area');
    // html2canvas ignores CSS `zoom`, so temporarily clear it and render at
    // an equivalent resolution via the `scale` option instead.
    const scale = parseFloat(buildArea.style.zoom) || 1;
    const originalZoom = buildArea.style.zoom;
    buildArea.style.zoom = '';
    return html2canvas(buildArea, { useCORS: true, backgroundColor: null, scale: scale })
        .finally(function () {
            buildArea.style.zoom = originalZoom;
        });
}

function generateImageAndDownload() {
    captureBuildArea().then(function (canvas) {
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');

        link.href = dataURL;
        link.download = 'crafty_recipe.png';
        link.dispatchEvent(new MouseEvent('click'));
    });
}

function generateImage() {
    captureBuildArea().then(function (canvas) {
        const dataURL = canvas.toDataURL();
        const img = document.getElementById('resultImage');
        if (img) {
            img.src = dataURL;
        }
    });
}

function setupScaling() {
    let currentScale = 1; // 1: 1x, 1.5: 1.5x, 2: 2x
    const scaleButton = document.getElementById('scaleMainArea');
    const buildArea = document.getElementById('build_area');

    if (!scaleButton || !buildArea) return;

    scaleButton.addEventListener('click', function () {
        if (currentScale === 1) {
            currentScale = 1.5;
        } else if (currentScale === 1.5) {
            currentScale = 2;
        } else { // currentScale === 2
            currentScale = 1;
        }
        scaleButton.textContent = currentScale + 'x';
        // CSS zoom (unlike transform: scale) actually affects layout, so
        // build_area's parent grows with it and sibling buttons stay
        // adjacent. No need to track widths manually.
        buildArea.style.zoom = currentScale;
    });
}

function showVersion() {
    fetch('package.json')
        .then(response => response.json())
        .then(data => {
            const versionElem = document.getElementById('version');
            if (versionElem) {
                versionElem.textContent = 'Version ' + data.version;
            }
        })
        .catch(error => console.error('Could not load version:', error));
}

function setupEmojiPicker() {
    const wrapper = document.getElementById('emojiPickerWrapper');
    const toggle = document.getElementById('emojiPickerToggle');
    const picker = wrapper ? wrapper.querySelector('emoji-picker') : null;
    const emojiInput = document.getElementById('emoji');
    if (!wrapper || !toggle || !picker || !emojiInput) return;

    toggle.addEventListener('click', function () {
        wrapper.style.display = wrapper.style.display === 'none' ? 'block' : 'none';
    });

    picker.addEventListener('emoji-click', function (event) {
        emojiInput.value = event.detail.unicode;
        wrapper.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', function () {
    build_area = document.getElementById("build_area");
    Reset();

    document.querySelectorAll('[data-add]').forEach(btn => {
        btn.addEventListener('click', () => AddIcon(btn.dataset.add));
    });
    document.querySelectorAll('[data-remove]').forEach(btn => {
        btn.addEventListener('click', () => RemoveIcon(btn.dataset.remove));
    });

    document.getElementById('imageFile').addEventListener('change', imageFile);
    document.getElementById('updateIcon').addEventListener('click', updateIcon);
    document.getElementById('initIcon').addEventListener('click', initIcon);
    document.getElementById('generateImage').addEventListener('click', generateImage);
    document.getElementById('saveImage').addEventListener('click', generateImageAndDownload);

    setupEmojiPicker();
    setupScaling();
    showVersion();
});

