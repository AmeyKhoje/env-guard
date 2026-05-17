# @ameykhoje/env-guard

Type-safe environment variable validation for JavaScript and TypeScript.

Validate, transform and safely access environment variables with support for:

* String validation
* Number validation
* Enum validation
* Boolean parsing
* Arrays
* Optional values
* Defaults
* Custom validators
* Partial success with collected errors
* End-to-end TypeScript inference

---

## Installation

```bash
npm install @ameykhoje/env-guard
```

or

```bash
yarn add @ameykhoje/env-guard
```

---

## Quick Start

```ts
import {
  env,
  string,
  number,
} from "@ameykhoje/env-guard";

const config = env(
  {
    VITE_API_URL:
      string()
        .url()
        .compile(),

    VITE_PORT:
      number()
        .min(1000)
        .max(9999)
        .compile(),
  },

  import.meta.env,
);

console.log(config.success);

console.log(config.data);
```

Result:

```ts
{
  success: true,

  data: {
    VITE_API_URL:
      "https://api.com",

    VITE_PORT:
      3000
  },

  errors: []
}
```

---

## Parsing Result

`env()` never crashes automatically.

```ts
const result =
  env(schema);

if (!result.success) {
  console.log(
    result.errors,
  );
}

console.log(
  result.data,
);
```

Force strict mode:

```ts
const config =
  result.unwrap();
```

Throws when validation fails.

---

## String Builder

```ts
string()
  .minLength(4)
  .regex(/abc/)
  .email()
  .url()
  .uuid()
  .optional()
  .default("value")
  .compile()
```

Example:

```ts
USERNAME:

string()
  .minLength(3)
  .compile()
```

---

## Number Builder

```ts
number()
  .min(1)
  .max(100)
  .optional()
  .default(10)
  .compile()
```

Example

```ts
PORT:

number()
  .min(1000)
  .max(9999)
  .compile()
```

---

## Boolean Builder

```ts
boolean()
  .default(false)
  .optional()
  .compile()
```

Supports:

```env
DEBUG=true
DEBUG=false
DEBUG=1
DEBUG=0
```

---

## Array Builder

```ts
array(
  number()
    .min(5)
    .compile(),
)

.compile()
```

Environment:

```env
PORTS=10,20,30
```

Result:

```ts
[10,20,30]
```

Nested validation supported:

```ts
array(
  number()
    .min(5)
    .max(100)
    .compile(),
)
```

---

## Optional Values

```ts
TOKEN:

string()
  .optional()
  .compile()
```

Missing value:

```ts
TOKEN === undefined
```

---

## Defaults

```ts
HOST:

string()
  .default(
    "localhost",
  )

  .compile()
```

Missing value:

```ts
HOST === "localhost"
```

---

## Custom Validation

```ts
string()

.custom(
  value =>
    value.startsWith(
      "sk_",
    ),

  "Invalid API key",
)

.compile()
```

---

## Email Validation

```ts
EMAIL:

string()
  .email()
  .compile()
```

---

## UUID Validation

```ts
ID:

string()
  .uuid()
  .compile()
```

---

## Result Shape

Success:

```ts
{
  success: true,

  data: { ... },

  errors: []
}
```

Failure:

```ts
{
  success: false,

  data: {
    partial:
      "values"
  },

  errors: [
    {
      key:
        "PORT",

      message:
        "Minimum acceptable only 1000",

      received:
        500
    }
  ]
}
```

---

## Example With Vite

`.env`

```env
VITE_API_URL=https://api.com
VITE_PORT=3000
```

Usage:

```ts
const config =
  env(
    {
      VITE_API_URL:
        string()
          .url()
          .compile(),

      VITE_PORT:
        number()
          .compile(),
    },

    import.meta.env,
  );
```

---

## Example With Node.js

```ts
const config =
  env(
    schema,
    process.env,
  );
```

## Upcoming Features

* Number Validation - Posivite, Negative, Finite
* Array - Unique Elements, Non Empty, Length
* Date(new)
* Transformation (new)
* Built-in dotenv loading
* Multiple env support
* Prefix validation. Eg. VITE_, NEXT_PUBLIC_
* Asynchronous validations
* Generate .env.example

---

## License

MIT
