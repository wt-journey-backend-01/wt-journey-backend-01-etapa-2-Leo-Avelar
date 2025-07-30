const agentesRepository = require("../repositories/agentesRepository");
const { agenteSchema } = require('../utils/agenteValidation');

const getAll = (req, res) => {
	const {cargo, sort} = req.query;
	let agentes = agentesRepository.findAll();

	if (cargo) {
		agentes = agentes.filter(a => a.cargo === cargo);
	}
	if (sort === "dataDeIncorporacao" || sort === "-dataDeIncorporacao") {
		const order = sort.startsWith('-') ? -1 : 1;
		agentes.sort((a, b) => {
			const dateA = new Date(a.dataDeIncorporacao);
			const dateB = new Date(b.dataDeIncorporacao);
			return (dateA - dateB) * order;
		});
	}
	res.status(200).json(agentes);
}

const getById = (req, res) => {
	const { id } = req.params;
	const agente = agentesRepository.findById(id);
	if (!agente) return res.status(404).json({ message: 'Agente não encontrado.' });
	res.status(200).json(agente);
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

		const updated = agentesRepository.update(id, data);
		if (!updated) return res.status(404).json({ message: 'Agente não encontrado.' });
		res.status(200).json(updated);
	} catch (error) {
		next(error);
	}
}

const partialUpdate = (req, res, next) => {
	try {
		const { id } = req.params;
		const data = agenteSchema.partial().parse(req.body);

		const updatedAgente = agentesRepository.update(id, data);
		if (!updatedAgente) return res.status(404).json({ message: 'Agente não encontrado.' });
		res.status(200).json(updatedAgente);
	} catch (error) {
		next(error);
	}
}

const remove = (req, res) => {
	const { id } = req.params;
	const deleted = agentesRepository.delete(id);

	if (!deleted) return res.status(404).json({ message: 'Agente não encontrado.' });
	res.status(204).send();
}

module.exports = {
	getAll,
	getById,
	create,
	update,
	partialUpdate,
	delete: remove
}