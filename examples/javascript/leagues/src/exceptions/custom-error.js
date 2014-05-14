function CustomError(message) {
  this.name = "CustomError";
  this.message = message || "Default Message";
}

CustomError.prototype = new Error();
CustomError.prototype.constructor = CustomError;

module.exports = CustomError;
