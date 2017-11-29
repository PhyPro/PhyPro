'use strict'

const bunyan = require('bunyan')
const fs = require('fs')
const through2 = require('through2')
const zlib = require('zlib')

const FetchGenesStream = require('./FetchGenesFromGenomeStream')
const AddAseqInfoStream = require('./addAseqInfoStream.js')
const MakeFasta = require('./MakeFasta.js')

exports.proteinInfoToFiles = (genome, filename, fastafilename) => {
	const gzip = zlib.createGzip()
	const fetchGenes = new FetchGenesStream(genome.version)
	const addAseqInfoStream = new AddAseqInfoStream()
	const makeFasta = new MakeFasta(genome)

	const fileWriteStream = fs.createWriteStream(filename)
	const fastaWriteStream = fs.createWriteStream(fastafilename)

	let page = 1

	const getData = fetchGenes.pipe(addAseqInfoStream)

	const saveInfo = new Promise((resolve, reject) => {
		getData.pipe(through2.obj(function(chunk, enc, next) {
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
			.on('error', (err) => {
				console.log(err)
			})
	})

	const saveFasta = new Promise((resolve, reject) => {
		getData.pipe(makeFasta).pipe(fastaWriteStream)
			.on('finish', () => {
				resolve()
			})
	})

	return new Promise((resolve, reject) => {
		Promise.all([saveInfo, saveFasta]).then(resolve)
	})
}
