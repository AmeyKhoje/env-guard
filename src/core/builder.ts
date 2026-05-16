import type { CompiledSchema, Rule } from "./types";

export abstract class Builder<T> {
  protected rules: Rule<T>[] = [];
  protected isOptional: boolean = false;
  protected defaultValue?: T;

  optional(): this {
    this.isOptional = true;
    return this;
  }

  default(value: T): this {
    this.defaultValue = value;
    return this;
  }

  custom(validate: (value: T) => boolean, message: string) {
    this.rules.push({
      name: "custom",
      message,
      validate,
    });
    return this;
  }

  abstract compile(): CompiledSchema<T>;
}
