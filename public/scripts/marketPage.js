//set onload for document
window.addEventListener('load', displayProducts)

//Display available products on table 
async function displayProducts () {

    //call server for products 
    let dataReceived = await fetchServer('/getProducts', null)
    

    //TODO display products on table


}
