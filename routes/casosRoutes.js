const express = require('express')
const router = express.Router();
const controller = require('../controllers/casosController');

router.get('/search', controller.search);
router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.get('/:id', controller.getById);
router.delete('/:id', controller.delete);
router.patch('/:id', controller.partialUpdate);
router.get('/:id/agente', controller.getAgenteOfCaso);

module.exports = router;