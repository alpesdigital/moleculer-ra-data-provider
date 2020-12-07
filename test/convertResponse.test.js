"use strict";
import {
  convertResponse,
  customizeItemFields,
  customizeItemsFields,
  getIdFieldName
} from '../src/convertResponse'
import { CREATE, DELETE_MANY, GET_LIST, GET_MANY, GET_MANY_REFERENCE, GET_ONE } from '../src/const'

describe("convertResponse", () => {

	beforeAll(() => {});
	afterAll(() =>{});

	const RESOURCE="dummyResource";
	const PARAMS= { data: { info: "dummyData"} } ;
	const EMPTY_PARAMS= {  } ;
	const EMPTY_OPTIONS= {  } ;
	const TEST_DEFAULT_OPTIONS= { idFields : { "DEFAULT": "_id2"  } } ;
  const DEFAULT_BACKEND_ID="_id"

	// moleculer responses for list, many and many format has the same format
  const RESPONSE_ONE = { json:  { _id: "id1234", info: "dummyData"  }}
  const RESPONSE_ONE_ID2 = { json:  { _id2: "id1234", info: "dummyData"  }}
  const RESPONSE_MANY = { json: { rows: [ {_id:1, row: "row1"},{_id:2, row: "row2"},{_id:3, row: "row3"} ], total:10, page:1, pageSize: 3 }}
  const CONVERTED_REPONSE_MANY = { data: [{id:1,   row: "row1"},{id:2,  row: "row2"},{id:3,  row: "row3"}], total: 10}
  const RESPONSE_MANY2 = { json: { rows: [ {_id2:1, row: "row1"},{_id2:2, row: "row2"},{_id2:3, row: "row3"} ], total:10, page:1, pageSize: 3 }}
  const CONVERTED_REPONSE_MANY2 = { data: [{id:1,   row: "row1"},{id:2,  row: "row2"},{id:3,  row: "row3"}], total: 10}
  const RESPONSE_EMPTY = { json: { }}
  const CUSTOM_RESPONSE_MANY = { json: { rows: [ {_id:1, line: "row1"},{_id:2, line: "row2"},{_id:3, line: "row3"} ], total:10, page:1, pageSize: 3 }}
  const CUSTOM_OPTIONS = {renameFields: { "toto": {"anotherField": "renamedField", "row": "line"} }}

  const RESPONSE_MANY_EXISTING_ID = { json: { rows: [ {_id:1, id: 11, row: "row1"},{_id:2, id:12,  row: "row2"},{_id:3, id:13, row: "row3"} ], total:10, page:1, pageSize: 3 }}
  const EXISTING_ID_OPTIONS = {renameFields: { "toto": {"id": "oid"} }}
  const CONVERTED_RESPONSE_MANY_EXISTING_ID = { data: [ {id:1, oid: 11, row: "row1"},{id:2, oid:12,  row: "row2"},{id:3, oid:13, row: "row3"} ], total:10}


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

  it("customizeItemFields", function() {

    expect(customizeItemFields(undefined,  "toto", CUSTOM_OPTIONS)).toBeUndefined();

    expect(customizeItemFields({},  "toto", CUSTOM_OPTIONS)).toEqual({ } );

    expect(customizeItemFields( RESPONSE_MANY.json.rows[0],   "tutu", CUSTOM_OPTIONS )).toEqual(RESPONSE_MANY.json.rows[0]);

    expect(customizeItemFields( RESPONSE_MANY.json.rows[0],   "toto", CUSTOM_OPTIONS )).toEqual(CUSTOM_RESPONSE_MANY.json.rows[0]);
	});

  it("customizeItemsFields", function() {

    expect(customizeItemsFields(undefined, "toto", CUSTOM_OPTIONS)).toEqual([undefined]);

    // single element instead or array
    expect(customizeItemsFields( RESPONSE_MANY.json.rows[0],   "toto", CUSTOM_OPTIONS )).toEqual([CUSTOM_RESPONSE_MANY.json.rows[0]]);

    expect(customizeItemsFields([], "toto", CUSTOM_OPTIONS)).toEqual([] );

    expect(customizeItemsFields( RESPONSE_MANY.json.rows, "tutu", CUSTOM_OPTIONS )).toEqual(RESPONSE_MANY.json.rows);

    expect(customizeItemsFields( RESPONSE_MANY.json.rows, "toto", CUSTOM_OPTIONS )).toEqual(CUSTOM_RESPONSE_MANY.json.rows);

  });

  it("convertResponse simple", function() {
    let convert

    // default
    convert = convertResponse( RESPONSE_ONE, GET_ONE, RESOURCE, EMPTY_PARAMS, EMPTY_OPTIONS  );
    expect(convert.data).toStrictEqual({"id": "id1234", info: "dummyData"});

    // custom default _id
    convert = convertResponse( RESPONSE_ONE_ID2, GET_ONE, RESOURCE, EMPTY_PARAMS, TEST_DEFAULT_OPTIONS );
    expect(convert.data).toStrictEqual({"id": "id1234", info: "dummyData"});

    // no _id -> no change
    convert = convertResponse( RESPONSE_ONE_ID2, GET_ONE, RESOURCE, EMPTY_PARAMS, EMPTY_OPTIONS  );
    expect(convert.data).toStrictEqual(RESPONSE_ONE_ID2.json);

  });

	it("convertResponse create", function() {
    let convert = convertResponse( RESPONSE_ONE, CREATE, RESOURCE, PARAMS , EMPTY_OPTIONS );
    expect(convert.data).toStrictEqual({"id": "id1234", "info": "dummyData"});

    convert= convertResponse( { json: { _id: "id1234", id: "ABC" }}, CREATE, "toto", EMPTY_PARAMS, EXISTING_ID_OPTIONS );
    expect(convert.data).toStrictEqual({id: "id1234", oid: "ABC" });

	});

	it("convertResponse get_list", function() {
    let convert = convertResponse( RESPONSE_MANY, GET_LIST, RESOURCE, EMPTY_PARAMS, EMPTY_OPTIONS  );
    expect(convert.data).toStrictEqual(CONVERTED_REPONSE_MANY.data);
    expect(convert.total).toEqual(CONVERTED_REPONSE_MANY.total);
	});

	it("convertResponse get_many", function() {
    let convert = convertResponse( RESPONSE_MANY, GET_MANY, RESOURCE, EMPTY_PARAMS, EMPTY_OPTIONS  );
    expect(convert.data).toStrictEqual(CONVERTED_REPONSE_MANY.data);
    expect(convert.total).toBeUndefined() // no total in this case : https://marmelab.com/react-admin/DataProviders.html

    convert = convertResponse( RESPONSE_MANY2, GET_MANY, RESOURCE, EMPTY_PARAMS, TEST_DEFAULT_OPTIONS );
    expect(convert.data).toStrictEqual(CONVERTED_REPONSE_MANY2.data);
    expect(convert.total).toBeUndefined() // no total in this case : https://marmelab.com/react-admin/DataProviders.html
  });


  it("convertResponse get_many_reference", function() {
    let convert = convertResponse( RESPONSE_MANY, GET_MANY_REFERENCE, RESOURCE, EMPTY_PARAMS, EMPTY_OPTIONS );
    expect(convert.data).toStrictEqual(CONVERTED_REPONSE_MANY.data);
    expect(convert.total).toEqual(CONVERTED_REPONSE_MANY.total);

    convert = convertResponse( RESPONSE_MANY_EXISTING_ID,   GET_MANY_REFERENCE, "toto", EMPTY_PARAMS, EXISTING_ID_OPTIONS )
    expect(convert.data).toEqual(CONVERTED_RESPONSE_MANY_EXISTING_ID.data);
  });

  it("convertResponse deleteMany", function() {
    let convert
    convert= convertResponse( { json: [{ _id: "id1234" }, { _id: "id12345" }] }, DELETE_MANY, RESOURCE, EMPTY_PARAMS, EMPTY_OPTIONS );
    expect(convert.data).toStrictEqual([{"id": "id1234"},{"id": "id12345"}]);

    convert = convertResponse( { json: [{ _id3: "id1234" }, { _id3: "id12345" }] }, DELETE_MANY, RESOURCE, EMPTY_PARAMS , { idFields: {"dummyResource": "_id3"}});
    expect(convert.data).toStrictEqual([{"id": "id1234"},{"id": "id12345"}]);

    convert = convertResponse( {}, DELETE_MANY, RESOURCE, EMPTY_PARAMS, EMPTY_OPTIONS );
    expect(convert.data).toStrictEqual([]);

    convert = convertResponse( { json: {} }, DELETE_MANY, RESOURCE, EMPTY_PARAMS, EMPTY_OPTIONS );
    expect(convert.data).toStrictEqual([{}]);

    convert= convertResponse( { json: [{ _id: "id1234", id: "ABC" }, { _id: "id12345", id : "DEF" }] }, DELETE_MANY, "toto", EMPTY_PARAMS, EXISTING_ID_OPTIONS );
    expect(convert.data).toStrictEqual([{id: "id1234", oid: "ABC" },{id: "id12345", oid: "DEF"}]);

  });

});
