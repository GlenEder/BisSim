//set onload for document
window.addEventListener('load', displayProducts)

//available products 
let products = []

let currentOrder = "ItemNum"
let currentlyDesc = false
let loadingTable = true

//change sorting 
function changeSorting(orderBy) {

    //prevent double tables 
    if(loadingTable) return
    loadingTable = true

    if(currentOrder == orderBy) {
        currentlyDesc = !currentlyDesc
    }
    else {
        currentOrder = orderBy
        currentlyDesc = false
    }

    //reset current products 
    products = []

    displayProducts()

}

//Display available products on table 
async function displayProducts () {

    //call server for products 
    let body = JSON.stringify({
        orderBy: currentOrder,
        desc: currentlyDesc
    })
    let dataReceived = await fetchServer('/getProducts', body)

    let items = dataReceived.result
    for(let i = 0; i < items.length; i++) {
        products.push(new Product(items[i]))
    }


    //TODO display products on table
    let table = document.createElement('table')
    let theader = table.createTHead()
    let headRow = theader.insertRow()
    let headers = ['Product ID', 'Name', 'Brand']

    for(var index in headers) {
        let th = document.createElement('th')
        let text = document.createTextNode(headers[index])
        th.appendChild(text)
        headRow.appendChild(th)
    }

    //add products to table 
    for(var p in products) {

        let row = table.insertRow()

        //add data to row
        for(var i in headers) {
            let cell = row.insertCell()
            let cellText = ""
            switch(Number(i)){
                case 0:
                    cellText = products[p].id
                    break;
                case 1:
                    cellText = products[p].name
                    break;
                case 2:
                    cellText = products[p].brand
                    break;
                default:
                    cellText = "ERROR-NO-DATA"  
            }

            //add text to cell
            cell.appendChild(document.createTextNode(cellText))
        }

        //add find sellers button 
        let buttonCell = row.insertCell()
        let button = document.createElement('input')
        button.type = 'button'
        button.value = 'View Sellers'
        let prodId = products[p].id
        button.addEventListener('click', () => {
            displaySellers(prodId)
        })

        buttonCell.appendChild(button)
        

    }


    //Add table to page
    let tableDiv = document.getElementById("marketTable")
    
    //remove existing table 
    if(tableDiv.children.length) {
        tableDiv.removeChild(tableDiv.lastChild)
    
    }
    
    tableDiv.appendChild(table)
    
    //allow changing of sorting
    loadingTable = false
}

//displays businesses that sell the provided item id
async function displaySellers(item) {

    let body = JSON.stringify({item: item})
    let dataReceived = await fetchServer('/findSellers', body)

    console.log(dataReceived)

     //TODO display products on table
    let table = document.createElement('table')
    let theader = table.createTHead()
    let headRow = theader.insertRow()
    let headers = ['Business', 'Quantity on Hand']

    for(var index in headers) {
        let th = document.createElement('th')
        let text = document.createTextNode(headers[index])
        th.appendChild(text)
        headRow.appendChild(th)
    }

    //add products to table 
    for(var b in dataReceived.result ) {

        let row = table.insertRow()

        //add data to row
        for(var i in headers) {
            let cell = row.insertCell()
            let cellText = ""
            switch(Number(i)){
                case 0:
                    cellText = dataReceived.result[b].BusName
                    break;
                case 1:
                    cellText = dataReceived.result[b].CurrentQuantity
                    break;
                default:
                    cellText = "ERROR-NO-DATA"  
            }

            //add text to cell
            cell.appendChild(document.createTextNode(cellText))
        }

        //create buy product button
        let buttonCell = row.insertCell()
        let button = document.createElement('input')
        button.type = 'button'
        button.value = 'Buy Product From This Seller'
        button.addEventListener('click', () => {
            alert("TODO purchase page")
        })

        buttonCell.appendChild(button)

    }


    //Add table to page
    let tableDiv = document.getElementById("sellersTable")
    
    //remove existing table 
    if(tableDiv.children.length) {
        tableDiv.removeChild(tableDiv.lastChild)
    
    }
    
    tableDiv.appendChild(table)

}