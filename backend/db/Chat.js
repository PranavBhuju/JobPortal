const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "RecruiterInfo"
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "JobApplicantInfo"
    },
  },
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("chats", schema);
