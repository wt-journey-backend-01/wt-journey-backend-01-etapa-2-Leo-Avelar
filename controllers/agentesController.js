const repository = require("../repositories/agentesRepository");
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
		const agentes = repository.findAll();
		res.status(200).json(agentes);
	} catch (error) {
		next(new ApiError("Erro ao listar agentes"));
	}	
}

const getById = (req, res, next) => {
    try {
        const { id } = req.params;
        const agente = repository.findById(id);
        if (!agente) return next(new ApiError('Agente não encontrado.', 404));
        res.status(200).json(agente);
    } catch (error) {
        next(new ApiError("Erro ao listar agentes"));
    }	
}

const create = (req, res, next) => {
	try {
		const data = agenteSchema.parse(req.body);
		const agente = repository.create(data);
		res.status(201).json(agente);
	} catch (error) {
		next(new ApiError("Erro ao criar agente", 400));
	}
}

const update = (req, res, next) => {
	try {
		const { id } = req.params;
		const data = agenteSchema.parse(req.body);
		const updated = repository.update(id, data);
		if (!updated) return next(new ApiError('Agente não encontrado.', 404));
		res.status(200).json(updated);
	} catch (error) {
		next(new ApiError(error.message, 400));
	}
}

const partialUpdate = (req, res, next) => {
	try {
		const { id } = req.params;
		const data = agenteSchema.partial().parse(req.body);
		const updatedAgente = repository.update(id, data);

		if (!updatedAgente) return next(new ApiError('Agente não encontrado.', 404));
		res.status(200).json(updatedAgente);
	} catch (error) {
		next(new ApiError(error.message, 400));
	}
}

const remove = (req, res, next) => {
	try {
		const { id } = req.params;
		const deleted = repository.delete(id);

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