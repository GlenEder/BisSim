


async function getBusinesses () {
    //Get business list from server
    const options = {
        method: 'POST'
    }
    const result = await fetch('/apiGetBusinesses', options)
    const jsonData = await result.json()

    //create html table for businesses
    let table = document.createElement('table')
    jsonData.data.forEach(element => {
        let row = table.insertRow()
        let cell = row.insertCell()
        let busName = document.createTextNode(element.BusName)
        cell.appendChild(busName)
        
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
