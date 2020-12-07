import { stringify } from 'query-string'
import { GET_ONE, DELETE, GET_MANY, UPDATE, GET_MANY_REFERENCE, CREATE, GET_LIST } from './const'
import { getIdFieldName } from './convertResponse'


export const sort = (field, order) => order === "ASC" ? "-".concat(field) : field;

/*
  Translate from React-Admin to data provider (moleculer)
 */
export const uncustomizeItemFields = (json, resource, userOptions) => {
  if (json === undefined || userOptions === undefined)
    return json

  let customJson =  Object.assign({}, json); // clone
  if (userOptions.renameFields !== undefined && userOptions.renameFields[resource] !== undefined) {
    // loop params
    for ( const [oldFieldName,newFieldName] of Object.entries( userOptions.renameFields[resource] ) ) {
      if (customJson[newFieldName] !== undefined){
        customJson[oldFieldName] = customJson[newFieldName]
        delete customJson[newFieldName]
      }
    }
  }

  return customJson
}

export const unconvertIdField = (data, idField) => {
  // already an _id or no id : stay as-is
  if (data.id === undefined || data[idField] !== undefined)
    return data

  let resultData =  Object.assign({}, data); // clone

  // rename id as _id
  resultData[idField] = resultData.id
  delete resultData.id
  return resultData
}

export const applyOptions = (params, resource, userOptions) => {
  const idField = getIdFieldName(resource, userOptions)
  return uncustomizeItemFields( unconvertIdField(params, idField), resource, userOptions)
};



export const createOne = (params, apiUrl, resource, userOptions) => ({
  url: `${apiUrl}/${resource}`,
  options: {
    method: "POST",
    body: JSON.stringify(applyOptions(params.data, resource, userOptions))
  }
});

export const deleteOne = (params, apiUrl, resource) => ({
  url: `${apiUrl}/${resource}/${params.id}`,
  options: {
    method: "DELETE"
  }
});

export const getList = (params, apiUrl, resource) => {
  const { page, perPage } = params.pagination
  const { field, order } = params.sort
  const { search } = params.filter

  const request = {
    sort: sort(field, order),
    pageSize: JSON.stringify(perPage),
    page: JSON.stringify(page)
  }

  let query = Object.assign({}, params.filter)

  if (search) {
    delete query.search
    request.search = search
  }

  request.query = JSON.stringify(query)
  return {
    url: `${apiUrl}/${resource}?${stringify(request)}`,
    options: {}
  }
};



export const getMany = (params, apiUrl, resource) => {
  const query = {
    filter: JSON.stringify({ id: params.ids })
  }
  return {
    url: `${apiUrl}/${resource}?${stringify(query)}`,
    options: {}
  }
}


export const getManyReference = (params, apiUrl, resource) => {
  const { page, perPage } = params.pagination
  const { field, order } = params.sort
  const query = {
    sort: sort(field, order),
    pageSize: JSON.stringify(perPage),
    page: JSON.stringify(page),
    query: JSON.stringify({
      ...params.filter,
      [params.target]: params.id
    })
  }
  return {
    url:`${apiUrl}/${resource}?${stringify(query)}`,
    options: {}
  }
};

export const getOne = (params, apiUrl, resource) => ({
  url:`${apiUrl}/${resource}/${params.id}`,
  options: {}
});


export const updateOne = (params, apiUrl, resource, userOptions) => ({
  url: `${apiUrl}/${resource}/${params.id}`,
  options: {
    method: "PUT",
    body: JSON.stringify(applyOptions(params.data, resource, userOptions))
  }
});


/**
 * @param {string} apiUrl
 * @param {string} type One of the constants appearing at the top of this file, e.g. 'UPDATE'
 * @param {string} resource Name of the resource to fetch, e.g. 'posts'
 * @param {object} params The data request params, depending on the type
 * @param {object} userOptions
 * @returns {object} { url, options } The HTTP request parameters
 */
export const convertRequest = (apiUrl, type, resource, params, userOptions) => {
  let httpRequest = {
    url: "",
    options: {}
  }

  switch (type) {
    case CREATE:
      httpRequest = createOne(params, apiUrl, resource, userOptions)
      break
    case GET_ONE:
      httpRequest = getOne(params, apiUrl, resource)
      break
    case GET_LIST:
      httpRequest = getList(params, apiUrl, resource)
      break
    case GET_MANY:
      httpRequest = getMany(params, apiUrl, resource)
      break
    case GET_MANY_REFERENCE:
      httpRequest = getManyReference(params, apiUrl, resource)
      break
    case UPDATE:
      httpRequest = updateOne(params, apiUrl, resource, userOptions)
      break
    case DELETE:
      httpRequest = deleteOne(params, apiUrl, resource)
      break
    default:
      throw new Error(`Unsupported fetch action type ${type}`)
  }
  return httpRequest
}

