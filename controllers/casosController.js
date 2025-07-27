const repository = require("../repositories/casosRepository");
const { casoSchema } = require("../utils/casoValidation");

class ApiError extends Error {
	constructor(message, statusCode = 500) {
		super(message);
		this.name = "ApiError";
		this.statusCode = statusCode;
	}
}

const getAll = (req, res, next) => {
	try {
		const casos = repository.findAll();
		res.status(200).json(casos);
	} catch (error) {
		next(new ApiError("Erro ao listar casos"));
	}	
}

const getById = (req, res, next) => {
	try {
		const { id } = req.params;
		const caso = repository.findById(id);
		if (!caso) return next(new ApiError('Caso não encontrado.', 404));
		res.status(200).json(caso);
	} catch (error) {
		next(new ApiError("Erro ao listar casos"));
	}	
}

const create = (req, res, next) => {
	try {
		const data = casoSchema.parse(req.body);
		const newCaso = repository.create(data);
		res.status(201).json(newCaso);
	} catch (error) {
		next(new ApiError("Erro ao criar caso", 400));
	}
}

const update = (req, res, next) => {
	try {
		const { id } = req.params;
		const data = casoSchema.parse(req.body);
		const updated = repository.update(id, data);

		if (!updated) return next(new ApiError('Caso não encontrado.', 404));
		res.status(200).json(updated);
	} catch (error) {
		next(new ApiError(error.message, 400));
	}
}

const partialUpdate = (req, res, next) => {
	try {
		const { id } = req.params;
		const data = casoSchema.partial().parse(req.body);
		const updatedCaso = repository.update(id, data);

		if (!updatedCaso) return next(new ApiError('Caso não encontrado.', 404));
		res.status(200).json(updatedCaso);
	} catch (error) {
		next(new ApiError('Erro ao atualizar caso', 400));
	}
}

const remove = (req, res, next) => {
	try {
		const { id } = req.params;
		const deleted = repository.delete(id);

		if (!deleted) return next(new ApiError('Caso não encontrado.', 404));
		res.status(204).send();
	} catch (error) {
		next(new ApiError('Erro ao deletar caso'));
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