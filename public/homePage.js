//set onload for document
window.addEventListener('load', displayBusinessName)

function displayBusinessName () {
    let display = document.getElementById("businessName")
    display.innerHTML = "Your Business Home"
}