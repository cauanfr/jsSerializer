class DataValidatorError extends Error {
  constructor(message) {
    super();
    this.message = { message };
  }
}

export { DataValidatorError };
