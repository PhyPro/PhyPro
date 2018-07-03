'use strict'

const expect = require('chai').expect
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const rimraf = require('rimraf')

const testPath = path.resolve(__dirname, 'test-data')
const availablePipelines = require('../src/availablePipelines.json')
const pipelines = Object.keys(availablePipelines)

const pickGenomes = require('./pickGenomes.js')
const PhyPro = require('./PhyPro.js')

describe('pickGenomes', function() {
	it('must not be undefined and to be an Array when no N is passed', function() {
		let taxid = 10
		return pickGenomes.pick(taxid).then(function(taxids) {
			expect(taxids).to.not.be.undefined
			expect(taxids).to.be.an('array')
		})
	})
	it('must not be undefined and to be an Array when N is passed and it is smaller than the number of possible genomes', function() {
		let taxid = 10
		let N = 2
		return pickGenomes.pick(taxid, N).then(function(taxids) {
			expect(taxids).to.not.be.undefined
			expect(taxids).to.be.an('array')
			expect(taxids.length).eql(N)
		})
	})
	it.skip('must not be undefined and to be an Array and must return all elements when N is passed and it is larger than the number of possible genomes', function() {
		let taxid = 10
		let N = 12
		return pickGenomes.pick(taxid, N).then(function(taxids) {
			expect(taxids).to.not.be.undefined
			expect(taxids).to.be.an('array')
			expect(taxids.length).eql(4)
		})
	})
	it('must return an Array of numbers when N is not passed', function() {
		let taxid = 10
		return pickGenomes.pick(taxid).then(function(taxids) {
			taxids.forEach(function(item) {
				expect(item.taxid).to.be.a('number')
				expect(item.name).to.be.a('string')
			})
		})
	})
	it('must return an Array of numbers when N is passed', function() {
		let taxid = 10
		let N = 3
		return pickGenomes.pick(taxid, N).then(function(taxids) {
			taxids.forEach(function(item) {
				expect(item.taxid).to.be.a('number')
				expect(item.name).to.be.a('string')
			})
		})
	})
	it('should work with deep nodes', function() {
		this.timeout(100000)
		let taxid = 28211
		let N = 10
		return pickGenomes.pick(taxid, N).then(function(taxids) {
			expect(taxids).to.not.be.undefined
			expect(taxids).to.be.an('array')
			expect(taxids.length).eql(N)
		})
	})
	describe('updateConfig', function() {
		beforeEach(function() {
			pipelines.forEach((pipeline) => {
				rimraf.sync(path.resolve(testPath, pipeline))
			})
			let configFilenamePattern = path.resolve(testPath, 'phypro.*.config.json')
			let files = glob.glob.sync(configFilenamePattern)
			files.forEach(function(file) {
				fs.unlinkSync(file)
			})
		})
		it.skip('should update the config file ', function() {
			let taxid = 10
			let N = 3
			let projectName = 'template'
			let configFilename = path.resolve(testPath, 'phypro.template.config.json')
			let phypro = new PhyPro(projectName)
			phypro.init(testPath)
			return pickGenomes.pick(taxid, N).then(function(taxids) {
				pickGenomes.updatePhyProConfig(configFilename, taxids)
				let configJSON = JSON.parse(fs.readFileSync(configFilename).toString())
				expect(configJSON.header.genomes.background.length).eql(N)
			})
		})
		it.skip('should add to existing taxids in the config file ', function() {
			let taxid = 10
			let N = 3
			let projectName = 'template'
			let configFilename = path.resolve(testPath, 'phypro.template.config.json')
			let phypro = new PhyPro(projectName)
			phypro.init(testPath)
			return pickGenomes.pick(taxid, N).then(function(taxids) {
				pickGenomes.updatePhyProConfig(configFilename, taxids)
				pickGenomes.updatePhyProConfig(configFilename, taxids)
				let configJSON = JSON.parse(fs.readFileSync(configFilename).toString())
				expect(configJSON.header.genomes.background.length).eql(N + N)
			})
		})
		afterEach(function() {
			pipelines.forEach((pipeline) => {
				rimraf.sync(path.resolve(testPath, pipeline))
			})
			let configFilenamePattern = path.resolve(testPath, 'phypro.*.config.json')
			let files = glob.glob.sync(configFilenamePattern)
			files.forEach(function(file) {
				fs.unlinkSync(file)
			})
		})
	})
})
