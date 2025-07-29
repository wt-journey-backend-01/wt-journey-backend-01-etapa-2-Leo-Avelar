const { z } = require('zod');
const agentesRepository = require('../repositories/agentesRepository');

const verifyAgente = (agenteId) => {
    if (!agenteId) return false;
    const agente = agentesRepository.findById(agenteId);
    return !!agente;
};

const casoSchema = z.object({
    titulo: z.string({ message: 'titulo é obrigatório (string)' }).min(1, 'titulo não pode ser vazio'),

    descricao: z.string({ message: 'descricao é obrigatória (string)' }).min(1, 'descricao não pode ser vazio'),

    status: z.enum(['aberto', 'solucionado'], {
        message: 'status é obrigatório (aberto ou solucionado)'
    }),

    agente_id: z.uuidv4({
        message: 'agente_id é obrigatório (UUID de um agente existente)'
    }).refine(verifyAgente, { message: 'agente_id deve corresponder a um agente existente' })
});

module.exports = { casoSchema };