


async function getBusinesses () {
    const options = {
        method: 'POST'
    }

    const result = await fetch('/apiGetBusinesses', options)
    const jsonData = await result.json()
    jsonData.data.forEach(element => {
        console.log(element.BusName)
    });

    let table = document.createElement('table')
    jsonData.data.forEach(element => {
        let row = document.createElement('tr')
        let cell = document.createElement('td')
        let text = document.createTextNode(element.BusName)
        cell.appendChild(text)
        row.appendChild(cell)

        table.appendChild(row)
    })

    document.getElementById("dataTable").appendChild(table)


}