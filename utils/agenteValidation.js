const { z } = require('zod');

const agenteSchema = z.object({
    nome: z.string({ required_error: "Nome é obrigatório" }).min(1, "Nome não pode ser vazio"),
    dataDeIncorporacao: z.string({ required_error: "Data de incorporação é obrigatória" }).regex(/^\d{4}\/\d{2}\/\d{2}$/, "Data deve estar no formato YYYY/MM/DD"),
    cargo: z.string({ required_error: "Cargo é obrigatório" }).min(1, "Cargo não pode ser vazio"),
})


module.exports = { agenteSchema };