// import { stringify } from 'query-string'
const stringify = require("query-string").stringify;
const RA_CORE=require("ra-core");
// import { GET_LIST, GET_ONE, GET_MANY, GET_MANY_REFERENCE, CREATE, UPDATE, DELETE } from "ra-core"

const sort = (field, order) => order === "ASC" ? "-".concat(field) : field;


const create = (params, apiUrl, resource) => ({
  url: `${apiUrl}/${resource}`,
  options: {
    method: "POST",
    body: JSON.stringify(params.data)
  }
});

function deleteRequest(params, apiUrl, resource){
  return {
    url: `${apiUrl}/${resource}/${params.id}`,
    options: {
      method: "DELETE"
    }
  }
};

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
  return `${apiUrl}/${resource}?${stringify(request)}`
};



const getMany = (params, apiUrl, resource) => {
  const query = {
    filter: JSON.stringify({ id: params.ids })
  }
  return `${apiUrl}/${resource}?${stringify(query)}`
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
  return `${apiUrl}/${resource}?${stringify(query)}`
};

const getOne = (params, apiUrl, resource) => `${apiUrl}/${resource}/${params.id}`;

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
    case RA_CORE.GET_LIST: {
      httpRequest.url = getList(params, apiUrl, resource)
      break
    }
    case RA_CORE.GET_ONE:
      httpRequest.url = getOne(params, apiUrl, resource)
      break
    case RA_CORE.GET_MANY: {
      httpRequest.url = getMany(params, apiUrl, resource)
      break
    }
    case RA_CORE.GET_MANY_REFERENCE: {
      httpRequest.url = getManyReference(params, apiUrl, resource)
      break
    }
    case RA_CORE.UPDATE:
      httpRequest = update(params, apiUrl, resource)
      break
    case RA_CORE.CREATE:
      httpRequest = create(params, apiUrl, resource)
      break
    case RA_CORE.DELETE:
      httpRequest = deleteRequest(params, apiUrl, resource)
      break
    default:
      throw new Error(`Unsupported fetch action type ${type}`)
  }
  return httpRequest
}


module.exports = {
  convertRequest,
  deleteRequest,
  create,
}
