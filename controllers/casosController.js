const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require('../repositories/agentesRepository');
const { casoSchema } = require("../utils/casoValidation");

const verifyAgente = (agenteId) => {
    if (!agenteId) return false;
    const agente = agentesRepository.findById(agenteId);
    return !!agente;
};

const search = (req, res) => {
	let casos = casosRepository.findAll();
	if (req.query.q) {
		const keyword = req.query.q.toLowerCase();
		casos = casos.filter(c => c.titulo.toLowerCase().includes(keyword) || c.descricao.toLowerCase().includes(keyword));
	}
	res.status(200).json(casos);
}

const getAll = (req, res) => {
	let casos = casosRepository.findAll();
	if (req.query.status) casos = casos.filter(caso => caso.status === req.query.status);
	if (req.query.agente_id) casos = casos.filter(caso => caso.agente_id === req.query.agente_id);
	res.status(200).json(casos);
}

const getById = (req, res) => {
	const { id } = req.params;
	const caso = casosRepository.findById(id);
	if (!caso) return res.status(404).json({ message: 'Caso não encontrado.' });
	res.status(200).json(caso);
}

const create = (req, res, next) => {
    try {
        const data = casoSchema.parse(req.body);
        if (!verifyAgente(data.agente_id)) {
            return res.status(404).json({ message: 'Agente não encontrado.' });
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
		if (!verifyAgente(data.agente_id)) {
			return res.status(404).json({ message: 'Agente não encontrado.' });
		}
		const updated = casosRepository.update(id, data);
		if (!updated) return res.status(404).json({ message: 'Caso não encontrado.' });
		res.status(200).json(updated);
	} catch (error) {
		next(error);
	}
}

const partialUpdate = (req, res, next) => {
	try {
		const { id } = req.params;
		const data = casoSchema.partial().parse(req.body);
		if (data.agente_id && !verifyAgente(data.agente_id)) {
			return res.status(404).json({ message: 'Agente não encontrado.' });
		}
		const updatedCaso = casosRepository.update(id, data);
		if (!updatedCaso) return res.status(404).json({ message: 'Caso não encontrado.' });
		res.status(200).json(updatedCaso);
	} catch (error) {
		next(error);
	}
}

const remove = (req, res) => {
	const { id } = req.params;
	const deleted = casosRepository.delete(id);

	if (!deleted) return res.status(404).json({ message: 'Caso não encontrado.' });
	res.status(204).send();
}

const getAgenteOfCaso = (req, res) => {
	const { id } = req.params;
	const caso = casosRepository.findById(id);
	if (!caso) return res.status(404).json({ message: 'Caso não encontrado.' });

	const agente = agentesRepository.findById(caso.agente_id);
	if (!agente) return res.status(404).json({ message: 'Agente não encontrado.' });
	res.status(200).json(agente);
}

module.exports = {
	search,
	getAll,
	getById,
	getAgenteOfCaso,
	create,
	update,
	partialUpdate,
	delete: remove
}