"use strict";
import CONVERT_RESPONSE from '../convertResponse'
import { CREATE, DELETE_MANY, GET_LIST, GET_MANY, GET_MANY_REFERENCE, GET_ONE } from '../const'

describe("CONVERT_RESPONSE", () => {

	beforeAll(() => {});
	afterAll(() =>{});

	const RESOURCE="dummyResource";
	const PARAMS= { data: { info: "dummyData"} } ;
	const EMPTY_PARAMS= {  } ;

	// moleculer responses for list, many and many format has the same format
  const RESPONSE_MANY = { json: { rows: [ {_id:1, row: "row1"},{_id:2, row: "row2"},{_id:3, row: "row3"} ], total:10, page:1, pageSize: 3 }}
  const CONVERTED_REPONSE_MANY = { data: [{id:1, _id:1,  row: "row1"},{id:2, _id:2, row: "row2"},{id:3, _id:3, row: "row3"}], total: 10}


  it("convertResponse simple", function() {
	  const response = { json: { id: "id1234", dummy: "data"  }};
    let convert = CONVERT_RESPONSE.convertResponse( response, GET_ONE, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual({"id": "id1234", dummy: "data"});
	});

	it("convertResponse create", function() {
	  const response = { json: { _id: "id1234", info: "dummyDataResponse"   }};
    let convert = CONVERT_RESPONSE.convertResponse( response, CREATE, RESOURCE, PARAMS );
    expect(convert.data).toStrictEqual({"_id": "id1234","id": "id1234", "info": "dummyDataResponse"});
	});

	it("convertResponse get_list", function() {
	  const response = RESPONSE_MANY;
    let convert = CONVERT_RESPONSE.convertResponse( response, GET_LIST, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual(CONVERTED_REPONSE_MANY.data);
    expect(convert.total).toEqual(CONVERTED_REPONSE_MANY.total);
	});

	it("convertResponse get_many", function() {
    const response = RESPONSE_MANY;
    let convert = CONVERT_RESPONSE.convertResponse( response, GET_MANY, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual(CONVERTED_REPONSE_MANY.data);
    expect(convert.total).toBeUndefined() // no total in this case : https://marmelab.com/react-admin/DataProviders.html
	});


  it("convertResponse get_many_reference", function() {
    const response = RESPONSE_MANY;
    let convert = CONVERT_RESPONSE.convertResponse( response, GET_MANY_REFERENCE, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual(CONVERTED_REPONSE_MANY.data);
    expect(convert.total).toEqual(CONVERTED_REPONSE_MANY.total);
  });

  it("convertResponse deleteMany", function() {
    const response = { json: { id: "id1234"  }};
    let convert = CONVERT_RESPONSE.convertResponse( response, DELETE_MANY, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual({"id": "id1234"});

    const responseEmpty = {  };
    convert = CONVERT_RESPONSE.convertResponse( responseEmpty, DELETE_MANY, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual([]);

    const responseJsonEmpty = {  json: {} };
    convert = CONVERT_RESPONSE.convertResponse( responseJsonEmpty, DELETE_MANY, RESOURCE, EMPTY_PARAMS );
    expect(convert.data).toStrictEqual({}); // TODO correct ???
  });

});
