import { CREATE, DELETE_MANY, GET_LIST, GET_MANY, GET_MANY_REFERENCE } from './const'

/**
 *
 * @param {[Object]} jsonResults: rows of result with an "_id" field (moleculer.services default id name)
 * @returns {[Object]} these rows with a new id field (react admin default id name), copy of _id
 *
 */
function convertIdFields (jsonResults) {
  return jsonResults.map(e => ({ id: e._id, ...e }))
}

/**
 *
 * @param {Object} object with an "_id" field (moleculer.services default id name)
 * @returns {Object} these rows with a new id field (react admin default id name), copy of _id
 *
 */
function convertIdField (data) {
  // already an id or no _id : stay as-is
  if (data.id !== undefined || data._id === undefined)
    return data
  // add _id = id
  return { id: data._id, ...data }
}


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
    case GET_LIST:
    case GET_MANY_REFERENCE:
      return {
        data : convertIdFields(json.rows),
        total: json.total
        // validUntil not used
      }

    case GET_MANY:
      return {
        data : convertIdFields(json.rows),
        // no total in this case
      }
    case CREATE:
      // why params, all is in json !!      return { data: { ...params.data, id: json.id } }
      return { data: convertIdField(json)}

    case DELETE_MANY:
      return { data: json || [] }

    default:
      return { data: json }
  }
}

module.exports = {
  convertResponse
}
