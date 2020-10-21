

async function getBusinesses () {
    const options = {
        method: 'POST'
    }

    const result = await fetch('/apiGetBusinesses', options)
    const jsonData = await result.json()
    jsonData.data.forEach(element => {
        console.log(element.BusName)
    });
}