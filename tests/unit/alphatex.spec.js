
/**
 * tests/unit/alphatex.spec.js
 */

import { expect } from 'chai'

import * as alphatex from '@/modules/alphatex'

describe('@alphatex', () =>
{
	/**
	 * transposeTex()
	 */
	describe('#transposeTex', () =>
	{
		// @TODO : identity ?

		it('transposes single notes correctly', () =>
		{
			// Single note
			expect(alphatex.transposeTex('4.4', 1)).to.equal('5.4');
			expect(alphatex.transposeTex('4.4', -1)).to.equal('3.4');

			// Single note with effects
			expect(alphatex.transposeTex('4.4.16', 1)).to.equal('5.4.16');
			expect(alphatex.transposeTex('4.4{tt}', 1)).to.equal('5.4{tt}');
			expect(alphatex.transposeTex('4.4{v}.16{d}', 1)).to.equal('5.4{v}.16{d}');
			expect(alphatex.transposeTex('4.4{b (0 2 4)}.16', 1)).to.equal('5.4{b (0 2 4)}.16');
		});

		// @TODO : multiple notes

		// @TODO : with string param
	});

	/**
	 * expandTex()
	 */
	describe('#expandTex', () =>
	{
		it('respects identity', () =>
		{
			expect(alphatex.expandTex('')).to.equal('');
			expect(alphatex.expandTex('4.4.4')).to.equal('4.4.4');
			expect(alphatex.expandTex('4.4.4{v}')).to.equal('4.4.4{v}');
			expect(alphatex.expandTex('1.3 2.3 3.3')).to.equal('1.3 2.3 3.3');
			expect(alphatex.expandTex('1.3{tt} 2.3{g} 3.3{v}')).to.equal('1.3{tt} 2.3{g} 3.3{v}');
		});
	});
});
