
/**
 * unit/alphatex.spec.js
 */

import { should } from 'chai';
import * from '@/modules/alphatex';

should();

describe('Alphatex module', () =>
{
	/**
	 * transpose()
	 */
	describe('#transpose', () =>
	{
		// @TODO : identity ?

		it('transposes single notes correctly', () =>
		{
			// Single note
			Alphatex.transpose('4.4',		 1).should.equal('5.4');
			Alphatex.transpose('4.4',		-1).should.equal('3.4');

			// Single note with effects
			Alphatex.transpose('4.4.16',		 1).should.equal('5.4.16');
			Alphatex.transpose('4.4{tt}',		 1).should.equal('5.4{tt}');
			Alphatex.transpose('4.4{v}.16{d}',	 1).should.equal('5.4{v}.16{d}');
			Alphatex.transpose('4.4{b (0 2 4)}.16',	 1).should.equal('5.4{b (0 2 4)}.16');
		});

		// @TODO : multiple notes

		// @TODO : with string param
	});

	/**
	 * expand()
	 */
	describe('#expand', () =>
	{
		it('respects identity', () =>
		{
			Alphatex.expand(''			  ).should.equal('');
			Alphatex.expand('4.4.4'			  ).should.equal('4.4.4');
			Alphatex.expand('4.4.4{v}'		  ).should.equal('4.4.4{v}');
			Alphatex.expand('1.3 2.3 3.3'		  ).should.equal('1.3 2.3 3.3');
			Alphatex.expand('1.3{tt} 2.3{g} 3.3{v}'	  ).should.equal('1.3{tt} 2.3{g} 3.3{v}');
		});
	});
});
