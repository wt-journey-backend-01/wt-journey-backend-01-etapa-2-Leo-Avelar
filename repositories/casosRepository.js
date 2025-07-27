const { v4: uuidv4 } = require('uuid');

const casos = [
    {
        id: uuidv4(),
        titulo: "homicidio",
        descricao: "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
        status: "aberto",
        agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1" 
    },
    {
        id: uuidv4(),
        titulo: "roubo",
        descricao: "Um roubo à mão armada foi reportado às 15:20 do dia 12/07/2007 na região do centro, onde a vítima, um comerciante de 50 anos, foi ameaçada.",
        status: "aberto",
        agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f2"
    },
    {
        id: uuidv4(),
        titulo: "furto",
        descricao: "Um furto foi reportado às 10:15 do dia 13/07/2007 na região do bairro Centro, onde a vítima, uma mulher de 30 anos, teve sua bolsa roubada.",
        status: "aberto",
        agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f3"
    }
]

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
