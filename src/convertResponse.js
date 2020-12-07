import {
  CREATE,
  DELETE,
  DELETE_MANY,
  GET_LIST,
  GET_MANY,
  GET_MANY_REFERENCE,
  GET_ONE,
  UPDATE
} from './const'

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

  let resultData =  Object.assign({}, data); // clone
  // rename _id as id

  resultData.id = resultData[idField]
  delete resultData[idField]
  return resultData
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
 * Translate from data provider (moleculer) to React-Admin
 * @param json {String} json containing rows of data returned by the provider
 * @param resource {String} will rename the fields for this resource
 * @param userOptions {Object} user parameters to customize the response
 * @returns {String} modified response to adapt user's customizations
 */
export const customizeItemFields = (json, resource, userOptions) => {
  if (json === undefined || userOptions === undefined)
    return json

  let customJson =  Object.assign({}, json); // clone
  if (userOptions.renameFields !== undefined && userOptions.renameFields[resource] !== undefined) {
    // loop params
    for ( const [oldFieldName,newFieldName] of Object.entries( userOptions.renameFields[resource] ) ) {
      if (customJson[oldFieldName] !== undefined){
        customJson[newFieldName] = customJson[oldFieldName]
        delete customJson[oldFieldName]
      }
    }
  }

  return customJson
}

export const customizeItemsFields = (json, type, resource, userOptions) => Array.isArray(json) ? json.map(e => customizeItemFields(e, type, resource, userOptions)) : [customizeItemFields(json, type, resource, userOptions)]

/**
 * @param {Object} response HTTP response from fetch()
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The data request params, depending on the type
 * @param {Object} userOptions The idFieds definition, can be overridden by the user for each
 * @returns {Object} Data response
 */
export const convertResponse = (response, type, resource, params, userOptions ) => {
  let { json } = response

  const idField = getIdFieldName(resource, userOptions)

  let data = {}

  switch (type) {
    case CREATE:
    case GET_ONE:
    case UPDATE:
    case DELETE:
      if (json !== undefined) {
        json = customizeItemFields(json, resource, userOptions)
        data = convertIdField(json, idField)
      }
      break

    case GET_LIST:
    case GET_MANY:
    case GET_MANY_REFERENCE:
      data = []
      if (json !== undefined && json.rows) {
        json.rows = customizeItemsFields(json.rows,  resource, userOptions)
        data = convertIdFields(json.rows, idField)
      }
      break

    case DELETE_MANY:
      data = []
      if (json !== undefined) {
        // json is an array here
        json = customizeItemsFields(json, resource, userOptions)
        data = convertIdFields(json, idField)
      }
      break
  }


  switch (type) {
    case GET_LIST:
    case GET_MANY_REFERENCE:
      return {
        data : data,
        total: json.total
        // validUntil not used
      }

    case DELETE_MANY:
    case GET_MANY:
      return {
        data : data,
        // no total in this case
      }


    // get_one, delete, update, create
    default:
      return { data: data }
  }
}

