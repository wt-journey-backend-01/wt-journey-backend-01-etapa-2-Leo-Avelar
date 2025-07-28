const { z } = require('zod');
const agentesRepository = require('../repositories/agentesRepository');

const casoSchema = z.object({
    titulo: z.any().refine((val) => {
        return val !== undefined && val !== null && typeof val === 'string' && val.trim().length > 0;
    }, {message: "Titulo é obrigatório"}),
    
    descricao: z.any().refine((val) => {
        return val !== undefined && val !== null && typeof val === 'string' && val.trim().length > 0;
    }, {message: "Descrição é obrigatório"}),

    status: z.any().refine((val) => {
        return val !== undefined && val !== null && ['aberto', 'solucionado'].includes(val);
    }, {message: "Status deve ser 'aberto' ou 'solucionado'"}),

    agente_id: z.any().refine((val) => {
        if (val === undefined || val === null || typeof val !== 'string') return false;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(val)) return false;
        return verifyAgente(val);
    },{message: "Agente ID é obrigatório, deve ser um UUID válido e corresponder a um agente existente"}),
});

const verifyAgente = (agenteId) => {
    if (!agenteId) return false;
    const agente = agentesRepository.findById(agenteId);
    return !!agente;
};

module.exports = { casoSchema };