'use strict'

const bunyan = require('bunyan')
const fs = require('fs')
const through2 = require('through2')
const zlib = require('zlib')

const FetchGenesStream = require('./FetchGenesFromGenomeStream')

exports.genesToZipFile = (genome, filename) => {
	const gzip = zlib.createGzip()
	const fetchGenes = new FetchGenesStream(genome)
	const fileWriteStream = fs.createWriteStream(filename)
	let page = 1
	return new Promise((resolve, reject) => {
		fetchGenes
			.pipe(through2.obj(function(chunk, enc, next) {
				let data = JSON.stringify(chunk)
				data = data.slice(0, data.length - 1)
				if (page !== 1)
					data = ',' + data.slice(1, data.length)
				this.push(data)
				page++
				next()
			}, function(flush) {
				this.push(']')
				flush()
			}))
			.pipe(gzip)
			.pipe(fileWriteStream)
			.on('finish', resolve)
	})
}
