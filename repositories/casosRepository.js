const { v4: uuidv4 } = require('uuid');

const casos = [
    {
        "id": "347e3cc5-95e7-4380-a3c2-53783ddd6e64",
        "titulo": "homicidio",
        "descricao": "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
        "status": "aberto",
        "agente_id": "47eb8b92-9b09-45d0-ae4b-537b7823e4e8"
    },
    {
        "id": "0c7a1a35-264b-4917-a78c-defd5221bbc3",
        "titulo": "furto",
        "descricao": "Relato de furto em residência na Rua das Flores, ocorrido no dia 15/08/2020.",
        "status": "solucionado",
        "agente_id": "0690c192-1be5-4897-81d8-6a56cf402feb"
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
