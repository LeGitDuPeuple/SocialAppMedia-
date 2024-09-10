const mongoos = require("mongoose");


const commentSchema = mongoos.Schema ({

  description:{type:String, required:true},
  author:{type:String, required: false},
  
}
,
{
timestamp : true,
})

module.exports = mongoos.model("comment", commentSchema)