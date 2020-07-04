time_icon_url = 'https://wiki.factorio.com/images/Time_icon.png'

icon_height = "32" // px
icon_width = "32" // px

function build() {
    var inputs = parseInt(document.getElementById("inputs").value)
    var outputs = parseInt(document.getElementById("outputs").value)
    var add_time = document.getElementById("add_time").checked 
    console.log("inputs=%d outputs=%d add_time=%s", inputs, outputs, add_time)

    if (add_time == true) {
        var element = document.getElementById("build_area");
        var para = document.createElement("div");
        para.className = "factorio-icon";
        para.style.backgroundColor = "#999";

        sub_para = document.createElement("IMG");
        sub_para.src = time_icon_url;
        sub_para.height = icon_height;
        sub_para.width = icon_width;
        para.appendChild(sub_para);

        text_para = document.createElement("div");
        text_para.className = "factorio-icon-text"
        text_para.innerHTML = "10" // time
        para.appendChild(text_para);

        element.appendChild(para);
    }
    
}

