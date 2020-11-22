"use strict";
import { convertResponse } from '../src/convertResponse'
import { CREATE, DELETE_MANY, GET_LIST, GET_MANY, GET_MANY_REFERENCE, GET_ONE } from '../src/const'

describe("convertResponse", () => {

	beforeAll(() => {});
	afterAll(() =>{});

	const RESOURCE="dummyResource";
	const PARAMS= { data: { info: "dummyData"} } ;
	const EMPTY_PARAMS= {  } ;

	// moleculer responses for list, many and many format has the same format
  const RESPONSE_ONE = { json:  { _id: "id1234", info: "dummyData"  }}
  const RESPONSE_MANY = { json: { rows: [ {_id:1, row: "row1"},{_id:2, row: "row2"},{_id:3, row: "row3"} ], total:10, page:1, pageSize: 3 }}
  const CONVERTED_REPONSE_MANY = { data: [{id:1, _id:1,  row: "row1"},{id:2, _id:2, row: "row2"},{id:3, _id:3, row: "row3"}], total: 10}


  it("convertResponse simple", function() {
    let convert = convertResponse( RESPONSE_ONE, GET_ONE, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual({"_id": "id1234","id": "id1234", info: "dummyData"});
	});

	it("convertResponse create", function() {
    let convert = convertResponse( RESPONSE_ONE, CREATE, RESOURCE, PARAMS );
    expect(convert.data).toStrictEqual({"_id": "id1234","id": "id1234", "info": "dummyData"});
	});

	it("convertResponse get_list", function() {
	  const response = RESPONSE_MANY;
    let convert = convertResponse( response, GET_LIST, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual(CONVERTED_REPONSE_MANY.data);
    expect(convert.total).toEqual(CONVERTED_REPONSE_MANY.total);
	});

	it("convertResponse get_many", function() {
    const response = RESPONSE_MANY;
    let convert = convertResponse( response, GET_MANY, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual(CONVERTED_REPONSE_MANY.data);
    expect(convert.total).toBeUndefined() // no total in this case : https://marmelab.com/react-admin/DataProviders.html
	});


  it("convertResponse get_many_reference", function() {
    const response = RESPONSE_MANY;
    let convert = convertResponse( response, GET_MANY_REFERENCE, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual(CONVERTED_REPONSE_MANY.data);
    expect(convert.total).toEqual(CONVERTED_REPONSE_MANY.total);
  });

  it("convertResponse deleteMany", function() {
    const response = { json: [ { _id: "id1234"  }, { _id: "id12345"  } ]};
    let convert = convertResponse( response, DELETE_MANY, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual([{"_id": "id1234","id": "id1234"},{"_id": "id12345","id": "id12345"}]);

    const responseEmpty = {  };
    convert = convertResponse( responseEmpty, DELETE_MANY, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual([]);

    const responseJsonEmpty = {  json: {} };
    convert = convertResponse( responseJsonEmpty, DELETE_MANY, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual([]);
  });

});
