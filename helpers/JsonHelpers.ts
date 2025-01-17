export type JSONPrimitive = string | number | boolean | null | undefined;

type JSONValue =
  | JSONPrimitive
  | JSONValue[]
  | {
      [key: string]: JSONValue;
    };

// eslint-disable-next-line @typescript-eslint/ban-types
export type NotAssignableToJson = bigint | symbol | Function;

export type JSONCompatible<T> = unknown extends T
  ? never
  : {
      [P in keyof T]: T[P] extends JSONValue
        ? T[P]
        : T[P] extends NotAssignableToJson
        ? never
        : JSONCompatible<T[P]>;
    };

export function toJsonValue<T>(value: JSONCompatible<T>): JSONValue {
  return value;
}

export function safeJsonStringify<T>(data: JSONCompatible<T>) {
  return JSON.stringify(data);
}

export function safeJsonParse(text: string): unknown {
  return JSON.parse(text);
}
