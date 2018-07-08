'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
const expect = chai.expect
const should = chai.should()

const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')

const PhyloProfile = require('./PhyloProfile')

const testPath = path.resolve(__dirname, 'test-data')
const testGenomicInfoPath = path.resolve(testPath, 'testGenomicInfo')

describe('PhyloProfile', function() {
	describe('makeFastaFiles', function() {
		beforeEach(() => {
			const phyloProfilePath = path.resolve(testPath, 'phyloProfile')
			mkdirp.sync(phyloProfilePath)
		})
		it('should make some fasta files', function() {
			this.timeout(60000)
			const configFileName = 'validateOk.phypro.template.config.json'
			const configFileFullPath = path.resolve(testPath, configFileName)
			const configFile = fs.readFileSync(configFileFullPath)
			const config = JSON.parse(configFile)
			config.header.genomicInfoPath = testGenomicInfoPath
			config.phyloProfile.stop = 'trimSequences'
			const phyloProfile = new PhyloProfile(config)
			phyloProfile.setPipelineOutputPath(path.resolve(testPath, 'phyloProfile'))
			return phyloProfile.makeFastaFiles({allowOverlap: true}).should.be.fulfilled
		})
		it('it should throw error if ask to non-overlapping families', function() {
			this.timeout(60000)
			const configFileName = 'validateOk.phypro.template.config.json'
			const configFileFullPath = path.resolve(testPath, configFileName)
			const configFile = fs.readFileSync(configFileFullPath)
			const config = JSON.parse(configFile)
			config.header.genomicInfoPath = testGenomicInfoPath
			config.phyloProfile.stop = 'trimSequences'
			const phyloProfile = new PhyloProfile(config)
			phyloProfile.setPipelineOutputPath(path.resolve(testPath, 'phyloProfile'))
			return phyloProfile.makeFastaFiles(config.header).should.be.rejectedWith('Found protein matching two protein family definitions. GCF_000006765.1-PA5040 is present in [0,1]')
		})
	})
})
