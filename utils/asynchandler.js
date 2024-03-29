

const asynchandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        console.log(error)
        res.status(error.statusCode || 500).json({
            message: "something went wrong from async handler",
            error: error || "not got error"
        })
    }
}

module.exports = asynchandler;