const errorResponse = async (res, err) => {
    return(
        res.status(500).json({
            Error: err.message
        })
    )
};

const successResponse = async (res, result) => {
    return(
        res.status(200).json({
            result
        })
    )
}

const issueResponse = async (res) => {
    return(
        res.status(404).json({
            message: "Could not complete request."
        })
    )
}

module.exports = {
    error: errorResponse,
    success: successResponse,
    issue: issueResponse,
}