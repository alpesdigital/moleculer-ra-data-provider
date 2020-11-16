"use strict";

require("jest-extended");

const UTI = require("../src/convertResponse");

// TODO

describe.skip("UTI", () => {

	beforeAll(() => {});
	afterAll(() =>{});

	it("nullToZero(null) ", function() {
		expect(UTI.nullToZero(null)).toBe(0);
	});

	it("nullToZero(x) ", function() {
		expect(UTI.nullToZero("x")).toBe("x");
	});

	it("nullToZero(undefined) ", function() {
		expect(UTI.nullToZero(undefined)).toBeUndefined();
	});


	it("pluriel(singulier) ", function() {
		expect(UTI.pluriel(-1)).toBe("");
		expect(UTI.pluriel(0)).toBe("");
		expect(UTI.pluriel(1)).toBe("");
		expect(UTI.pluriel("1")).toBe("");
	});
	it("pluriel(multiple) ", function() {
		expect(UTI.pluriel(2)).toBe("s");
		expect(UTI.pluriel(2000)).toBe("s");
		expect(UTI.pluriel("222")).toBe("s");
	});
	it("pluriel(multiple custom) ", function() {
		expect(UTI.pluriel(2, "x")).toBe("x");
	});
	it("pluriel(undefined) ", function() {
		expect(UTI.pluriel(undefined)).toBe("");
		expect(UTI.pluriel(null)).toBe("");
	});
	it("pluriel(str) ", function() {
		expect(UTI.pluriel("string")).toBe("");
	});

	it("asCounter(singulier) ", function() {
		expect(UTI.asCounter("test", -1)).toBe("-1 test");
		expect(UTI.asCounter("test", 0)).toBe("0 test");
		expect(UTI.asCounter("test", 1)).toBe("1 test");
		expect(UTI.asCounter("test", "1")).toBe("1 test");
	});
	it("asCounter(multiple) ", function() {
		expect(UTI.asCounter("test", 2)).toBe("2 tests");
		expect(UTI.asCounter("test", 2000)).toBe("2000 tests");
		expect(UTI.asCounter("test", "222")).toBe("222 tests");
	});
	it("asCounter(multiple custom) ", function() {
		expect(UTI.asCounter("test", 2, "x")).toBe("2 testx");
	});
	it("asCounter(undefined) ", function() {
		expect(UTI.asCounter("test", undefined)).toBe("undefined test");
		expect(UTI.asCounter("test", null)).toBe("null test");
	});
	it("asCounter(str) ", function() {
		expect(UTI.asCounter("test", "string")).toBe("string test");
	});
	it("removeElementFromArray(elt, arr) ", function() {
		expect(UTI.removeElementFromArray("test", ["string", "test","string2"])).toEqual(["string", "string2"]);
		expect(UTI.removeElementFromArray(123, ["string", "123","string2"])).toEqual(["string","123", "string2"]);
		expect(UTI.removeElementFromArray(123, ["string", 123,"string2"])).toEqual(["string", "string2"]);
		expect(UTI.removeElementFromArray("testX", ["string", "test","string2"])).toEqual(["string", "test","string2"]);
		expect(UTI.removeElementFromArray("tes", ["string", "test","string2"])).toEqual(["string", "test","string2"]);
		expect(UTI.removeElementFromArray(undefined, ["string", "test","string2"])).toEqual(["string", "test","string2"]);
		expect(UTI.removeElementFromArray(undefined, undefined)).toBeUndefined();
		expect(UTI.removeElementFromArray("test", "test")).toEqual( "test");
		expect(UTI.removeElementFromArray("test", 123)).toEqual( 123);
	});
	it("argumentParse(str) ", function() {
		expect(UTI.argumentParse("[test,test2]" )).toEqual(["test","test2"]);
		expect(UTI.argumentParse("[test,123]" )).toEqual(["test","123"]);
		expect(UTI.argumentParse("test,test2" )).toBe("test,test2");
		expect(UTI.argumentParse("[test,test2" )).toBe("[test,test2");
		expect(UTI.argumentParse("test,test2]" )).toBe("test,test2]");
		expect(UTI.argumentParse(123 )).toBe(123);
		expect(UTI.argumentParse("123" )).toBe("123");
		expect(UTI.argumentParse(123.5 )).toBe(123.5);
		expect(UTI.argumentParse("" )).toBe("");
		expect(UTI.argumentParse(undefined )).toBeUndefined();
	});
	it("filterFields([], {}) ", function() {
		expect(UTI.filterFields([], {a:1, b:2, c:3, d:4})).toEqual({});
		expect(UTI.filterFields(["e"], {a:1, b:2, c:3, d:4})).toEqual({});
		expect(UTI.filterFields(["a","c"], {a:1, b:2, c:3, d:4})).toEqual({a:1, c:3});
		expect(UTI.filterFields(["a","c","e"], {a:1, b:2, c:3, d:4})).toEqual({a:1, c:3});
	});
});
