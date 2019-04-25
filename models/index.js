// Exporting an object containing all of our models

module.exports = {
  Note: require("./article"),
  User: require("./user"),
  Comment: require("./comments")
};
