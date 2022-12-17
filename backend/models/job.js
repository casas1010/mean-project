const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  state: { type: String, required: true },
  substate: { type: String, required: true },
  address: { type: String, required: true },
  jobType: { type: [String] },

  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

});

module.exports = mongoose.model("Job", postSchema);
