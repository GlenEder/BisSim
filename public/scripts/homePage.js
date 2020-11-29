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
async function handleHire (form) {
    currentBusiness.hireEmployee(form);
}

//Displays inventory of business 
async function viewInventory () {
    currentBusiness.getInventory(result => {
        console.log("Iventory:", result)

        //remove uneeded fields
        for(var item in result) {
            delete result[item].BusId
            delete result[item].TypeId
        }

        console.log(result)

        let headers = [
            "Product ID",
            "Current Quantity",
            "Product Name",
            "Brand",
        ]

        displayDataInTable(result, headers)

    })
}

//renders employee table on home page
async function viewEmployees () {
    currentBusiness.getEmployees(result => {
        listEmployees(result)
    })
}

//confirms deletion of business
function confirmBusinessDelete () {
    if(confirm("Press OK to continue with deletion.\nThis will remove all employees including the owner.")) {
        currentBusiness.delete(result => {
            alert(result);
            if(result.includes("SUCCESS")) { location.href = '/'}
        })
    }
}

//creates list of employees with given employee array 
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
    
                currentBusiness.fireEmployee(body, result => {
                    if(result == "SUCCESS") {
                        alert("Employee Fired")
                        viewEmployees()
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

//Displays given data in table on site with headers provided
//@param data -- array of objects 
//@param headers -- array of strings to label columns 
//@param rowExtras -- html elements to add to each row at end 
function displayDataInTable(data, headers, rowExtras) {

    console.log(data)

    let table = document.createElement('table')
    //create table headers
    let theader = table.createTHead()
    let headRow = theader.insertRow()
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

        //Add row extras 
        for(var extra in rowExtras) {
            let cell = row.insertCell()
            cell.appendChild(extra)
        }

    }

    //Add/Replace on document
    let dataDiv = document.getElementById("dataTable")
    if(dataDiv.childElementCount) {
        dataDiv.replaceChild(table, dataDiv.lastChild)
    }
    else {
        dataDiv.appendChild(table)
    }

}