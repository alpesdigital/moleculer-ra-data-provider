const RA_CORE=require("ra-core");

/**
 * @param {Object} response HTTP response from fetch()
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The data request params, depending on the type
 * @returns {Object} Data response
 */
const convertResponse = (response, type, resource, params) => {
  const { json } = response
  switch (type) {
    case RA_CORE.GET_LIST:
    case RA_CORE.GET_MANY_REFERENCE:
      return {
        data: json.rows,
        total: json.rows.length
        // TODO pagination info if any ???
      }
    case RA_CORE.CREATE:
      return { data: { ...params.data, id: json.id } }

    case RA_CORE.DELETE_MANY:
      return { data: json || [] }

    default:
      return { data: json }
  }
}

module.exports = {
  convertResponse
}
