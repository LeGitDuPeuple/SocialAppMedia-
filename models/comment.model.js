const mongoose = require("mongoose");


const commentSchema = mongoose.Schema ({

  description:{type:String, required:true},
  author:{type:mongoose.Schema.Types.ObjectId, ref: "User", required : true},
  post: {type:mongoose.Schema.Types.ObjectId, ref: "Post", required : true}
  
}
,
{
timestamps : true,
})

module.exports = mongoose.model("Comment", commentSchema)