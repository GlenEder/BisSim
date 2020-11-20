

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
}