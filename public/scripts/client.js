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

//creats list of employees with given employee array 
function listEmployees(data) {

    let table = document.createElement('table')
    //create table headers
    let theader = table.createTHead()
    let headRow = theader.insertRow()
    let headers = ['EmployeeId', 'BusinessId', 'Name', 'Birth Date', 'Position', 'Salary']
    for(var idex in headers) {
        let th = document.createElement('th')
        let text = document.createTextNode(headers[idex])
        th.appendChild(text)
        headRow.appendChild(th)
    }

    for(var index in data) {
        //console.log(data[index])
        //create entry row
        let row = table.insertRow()

        //fill row with data
        for(var item in data[index]) {
            let cell = row.insertCell()
            let text = document.createTextNode(data[index][item])
            cell.appendChild(text)
        }

        let eId = data[index].EmpId
        let bId = data[index].BusId

        //skip fire button if owner
        if(eId == localStorage.getItem('empId')) continue
        

        //add fire button cell
        let fireCell = row.insertCell()
        let fireButton = document.createElement("input")
        fireButton.type = "button"
        fireButton.value = "Fire Employee"
        fireButton.style = "background-color: red"
        
        

        fireButton.addEventListener('click', () => {
           
                let body = JSON.stringify({
                    "EmpId": eId,
                    "BusId": bId
                })
    
                fireEmployee(body, result => {
                    if(result == "SUCCESS") {
                        alert("Employee Fired")
                        location.href = "/"
                    }
                    else {
                        showError("Failed to fire employee")
                    }
                })
        })
        //add fire button
        fireCell.appendChild(fireButton)
    
    }

    //Add/Replace on document
    let empDiv = document.getElementById("dataTable")
    if(empDiv.childElementCount) {
        empDiv.replaceChild(table, empDiv.lastChild)
    }
    else {
        empDiv.appendChild(table)
    }
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

//hires employee with given fields
async function hireEmployee(form) {

    //assign employee id
    let newId = -1
    let body = JSON.stringify({
        "busID": localStorage.getItem("busId")
    })

    //get max emp id from server 
    let dataRecieved = await fetchServer('getBysMaxEmpId', body)

    newId = dataRecieved.maxID + 1

    //check for error in query 
    if(newId < 1) {
        alert("ERROR: Could not create new employee")
        return
    }

    body = JSON.stringify({
        "EmpId": newId,
        "BusId": sessionStorage.getItem("selBus"),
        "Name": document.getElementById("Name").value.trim(),
        "BirthYear": document.getElementById("Birth").value,
        "position": document.getElementById("Pos").value.trim(),
        "Salary": document.getElementById("Salary").value
    })

    //call server to add new employee
    dataReceived = await fetchServer('/hireNewEmployee', body)

    if(dataRecieved != "ERROR") {
        alert("SUCCESS: Employee Hired")
        location.href = '/homePage'
    }
    else {
        alert("ERROR: Failed to Hire Employee")
    }
}

//fires employee with given fields
async function fireEmployee(body, callback) {
    let dataReceived = await fetchServer('/fireEmployee', body)
    callback(dataReceived.result)
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

