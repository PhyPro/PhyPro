'use strict'

let chai = require('chai'),
	path = require('path'),
	fs = require('fs'),
	rimraf = require('rimraf')

chai.use(require('chai-fs'))

let expect = chai.expect

let PhyPro = require('./PhyPro.js')

const testPath = path.resolve(__dirname, 'test-data')

describe('PhyPro', function() {
	describe('init function', function() {
		beforeEach(function() {
			let configFilename = 'phypro.template.config.json'
			fs.unlink(path.resolve(testPath, configFilename))
			rimraf.sync(path.resolve(testPath, 'phylo-profile'))
			rimraf.sync(path.resolve(testPath, 'ref-tree'))
		})
		it('should build directory structure and config file', function() {
			let projectName = 'template'
			let configFilename = 'phypro.template.config.json'
			let phypro = new PhyPro(projectName)
			phypro.init(testPath)
			expect(testPath).to.be.a.directory().with.files([configFilename])
			expect(path.resolve(testPath, 'phylo-profile')).to.be.a.directory()
			expect(path.resolve(testPath, 'ref-tree')).to.be.a.directory()
		})
		afterEach(function() {
			let configFilename = 'phypro.template.config.json'
			fs.unlink(path.resolve(testPath, configFilename))
			rimraf.sync(path.resolve(testPath, 'phylo-profile'))
			rimraf.sync(path.resolve(testPath, 'ref-tree'))
		})
	})
})
