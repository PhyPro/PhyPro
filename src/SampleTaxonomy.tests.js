'use strict'

let expect = require('chai').expect

let SampleTaxonomy = require('./SampleTaxonomy.js')

describe('SampleTaxonomy', function() {
	it('must not break when passed no genomes', function() {
		let sampleTax = new SampleTaxonomy()
	})
	describe('_shuffle', function() {
		it('must shuffle elements in an array', function() {
			let fixture = [0, 1, 2, 3, 4, 5, 6]
			let shuffled = [0, 1, 2, 3, 4, 5, 6]
			let sampleTax = new SampleTaxonomy()
			sampleTax.shuffle_(shuffled)
			expect(shuffled).not.eql(fixture)
			expect(shuffled.length).eql(fixture.length)
			expect(shuffled.sort()).eql(fixture)
		})
	})
	it('must work with a tree Object', function() {
		let fixture = {
			id: 10,
			children: [
				{
					id: 1622269
				},
				{
					id: 1134474
				},
				{
					id: 155077,
					children: [
						{
							id: 498211
						}
					]
				},
				{
					id: 39650,
					children: [
						{
							id: 126346,
							children: [
								{
									id: 1209072
								}
							]
						}
					]
				}
			]
		}
		let sampleTax = new SampleTaxonomy(fixture)
		let expected = [1209072, 498211, 1134474, 1622269]
		let N = 2
		let results = sampleTax.pick(N)
		let taxids = []
		results.forEach(function(item) {
			taxids.push(item.property('id'))
		})
		expect(expected).to.include.members(taxids)
	})
})
