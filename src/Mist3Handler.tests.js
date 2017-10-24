'use strict'

let expect = require('chai').expect

let Mist3Tax = require('./Mist3Handler.js').Taxonomy

describe('Mist3Handler', function() {
	it('must get genome given a certain ID', function() {
		let taxid = 10
		let mist3 = new Mist3Tax(taxid)
		expect(mist3.taxonomyID).eql(taxid)
	})
	describe('makeJsonSubTree', function() {
		it.only('it should not break this', function() {
			let taxid = 10
			let mist3 = new Mist3Tax(taxid)
			return	mist3.makeJsonTree().then(function() {
				let expected = {
					name: 10,
					children: [
						{
							name: 1622269
						},
						{
							name: 1134474
						},
						{
							name: 155077,
							children: [
								{
									name: 498211
								}
							]
						},
						{
							name: 39650,
							children: [
								{
									name: 126346,
									children: [
										{
											name: 1209072
										}
									]
								}
							]
						}
					]
				}
				mist3.sampleTree()
				expect(mist3.jsonTree.children).to.not.undefined
				expect(mist3.jsonTree).eql(expected)
			})
		})
	})
})
