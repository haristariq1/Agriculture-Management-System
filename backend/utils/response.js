exports.ok = (res, data = null, message = 'OK', status = 200) => res.status(status).json({ succeeded: true, message, data });
exports.fail = (res, message = 'Something went wrong', status = 400, errors = null) => res.status(status).json({ succeeded: false, message, data: null, ...(errors ? { errors } : {}) });
