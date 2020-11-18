"use strict";
import  CONVERT_RESPONSE  from '../convertResponse'
import  { GET_LIST, DELETE_MANY, CREATE, GET_ONE } from '../const'

describe("CONVERT_RESPONSE", () => {

	beforeAll(() => {});
	afterAll(() =>{});

	const RESOURCE="dummyResource";
	const PARAMS= { data: { info: "dummyData"} } ;


  it("convertResponse simple", function() {
	  const response = { json: { id: "id1234"  }};
    let convert = CONVERT_RESPONSE.convertResponse( response, GET_ONE, RESOURCE, PARAMS );
    expect(convert.data).toStrictEqual({"id": "id1234"});
	});

	it("convertResponse create", function() {
	  const response = { json: { id: "id1234"  }};
    let convert = CONVERT_RESPONSE.convertResponse( response, CREATE, RESOURCE, PARAMS );
    expect(convert.data).toStrictEqual({"id": "id1234", "info": "dummyData"});
	});

	it("convertResponse get_list", function() {
	  const response = { json: { rows: [ {row: "row1"},{row: "row2"},{row: "row3"} ], total:3, page:1, pageSize: 10 }};
    let convert = CONVERT_RESPONSE.convertResponse( response, GET_LIST, RESOURCE, PARAMS );
    expect(convert.data).toStrictEqual([{"row": "row1"}, {"row": "row2"}, {"row": "row3"}]);
    expect(convert.total).toEqual(3);
	});

  it("convertResponse deleteMany", function() {
    const response = { json: { id: "id1234"  }};
    let convert = CONVERT_RESPONSE.convertResponse( response, DELETE_MANY, RESOURCE, PARAMS );
    expect(convert.data).toStrictEqual({"id": "id1234"});

    const responseEmpty = {  };
    convert = CONVERT_RESPONSE.convertResponse( responseEmpty, DELETE_MANY, RESOURCE, PARAMS );
    expect(convert.data).toStrictEqual([]);

    const responseJsonEmpty = {  json: {} };
    convert = CONVERT_RESPONSE.convertResponse( responseJsonEmpty, DELETE_MANY, RESOURCE, PARAMS );
    expect(convert.data).toStrictEqual({}); // TODO correct ???
  });

});
