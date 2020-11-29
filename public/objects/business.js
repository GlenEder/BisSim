

class Business {
    constructor(databaseBusinessObject) {
        this.owner = databaseBusinessObject.OwnerId
        this.id = databaseBusinessObject.BusId
        this.name = databaseBusinessObject.BusName
        this.yearFounded = databaseBusinessObject.Founded
        this.city = databaseBusinessObject.City
        this.state = databaseBusinessObject.State
        this.address = databaseBusinessObject.Address
    }

    async hireEmployee(form) {

        console.log(form)
        return

        //assign employee id
        let newId = -1
        let body = JSON.stringify({
            "busID": this.id
        })

        //get max emp id from server 
        let dataRecieved = await fetchServer('getBusMaxEmpId', body)

        newId = dataRecieved.maxID + 1

        //check for error in query 
        if(newId < 1) {
            alert("ERROR: Could not create new employee")
            return
        }

        body = JSON.stringify({
            "EmpId": newId,
            "BusId": localStorage.getItem("busId"),
            "Name": document.getElementById("Name").value.trim(),
            "BirthYear": document.getElementById("Birth").value,
            "position": document.getElementById("Pos").value.trim(),
            "Salary": document.getElementById("Salary").value
        })

        //call server to add new employee
        dataReceived = await fetchServer('/hireNewEmployee', body)

        if(dataRecieved != "ERROR") {
            alert("SUCCESS: Employee Hired")
        }
        else {
            alert("ERROR: Failed to Hire Employee")
        }

        location.href = '/home'
    }
}