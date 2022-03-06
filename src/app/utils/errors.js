class Errors {
    static createError(message) {
        const error = new Error();
        error.message = message;
        return error;
    }
}

export default Errors;
