
/**
 * test/tools.test.js
 */

import { expect }  from 'chai'

import * as object from '@/modules/object'

describe("@object", () =>
{
	describe("#isObject", () =>
	{
		it("fails on non-objects", () =>
		{
			expect(object.isObject(null     )).to.be.false;
			expect(object.isObject(undefined)).to.be.false;
			expect(object.isObject(3.14     )).to.be.false;
			expect(object.isObject([]       )).to.be.false;
			expect(object.isObject('object' )).to.be.false;
		});

		it("succeeds on objects", () =>
		{
			expect(object.isObject({}              )).to.be.true;
			expect(object.isObject(new Object()    )).to.be.true;
			expect(object.isObject({ a: undefined })).to.be.true;
			expect(object.isObject({ a: 1, b: 2 }  )).to.be.true;
		});
	});

	describe("#objectCheckKey", () =>
	{
		it("returns the key to check on success", () =>
		{
			expect(object.checkKey({ foo: true }, 'foo')).to.equal('foo');
			expect(object.checkKey({ bar: {}   }, 'bar')).to.equal('bar');
		});

		it("returns 'null' on failure", () =>
		{
			expect(object.checkKey({ foo: true }, 'bar')).to.be.null;
			expect(object.checkKey({ bar: {}   }, 'foo')).to.be.null;
		});

		it("returns 'null' when the key is undefined", () =>
		{
			expect(object.checkKey({ foo: true }, undefined)).to.be.null;
			expect(object.checkKey({ bar: {}   }, {}.foo   )).to.be.null;
		});
	});
});
