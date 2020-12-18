'use strict'
import {
  convertRequest,
  createOne,
  deleteOne,
  getList,
  getMany,
  getManyReference,
  getOne,
  sort,
  unconvertIdField,
  uncustomizeItemFields,
  updateOne
} from '../src/convertRequest'
import { DELETE, GET_ONE, UPDATE } from '../src/const'
import { getIdFieldName } from '../src/convertResponse'

const API_URL = "http://dummy.api.url/"
const RESOURCE = 'dummyResource'

const EXISTING_ID_OPTIONS = {renameFields: { "dummyResource": {"id": "oid", "line":"row"} }}
const TEST_DEFAULT_OPTIONS= { idFields : { "DEFAULT": "_id2"  } } ;



describe('convertRequest', () => {
  beforeAll(() => {})
  afterAll(() => {})

  it('delete', function () {
    const { url, options } = deleteOne({ id: 1234 }, API_URL, RESOURCE)
    expect(url).toEqual(API_URL + '/' + RESOURCE + '/' + '1234')
    expect(options).toStrictEqual({method: 'DELETE'})
  })

  it('uncustomizeItemFields', function () {
    let un
    un = uncustomizeItemFields({
      oid: 'ABC',
      str: 'string123',
      num: 1234
    }, RESOURCE, EXISTING_ID_OPTIONS)
    expect(un).toStrictEqual( { id: "ABC", num:1234, str:"string123"})
  })

  it('unconvertIdField', function () {
    let un
    let idFieldName = getIdFieldName("xxx", TEST_DEFAULT_OPTIONS)
    expect(idFieldName).toEqual("_id2")

    un = unconvertIdField({
      id: 12,
      oid: 'ABC',
      str: 'string123',
      num: 1234
    }, idFieldName )
    expect(un).toStrictEqual( { _id2:12, oid: "ABC", num:1234, str:"string123"})

    un = unconvertIdField({
      id: 12,
      oid: 'ABC',
      str: 'string123',
      num: 1234
    }, "_id" )
    expect(un).toStrictEqual( { _id:12, oid: "ABC", num:1234, str:"string123"})



  })

  it('create', function () {
    const { url, options }  = createOne({
      data: {
        oid : "ABC",
        str: 'string123',
        num: 1234
      }
    }, API_URL, RESOURCE, EXISTING_ID_OPTIONS)
    expect(url).toBe(API_URL + '/' + RESOURCE)
    expect(options).toEqual({
      method: 'POST',
      body: '{"str":"string123","num":1234,"id":"ABC"}'
    })
  })

  it('getList', function () {
    // test1
    let params = {
      pagination: {
        page: 2,
        perPage: 10
      },
      sort: {
        field: 'f1',
        order: 'ASC'
      },
      filter: {
        todo: 'todoFilter'
      },
      id: 'idParam'
    }
    let convert = getList(params, API_URL, RESOURCE)
    expect(convert.url).toEqual(API_URL + '/' + RESOURCE + '?page=2&pageSize=10&query=%7B%22todo%22%3A%22todoFilter%22%7D&sort=-f1')
    expect(convert.options).toStrictEqual({})
    // test2 : sort desc + target
    params = {
      pagination: {
        page: 2,
        perPage: 10
      },
      sort: {
        field: 'f1',
        order: 'DESC'
      },
      filter: {
        todo: 'todoFilter'
      },
      id: 'idParam',
      target: 'targetName'
    }
    convert = getList(params, API_URL, RESOURCE)
    expect(convert.url).toEqual(API_URL + '/' + RESOURCE + '?page=2&pageSize=10&query=%7B%22todo%22%3A%22todoFilter%22%7D&sort=f1')
    expect(convert.options).toStrictEqual({})
    // test3 : filter.search + target
    params = {
      pagination: {
        page: 2,
        perPage: 10
      },
      sort: {
        field: 'f1',
        order: 'DESC'
      },
      filter: {
        search: 'SearchFilter'
      },
      id: 'idParam'
    }
    convert = getList(params, API_URL, RESOURCE)
    expect(convert.url).toEqual(API_URL + '/' + RESOURCE + '?page=2&pageSize=10&query=%7B%7D&search=SearchFilter&sort=f1')
    expect(convert.options).toStrictEqual({})
  })

  it('getMany', function () {
    const { url, options } = getMany({ ids: ['id1', 'id2', 'id3'] }, API_URL, RESOURCE)
    expect(url).toBe(API_URL + '/' + RESOURCE + '?filter=%7B%22id%22%3A%5B%22id1%22%2C%22id2%22%2C%22id3%22%5D%7D')
    expect(options).toStrictEqual({})
  })

  it('getManyReference', function () {
    let params = {
      pagination: {
        page: 2,
        perPage: 10
      },
      sort: {
        field: 'f1',
        order: 'DESC'
      },
      filter: {
        search: 'SearchFilter'
      },
      id: 'idParam',
      target: 'targetName'
    }
    const { url, options } = getManyReference(params, API_URL, RESOURCE)
    expect(url).toEqual(API_URL + '/' + RESOURCE + '?page=2&pageSize=10&query=%7B%22search%22%3A%22SearchFilter%22%2C%22targetName%22%3A%22idParam%22%7D&sort=f1')
    expect(options).toStrictEqual({})
  })

  it('getOne', function () {
    const { url, options } = getOne({ id: 1234 }, API_URL, RESOURCE)
    expect(url).toEqual(API_URL + '/' + RESOURCE + '/' + '1234')
    expect(options).toStrictEqual({})
  })

  it('update', function () {
    const { url, options } = updateOne({
      id: 1234,
      data: {id: 1234, oid: "ABC", field1: 'f1', row: ['f2a', 'f2b'] }
    }, API_URL, RESOURCE, EXISTING_ID_OPTIONS)
    expect(url).toEqual(API_URL + '/' + RESOURCE + '/' + '1234')
    expect(options).toStrictEqual({
      body: '{"field1":"f1","_id":1234,"id":"ABC","line":["f2a","f2b"]}',
      method: 'PUT'
    })
  })
  it('sort', function () {
    expect(sort('fieldName', 'ASC')).toEqual('-fieldName')
    // to bad, case dependant, is it normal
    expect(sort('fieldName', 'asc')).toEqual('fieldName')
    expect(sort('fieldName', 'DESC')).toEqual('fieldName')
    expect(sort('fieldName', 'AnyOtherText')).toEqual('fieldName')
  })

  it('convertRequest Get', function () {
    let { url, options } = convertRequest(API_URL, GET_ONE, RESOURCE, { id: 1234}, {})
    expect(url).toEqual(API_URL + '/' + RESOURCE + '/' + '1234')
    expect(options).toStrictEqual({})
  })

  it('convertRequest Delete', function () {
    let { url, options } = convertRequest(API_URL, DELETE, RESOURCE, { id: 1234}, {})
    expect(url).toEqual(API_URL + '/' + RESOURCE + '/' + '1234')
    expect(options).toStrictEqual({"method": "DELETE"})
  })

  it('convertRequest Update', function () {
    let { url, options } = convertRequest(API_URL, UPDATE, RESOURCE, {
      id: 1234,
      data: {id: 1234, oid: "ABC", field1: 'f1', row: ['f2a', 'f2b'] }
    }, EXISTING_ID_OPTIONS)
    expect(url).toEqual(API_URL + '/' + RESOURCE + '/' + '1234')
    expect(options).toStrictEqual({
      body: '{"field1":"f1","_id":1234,"id":"ABC","line":["f2a","f2b"]}',
      method: 'PUT'
    })
  })


  it('convertRequest Exception', function () {
    const test = () => {
      convertRequest(API_URL, "UNKNOWN ORDER", RESOURCE, { id: 1234}, {})
    };
    expect(test).toThrow(Error);
  })

})
