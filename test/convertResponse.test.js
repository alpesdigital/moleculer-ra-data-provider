"use strict";
import { convertResponse, getIdFieldName } from '../src/convertResponse'
import { CREATE, DELETE_MANY, GET_LIST, GET_MANY, GET_MANY_REFERENCE, GET_ONE } from '../src/const'

describe("convertResponse", () => {

	beforeAll(() => {});
	afterAll(() =>{});

	const RESOURCE="dummyResource";
	const PARAMS= { data: { info: "dummyData"} } ;
	const EMPTY_PARAMS= {  } ;
	const TEST_DEFAULT_OPTIONS= { idFields : { "DEFAULT": "_id2"  } } ;
  const DEFAULT_BACKEND_ID="_id"

	// moleculer responses for list, many and many format has the same format
  const RESPONSE_ONE = { json:  { _id: "id1234", info: "dummyData"  }}
  const RESPONSE_ONE_ID2 = { json:  { _id2: "id1234", info: "dummyData"  }}
  const RESPONSE_MANY = { json: { rows: [ {_id:1, row: "row1"},{_id:2, row: "row2"},{_id:3, row: "row3"} ], total:10, page:1, pageSize: 3 }}
  const CONVERTED_REPONSE_MANY = { data: [{id:1, _id:1,  row: "row1"},{id:2, _id:2, row: "row2"},{id:3, _id:3, row: "row3"}], total: 10}
  const RESPONSE_MANY2 = { json: { rows: [ {_id2:1, row: "row1"},{_id2:2, row: "row2"},{_id2:3, row: "row3"} ], total:10, page:1, pageSize: 3 }}
  const CONVERTED_REPONSE_MANY2 = { data: [{id:1, _id2:1,  row: "row1"},{id:2, _id2:2, row: "row2"},{id:3, _id2:3, row: "row3"}], total: 10}


  it("getIdFieldName", function() {
    expect(getIdFieldName("toto")).toEqual(DEFAULT_BACKEND_ID);

    let userOptions
    // Change _Id for some resources
    userOptions = {idFields: {"toto": "myId", "tutu": "myId2"}}
    expect(getIdFieldName( "toto", userOptions )).toEqual("myId");
    expect(getIdFieldName( "tutu", userOptions )).toEqual("myId2");
    expect(getIdFieldName( "others", userOptions )).toEqual(DEFAULT_BACKEND_ID);

    // change default _Id
    // all
    userOptions = TEST_DEFAULT_OPTIONS
    expect(getIdFieldName("toto", userOptions)).toEqual(userOptions.idFields.DEFAULT);

    // all with exception
    userOptions = {idFields: {"toto": "myId", "DEFAULT": "_id3" }}
    expect(getIdFieldName( "toto", userOptions )).toEqual("myId");
    expect(getIdFieldName( "others", userOptions )).toEqual(userOptions.idFields.DEFAULT);
	});

  it("convertResponse simple", function() {
    let convert

    // default
    convert = convertResponse( RESPONSE_ONE, GET_ONE, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual({"_id": "id1234","id": "id1234", info: "dummyData"});

    // custom default _id
    convert = convertResponse( RESPONSE_ONE_ID2, GET_ONE, RESOURCE, EMPTY_PARAMS, TEST_DEFAULT_OPTIONS );
    expect(convert.data).toStrictEqual({"_id2": "id1234","id": "id1234", info: "dummyData"});

    // no _id -> no change
    convert = convertResponse( RESPONSE_ONE_ID2, GET_ONE, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual(RESPONSE_ONE_ID2.json);

  });

	it("convertResponse create", function() {
    let convert = convertResponse( RESPONSE_ONE, CREATE, RESOURCE, PARAMS );
    expect(convert.data).toStrictEqual({"_id": "id1234","id": "id1234", "info": "dummyData"});
	});

	it("convertResponse get_list", function() {
    let convert = convertResponse( RESPONSE_MANY, GET_LIST, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual(CONVERTED_REPONSE_MANY.data);
    expect(convert.total).toEqual(CONVERTED_REPONSE_MANY.total);
	});

	it("convertResponse get_many", function() {
    let convert = convertResponse( RESPONSE_MANY, GET_MANY, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual(CONVERTED_REPONSE_MANY.data);
    expect(convert.total).toBeUndefined() // no total in this case : https://marmelab.com/react-admin/DataProviders.html

    convert = convertResponse( RESPONSE_MANY2, GET_MANY, RESOURCE, EMPTY_PARAMS, TEST_DEFAULT_OPTIONS );
    expect(convert.data).toStrictEqual(CONVERTED_REPONSE_MANY2.data);
    expect(convert.total).toBeUndefined() // no total in this case : https://marmelab.com/react-admin/DataProviders.html
  });


  it("convertResponse get_many_reference", function() {
    let convert = convertResponse( RESPONSE_MANY, GET_MANY_REFERENCE, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual(CONVERTED_REPONSE_MANY.data);
    expect(convert.total).toEqual(CONVERTED_REPONSE_MANY.total);
  });

  it("convertResponse deleteMany", function() {
    let convert

    convert= convertResponse( { json: [{ _id: "id1234" }, { _id: "id12345" }] }, DELETE_MANY, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual([{"_id": "id1234","id": "id1234"},{"_id": "id12345","id": "id12345"}]);

    convert = convertResponse( { json: [{ _id3: "id1234" }, { _id3: "id12345" }] }, DELETE_MANY, RESOURCE, EMPTY_PARAMS , { idFields: {"dummyResource": "_id3"}});
    expect(convert.data).toStrictEqual([{"_id3": "id1234","id": "id1234"},{"_id3": "id12345","id": "id12345"}]);

    const responseEmpty = {  };
    convert = convertResponse( responseEmpty, DELETE_MANY, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual([]);

    const responseJsonEmpty = {  json: {} };
    convert = convertResponse( responseJsonEmpty, DELETE_MANY, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual([]);

  });

});
