function responseWrapper(req, res, next) {
    res.success = (message, data = null) => {
        res.json({
            status: 'success',
            message: message,
            data: data,
            statusCode: 200,
            timestamp: new Date().toISOString(),
            requestId: req.headers['x-request-id'] || req.id || 'default-request-id'
        });
    };

    res.error = (message, data = null, statusCode = 500) => {
        res.json({
            status: 'error',
            message: message,
            data: data,
            statusCode: statusCode,
            timestamp: new Date().toISOString(),
            requestId: req.headers['x-request-id'] || req.id || 'default-request-id'
        });
    };

    next();
}

module.exports = responseWrapper;
