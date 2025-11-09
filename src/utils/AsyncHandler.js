// function that handles every request handler functions
export const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((error) => {
                // if a request handler throws error then will add to error handling middleware
                // hopefull it will not be called
                next(error);
            })
    }
}