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
	describe('getGenesByGenomes', function() {
		it('should pass', function() {
			this.timeout(14000)
			const expectedNumberOfGenes = 736
			const genome = 'GCF_000701865.1' // 'GCF_000006765.1'
			return mist3.getGenesByGenome(genome).then((genes) => {
				expect(genes.length).eql(expectedNumberOfGenes)
			})
		})
		it('must fail is passed invalid version')
	})
})
