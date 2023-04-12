class ValidationIdError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationIdError';
  }
}

module.exports = ValidationIdError;
