//set onload for document
window.addEventListener('load', loadBusiness)

//current business of user
let currentBusiness = null

//loads data from server about current business
async function loadBusiness () {
    //get current business 
    let bId = localStorage.getItem('busId')

    let body = JSON.stringify({"businessID": bId})
    let dataReceived = await fetchServer('/getBusiness', body)
    let busData = dataReceived.result

    if(busData) {
        //create business object 
        currentBusiness = new Business(busData)
    }
    else {
        showError("Could not retreive business")
        location.href = '/'
    }


    //update business name if on home page
    if(location.href.includes('/home')) { displayBusinessName() }
}

//Sets the business name on the home page
function displayBusinessName () {
    let display = document.getElementById("businessName")
    if(display == undefined) { return }                     //check that we're on home page
    display.innerHTML = currentBusiness.name
}

//Calls hire employee under current business ORM
async function handleHire(form) {
    currentBusiness.hireEmployee(form);
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