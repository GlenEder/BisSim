//set onload for document
window.addEventListener('load', displayProducts)

//available products 
let products = []

//Display available products on table 
async function displayProducts () {

    //call server for products 
    let dataReceived = await fetchServer('/getProducts', null)
    
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



    //Add table to page
    let tableDiv = document.getElementById("marketTable")
    if(tableDiv.childElementCount) {
        tableDiv.replaceChild(table, tableDiv.lastChild)
    }
    else {
        tableDiv.appendChild(table)
    }

}
