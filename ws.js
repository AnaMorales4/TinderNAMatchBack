const WebSocket = require("ws");
const connectDB = require("./db"); // your DB connection file
const ChatMessage = require("./models/ChatMessage");
const Match = require("./models/user");

const PORT = process.env.WS_PORT || 8001;

async function startWebSocket() {
  try {
    // 1️⃣ Connect to MongoDB
    await connectDB();
    console.log("MongoDB connected successfully");

    // 2️⃣ Create WebSocket server
    const wss = new WebSocket.Server({ port: PORT, path: "/chat" });

    wss.on("connection", (ws) => {
      console.log("Client connected");

      ws.on("message", async (msg) => {
        const data = JSON.parse(msg);

        switch (data.type) {
          case "join":
            ws.userId = data.senderId;
            break;

          case "load history":
            const { senderId, receiverId } = data;
            const senderUserInfo = await Match.findById(senderId);
            const receiverUserInfo = await Match.findById(receiverId);
            if (!senderUserInfo || !receiverUserInfo) return;

            const hasMatch =
              senderUserInfo.matches.includes(receiverId) ||
              receiverUserInfo.matches.includes(senderId);

            const history = hasMatch
              ? await ChatMessage.find({
                $or: [
                  { senderId, receiverId },
                  { senderId: receiverId, receiverId: senderId },
                ],
              })
                .sort({ timestamp: 1 })
                .populate("senderId", "name")
                .populate("receiverId", "name")
              : [];

            ws.send(JSON.stringify({ type: "history", history }));
            break;

          case "chat message":
            const saved = await ChatMessage.create({
              senderId: data.senderId,
              receiverId: data.receiverId,
              text: data.text,
            });

            const populated = await ChatMessage.findById(saved._id)
              .populate("senderId", "name")
              .populate("receiverId", "name");

            wss.clients.forEach(client => {
              if (
                client.readyState === WebSocket.OPEN &&
                [data.senderId, data.receiverId].includes(client.userId)
              ) {
                client.send(JSON.stringify({ type: "chat message", msg: populated }));
              }
            });
            break;
        }
      });

      ws.on("close", () => console.log("Client disconnected"));
    });

    console.log(`Raw WebSocket server running on ws://localhost:${PORT}/chat`);
  } catch (err) {
    console.error("Error starting WebSocket server:", err);
    process.exit(1);
  }
}

startWebSocket();
