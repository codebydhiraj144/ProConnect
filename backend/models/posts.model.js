import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    body: {
      type: String,
      required: true
    },
    likes: {
      type: Number,
      default:0
    },
    createdAt:{
      type: Date,
      default: Date.Now
    },
    updatedAt: {
        type: Date,
      default: Date.Now
    },
    media: {
      type: String,
      default: ''
    },
    active: {
       type: Boolean,
       default: true
    },
    filetype: {
        type: String,
        default: ''

    },

})

const post = mongoose.model("post", PostSchema)

export default post;