import { Builder } from "../core/builder";
import type { CompiledSchema } from "../core/types";

class EnumSchema<T extends readonly string[]> extends Builder<T[number]> {
  constructor(private values: T) {
    super();
    this.rules.push({
      name: "enum",
      message: `Expected one of: ${values.join(", ")}`,
      validate(value) {
        return values.includes(value);
      },
    });
  }

  compile(): CompiledSchema<T[number]> {
    return {
      optional: this.isOptional,
      type: "enum",
      rules: this.rules,
      defaultValue: this.defaultValue,
      parse(raw) {
        return String(raw) as T[number];
      },
    };
  }
}

/**
 * @function enum_
 * @description Enum validation function, provides pattern to add enum validation rules
 */
export function enum_<T extends readonly string[]>(values: T) {
  return new EnumSchema(values);
}
