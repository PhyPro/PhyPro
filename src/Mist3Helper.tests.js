'use strict'

let expect = require('chai').expect
let mist3 = require('./Mist3Helper.js')

describe('Mist3Helper', function() {
	describe('getImmediateChildren', function() {
		it('should pass', function() {
			let taxid = 10
			return mist3.getImmediateChildren(taxid).then(function(taxids) {
				expect(taxids.length)
			})
		})
	})
	describe('getChildren', function() {
		it('should pass', function() {
			let taxid = 10
			return mist3.getChildren(taxid).then(function(taxids) {
				expect(taxids.length)
			})
		})
	})
	describe('getGenomeByTaxids', function() {
		it('should pass', function() {
			const taxids = [208964, 314345]
			return mist3.getGenomesByTaxids(taxids).then((genomes) => {
				expect(genomes.length).to.eql(taxids.length)
			})
		})
	})
})
