'use strict'

let expect = require('chai').expect

let Mist3Tax = require('./Mist3Handler.js').Taxonomy

describe.only('Mist3Handler', function() {
	it('must get genome given a certain ID', function() {
		let taxid = 10
		let mist3 = new Mist3Tax(taxid)
		expect(mist3.taxonomyID).eql(taxid)
	})
	describe('getIDs', function() {
		it('must get children of node', function(done) {
			let taxid = 10
			let mist3 = new Mist3Tax(taxid)
			mist3.getIDs().then(function(ids) {
				console.log(ids)
				expect(ids).to.not.be.undefined
				done()
			})
		})
	})
})
