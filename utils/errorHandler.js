const { ZodError } = require('zod');

const errorHandler = (err, req, res, next) => {
    if (err instanceof ZodError || err.name === 'ZodError' || err.constructor.name === 'ZodError') {
        const errors = {};
        
        if (err.issues && Array.isArray(err.issues)) {
            err.issues.forEach(issue => {
                const field = issue.path.length > 0 ? issue.path.join('.') : 'root';
                errors[field] = issue.message;
            });
        }
        
        return res.status(400).json({
            status: 400,
            message: 'Payload inválido',
            errors
        });
    }

    if (err.name === 'ApiError') {
        return res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message
        });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro interno no servidor';

    res.status(statusCode).json({
        status: statusCode,
        message,
    });
};

module.exports = errorHandler;