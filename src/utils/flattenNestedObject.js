/**
 * Flattens a nested object into a single level object with dot notation for nested keys.
 * @param {Record<string, unknown>} object - The object to flatten.
 * @param {string[]} [properties] - The current path of properties (used for recursion).
 * @param {string[]} [returnedProperties] - The properties to return (used for recursion).
 * @returns {Record<string, unknown>} - The flattened object.
 */
export const flattenNestedObject = (object, properties = [], returnedProperties = []) => {
  const flat = { ...object }

  properties.forEach(property => {
    if (flat[property] && typeof flat[property] === 'object') {
      Object.entries(flat[property]).forEach(([key, value]) => {
        if (returnedProperties.includes(key)) {
          flat[`${property.toLowerCase()}`] = value
        }
      })
      delete flat[property]
    }
  })

  return flat
}