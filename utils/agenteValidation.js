const { z } = require('zod');
const { parse, isValid } = require('date-fns');

const dateConverter = z.preprocess((arg) => {
    if (typeof arg !== 'string') return arg;

    for (const format of ['yyyy-MM-dd', 'yyyy/MM/dd']) {
        const parsed = parse(arg, format, new Date());
        if (isValid(parsed)) return parsed;
    }
    return arg;
},
    z.date({
        required_error: "Data de incorporação é obrigatória",
        invalid_type_error: "Data deve estar em 'YYYY-MM-DD' ou 'YYYY/MM/DD'"
    }).transform(date => date.toISOString().slice(0, 10))
);

const agenteSchema = z.object({
    nome: z.any().refine((val) => {
        return val !== undefined && val !== null && typeof val === 'string' && val.trim().length > 0;
    }, {message: "Nome é obrigatório"}),

    dataDeIncorporacao: dateConverter,
    
    cargo: z.any().refine((val) => {
        return val !== undefined && val !== null && typeof val === 'string' && val.trim().length > 0;
    }, { message: "Cargo é obrigatório" }),
});

module.exports = { agenteSchema };