import type { CompiledSchema, EnvError, EnvResult, Infer } from "./types";

export function env<T extends Record<string, CompiledSchema<any>>>(
  schema: T,
  values = process.env,
): EnvResult<{
  [K in keyof T]: Infer<T[K]>;
}> {
  const output: Record<string, unknown> = {};

  const errors: EnvError[] = [];

  for (const key in schema) {
    const definition = schema[key];
    const raw = values[key];

    if (raw === null || raw === undefined || raw === "") {
      if (definition.defaultValue !== undefined) {
        output[key] = definition.defaultValue;
        continue;
      }

      if (definition.optional) {
        output[key] = undefined;
        continue;
      }

      errors.push({
        key,
        message: `${key} value is required`,
        received: raw,
      });

      continue;
    }

    let parsed: unknown;

    try {
      parsed = definition.parse(raw);
    } catch (error: any) {
      errors.push({
        key,
        message: error?.message ?? `Invalid value passed for ${key}`,
        received: raw,
      });
      continue;
    }

    for (const rule of definition.rules) {
      const valid = rule.validate(parsed);
      if (!valid) {
        errors.push({
          key,
          message: rule.message || `Validation failed for ${rule.name}`,
          received: parsed,
        });
      }
    }

    if (Array.isArray(parsed) && "_errors" in parsed) {
      const parsedErrors = parsed._errors as Array<{
        index: number;
        message: string;
        received: unknown;
      }>;
      errors.push(
        ...parsedErrors.map(
          (err) =>
            ({
              key: `${key}|${err.index}`,
              message: err.message,
              received: err.received,
            }) as EnvError,
        ),
      );

      delete parsed._errors;
    }

    output[key] = parsed;
  }

  return {
    success: !errors.length,
    data: output as {
      [K in keyof T]: Infer<T[K]>;
    },
    errors,
    unwrap() {
      if (errors.length) {
        throw new Error(
          errors
            .map(
              (err) =>
                `Key: ${err.key}, Message: ${err.message}, Received: ${err.received}`,
            )
            .join("\n"),
        );
      }
      return output as {
        [K in keyof T]: Infer<T[K]>;
      };
    },
  };
}
