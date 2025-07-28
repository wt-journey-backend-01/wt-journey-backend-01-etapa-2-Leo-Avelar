const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require('../repositories/agentesRepository');
const { casoSchema } = require("../utils/casoValidation");

class ApiError extends Error {
	constructor(message, statusCode = 500) {
		super(message);
		this.name = "ApiError";
		this.statusCode = statusCode;
	}
}

const verifyAgente = (agenteId) => {
    if (!agenteId) return false;
    const agente = agentesRepository.findById(agenteId);
    return !!agente;
};

const getAll = (req, res, next) => {
	try {
		let casos = casosRepository.findAll();

		if (req.query.status) casos = casos.filter(caso => caso.status === req.query.status);
		if (req.query.agente_id) casos = casos.filter(caso => caso.agente_id === req.query.agente_id);
		if (req.query.q) {
			const keyword = req.query.q.toLowerCase();
			casos = casos.filter(c => c.titulo.toLowerCase().includes(keyword) || c.descricao.toLowerCase().includes(keyword));
		}
		res.status(200).json(casos);
	} catch (error) {
		next(new ApiError("Erro ao listar casos"));
	}	
}

const getById = (req, res, next) => {
	try {
		const { id } = req.params;
		const caso = casosRepository.findById(id);
		if (!caso) return next(new ApiError('Caso não encontrado.', 404));
		res.status(200).json(caso);
	} catch (error) {
		next(new ApiError("Erro ao listar casos"));
	}	
}

const create = (req, res, next) => {
    try {
        const data = casoSchema.parse(req.body);
        if (!verifyAgente(data.agente_id)) {
            throw new ApiError('Agente não encontrado.', 404);
        }

        const newCaso = casosRepository.create(data);
        res.status(201).json(newCaso);
    } catch (error) {
        next(error);
    }
}

const update = (req, res, next) => {
	try {
		const { id } = req.params;
		const data = casoSchema.parse(req.body);
		delete data.id;
		if (!verifyAgente(data.agente_id)) {
			throw new ApiError('Agente não encontrado.', 404);
		}
		
		const updated = casosRepository.update(id, data);
		if (!updated) throw new ApiError('Caso não encontrado.', 404);
		res.status(200).json(updated);
	} catch (error) {
		next(error);
	}
}

const partialUpdate = (req, res, next) => {
	try {
		const { id } = req.params;
		const data = casoSchema.partial().parse(req.body);
		delete data.id;
		if (data.agente_id && !verifyAgente(data.agente_id)) {
			throw new ApiError('Agente não encontrado.', 404);
		}

		const updatedCaso = casosRepository.update(id, data);
		if (!updatedCaso) throw new ApiError('Caso não encontrado.', 404);
		res.status(200).json(updatedCaso);
	} catch (error) {
		next(error);
	}
}

const remove = (req, res, next) => {
	try {
		const { id } = req.params;
		const deleted = casosRepository.delete(id);

		if (!deleted) return next(new ApiError('Caso não encontrado.', 404));
		res.status(204).send();
	} catch (error) {
		next(new ApiError('Erro ao deletar caso'));
	}
}

const getAgenteOfCaso = (req, res, next) => {
	try {
		const { id } = req.params;
		const caso = casosRepository.findById(id);
		if (!caso) return next(new ApiError('Caso não encontrado.', 404));

		const agente = agentesRepository.findById(caso.agente_id);
		if (!agente) return next(new ApiError('Agente não encontrado.', 404));

		res.status(200).json(agente);
	} catch (error) {
		next(new ApiError("Erro ao buscar agente do caso"));
	}
}

module.exports = {
	getAll,
	getById,
	getAgenteOfCaso,
	create,
	update,
	partialUpdate,
	delete: remove
}