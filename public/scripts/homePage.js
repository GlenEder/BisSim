//set onload for document
window.addEventListener('load', loadBusiness)

//current business of user
let currentBusiness = null

//if user is viewing employees
let employeeTableVisable = false

//TABLE VALUES
const EMPLOYEE_TABLE = 1
const INVENTORY_TABLE = 2
const TRANSACTION_TABLE = 3


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

        //remove uneeded fields
        for(var item in result) {
            delete result[item].BusId
            delete result[item].TypeId
        }

        let headers = [
            "Product ID",
            "Current Quantity",
            "Product Name",
            "Brand",
        ]

        displayDataInTable(result, headers, INVENTORY_TABLE)

        employeeTableVisable = false

    })
}

//renders employee table on home page
async function viewEmployees () {

    currentBusiness.getEmployees(result => {

        //create headers for table
        let headers = [
            'EmployeeId', 
            'BusinessId', 
            'Name', 
            'Birth Date', 
            'Position', 
            'Salary'
        ]

        //display data on site
        displayDataInTable(result, headers, EMPLOYEE_TABLE)

        employeeTableVisable = true
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

//Displays employees and employee selector
async function showFireEmployee () {
  
    //get selector 
    let selector = document.getElementById("employeeSelect")

    //fill selector
    currentBusiness.getEmployees(result => {
        for(var index in result) {
            let option = document.createElement("option")
            option.text = result[index].Name + " (" + result[index].EmpId + ")"
            selector.add(option)
        }

        //show selector
        document.getElementById("fireBlock").style.display = "block"
    })
}

//Gets id from selector and fires employee
async function fireEmployee () {

    //get id from selector
    let employee = document.getElementById("employeeSelect").value
    let id = employee.substring(employee.indexOf("(") + 1, employee.length - 1)

    currentBusiness.fireEmployee(id, result => {
        alert(result)
        if(result == "SUCCESS") {
            document.getElementById("fireBlock").style.display = "none"
            if(employeeTableVisable) {
                viewEmployees()
            }
        }
    })

}

//Displays transactions of business 
async function showTransactions (orderby) {

    currentBusiness.getTransactions(orderby, result => {
        let headers = [
            "Bought/Sold",
            "Transaction Id",
            "ItemNum",
            "Quantity",
            "Date",
            "Price Per Unit"
        ]

        //change business id to bought or sold 
        for(var item in result) {
            if(result[item].Sold) {
                result[item].BusId = "Sold"
            }
            else {
                result[item].BusId = "Bought"
            }

            delete result[item].Sold
        }

        //manually sort by date because sql order by is lame
        if(orderby == "Date") {
            result.sort(transactionSort)
        }

        displayDataInTable(result, headers, TRANSACTION_TABLE)
    })

    

}




//Displays given data in table on site with headers provided
//@param data -- array of objects 
//@param headers -- array of strings to label columns 
//@param tableBeingShown -- value of table being shown
function displayDataInTable(data, headers, tableBeingShown) {

    switch(tableBeingShown) {
        case EMPLOYEE_TABLE:
            document.getElementById("transSort").style.display = "none"
            break;
        case TRANSACTION_TABLE:
            document.getElementById("transSort").style.display = "block"
            document.getElementById("fireBlock").style.display = "none"
            break;
        case INVENTORY_TABLE:
            document.getElementById("transSort").style.display = "none"
            document.getElementById("fireBlock").style.display = "none"
    }


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