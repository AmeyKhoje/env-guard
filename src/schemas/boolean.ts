import { Builder } from "../core/builder";
import type { CompiledSchema } from "../core/types";

const TruthyValues = ["1", "true", "yes", "on"];
const FalsyValues = ["0", "false", "no", "off"];

class BooleanSchema extends Builder<boolean> {
  truthy(values: string[] = TruthyValues): this {
    this.rules.push({
      message: "Invalid truthy value passed",
      name: "truthy",
      validate(value) {
        return (
          value === true || values.includes(String(value).trim().toLowerCase())
        );
      },
    });

    return this;
  }

  falsy(values: string[] = FalsyValues): this {
    this.rules.push({
      message: "Invalid falsy value passed",
      name: "truthy",
      validate(value) {
        return (
          value === false || values.includes(String(value).trim().toLowerCase())
        );
      },
    });

    return this;
  }

  compile(): CompiledSchema<boolean> {
    return {
      optional: this.isOptional,
      defaultValue: this.defaultValue,
      rules: this.rules,
      type: "boolean",
      parse(raw) {
        if (raw === null) {
          throw new Error("Boolean required.");
        }
        const value = String(raw).trim().toLowerCase();

        if (TruthyValues.includes(value)) {
          return true;
        }

        if (FalsyValues.includes(value)) {
          return false;
        }

        throw new Error("Invalid boolean value.");
      },
    };
  }
}

/**
 * @function boolean
 * @description Boolean validation function, provides pattern to add boolean validation rules
 */
export function boolean() {
  return new BooleanSchema();
}
