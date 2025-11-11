const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const swipesController = require('../controllers/swipesController');
const matchesController = require('../controllers/matchesController');

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Created user
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by Id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User Id
 *     responses:
 *       200:
 *         description: Find user 
 *       404:
 *         description: user not found 
 */
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: user Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: updated user
 *       404:
 *         description: user not found
 */
router.put('/:id', userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User Id
 *     responses:
 *       200:
 *         description: user deleted
 *       404:
 *         description: user not found
 */
router.delete('/:id', userController.deleteUser);

/**
 * @swagger
 * /users/{id}/like:
 *   post:
 *     summary: send like to user
 *     tags: [Swipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID user receive Like
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID who send like 
 *     responses:
 *       201:
 *         description: like saved
 */
router.post('/:id/like', swipesController.saveLike);

/**
 * @swagger
 * /users/{id}/dislike:
 *   post:
 *     summary: send dislike to user
 *     tags: [Swipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID user receive dislike
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID who send dislike
 *     responses:
 *       201:
 *         description: Dislike saved
 */
router.post('/:id/dislike', swipesController.saveDislike);

/**
 * @swagger
 * /api/users/{id}/matches:
 *   get:
 *     summary: Get all matches for a user.
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve matches for.
 *     responses:
 *       200:
 *         description: List of matched users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 matches:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       name:
 *                         type: string
 *                       age:
 *                         type: integer
 *                       profilePhoto:
 *                         type: string
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.get('/:id/matches', matchesController.getMatches);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         age:
 *           type: number
 *         email:
 *           type: string
 *         swipes:
 *           type: array
 *           items:
 *             type: string
 *         matches:
 *           type: array
 *           items:
 *             type: string
 */

module.exports = router;
