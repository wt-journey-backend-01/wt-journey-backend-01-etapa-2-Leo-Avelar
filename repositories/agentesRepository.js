const { v4: uuidv4 } = require('uuid');

const agentes = [];

const findAll = () => agentes;
const findById = (id) => agentes.find(a => a.id === id);

const create = (agente) => {
    const newAgente = { id: uuidv4(), ...agente };
    agentes.push(newAgente);
    return newAgente;
}

const update = (id, data) => {
    const index = agentes.findIndex(a => a.id === id);
    if (index !== -1) {
        agentes[index] = { ...agentes[index], ...data };
        return agentes[index];
    }
    return null;
}

const remove = (id) => {
    const index = agentes.findIndex(a => a.id === id);
    if (index !== -1) {
        return agentes.splice(index, 1)[0];
    }
    return null;
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    delete: remove
};
