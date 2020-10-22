


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
        let row = document.createElement('tr')
        let cell = document.createElement('td')
        let text = document.createTextNode(element.BusName)
        cell.appendChild(text)
        row.appendChild(cell)

        table.appendChild(row)
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