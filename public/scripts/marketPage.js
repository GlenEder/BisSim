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

    console.log(products)

    //TODO display products on table


}
