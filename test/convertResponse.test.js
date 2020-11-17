"use strict";
const CONVERT_RESPONSE = require("../src/convertResponse");

const RA_CORE=require("ra-core");

describe("CONVERT_RESPONSE", () => {

	beforeAll(() => {});
	afterAll(() =>{});

	const RESOURCE="dummyResource";
	const PARAMS= { data: { info: "dummyData"} } ;

	it("convertResponse simple", function() {
	  const response = { json: { id: "id1234"  }};
    let convert = CONVERT_RESPONSE.convertResponse( response, RA_CORE.GET_ONE, RESOURCE, PARAMS );
    expect(convert.data).toStrictEqual({"id": "id1234"});
	});

	it("convertResponse create", function() {
	  const response = { json: { id: "id1234"  }};
    let convert = CONVERT_RESPONSE.convertResponse( response, RA_CORE.CREATE, RESOURCE, PARAMS );
    expect(convert.data).toStrictEqual({"id": "id1234", "info": "dummyData"});
	});

	it("convertResponse get_list", function() {
	  const response = { json: { rows: [ {row: "row1"},{row: "row2"},{row: "row3"} ], total:3, page:1, pageSize: 10 }};
    let convert = CONVERT_RESPONSE.convertResponse( response, RA_CORE.GET_LIST, RESOURCE, PARAMS );
    expect(convert.data).toStrictEqual([{"row": "row1"}, {"row": "row2"}, {"row": "row3"}]);
    expect(convert.total).toEqual(3);
	});

  it("convertResponse deleteMany", function() {
    const response = { json: { id: "id1234"  }};
    let convert = CONVERT_RESPONSE.convertResponse( response, RA_CORE.DELETE_MANY, RESOURCE, PARAMS );
    expect(convert.data).toStrictEqual({"id": "id1234"});

    const responseEmpty = {  };
    convert = CONVERT_RESPONSE.convertResponse( responseEmpty, RA_CORE.DELETE_MANY, RESOURCE, PARAMS );
    expect(convert.data).toStrictEqual([]);

    const responseJsonEmpty = {  json: {} };
    convert = CONVERT_RESPONSE.convertResponse( responseJsonEmpty, RA_CORE.DELETE_MANY, RESOURCE, PARAMS );
    expect(convert.data).toStrictEqual({}); // TODO correct ???
  });

});
