const Notification = require("../models/Notification");

const createNotification = async ({
  user,
  fromUser,
  type,
  post = null,
}) => {
  // 🚫 no self notifications
  if (user.toString() === fromUser.toString()) return;

  // 🚫 avoid duplicates for same action (like spam)
  const existing = await Notification.findOne({
    user,
    fromUser,
    type,
    post,
    read: false,
  });

  if (existing) return;

  await Notification.create({
    user,
    fromUser,
    type,
    post,
  });
};

module.exports = createNotification;
