//set onload for document
window.addEventListener('load', showLoggedIn)

//returns emp id if user is logged in, null otherwise
function isLoggedIn() {
    return localStorage.getItem('empId')
}

//Sets header text to display if user is logged in 
function showLoggedIn() {
    let info = document.getElementById("loginHUD")
    if(info == null) return     //Error checking as using this file for other pages

    const empId = localStorage.getItem('empId');
    let loggedIn = empId == null ? false : true

    if(loggedIn) {
        info.innerHTML = "Logged in as Employee: " + empId
    }
    else {
        info.innerHTML = "User Not Logged In"
    }
}

//logs in user based on creds
async function login() {

    if(verifyLoginParams()) {
        let empID = document.getElementById("loginEmpID").value
        let busID = document.getElementById("loginBusID").value

        //query server to validate params
        let body = JSON.stringify({
            "empID": empID,
            "busID": busID
        })

        //call server to login user
        let dataReceived = await fetchServer('/loginUser', body)

        //login user
        if(dataReceived.result) {

            localStorage.setItem('empId', empID)
            localStorage.setItem('busId', busID)
            location.href = '/home'
        }
        else {
            showError("Employee does not exist")
        }
    }
    else {
        showError("Invalid login parameters")
    }
}

//null check for login fields
function verifyLoginParams() {
    let empID = document.getElementById("loginEmpID").value
    let busID = document.getElementById("loginBusID").value
    return empID && busID
}

//create Owner and first business and alert user of creds when done
async function createOwnerShit() {
    const body = JSON.stringify({
        "EmpID": document.getElementById("EmpID").value,
        "EmpName": document.getElementById("EmpName").value,
        "EmpYear": document.getElementById("EmpYear").value,
        "BusinessName": document.getElementById("BusinessName").value,
        "YearFounded": document.getElementById("YearFounded").value,
        "Address": document.getElementById("Address").value,
        "City": document.getElementById("City").value,
        "State": document.getElementById("State").value
    })

    //call server 
    let dataReceived = await fetchServer('/createOwnerAndBusiness', body)

    if(dataReceived.result == "SUCCESS") {
        alert("Creation Successful: Login Creds Below\nEmployee Id: " + dataReceived.emp + "\nBusiness Id: " + dataReceived.bus)
        localStorage.setItem('empId', dataReceived.emp);
        window.location.href = '/home'
    }
    else {
        showError("Failed to create user and business")
    }

}


//displays all employees in database on site
async function getAllEmployees() {

    listEmployees(await fetchServer('/getAllEmployees'))

}

//alerts user that they are not signed in and takes to login screen
function handleSignedoutError() {
    showError("User not logged in")
    window.location.href = '/'
}


//calls server to delete provided business from database
async function deleteBusiness(ownerID, businessID, callback) {

    let empId = isLoggedIn() 

    if(empId === null) {
        handleSignedoutError()
    }

    if(ownerID != empId) {
        callback("ERROR: Cannot delete business you do not own")
        return
    }

    console.log(ownerID + ", " + businessID)
    let body = JSON.stringify({
        "owner": ownerID,
        "business": businessID
    })
    console.log(body)

    let dataReceived = await fetchServer('/removeBusines', body)

    //Return result message
    dataReceived.requestStatus == "ERROR" ? callback("ERROR: Could not delete business") : callback("SUCCESS: Business deleted")
}

//calls sever to get employees of selected business
async function getBusinessEmployees(businessID, callback) {
    let body = JSON.stringify({
        "busID": businessID
    })
    callback(await fetchServer('/getBusinessEmployees', body))
}


//returns true if provided id is owner of business
async function verifyIsOwner(busID, empID, callback) {
    let body = JSON.stringify( {"businessID": busID} )
    let dataReceived = await fetchServer('/getBusOwner', body)
    dataReceived.result == empID ? callback(true) : callback(false)
}

//displays alrert with error tag
function showError(msg) {
    alert("ERROR: " + msg)
}

//fetch server and return data
async function fetchServer(command, body) {
    let result = await fetch(command, {method: 'post', headers: {'Content-Type': 'application/json'}, body})
    let dataReceived = await result.json()

    return dataReceived
}

//returns true if the date string 1 is older than string 2
function isOlderDate(d1, d2) {
    
    //compare years
    let d1Year = Number(d1.substring(d1.length - 4))
    let d2Year = Number(d2.substring(d2.length - 4))

    if(d1Year < d2Year) return 1
    if(d1Year > d2Year) return -1

    //compare months
    let d1FirstSlash = d1.indexOf("/")
    let d2FirstSlash = d2.indexOf("/")
    let d1Month = Number(d1.substring(0, d1FirstSlash))
    let d2Month = Number(d2.substring(0, d2FirstSlash))

    if(d1Month < d2Month) return 1
    if(d1Month > d2Month) return -1

    //compare day
    let d1SecSlash = d1.indexOf("/", d1FirstSlash + 1)
    let d2SecSlash = d2.indexOf("/", d2FirstSlash + 1)
    let d1Day = Number(d1.substring(d1FirstSlash + 1, d1SecSlash))
    let d2Day = Number(d2.substring(d2FirstSlash + 1, d2SecSlash))

    if(d1Day < d2Day) return 1

    //same day or younger
    return -1

}

//Transaction sort helper method for sorting by date
function transactionSort(a, b) {
    return isOlderDate(a.Date, b.Date)
}

//Opposite sort helper for sorting date results 
function oppoTransactionSort(a, b) {
    return isOlderDate(b.Date, a.Date)
}
