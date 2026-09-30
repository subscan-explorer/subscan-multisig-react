/** Metadata names may be camelCase while Call.toJSON() uses snake_case. */
export function callArgumentValue(args: Record<string, unknown> | undefined, name = ''): unknown {
  if (!args) return undefined;
  if (Object.prototype.hasOwnProperty.call(args, name)) return args[name];
  const snakeName = name.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  return args[snakeName];
}
