time_icon_url = 'https://wiki.factorio.com/images/Time_icon.png'

// Size in pixels
icon_height = "32"
icon_width = "32"

build_area = document.getElementById("build_area");


function BuildIconElement(icon_url="", count="") {
    var div_elem = document.createElement("div");
    div_elem.className = "factorio-icon";
    div_elem.style.backgroundColor = "#999";

    if (icon_url) {
        img_elem = document.createElement("IMG");
        img_elem.src = icon_url;
        img_elem.height = icon_height;
        img_elem.width = icon_width;
        div_elem.appendChild(img_elem);

        text_elem = document.createElement("div");
        text_elem.className = "factorio-icon-text"
        text_elem.innerHTML = count // time
        div_elem.appendChild(text_elem);
    }

    return div_elem
}

function AddEmptyIcon() {
    build_area.appendChild(BuildIconElement());
    console.log("Added empty icon");
}

function CleanBuildArea() {
    build_area.innerHTML =""
}

function CreateBuild() {
    var inputs = parseInt(document.getElementById("inputs").value)
    var outputs = parseInt(document.getElementById("outputs").value)
    var add_time = document.getElementById("add_time").checked 
    console.log("inputs=%d outputs=%d add_time=%s", inputs, outputs, add_time)
    // Do we need to cleanup
    if (build_area.innerHTML) {
        CleanBuildArea()
    }
    // Add time only if requested
    if (add_time) {
        build_area.appendChild(BuildIconElement(time_icon_url, "10"));
        build_area.innerHTML += "+";
    }
    
    for (i = 0; i < inputs; i++) {
        build_area.appendChild(BuildIconElement());
        if (i < inputs - 1) {
            build_area.innerHTML += "+";
        }
    }

    build_area.innerHTML += "→";

    for (i = 0; i < outputs; i++) {
        build_area.appendChild(BuildIconElement());
        if (i < outputs - 1) {
            build_area.innerHTML += "+";
        }
    }
    
}
