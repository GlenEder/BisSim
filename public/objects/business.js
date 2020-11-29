

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

    //Calls server to fire an employee
    async fireEmployee(body, callback) {
        let dataReceived = await fetchServer('/fireEmployee', body)
        callback(dataReceived.result)
    } 

    //Calls server to remove employee from business in database
    async hireEmployee(form) {

        //assign employee id
        let newId = -1
        let body = JSON.stringify({
            "busID": this.id
        })

        //get max emp id from server 
        let dataReceived = await fetchServer('getBusMaxEmpId', body)

        newId = dataReceived.maxID + 1

        //check for error in query 
        if(newId < 1) {
            alert("ERROR: Could not create new employee")
            return
        }

        body = JSON.stringify({
            "EmpId": newId,
            "BusId": this.id,
            "Name": form.elements["Name"].value.trim(),
            "BirthYear": form.elements["Birth"].value,
            "position": form.elements["Pos"].value.trim(),
            "Salary": form.elements["Salary"].value
        })

        //call server to add new employee
        dataReceived = await fetchServer('/hireNewEmployee', body)

        if(dataReceived != "ERROR") {
            alert("SUCCESS: Employee Hired")
        }
        else {
            alert("ERROR: Failed to Hire Employee")
        }

        location.href = '/home'
    }
}