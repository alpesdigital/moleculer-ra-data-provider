"use strict";

const CONVERT_REQUEST = require("../src/convertRequest");

const API_URL="http://dummy.api.url/";
const RESOURCE="dummyResource";

describe("CONVERT_REQUEST", () => {
	beforeAll(() => {});
	afterAll(() =>{});

	it("delete", function() {
    const convert=CONVERT_REQUEST.deleteRequest({ id:1234 }, API_URL, RESOURCE);
    expect(convert.url).toEqual(API_URL+"/"+RESOURCE+ "/"+"1234");
    expect(convert.options).toStrictEqual({
      method: "DELETE",
    })
	});

	it("create", function() {
    const convert=CONVERT_REQUEST.create({ data: { str:"string123", num: 1234 } }, API_URL, RESOURCE);
    expect(convert.url).toBe(API_URL+"/"+RESOURCE );
    expect(convert.options).toStrictEqual({
        method: "POST",
      body:'{"str":"string123","num":1234}'
    })
	});

});
