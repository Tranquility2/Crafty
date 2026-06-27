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
    document.getElementById('emoji').value = '';
    event.target.value = ''; // Clear the file input
    document.getElementById('editFrame').style.display = 'none'; // Hide the edit frame
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

function updateIcon() {
    console.log("Updating icon");
    if (currentlyEditedIcon) {
        const imageUrlInput = document.getElementById('imageUrl');
        const emojiInput = document.getElementById('emoji');
        const countInput = document.getElementById('count').value;
        const newImageUrl = imageUrlInput.value;
        const newEmoji = emojiInput.value.trim();

        currentlyEditedIcon.querySelector('.factorio-icon-text').textContent = countInput;

        if (newEmoji) {
            setIconEmoji(currentlyEditedIcon, newEmoji);
        } else {
            setIconImage(currentlyEditedIcon, newImageUrl);
        }

        document.getElementById('editFrame').style.display = 'none';
        currentlyEditedIcon = null; // Clear the reference
        imageUrlInput.value = ''; // Clear the URL input
        emojiInput.value = ''; // Clear the emoji input
        console.log("Icon updated");
    }
}

function initIcon() {
    if (currentlyEditedIcon) {
        console.log("Initializing icon");
        // Clear any image or emoji visual
        setIconImage(currentlyEditedIcon, "");
        setIconEmoji(currentlyEditedIcon, "");

        // Reset the count to 1
        const text_elem = currentlyEditedIcon.querySelector('.factorio-icon-text');
        text_elem.textContent = "1";

        document.getElementById('editFrame').style.display = 'none';
        document.getElementById('imageUrl').value = ''; // Clear the URL input
        document.getElementById('emoji').value = ''; // Clear the emoji input
        currentlyEditedIcon = null; // Clear the reference
    }
}

function Reset() { // build_area must be defined
    build_area.appendChild(BuildIconElement("", "1", IconType.Input));
    build_area.append("→");
    build_area.appendChild(BuildIconElement("", "1", IconType.Output));
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
        build_area.insertBefore(BuildIconElement("", "1", IconType.Input), build_area.childNodes[arrowIndex]);
        // Insert the '+' before the newly added input icon, but only if it's not the first element
        if (arrowIndex > 0) {
            build_area.insertBefore(document.createTextNode("+"), build_area.childNodes[arrowIndex]);
        }
    } else if (icon_type == IconType.Output) {
        // Insert the '+' before the output icon if it's not the last element
        build_area.appendChild(document.createTextNode("+"));
        build_area.appendChild(BuildIconElement("", "1", IconType.Output));
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
    const updateButton = document.getElementById('updateIcon');
    updateButton.addEventListener('click', updateIcon);

    const generateImageButton = document.getElementById('generateImage');
    generateImageButton.addEventListener('click', generateImage);

    const saveImageButton = document.getElementById('saveImage');
    saveImageButton.addEventListener('click', generateImageAndDownload);

    const initiButton = document.getElementById('initIcon');
    initiButton.addEventListener('click', initIcon);

    setupEmojiPicker();
    setupScaling();
    showVersion();
});

