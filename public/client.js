
let loggedIn = false    //current user logged in
let empId = null        //employee id of logged in user


//set onload for document
window.addEventListener('load', showLoggedIn)

//Sets header text to display if user is logged in 
function showLoggedIn() {
    let info = document.getElementById("loginHUD")
    if(loggedIn) {
        info.innerHTML = "Logged in as Employee: " + empId
    }
    else {
        info.innerHTML = "User Not Logged In"
    }
}

//logs in user based on creds
async function login() {

    //logout if user is already logged in
    if(loggedIn) {
        loggedIn = false
        empId = null
        alert("User Logged Out")
        showLoggedIn()
        return
    }

    if(verifyLoginParams()) {
        let empID = document.getElementById("loginEmpID").value
        let busID = document.getElementById("loginBusID").value

        //query server to validate params
        let body = JSON.stringify({
            "empID": empID,
            "busID": busID
        })

        let result = await fetch('/loginUser', {method: 'post', headers: {'Content-Type': 'application/json'}, body})
        let dataReceived = await result.json()

        //login user
        if(dataReceived.result) {
            loggedIn = true
            empId = empID
            showLoggedIn()
        }
        else {
            alert("ERROR: Employee Does Not Exist")
        }
    }
    else {
        alert("ERROR: Enter Name and Employee ID")
    }
}

function verifyLoginParams() {
    let empID = document.getElementById("loginEmpID").value
    let busID = document.getElementById("loginBusID").value
    return empID && busID
}

async function getBusinesses () {
    //Get business list from server
    const options = {
        method: 'POST'
    }
    const result = await fetch('/apiGetBusinesses', options)
    const jsonData = await result.json()

    //create html table for businesses
    let table = document.createElement('table')

    //create table headers
    let theader = table.createTHead()
    let headRow = theader.insertRow()
    let headers = ['OwnerId', 'BusinessId', 'Business Name', 'Year Founded', 'City', 'State', 'Address']
    for(var idex in headers) {
        let th = document.createElement('th')
        let text = document.createTextNode(headers[idex])
        th.appendChild(text)
        headRow.appendChild(th)
    }

    //Fill table with data
    jsonData.data.forEach(element => {
        
        //create entry row
        let row = table.insertRow()

        //fill row with data
        for(var item in element) {
            let cell = row.insertCell()
            let text = document.createTextNode(element[item])
            cell.appendChild(text)
        }
       
    
        //create delete button cell 
        let deleteCell = row.insertCell()
        
        //create the button
        let deleteButton = document.createElement('input')
        deleteButton.type = "button"
        deleteButton.value = "Delete Business"
        deleteButton.addEventListener('click', () => {
            deleteBusiness(element.OwnerId, element.BusId, result => {
                alert(result)
                location.href = '/'
            })
            
        })

        //appened to cell
        deleteCell.appendChild(deleteButton)
    })


    //Add/Replace on document
    let dataDiv = document.getElementById("dataTable")
    if(dataDiv.childElementCount) {
        dataDiv.replaceChild(table, dataDiv.lastChild)
    }
    else {
        dataDiv.appendChild(table)
    }



}

//calls server to delete provided business from database
async function deleteBusiness(ownerID, businessID, callback) {
    console.log(ownerID + ", " + businessID)
    let body = JSON.stringify({
        "owner": ownerID,
        "business": businessID
    })
    console.log(body)
    let result = await fetch('/removeBusiness', {method: 'post', headers: {'Content-Type': 'application/json'}, body})
    let dataReceived = await result.json()

    //Return result message
    dataReceived.requestStatus == "ERROR" ? callback("ERROR: Could not delete business") : callback("SUCCESS: Business deleted")
}