const { v4: uuidv4 } = require('uuid');

const agentes = [
    {
        "id": "401bccf5-cf9e-489d-8412-446cd169a0f1",
        "nome": "Rommel Carneiro",
        "dataDeIncorporacao": "1992-10-04",
        "cargo": "delegado"
    },
    {
        "id": "b0c1f8d2-3e4b-4c1b-8f3d-2e5f6a7b8c9d",
        "nome": "Ana Paula",
        "dataDeIncorporacao": "2005-05-15",
        "cargo": "investigadora"
    },
    {
        "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
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
