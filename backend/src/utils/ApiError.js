class ApiError extends Error{
    constructor(
        statusCode,
        errMessage = "Something went Wrong!",
        errors = [],
        stack = ""
    ){
        super(errMessage);
        this.statusCode = statusCode;
        this.errMessage = errMessage;
        this.errors = errors;
        this.data = null;
        this.success = false;
        
        if(stack){
            this.stack = stack;
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    } 
    
}

export { ApiError }