class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.codeStatus = 403;
  }
}

module.exports = ForbiddenError;
