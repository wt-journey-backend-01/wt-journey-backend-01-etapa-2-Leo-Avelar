const express = require('express')
const router = express.Router();
const controller = require('../controllers/agentesController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Agente:
 *       type: object
 *       required:
 *         - nome
 *         - dataDeIncorporacao
 *         - cargo
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do agente (adicionado automaticamente)
 *         nome:
 *           type: string
 *           description: Nome do agente
 *         dataDeIncorporacao:
 *           type: string
 *           format: date
 *           example: "YYYY-MM-DD ou YYYY/MM/DD"
 *           description: Data de incorporação do agente
 *         cargo:
 *           type: string
 *           description: Cargo/Função do agente
 *       example:
 *         id: "401bccf5-cf9e-489d-8412-446cd169a0f1"
 *         nome: "Jorge da Silva"
 *         dataDeIncorporacao: "2003-01-01"
 *         cargo: "Investigador"
*/

/**
 * @swagger
 * tags:
 *   name: Agentes
 *   description: Endpoints agentes
*/


/**
 * @swagger
 * /agentes:
 *   get:
 *     summary: Retorna todos os agentes ou realiza uma busca com filtros
 *     tags: [Agentes]
 *     parameters:
 *      - in: query
 *        name: cargo
 *        required: false
 *        schema:
 *          type: string
 *        description: Filtra agentes pelo cargo
 *      - in: query
 *        name: sort
 *        required: false
 *        schema:
 *          type: string
 *        description: Ordena pela data de incorporação ("dataDeIncorporacao" ou "-dataDeIncorporacao")
 *     responses:
 *       200:
 *         description: Sucesso ao listar agentes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agente'
 */
router.get('/', controller.getAll);


/**
 * @swagger
 * /agentes/{id}:
 *   get:
 *     summary: Retorna um agente pelo ID
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agente
 *     responses:
 *       200:
 *         description: Agente encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Agente não encontrado
 */
router.get('/:id', controller.getById);


/**
 * @swagger
 * /agentes:
 *   post:
 *     summary: Cria um novo agente
 *     tags: [Agentes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Agente'
 *           example:
 *             nome: "Jorge da Silva"
 *             dataDeIncorporacao: "2003-01-01"
 *             cargo: "Investigador"
 *     responses:
 *       201:
 *         description: Agente criado com sucesso
 */
router.post('/', controller.create);


/**
 * @swagger
 * /agentes/{id}:
 *   put:
 *     summary: Atualiza completamente um agente pelo ID
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Agente'
 *           example:
 *             nome: "Jorge Oliveira"
 *             dataDeIncorporacao: "2005-01-01"
 *             cargo: "Agente"
 *     responses:
 *       200:
 *         description: Agente atualizado com sucesso
 *       404:
 *         description: Agente não encontrado
 */
router.put('/:id', controller.update);


/**
 * @swagger
 * /agentes/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um agente pelo ID
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *           example:
 *             cargo: "Investigador"
 *     responses:
 *       200:
 *         description: Agente atualizado parcialmente com sucesso
 *       404:
 *         description: Agente não encontrado
 */
router.patch('/:id', controller.partialUpdate);


/**
 * @swagger
 * /agentes/{id}:
 *   delete:
 *     summary: Remove um agente pelo ID
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agente
 *     responses:
 *       204:
 *         description: Agente removido com sucesso
 *       404:
 *         description: Agente não encontrado
 */
router.delete('/:id', controller.delete);

module.exports = router;