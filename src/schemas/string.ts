import { Builder } from "../core/builder";
import type { CompiledSchema } from "../core/types";

const emailRegex = new RegExp(
  String.raw`(?:[a-z0-9!#$%&'*+=?^_\`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_\`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])`,
  "i",
);

const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

class StringSchema extends Builder<string> {
  minLength(len: number): this {
    this.rules.push({
      name: "minLength",
      message: `Minimum length acceptable only ${len}.`,
      validate(value) {
        return value.length >= len;
      },
    });

    return this;
  }

  regex(regex: RegExp): this {
    this.rules.push({
      name: "regex",
      message: `Invalid string, Regex validation failed.`,
      validate(value) {
        return regex.test(value);
      },
    });

    return this;
  }

  url(urlValue: string): this {
    return this.custom((value) => {
      try {
        const url = new URL(urlValue);
        return true;
      } catch (e) {
        return false;
      }
    }, `Invalid URL value.`);
  }

  email(): this {
    this.rules.push({
      name: "email",
      message: "Invalid email provided.",
      validate(value) {
        return emailRegex.test(value);
      },
    });

    return this;
  }

  uuid(): this {
    this.rules.push({
      name: "uuid",
      message: "",
      validate(value) {
        return uuidRegex.test(value);
      },
    });

    return this;
  }

  compile(): CompiledSchema<string> {
    return {
      type: "string",
      optional: this.isOptional,
      defaultValue: this.defaultValue,
      rules: this.rules,
      parse(raw) {
        return String(raw);
      },
    };
  }
}

/**
 * @function string
 * @description String validation function, provides pattern to add string validation rules
 */
export function string() {
  return new StringSchema();
}
