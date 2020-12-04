import { DELETE_MANY, GET_LIST, GET_MANY, GET_MANY_REFERENCE } from './const'

/**
 *
 * @param {[Object]} jsonResults: rows of result with an "_id" field (moleculer.services default id name)
 * @returns {[Object]} these rows with a new id field (react admin default id name), copy of _id
 *
 */
function convertIdFields (jsonResults, idField) {
  return Array.isArray(jsonResults) ? jsonResults.map(e => convertIdField(e, idField)) : []
}

/**
 *
 * @param {Object} object with an "_id" field (moleculer.services default id name)
 * @returns {Object} these rows with a new id field (react admin default id name), copy of _id
 *
 */
function convertIdField (data, idField) {
  // already an id or no _id : stay as-is
  if (data.id !== undefined || data[idField] === undefined)
    return data
  // add _id = id
  return { id: data[idField], ...data }
}

/**
 * @param resource {String} will return the backend idField for this resource
 * @param userOptions {Object} user parameters to customize resource's idField or all idField
 * @returns {String} name of the if field; default is "_id" in moleculer
 */
export const getIdFieldName = (resource, userOptions) => {
  const safeUserOptionsIdField = userOptions ? userOptions.idFields : {}
  const options = { idFields: { "DEFAULT": "_id", ...safeUserOptionsIdField } }
  return options.idFields[resource] ? options.idFields[resource] : options.idFields.DEFAULT
}

/**
 * @param {Object} response HTTP response from fetch()
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The data request params, depending on the type
 * @param {Object} userOptions The idFieds definition, can be overridden by the user for each
 * @returns {Object} Data response
 */
export const convertResponse = (response, type, resource, params, userOptions) => {
  const { json } = response

  const idField = getIdFieldName(resource, userOptions)

  switch (type) {
    case GET_LIST:
    case GET_MANY_REFERENCE:
      return {
        data : convertIdFields(json.rows, idField),
        total: json.total
        // validUntil not used
      }

    case GET_MANY:
      return {
        data : convertIdFields(json.rows, idField),
        // no total in this case
      }

    // case CREATE:
    //   // why params, all is in json !!      return { data: { ...params.data, id: json.id } }
    //   return { data: convertIdField(json)}

    case DELETE_MANY:
      return { data: convertIdFields(json, idField) }

      // get_one, delete, update, create
    default:
      return { data: convertIdField(json, idField) }
  }
}

