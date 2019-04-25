var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  // `title` must be of type String
  headline: { type: String, unique: true },
  // `body` must be of type String
  summary: String,
  url: String,
  link: String,
  comments: [
    {
      // Store ObjectIds in the array
      type: Schema.Types.ObjectId,
      // The ObjectIds will refer to the ids in the Comment model
      ref: "Comment"
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
var article = mongoose.model("article", ArticleSchema);

// Export the Note model
module.exports = article;
