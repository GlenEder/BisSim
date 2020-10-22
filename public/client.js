


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
       
    
        //create delete button cell 
        let deleteCell = row.insertCell()
        
        //create the button
        let deleteButton = document.createElement('input')
        deleteButton.type = "button"
        deleteButton.value = "Delete Business"
        deleteButton.addEventListener('click', () => {
          alert("Deleting " + element.BusName)
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
