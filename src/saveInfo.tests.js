'use strict'

const expect = require('chai').expect
const path = require('path')
const fs = require('fs')
const zlib = require('zlib')

const testPath = path.resolve(__dirname, 'test-data')
const geneInfoFile = 'saveInfo.json.gz'

const saveInfo = require('./saveInfo')

describe('saveInfo', function() {
	it('should work and make a fasta file and a json file with info', function(done) {
		const geneInfo = [
			{
				id: 998731,
				stable_id: 'GCF_000006765.1-PA0094',
				component_id: 9700,
				dseq_id: 'pZPTwEWj5P8YUgyEhfl5Jw',
				aseq_id: 'nY4dp0YF5Z8RAD7a27sCMQ',
				accession: 'NP_248784',
				version: 'NP_248784.1',
				locus: 'PA0094',
				old_locus: null,
				location: 'complement(114611..115045)',
				strand: '-',
				start: 114611,
				stop: 115045,
				length: 435,
				names: null,
				pseudo: false,
				notes: null,
				product: 'hypothetical protein',
				codon_start: 1,
				translation_table: 11,
				qualifiers: {},
				cds_location: 'complement(114611..115045)',
				cds_qualifiers: {}
			},
			{
				id: 998732,
				stable_id: 'GCF_000006765.1-PA0095',
				component_id: 9700,
				dseq_id: '29WQ8pHlRWaAqkiitW3A0Q',
				aseq_id: 'J6LYBYbxM8gXEp360wRnFw',
				accession: 'NP_248785',
				version: 'NP_248785.1',
				locus: 'PA0095',
				old_locus: null,
				location: '115299..117524',
				strand: '+',
				start: 115299,
				stop: 117524,
				length: 2226,
				names: null,
				pseudo: false,
				notes: null,
				product: 'hypothetical protein',
				codon_start: 1,
				translation_table: 11,
				qualifiers: {},
				cds_location: '115299..117524',
				cds_qualifiers: {}
			},
			{
				id: 998733,
				stable_id: 'GCF_000006765.1-PA0096',
				component_id: 9700,
				dseq_id: 'j1bdpCqVq4Wdyrz_Gtdjhg',
				aseq_id: 'wb-sOs6LvXjEo2xYPSHmxA',
				accession: 'NP_248786',
				version: 'NP_248786.1',
				locus: 'PA0096',
				old_locus: null,
				location: '117552..118001',
				strand: '+',
				start: 117552,
				stop: 118001,
				length: 450,
				names: null,
				pseudo: false,
				notes: null,
				product: 'hypothetical protein',
				codon_start: 1,
				translation_table: 11,
				qualifiers: {},
				cds_location: '117552..118001',
				cds_qualifiers: {}
			},
			{
				id: 998734,
				stable_id: 'GCF_000006765.1-PA0097',
				component_id: 9700,
				dseq_id: 'gXAxhFaqvxyjDikhuIztnw',
				aseq_id: '-D_AJJViExGZCxoyq0pczA',
				accession: 'NP_248787',
				version: 'NP_248787.1',
				locus: 'PA0097',
				old_locus: null,
				location: '117931..119130',
				strand: '+',
				start: 117931,
				stop: 119130,
				length: 1200,
				names: null,
				pseudo: false,
				notes: null,
				product: 'hypothetical protein',
				codon_start: 1,
				translation_table: 11,
				qualifiers: {},
				cds_location: '117931..119130',
				cds_qualifiers: {}
			}
		]
		const geneInfoPath = path.resolve(testPath, geneInfoFile)

		saveInfo(geneInfo, geneInfoPath).then(() => {
			const gunzip = zlib.createGunzip()
			let data = ''
			fs.createReadStream(geneInfoPath)
				.pipe(gunzip)
				.on('data', function(d) {
					data += d.toString()
				})
				.on('end', () => {
					const recordedData = JSON.parse(data)
					expect(recordedData.length).eql(geneInfo.length)
					done()
				})
		})
	})
	after(function() {
		const geneInfoPath = path.resolve(testPath, geneInfoFile)
		fs.unlinkSync(geneInfoPath)
	})
})
