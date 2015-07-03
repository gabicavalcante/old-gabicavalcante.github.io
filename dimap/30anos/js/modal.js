function overlay() {
	el = document.getElementById("overlay");
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}

function close() {
    document.getElementById("overlay").style.visibility = 'hidden';
}
