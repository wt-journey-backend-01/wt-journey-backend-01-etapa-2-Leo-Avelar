const express = require('express')
const router = express.Router();
const controller = require('../controllers/casosController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Caso:
 *       type: object
 *       required:
 *         - titulo
 *         - descricao
 *         - status
 *         - agente_id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do caso (adicionado automaticamente)
 *         titulo:
 *           type: string
 *           description: Título do caso
 *         descricao:
 *           type: string
 *           description: Descrição do caso
 *         status:
 *           type: string
 *           enum: [aberto, solucionado]
 *           description: Status do caso (aberto ou solucionado)
 *         agente_id:
 *           type: string
 *           format: uuid
 *           description: ID do agente responsável pelo caso
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         titulo: "Roubo à mão armada"
 *         descricao: "Roubo ocorrido no centro da cidade às 15:30"
 *         status: "aberto"
 *         agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1"
 */

/**
 * @swagger
 * tags:
 *   name: Casos
 *   description: Endpoints casos
*/


/**
 * @swagger
 * /casos/search:
 *  get:
 *    summary: Busca palavras no titulo e descrição dos casos
 *    tags: [Casos]
 *    parameters:
 *     - in: query
 *       name: q
 *       required: false
 *       schema:
 *         type: string
 *       description: Palavra-chave para busca nos casos
 *    responses:
 *     200:
 *       description: Lista de casos filtrados por palavra-chave
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Caso'
 */
router.get('/search', controller.search);


/**
 * @swagger
 * /casos/{id}/agente:
 *  get:
 *    summary: Retorna o agente responsável por um caso específico
 *    tags: [Casos]
 *    parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *         description: ID do caso
 *    responses:
 *      200:
 *        description: Agente encontrado
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Agente'
 *            example:
 *              nome: "Jorge da Silva"
 *              dataDeIncorporacao: "2003-01-01"
 *              cargo: "Investigador"
 *      404:
 *        description: Caso não encontrado
 *      500:
 *        description: Erro ao buscar agente do caso
 */
router.get('/:id/agente', controller.getAgenteOfCaso);


/**
 * @swagger
 * /casos/{id}:
 *   get:
 *     summary: Retorna um caso específico
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do caso
 *     responses:
 *       200:
 *         description: Caso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso não encontrado
 *       500:
 *         description: Erro ao buscar caso
 */
router.get('/:id', controller.getById);


/**
 * @swagger
 * /casos:
 *  get:
 *    summary: Retorna todos os casos
 *    tags: [Casos]
 *    responses:
 *     200:
 *       description: Lista de casos encontrados
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Caso'
 *     500:
 *       description: Erro ao buscar casos
 */
router.get('/', controller.getAll);


/**
 * @swagger
 * /casos:
 *   post:
 *     summary: Cria um novo caso
 *     tags: [Casos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Caso'
 *           example:
 *             titulo: "Roubo à mão armada"
 *             descricao: "Roubo ocorrido no centro da cidade às 15:30"
 *             status: "aberto"
 *             agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1"
 *     responses:
 *       201:
 *         description: Caso criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Erro de validação dos dados do caso
 *       404:
 *         description: Agente não encontrado
 *       500:
 *         description: Erro ao criar caso
 */
router.post('/', controller.create);


/**
 * @swagger
 * /casos/{id}:
 *  put:
 *    summary: Atualiza um caso existente
 *    tags: [Casos]
*    parameters:
*     - in: path
*       name: id
*       required: true
*       schema:
*         type: string
*       description: ID do caso a ser atualizado
*    requestBody:
*      required: true
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/schemas/Caso'
*    responses:
*      200:
*        description: Caso atualizado com sucesso
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/Caso'
*/
router.put('/:id', controller.update);


/**
 * @swagger
 * /casos/{id}:
 *   delete:
 *     summary: Remove um caso pelo ID
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do caso
 *     responses:
 *       204:
 *         description: Caso removido com sucesso
 *       404:
 *         description: Caso não encontrado
 */
router.delete('/:id', controller.delete);


/**
 * @swagger
 * /casos/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um caso existente
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do caso a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *           example:
 *             titulo: "Roubo à mão armada - Atualizado"
 *             descricao: "Descrição atualizada do caso"
 *     responses:
 *      200:
 *        description: Caso atualizado parcialmente com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Caso'
 *      404:
 *        description: Caso não encontrado
 *      400:
 *        description: Erro de validação dos dados do caso
 *      500:
 *        description: Erro ao atualizar caso
 */
router.patch('/:id', controller.partialUpdate);

module.exports = router;