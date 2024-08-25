function responseWrapper(req, res, next) {
    res.success = (data = null, message = 'success') => {
        res.json({
            status: 'success',
            message: message,
            data: data,
            statusCode: 200,
            timestamp: new Date().toISOString(),
        });
    };

    res.error = (message, data = null, statusCode = 500) => {
        res.json({
            status: 'error',
            message: message,
            data: data,
            statusCode: statusCode,
            timestamp: new Date().toISOString(),
        });
    };

    next();
}

module.exports = responseWrapper;
