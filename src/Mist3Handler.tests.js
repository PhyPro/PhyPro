'use strict'

let expect = require('chai').expect

let Mist3Tax = require('./Mist3Handler.js').Taxonomy

describe.only('Mist3Handler', function() {
	it('must get genome given a certain ID', function() {
		let taxid = 10
		let mist3 = new Mist3Tax(taxid)
		expect(mist3.taxonomyID).eql(taxid)
	})
	describe.only('makeJsonSubTree', function() {
		it('it should not break this', function() {
			let taxid = 10
			let mist3 = new Mist3Tax(taxid)
			return	mist3.makeJsonTree().then(function(tree) {
				console.log('end')
				expect(mist3.jsonTree.children).to.not.undefined
			})
		})
	})
	describe('makeJsonTree', function() {
		it('must get children of node')
	})
})
