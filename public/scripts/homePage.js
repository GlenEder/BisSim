//set onload for document
window.addEventListener('load', displayBusinessName)

let currentBusiness = null

async function displayBusinessName () {
    let display = document.getElementById("businessName")

    //get current business 
    let bId = localStorage.getItem('busId')

    let body = JSON.stringify({"businessID": bId})
    let result = await fetch('/getBusiness', {method: 'post', headers: {'Content-Type': 'application/json'}, body})
    let dataReceived = await result.json()
    let busData = dataReceived.result

    if(busData) {
        //create business object 
        currentBusiness = new Business(busData)
        display.innerHTML = currentBusiness.name
    }
    else {
        showError("Could not retreive business")
        location.href = '/'
    }
}

//renders employee table on home page
async function viewEmployees () {
    getBusinessEmployees(currentBusiness.id, result => {
        listEmployees(result)
    })
}

//confirms deletion of business
function confirmBusinessDelete () {
    if(confirm("Press OK to continue with deletion.\nThis will remove all employees including the owner.")) {
        deleteBusiness(localStorage.getItem('empId'), currentBusiness.id, result => {
            alert(result);
            if(result.includes("SUCCESS")) { location.href = '/'}
        })
    }
}