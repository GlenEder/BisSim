
let loggedIn = false    //current user logged in
let empId = null        //employee id of logged in user


//set onload for document
window.addEventListener('load', showLoggedIn)

//Sets header text to display if user is logged in 
function showLoggedIn() {
    let info = document.getElementById("loginHUD")
    if(info == null) return     //Error checking as using this file for other pages

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
        "EmpPos": document.getElementById("EmpPos").value,
        "BusinessName": document.getElementById("BusinessName").value,
        "YearFounded": document.getElementById("YearFounded").value,
        "Address": document.getElementById("Address").value,
        "City": document.getElementById("City").value,
        "State": document.getElementById("State").value
    })

    let result = await fetch('/createOwnerAndBusiness', {method: 'post', headers: {'Content-Type': 'application/json'}, body})
    let dataReceived = await result.json()

    console.log(dataReceived)
    if(dataReceived.result == "SUCCESS") {
        alert("Creation Successful: Login Creds Below\nEmployee Id: " + dataReceived.emp + "\nBusiness Id: " + dataReceived.bus)
    }
    else {
        alert(dataReceived.result)
    }

}

//displays all businesses on site
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

        //create list employees button
        let employeeCell = row.insertCell()

        //create button
        let employeeButton = document.createElement('input')
        employeeButton.type = "button"
        employeeButton.value = "Display employees"
        employeeButton.style = "background-color: green"
        employeeButton.addEventListener('click', () => {
            getBusinessEmployees(element.BusId, result => {
                //console.log(result)

                //create employee list
                listEmployees(result)
            })
        })

        //add to cell
        employeeCell.appendChild(employeeButton)


        //create hire emp button 
        let hireCell = row.insertCell()
        //create hire button
        let hireButton = document.createElement('input')
        hireButton.type = "button"
        hireButton.value = "Hire Employee"
        hireButton.style = "background-color: green"
        hireButton.addEventListener('click', () => {
            if(!loggedIn) {
                alert("ERROR: User must be logged")
                return
            }
            else if (element.OwnerId != empId) {
                alert("ERROR: User does not own selected Business")
                return
            }

            //take to hire employee page
            location.href = "/hireEmployee"

        })
        //add button to cell
        hireCell.appendChild(hireButton)
    
       
    
        //create delete button cell 
        let deleteCell = row.insertCell()
        
        //create the button
        let deleteButton = document.createElement('input')
        deleteButton.type = "button"
        deleteButton.value = "Delete Business"
        deleteButton.style = "background-color: red"
        deleteButton.addEventListener('click', () => {
            deleteBusiness(element.OwnerId, element.BusId, result => {
                alert(result)
                getBusinesses()
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

//displays all employees in database on site
async function getAllEmployees() {
    let result = await fetch('/getAllEmployees', {method: 'post'})
    let dataReceived = await result.json()

    listEmployees(dataReceived)

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
    }

    //Add/Replace on document
    let empDiv = document.getElementById("employeeTable")
    if(empDiv.childElementCount) {
        empDiv.replaceChild(table, empDiv.lastChild)
    }
    else {
        empDiv.appendChild(table)
    }
}

//calls server to delete provided business from database
async function deleteBusiness(ownerID, businessID, callback) {

    if(!loggedIn) {
        callback("ERROR: Login to delete business")
        return
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
    let result = await fetch('/removeBusiness', {method: 'post', headers: {'Content-Type': 'application/json'}, body})
    let dataReceived = await result.json()

    //Return result message
    dataReceived.requestStatus == "ERROR" ? callback("ERROR: Could not delete business") : callback("SUCCESS: Business deleted")
}

//calls sever to get employees of selected business
async function getBusinessEmployees(businessID, callback) {
    let body = JSON.stringify({
        "busID": businessID
    })
    let result = await fetch('/getBusinessEmployees', {method: 'post', headers: {'Content-Type': 'application/json'}, body})
    let dataReceived = await result.json()

    callback(dataReceived)
}