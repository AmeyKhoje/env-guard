import type { CompiledSchema, Rule } from "./types";

/**
 * @class Builder
 * @description Builder class as common extraction for schema
 */
export abstract class Builder<T> {
  protected rules: Rule<T>[] = [];
  protected isOptional: boolean = false;
  protected defaultValue?: T;

  /**
   * @function optional
   * @description Marks as optional variable
   */
  optional(): this {
    this.isOptional = true;
    return this;
  }

  /**
   * @function default
   * @description Set default value for this variable
   */
  default(value: T): this {
    this.defaultValue = value;
    return this;
  }

  /**
   * @function custom
   * @description Adds custom validation rules to variable
   */
  custom(validate: (value: T) => boolean, message: string) {
    this.rules.push({
      name: "custom",
      message,
      validate,
    });
    return this;
  }

  /**
   * @abstract compile
   * @description Method to be implemeted by all consumers
   */
  abstract compile(): CompiledSchema<T>;
}
