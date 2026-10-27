export async function find<type>(
  property: keyof type,
  objects: Array<type>,
  value: any,
): Promise<type | null> {
  for (const object of objects) {
    if (object[property] === value) {
      return object;
    }
  }
  return null;
}
