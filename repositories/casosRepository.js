const { v4: uuidv4 } = require('uuid');

const casos = [];

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
