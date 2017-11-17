'use strict'

const expect = require('chai').expect
const FetchGenesFromGenomeStream = require('./FetchGenesFromGenomeStream.js')

const stream = require('stream')

describe('FetchGenesFromGenomeStream', function() {
	it('it must fetch the genome from MiST', function(done) {
		this.timeout(10000)
		const genome = 'GCF_000701865.1'
		const fetchGenesFromGenomeStream = new FetchGenesFromGenomeStream(genome)

		const ws = stream.Writable({objectMode: true})
		ws._write = function(chunk, enc, next) {
			next()
		}

		const allGenes = []

		fetchGenesFromGenomeStream.on('data', (items) => {
			items.forEach((item) => {
				allGenes.push(item)
			})
		})

		fetchGenesFromGenomeStream.on('end', () => {
			const numberOfGenes = 736
			expect(allGenes.length).eql(numberOfGenes)
			done()
		})
		fetchGenesFromGenomeStream.on('error', (err) => {
			console.log(err)
		})

		fetchGenesFromGenomeStream.pipe(ws)
	})
})
