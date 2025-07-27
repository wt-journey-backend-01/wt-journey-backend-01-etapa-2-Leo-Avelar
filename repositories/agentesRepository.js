const { v4: uuidv4 } = require('uuid');

const agentes = [
    {
        id: "401bccf5-cf9e-489d-8412-446cd169a0f1",
        nome: "Rommel Carneiro",
        dataDeIncorporacao: "1992/10/04",
        cargo: "delegado"
    },
    {
        id: "401bccf5-cf9e-489d-8412-446cd169a0f2",
        nome: "Ana Paula",
        dataDeIncorporacao: "1995/05/15",
        cargo: "investigadora"
    },
    {
        id: "401bccf5-cf9e-489d-8412-446cd169a0f3",
        nome: "Carlos Silva",
        dataDeIncorporacao: "2000/08/20",
        cargo: "agente"
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
