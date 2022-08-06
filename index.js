import * as serializers from "./serializers.js";
import * as errors from "./errors.js";

class UserSerializer extends serializers.Serializer {
  nome = new serializers.CharField({ required: false });
  idade = new serializers.IntegerField();
}

const userData = { nome: "cauan", idade: 23 };
const serialized = new UserSerializer(userData);

try {
  if (serialized.isValid({ raiseExceptions: true })) {
    console.log("Valid data:");
    console.log(serialized.validatedData);
  } else {
    console.log("Invalid data:");
    console.log(serialized.errors);
  }
} catch (error) {
  if (error instanceof errors.DataValidatorError) {
    console.log(error.message);
  }
}
