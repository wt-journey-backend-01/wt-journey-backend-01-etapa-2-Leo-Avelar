const { v4: uuidv4 } = require('uuid');

const casos = [
    {
        "id": "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46",
        "titulo": "homicidio",
        "descricao": "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
        "status": "aberto",
        "agente_id": "401bccf5-cf9e-489d-8412-446cd169a0f1"
    },
    {
        "id": "a2b3c4d5-e6f7-8g9h-0i1j-k2l3m4n5o6p7",
        "titulo": "furto",
        "descricao": "Relato de furto em residência na Rua das Flores, ocorrido no dia 15/08/2020.",
        "status": "fechado",
        "agente_id": "b0c1f8d2-3e4b-4c1b-8f3d-2e5f6a7b8c9d"
    }
];

const findAll = () => casos;
const findById = (id) => casos.find(c => c.id === id);

const create = (data) => {
    const newCaso = { id: uuidv4(), ...data };
    casos.push(newCaso);
    return newCaso;
}

const update = (id, data) => {
    const index = casos.findIndex(c => c.id === id);
    if (index !== -1) {
        casos[index] = { ...casos[index], ...data };
        return casos[index];
    }
    return null;
}

const remove = (id) => {
    const index = casos.findIndex(c => c.id === id);
    if (index !== -1) {
        return casos.splice(index, 1)[0];
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
