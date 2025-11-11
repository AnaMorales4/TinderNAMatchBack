const express = require("express");
const router = express.Router();
const chatController = require("../controllers/socketController");

/**
 * @swagger
 * /chat/history:
 *   post:
 *     summary: Get chat history between two users
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderId
 *               - receiverId
 *             properties:
 *               senderId:
 *                 type: string
 *                 description: ID of the sender user
 *               receiverId:
 *                 type: string
 *                 description: ID of the receiver user
 *     responses:
 *       200:
 *         description: Successfully retrieved chat history
 *       403:
 *         description: Users must match before chatting
 *       404:
 *         description: User not found
 *       500:
 *         description: Error loading chat history
 */
//router.post("/history", chatController.getChatHistory);

/**
 * @swagger
 * /chat/message:
 *   post:
 *     summary: Send a chat message
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderId
 *               - receiverId
 *               - text
 *             properties:
 *               senderId:
 *                 type: string
 *                 description: ID of the sender user
 *               receiverId:
 *                 type: string
 *                 description: ID of the receiver user
 *               text:
 *                 type: string
 *                 description: The message content
 *     responses:
 *       201:
 *         description: Message successfully sent
 *       403:
 *         description: Users must match before chatting
 *       404:
 *         description: User not found
 *       500:
 *         description: Error sending message
 */
//router.post("/message", chatController.sendMessage);

module.exports = router;




