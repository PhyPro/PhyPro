'use strict'

const expect = require('chai').expect
const path = require('path')
const fs = require('fs')
const zlib = require('zlib')

const testPath = path.resolve(__dirname, 'test-data')

const fetchData = require('./fetchData')

describe('fetchData', function() {
	describe('proteinsToZipFile', function() {
		it('should work', function(done) {
			this.timeout(10000)
			const expectedNumberOfGenes = 655
			const genome = 'GCF_000701865.1'
			const filename = 'phypro.template.genes.' + genome + '.json.gz'
			const filePath = path.resolve(testPath, filename)
			fetchData.proteinsToZipFile(genome, filePath).then(() => {
				let data = ''
				fs.createReadStream(filePath).pipe(zlib.createGunzip())
					.on('data', function(d) {
						data += d.toString()
					})
					.on('end', () => {
						const recordedData = JSON.parse(data)
						expect(recordedData.length).eql(expectedNumberOfGenes)
						done()
					})
			})
		})
	})
	after(function() {
		const genome = 'GCF_000701865.1'
		const filename = 'phypro.template.genes.' + genome + '.json.gz'
		const filePath = path.resolve(testPath, filename)
		fs.unlinkSync(filePath)
	})
})
