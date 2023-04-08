const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
},
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("messages", schema);
