class APIerror extends Error {
    // custom APIerror class that is a child of error class
    // constructor recieves statuscode message errors and stack
    constructor(
        statusCode, message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            // gives a string on where error is being called
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { APIerror }