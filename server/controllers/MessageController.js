import getPrismaInstance from "../utils/PrismaClient.js";

export const addMessage = async (req, res, next) => {
	try {
		const prisma = getPrismaInstance();
		const { message, from, to } = req.body;
		const getUser = onlineUsers.get(to);
		if (message && from && to) {
			const newMessage = await prisma.Messages.create({
				data: {
					message,
					sender: { connect: { id: parseInt(from) } },
					receiver: { connect: { id: parseInt(to) } },
					messageStatus: getUser ? "delivered" : "sent",
				},
				include: { sender: true, receiver: true },
			});
            return res.status(201).send({message: newMessage});
		}
        return res.status(400).send("from, to and message is required")
	} catch (error) {
		next(error);
	}
};
