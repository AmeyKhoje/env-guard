import { Builder } from "../core/builder";
import type { CompiledSchema } from "../core/types";

class NumberSchema extends Builder<number> {
  min(value: number) {
    this.rules.push({
      message: `Minimum value required ${value}.`,
      name: "min",
      validate(x) {
        return x >= value;
      },
    });

    return this;
  }

  max(value: number) {
    this.rules.push({
      name: "min",
      message: `Maximum value allowed ${value}.`,
      validate(x) {
        return x <= value;
      },
    });
    return this;
  }

  integer() {
    this.rules.push({
      name: "integer",
      message: `Integer allowed only`,
      validate: Number.isInteger,
    });
    return this;
  }

  compile(): CompiledSchema<number> {
    return {
      type: "number",
      optional: this.isOptional,
      defaultValue: this.defaultValue,
      rules: this.rules,
      parse(raw: string) {
        const parsed = Number(raw);
        if (Number.isNaN(parsed)) {
          throw new Error("");
        }
        return parsed;
      },
    };
  }
}

export function number() {
  return new NumberSchema();
}
