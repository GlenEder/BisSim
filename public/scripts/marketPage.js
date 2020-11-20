//set onload for document
window.addEventListener('load', displayProducts)

//available products 
let products = []

//Display available products on table 
async function displayProducts () {

    //call server for products 
    let body = JSON.stringify({
        orderBy: 'Brand',
        desc: false
    })
    let dataReceived = await fetchServer('/getProducts', body)

    let items = dataReceived.result
    console.log(items)
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
