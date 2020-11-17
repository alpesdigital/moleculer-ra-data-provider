import { stringify } from 'query-string'
import { GET_ONE, DELETE, GET_MANY, UPDATE, GET_MANY_REFERENCE, CREATE, GET_LIST } from 'ra-core'

const sort = (field, order) => order === "ASC" ? "-".concat(field) : field;


const create = (params, apiUrl, resource) => ({
  url: `${apiUrl}/${resource}`,
  options: {
    method: "POST",
    body: JSON.stringify(params.data)
  }
});

const deleteOne = (params, apiUrl, resource) => ({
  url: `${apiUrl}/${resource}/${params.id}`,
  options: {
    method: "DELETE"
  }
});

const getList = (params, apiUrl, resource) => {
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



const getMany = (params, apiUrl, resource) => {
  const query = {
    filter: JSON.stringify({ id: params.ids })
  }
  return {
    url: `${apiUrl}/${resource}?${stringify(query)}`,
    options: {}
  }
}


const getManyReference = (params, apiUrl, resource) => {
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

const getOne = (params, apiUrl, resource) => ({
  url:`${apiUrl}/${resource}/${params.id}`,
  options: {}
});


const update = (params, apiUrl, resource) => ({
  url: `${apiUrl}/${resource}/${params.id}`,
  options: {
    method: "PUT",
    body: JSON.stringify(params.data)
  }
});


/**
 * @param {string} apiUrl
 * @param {string} type One of the constants appearing at the top of this file, e.g. 'UPDATE'
 * @param {string} resource Name of the resource to fetch, e.g. 'posts'
 * @param {object} params The data request params, depending on the type
 * @returns {object} { url, options } The HTTP request parameters
 */
const convertRequest = (apiUrl, type, resource, params) => {
  let httpRequest = {
    url: "",
    options: {}
  }

  switch (type) {
    case CREATE:
      httpRequest = create(params, apiUrl, resource)
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
      httpRequest = update(params, apiUrl, resource)
      break
    case DELETE:
      httpRequest = deleteOne(params, apiUrl, resource)
      break
    default:
      throw new Error(`Unsupported fetch action type ${type}`)
  }
  return httpRequest
}


module.exports = {
  convertRequest,
  deleteOne,
  create,
  getList,
  getMany,
  getManyReference,
  getOne,
  update,
  sort
}
