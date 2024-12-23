import User from "../models/user.js";
import Message from "../models/message.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } });
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: senderId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId, receiverId: myId },
        { senderId: myId, receiverId: senderId },
      ],
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { text } = req.body;
    const senderId = req.user._id;
    let imageUrl = "";
    if (req.file) {
      imageUrl = req.file.path;
    }
    const message = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await message.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
