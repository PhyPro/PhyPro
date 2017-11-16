'use strict'

const expect = require('chai').expect
const FetchGenesFromGenome = require('./FetchGenesFromGenome.js')

const fs = require('fs')
const stream = require('stream')

describe('FetchGenesFromGenome', function() {
	it('it must fetch the genome from MiST', function(done) {
		this.timeout(10000)
		const genome = 'GCF_000701865.1'
		const fetchGenesFromGenome = new FetchGenesFromGenome(genome)

		const ws = stream.Writable({objectMode: true})
		ws._write = function(chunk, enc, next) {
			next()
		}

		fetchGenesFromGenome.on('end', done)

		fetchGenesFromGenome.on('error', (err) => {
			console.log(err)
		})

		fetchGenesFromGenome.pipe(ws)
	})
})
