import { Builder } from "../core/builder";
import type { CompiledSchema } from "../core/types";

class ArraySchema<T> extends Builder<T[]> {
  constructor(private item: CompiledSchema<T>) {
    super();
  }

  compile(): CompiledSchema<T[]> {
    const item = this.item;
    return {
      type: "array",
      optional: this.isOptional,
      defaultValue: this.defaultValue,
      rules: this.rules,
      parse(raw) {
        if (raw === null || raw === undefined) {
          throw new Error("Array required");
        }

        const parsed = String(raw)
          .split(",")
          .map((val) => item.parse(val.trim()));

        const errors: Array<{
          index: number;
          message: string;
          received: unknown;
        }> = [];

        parsed.forEach((parsedItem, index) => {
          for (const rule of item.rules) {
            if (!rule.validate(parsedItem)) {
              errors.push({
                index,
                message: rule.message,
                received: parsedItem,
              });
            }
          }
        });

        return Object.assign(parsed, {
          _errors: errors,
        });
      },
    };
  }
}

/**
 * @function array
 * @description Array validation function, provides pattern to add array validation rules
 */
export function array<T>(schema: CompiledSchema<T>) {
  return new ArraySchema(schema);
}
