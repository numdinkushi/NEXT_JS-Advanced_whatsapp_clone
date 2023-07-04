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
			return res.status(201).send({ message: newMessage });
		}
		return res.status(400).send("from, to and message is required");
	} catch (error) {
		next(error);
	}
};

export const getMessages = async (req, res, next) => {
	try {
		const prisma = getPrismaInstance();
		const {from, to} = req.params;

		// console.log(await prisma.Messages)
		const messages = await prisma.Messages.findMany({
			where: {
				OR: [
					{
						senderId: parseInt(from),
						receiverId: parseInt(to),
					},
					{
						senderId: parseInt(to),
						receiverId: parseInt(from),
					}
				]
			},
			orderBy: {id: "asc"}
		});
		const unreadMessages = [];
		messages.forEach((message, index) => {
			if (
				message?.messageStatus !== "read" &&
				message.senderId === parseInt(to)
			) {
				messages[index].messageStatus = "read";
				unreadMessages.push(message.id);
			}
		});

		await prisma.Messages.updateMany({
			where: {
				id: { in: unreadMessages },
			},
			data: { messageStatus: "read" },
		});

        res.status(200).json({messages})
	} catch (error) {
		next(error);
	}
};
