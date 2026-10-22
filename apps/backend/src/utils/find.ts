export async function find<type>(
  property: keyof type,
  objects: Array<type>,
  value: string,
): Promise<any | null> {
  for (const object of objects) {
    if (object[property] === value) {
      return object[property];
    }
  }
  return null;
}
