
/**
 * tests/unit/tools.spec.js
 */

import { expect } from 'chai'

import * as object from '@/modules/object'

describe('@object', () =>
{
	/**
	 * isObject()
	 */
	describe('#isObject', () =>
	{
		it('fails on non-objects', () =>
		{
			expect(object.isObject(null)).to.be.false;
			expect(object.isObject(undefined)).to.be.false;
			expect(object.isObject(3.14)).to.be.false;
			expect(object.isObject([])).to.be.false;
			expect(object.isObject('object')).to.be.false;
		});

		it('succeeds on objects', () =>
		{
			expect(object.isObject({})).to.be.true;
			expect(object.isObject(new Object())).to.be.true;
			expect(object.isObject({ a: undefined })).to.be.true;
			expect(object.isObject({ a: 1, b: 2 })).to.be.true;
		});
	});
});
