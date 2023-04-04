const User = require("../models/User");
const { NotFound } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  if (!users) {
    throw new NotFound("No users found!");
  }
  res.status(StatusCodes.OK).json({ users });
};

const getUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ _id: userId }).select("-password");
  if (!user) {
    throw new NotFound(`Couldn't find user with id ${userId}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const getUserFriends = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ _id: userId });
  const friends = await Promise.all(
    user.friends.map((id) =>
      User.findOne({ _id: id }).select("firstName lastName picturePath")
    )
  );
  if (!friends) {
    throw new NotFound("No friends found!");
  }

  const formattedData = friends.map(
    ({ _id, firstName, lastName, picturePath }) => {
      return {
        _id,
        firstName,
        lastName,
        picturePath,
      };
    }
  );
  res.status(StatusCodes.OK).json({ friends: formattedData });
};

const addremoveFriend = async (req, res) => {
  const { userId, friendId } = req.params;
  const user = await User.findOne({ _id: userId });
  const friend = await User.findOne({ _id: friendId });
  if (user.friends.includes(friend)) {
    user.friends = user.friends.filter((id) => id !== friendId);
    friend.friends = friend.friends.filter((id) => id !== userId);
  } else {
    user.friends.push(friendId);
    friend.friends.push(userId);
  }
  await user.save();
  await friend.save();
  const friends = await Promise.all(
    user.friends.map((id) => User.findOne({ _id: id }))
  );
  const formattedData = friends.map(
    ({ _id, firstName, lastName, picturePath }) => {
      return {
        _id,
        firstName,
        lastName,
        picturePath,
      };
    }
  );
  res.status(StatusCodes.OK).json({ friends: formattedData });
};

module.exports = {
  getAllUsers,
  getUser,
  getUserFriends,
  addremoveFriend,
};
