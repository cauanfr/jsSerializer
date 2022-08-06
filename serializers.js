import * as erros from "./errors.js";

class Field {
  constructor(required = true) {
    this.required = required;
  }

  isRequired = () => {
    return this.required;
  };

  validDataType = () => {};
}

class Serializer {
  #data = {};

  constructor(data) {
    this.#data = data;
    this.validatedData = {};
    this.errors = {};
  }

  #getAttributes = () => {
    const allAttributes = Object.entries(this);
    const filtredAttr = {};

    allAttributes.forEach(([key, value], _) => {
      if (value instanceof Field) {
        filtredAttr[key] = value;
      }
    });

    return filtredAttr;
  };

  #validateDataType = () => {
    const attrs = this.#getAttributes();

    for (let [key, value] of Object.entries(attrs)) {
      if (!value.validDataType(this.#data[key])) {
        this.errors[key] = "invalid data type.";
      }
    }

    if (Object.keys(this.errors).length) {
      throw new erros.DataValidatorError(this.errors);
    }
  };

  #validateRequired = () => {
    const attrs = this.#getAttributes();

    for (let [key, value] of Object.entries(attrs)) {
      if (value.isRequired() && !this.#data[key]) {
        this.errors[key] = "required field.";
      }
    }

    if (Object.keys(this.errors).length) {
      throw new erros.DataValidatorError(this.errors);
    }
  };

  #validateData = () => {
    try {
      this.#validateRequired();
      this.#validateDataType();

      this.validatedData = this.#data;

      return true;
    } catch (error) {
      if (error instanceof erros.DataValidatorError) {
        return false;
      }

      console.log(`Error: ${error}`);
    }
  };

  isValid = ({ raiseExceptions } = { raiseExceptions: false }) => {
    if (!this.#validateData() && raiseExceptions) {
      throw new erros.DataValidatorError(this.errors);
    }

    return this.#validateData();
  };
}

class CharField extends Field {
  constructor({ required } = { required: true }) {
    super(required);
  }

  validDataType = (dataValue) => {
    if (!this.isRequired() && !dataValue) {
      return true;
    }

    if (typeof dataValue !== "string") {
      return false;
    }

    return true;
  };
}

class IntegerField extends Field {
  constructor({ required } = { required: true }) {
    super(required);
  }

  validDataType = (dataValue) => {
    if (!this.isRequired() && !dataValue) {
      return true;
    }

    if (this.isRequired() && typeof dataValue !== "number") {
      return false;
    }

    return true;
  };
}

export { Serializer, CharField, IntegerField };
