'use strict'

let expect = require('chai').expect

let mist3 = require('./mist3Helper.js')

describe('Mist3Helper', function() {
	it('it should pass', function() {
		let taxid = 10
		return mist3.getImmediateChildren(taxid).then(function(taxids) {
			expect(taxids.length)
		})
	})
	it('it should pass', function() {
		let taxid = 10
		return mist3.getChildren(taxid).then(function(taxids) {
			expect(taxids.length)
		})
	})
})
