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
            message: 'Parâmetros inválidos',
            errors
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