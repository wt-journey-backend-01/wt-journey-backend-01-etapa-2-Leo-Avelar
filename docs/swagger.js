const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Departamento de Polícia',
            version: '1.0.0',
            description: 'API para gerenciar informações de um departamento de polícia, casos e agentes',
            contact: {
                name: 'Leo Avelar',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000/',
                description: 'Ambiente de desenvolvimento',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

function setupSwagger(app) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;