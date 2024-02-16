

const asynchandler = (fn) => async (req, res, next) => {
    try {
        fn(req, res, next);
    } catch (error) {
        res.status(error.status || 500).json({
            message: "something went wrong from async handler",
            error: error || "not got error"
        })
    }
}

module.exports = asynchandler;