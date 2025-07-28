const agentesRepository = require("../repositories/agentesRepository");
const { agenteSchema } = require('../utils/agenteValidation');

class ApiError extends Error {
	constructor(message, statusCode = 500) {
		super(message);
		this.name = "ApiError";
		this.statusCode = statusCode;
	}
}

const getAll = (req, res, next) => {
	try {
		let agentes = agentesRepository.findAll();

		if (req.query.cargo) agentes = agentes.filter(a => a.cargo === req.query.cargo);
		if (req.query.sort) {
			const field = req.query.sort.replace('-', '');
			const order = req.query.sort.startsWith('-') ? -1 : 1;
			
			if (field === 'dataDeIncorporacao') {
				agentes.sort((a, b) => {
					const dateA = new Date(a.dataDeIncorporacao);
					const dateB = new Date(b.dataDeIncorporacao);
					return (dateA - dateB) * order;
				});
			} else {
				agentes.sort((a, b) => (a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0) * order);
			}
		}
		
		res.status(200).json(agentes);
	} catch (error) {
		next(new ApiError("Erro ao listar agentes"));
	}	
}

const getById = (req, res, next) => {
    try {
        const { id } = req.params;
        const agente = agentesRepository.findById(id);
        if (!agente) return next(new ApiError('Agente não encontrado.', 404));
        res.status(200).json(agente);
    } catch (error) {
        next(new ApiError("Erro ao listar agentes"));
    }	
}

const create = (req, res, next) => {
	try {
		const data = agenteSchema.parse(req.body);
		const agente = agentesRepository.create(data);
		res.status(201).json(agente);
	} catch (error) {
		next(error);
	}
}

const update = (req, res, next) => {
	try {
		const { id } = req.params;
		const data = agenteSchema.parse(req.body);
		delete data.id;
		const updated = agentesRepository.update(id, data);
		if (!updated) throw new ApiError('Agente não encontrado.', 404);
		res.status(200).json(updated);
	} catch (error) {
		next(error);
	}
}

const partialUpdate = (req, res, next) => {
	try {
		const { id } = req.params;
		const data = agenteSchema.partial().parse(req.body);
		delete data.id;
		const updatedAgente = agentesRepository.update(id, data);
		if (!updatedAgente) throw new ApiError('Agente não encontrado.', 404);
		res.status(200).json(updatedAgente);
	} catch (error) {
		next(error);
	}
}

const remove = (req, res, next) => {
	try {
		const { id } = req.params;
		const deleted = agentesRepository.delete(id);

		if (!deleted) return next(new ApiError('Agente não encontrado.', 404));
		res.status(204).send();
	} catch (error) {
		next(new ApiError('Erro ao deletar agente'));
	}
}

module.exports = {
	getAll,
	getById,
	create,
	update,
	partialUpdate,
	delete: remove
}