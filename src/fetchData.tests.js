'use strict'

const expect = require('chai').expect
const path = require('path')
const fs = require('fs')
const zlib = require('zlib')

const testPath = path.resolve(__dirname, 'test-data')

const fetchData = require('./fetchData')
const mist3 = require('./Mist3Helper')

describe('fetchData', function() {
	describe('proteinInfoToFiles', function() {
		it('should work and make a fasta file and a json file with info', function(done) {
			this.timeout(100000)
			const expectedNumberOfGenes = 5572
			const genome = 'GCF_000006765.1'
			const filename = 'phypro.template.genes.' + genome + '.json.gz'
			const fastaFile = genome + '.fa'
			const filePath = path.resolve(testPath, filename)
			const fastaPath = path.resolve(testPath, fastaFile)
			mist3.getGenomeInfoByVersion(genome).then((genomeInfo) => {
				fetchData.proteinInfoToFiles(genomeInfo, filePath, fastaPath)
					.then(() => {
						let data = ''
						fs.createReadStream(filePath).pipe(zlib.createGunzip())
							.on('data', function(d) {
								data += d.toString()
							})
							.on('end', () => {
								const recordedData = JSON.parse(data)
								expect(recordedData.length).eql(expectedNumberOfGenes)
								return
							})
					})
					.then(() => {
						let data = ''
						let biggerThanCount = 0
						fs.createReadStream(fastaPath)
							.on('data', function(d) {
								data = d.toString()
								biggerThanCount += (data.match(/>/g) || []).length
							})
							.on('end', () => {
								expect(biggerThanCount).eql(expectedNumberOfGenes)
								done()
							})
					})
			})
		})
	})
	after(function() {
		const genome = 'GCF_000006765.1'
		const filename = 'phypro.template.genes.' + genome + '.json.gz'
		const fastaFile = genome + '.fa'
		const files = [filename, fastaFile]
		files.forEach((file) => {
			const filePath = path.resolve(testPath, file)
			try {
				fs.unlinkSync(filePath)
			}
			catch (err) {}
		})
	})
})

