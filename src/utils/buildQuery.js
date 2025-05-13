/**
 * Builds a query object for the specified model and slug.
 * @param {import('sequelize').ModelStatic<import('sequelize').Model<any, any>>} model - The model to build the query for.
 * @param {string | import('qs').ParsedQs | (string | import('qs').ParsedQs)[] | undefined} [slug=null] - The slug to filter the query by.
 * @returns {import('sequelize').Includeable} The query object.
 */
export const buildQuery = (model, slug = undefined) => {
  /** @type {import('sequelize').Includeable} */
  const query = {
    model,
    attributes: ['id', 'name'],
  }

  if (slug) {
    query.where = { slug }
    query.required = true
  }

  return query
}