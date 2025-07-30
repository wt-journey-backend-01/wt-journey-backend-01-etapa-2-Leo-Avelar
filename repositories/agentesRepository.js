const { v4: uuidv4 } = require('uuid');

const agentes = [
    {
        "id": "47eb8b92-9b09-45d0-ae4b-537b7823e4e8",
        "nome": "Rommel Carneiro",
        "dataDeIncorporacao": "1992-10-04",
        "cargo": "delegado"
    },
    {
        "id": "0690c192-1be5-4897-81d8-6a56cf402feb",
        "nome": "Ana Paula",
        "dataDeIncorporacao": "2005-05-15",
        "cargo": "investigadora"
    },
    {
        "id": "199818bb-859a-4284-99ae-8b3497f54f8d",
        "nome": "Carlos Silva",
        "dataDeIncorporacao": "2010-03-20",
        "cargo": "agente"
    }
];

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
