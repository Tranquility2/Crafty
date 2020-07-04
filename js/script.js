time_icon_url = 'https://wiki.factorio.com/images/Time.png'

icon_height = 32 // px
icon_width = 32 // px

function build() {
    var inputs = parseInt(document.getElementById("inputs").value)
    var outputs = parseInt(document.getElementById("outputs").value)
    var add_time = document.getElementById("add_time").checked 
    console.log("inputs=%d outputs=%d add_time=%s", inputs, outputs, add_time)
}

