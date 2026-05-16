export type Rule<T> = {
  name: string;
  validate(value: T): boolean;
  message: string;
};

export interface CompiledSchema<T> {
  type: string;
  optional: boolean;
  defaultValue?: T;
  parse(raw: string | undefined): T;
  rules: Rule<T>[];
}

export type Infer<T> = T extends CompiledSchema<infer U> ? U : never;

export type EnvError = {
  key: string;
  message: string;
  received: unknown;
};

export type EnvSuccess<T> = {
  success: true;
  data: T;
  unwrap(): T;
};

export type EnvFailure = {
  success: false;
  errors: EnvError[];
  unwrap(): never;
};

export type EnvResult<T> = {
  success: boolean;

  data: Partial<T>;

  errors: EnvError[];

  unwrap(): T;
};
