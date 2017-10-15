'use strict'

let chai = require('chai'),
	path = require('path'),
	fs = require('fs'),
	glob = require('glob'),
	rimraf = require('rimraf')

chai.use(require('chai-fs'))

let expect = chai.expect

let PhyPro = require('./PhyPro.js')

const testPath = path.resolve(__dirname, 'test-data')

describe('PhyPro', function() {
	describe('init function', function() {
		beforeEach(function() {
			rimraf.sync(path.resolve(testPath, 'phylo-profile'))
			rimraf.sync(path.resolve(testPath, 'ref-tree'))
			let configFilenamePattern = path.resolve(testPath, 'phypro.*.config.json')
			let files = glob.glob.sync(configFilenamePattern)
			files.forEach(function(file) {
				fs.unlinkSync(file)
			})
		})
		it('should build directory structure and config file', function() {
			let projectName = 'template'
			let configFilename = 'phypro.template.config.json'
			let phypro = new PhyPro(projectName)
			phypro.init(testPath)
			expect(testPath).to.be.a.directory().include.files([configFilename])
			expect(path.resolve(testPath, 'phylo-profile')).to.be.a.directory()
			expect(path.resolve(testPath, 'ref-tree')).to.be.a.directory()
		})
		it('should use generic ProjectName if no Project name is passed to constructor', function() {
			let configFilename = 'phypro.ProjectName.config.json'
			let phypro = new PhyPro()
			phypro.init(testPath)
			expect(testPath).to.be.a.directory().include.files([configFilename])
			expect(path.resolve(testPath, 'phylo-profile')).to.be.a.directory()
			expect(path.resolve(testPath, 'ref-tree')).to.be.a.directory()
		})
		afterEach(function() {
			rimraf.sync(path.resolve(testPath, 'phylo-profile'))
			rimraf.sync(path.resolve(testPath, 'ref-tree'))
			let configFilenamePattern = path.resolve(testPath, 'phypro.*.config.json')
			let files = glob.glob.sync(configFilenamePattern)
			files.forEach(function(file) {
				fs.unlinkSync(file)
			})
		})
	})
	describe('_isValidProjectStructure', function() {
		beforeEach(function() {
			rimraf.sync(path.resolve(testPath, 'phylo-profile'))
			rimraf.sync(path.resolve(testPath, 'ref-tree'))
			let configFilenamePattern = path.resolve(testPath, 'phypro.*.config.json')
			let files = glob.glob.sync(configFilenamePattern)
			files.forEach(function(file) {
				fs.unlinkSync(file)
			})
		})
		it('must throw error if can\'t find config file', function() {
			let projectName = 'template'
			process.chdir(testPath)
			let phypro = new PhyPro(projectName)
			phypro.init(testPath)
			fs.unlinkSync('phypro.template.config.json')
			expect(phypro._isValidProjectStructure.bind(phypro)).to.throw('The config file for this project does not exists. Please check the project name and if this is the correct directory.')
		})
		it('must throw error if can\'t find phylo-profile directory', function() {
			let missingPipeline = 'phylo-profile'
			let projectName = 'template'
			let phypro = new PhyPro(projectName)
			process.chdir(testPath)
			phypro.init(testPath)
			rimraf.sync(path.resolve(testPath, missingPipeline))
			expect(phypro._isValidProjectStructure.bind(phypro)).to.throw('The current directory does not have the ' + missingPipeline + ' folder. Please check if this is the correct directory.')
		})
		it('must throw error if can\'t find ref-tree directory', function() {
			let missingPipeline = 'ref-tree'
			let projectName = 'template'
			let phypro = new PhyPro(projectName)
			process.chdir(testPath)
			phypro.init(testPath)
			rimraf.sync(path.resolve(testPath, missingPipeline))
			expect(phypro._isValidProjectStructure.bind(phypro)).to.throw('The current directory does not have the ' + missingPipeline + ' folder. Please check if this is the correct directory.')
			let configFilename = 'phypro.template.config.json'
			expect(testPath).to.be.a.directory().include.files([configFilename])
		})
		it('should pass if everything is ok', function() {
			process.chdir(testPath)
			let projectName = 'template'
			let phypro = new PhyPro(projectName)
			phypro.init()
			phypro._isValidProjectStructure()
		})
		afterEach(function() {
			rimraf.sync(path.resolve(testPath, 'phylo-profile'))
			rimraf.sync(path.resolve(testPath, 'ref-tree'))
			let configFilenamePattern = path.resolve(testPath, 'phypro.*.config.json')
			let files = glob.glob.sync(configFilenamePattern)
			files.forEach(function(file) {
				fs.unlinkSync(file)
			})
		})
	})
	describe('_loadConfig function', function() {
		it('must load config from file', function() {
			let configContent = {
				header: {
					ProjectName: 'template',
					initDate: 'Sat Oct 14 2017 12:58:45 GMT-0700 (PDT)'
				},
				phyloprofile: {},
				tree: {}
			}
			let projectName = 'template'
			let configFilename = 'loadConfig.phypro.template.config.json'
			let phypro = new PhyPro(projectName)
			phypro._loadConfig(path.resolve(testPath, configFilename))
			expect(phypro.config).eql(configContent)
		})
		it('must throw error if file is corrupted', function() {
			let configContent = {
				header: {
					ProjectName: 'template',
					initDate: 'Sat Oct 14 2017 12:58:45 GMT-0700 (PDT)'
				},
				phyloprofile: {},
				tree: {}
			}
			let projectName = 'template'
			let configFilename = 'corrupted.phypro.template.config.json'
			let phypro = new PhyPro(projectName)
			expect(phypro._loadConfig.bind(phypro, path.resolve(testPath, configFilename))).to.throw('The config file exists but it seems to be corrupted.')
		})
	})
	describe('keepgoing function', function() {
		it('throws error if does not have the right directory structure', function() {
			let projectName = 'template'
			let phypro = new PhyPro(projectName)
			expect(phypro.keepgoing.bind(phypro, 'ref-tree')).to.throw('The config file for this project does not exists. Please check the project name and if this is the correct directory.')
		})
		it('It loads the standard config as default', function() {
			let projectName = 'template'
			let phypro = new PhyPro(projectName)
			process.chdir(testPath)
			phypro.init()
			phypro.keepgoing('ref-tree')
		})
		after(function() {
			rimraf.sync(path.resolve(testPath, 'phylo-profile'))
			rimraf.sync(path.resolve(testPath, 'ref-tree'))
			let configFilenamePattern = path.resolve(testPath, 'phypro.*.config.json')
			let files = glob.glob.sync(configFilenamePattern)
			files.forEach(function(file) {
				fs.unlinkSync(file)
			})
		})
	})
})
