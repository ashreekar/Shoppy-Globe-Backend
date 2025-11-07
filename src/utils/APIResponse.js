class APIresponse{
    // custom api response class that defines every response object
    constructor(statusCode,message,data){
        // constructor recieves statuscodde,message,data and creates object with 4 keys
        this.statusCode=statusCode;
        this.message=message;
        this.data=data;
        this.success = statusCode < 400;
    }
}

export {APIresponse};