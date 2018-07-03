'use strict'

const chai = require('chai')
const expect = chai.expect

const fetchData = require('./fetchData')
const mist3 = require('node-mist3')

describe('fetchData', function() {
	it('should work and spit fastaEntries and json with info', function() {
		this.timeout(100000)
		const expectedNumberOfFastaEntries = 5572
		const expectedNumberOfGenes = 5697
		const genome = 'GCF_000006765.1'
		const mist3Genomes = new mist3.Genomes()
		return mist3Genomes.getGenomeInfoByVersion(genome)
			.then((genomeInfo) => {
				return fetchData(genomeInfo).then((data) => {
					expect(data.genes.length).eql(expectedNumberOfGenes)
					expect(data.fastaEntries.length).eql(expectedNumberOfFastaEntries)
				})
			})
	})
})
