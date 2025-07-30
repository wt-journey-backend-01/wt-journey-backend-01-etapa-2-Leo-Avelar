const { z } = require('zod');

const agenteSchema = z.object({
    id: z.any().refine(() => false, { message: "Id inválido, o id é criado automaticamente e não é alterável" }).optional(),

    nome: z.string({ message: "nome é obrigatório (string)" }).min(1, { message: "nome não pode ser vazio" }),

    dataDeIncorporacao: z.string({ message: "dataDeIncorporacao é obrigatória (YYYY-MM-DD ou YYYY/MM/DD)" })
        .min(1, { message: "dataDeIncorporacao não pode ser vazia" })
        .transform((val) => val.replace(/\//g, '-'))
        .refine(
            (val) => /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val)),
            { message: "dataDeIncorporacao deve estar em 'YYYY-MM-DD' ou 'YYYY/MM/DD'" }
        )
        .refine(
            (val) => new Date(val) <= new Date(),
            { message: "A dataDeIncorporacao não pode ser no futuro." }
        ),

    cargo: z.string({ message: "cargo é obrigatório (string)" }).min(1, { message: "cargo não pode ser vazio" }),
});

module.exports = { agenteSchema };