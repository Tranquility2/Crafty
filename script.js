time_icon_url = 'https://wiki.factorio.com/images/Time_icon.png'

// Size in pixels
icon_height = "32"
icon_width = "32"

var IconType = {
    Input: 'input',
    Output: 'output',
};

build_area = document.getElementById("build_area");
Reset();

function BuildIconElement(icon_url, count, icon_type) {
    console.log("Adding %s Icon (count=%s, url=%s)", icon_type, count, icon_url)
    var icon_elem = document.createElement("div");
    icon_elem.className = "factorio-icon";
    icon_elem.style.backgroundColor = "#999";
    icon_elem.onclick = function() {alert('t')};

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

    return icon_elem
}

function Reset() {
    build_area.appendChild(BuildIconElement(icon_url="", count="1", icon_type=IconType.Input));
    build_area.append("→");
    build_area.appendChild(BuildIconElement(icon_url="", count="1", icon_type=IconType.Output));
}

function AddIcon(icon_type) {
    if (icon_type==IconType.Input) {
        build_area.prepend("+")
        build_area.prepend(BuildIconElement(icon_url="", count="1", icon_type=IconType.Input));
    } else if (icon_type==IconType.Output) {
        build_area.append("+");
        build_area.appendChild(BuildIconElement(icon_url="", count="1", icon_type=IconType.Output));
    } else {
        console.log("%s is not a valid option", icon_type)
    }
}
