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
const availablePipelines = require('../src/availablePipelines.json')
const pipelines = Object.keys(availablePipelines)

describe('PhyPro', function() {
	describe('init function', function() {
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
		it('should build directory structure and config file', function() {
			let projectName = 'template'
			let configFilename = 'phypro.template.config.json'
			let phypro = new PhyPro(projectName)
			phypro.init(testPath)
			expect(testPath).to.be.a.directory().include.files([configFilename])
			pipelines.forEach((pipeline) => {
				expect(path.resolve(testPath, pipeline)).to.be.a.directory()
			})
		})
		it('should use generic ProjectName if no Project name is passed to constructor', function() {
			let configFilename = 'phypro.ProjectName.config.json'
			let phypro = new PhyPro()
			phypro.init(testPath)
			expect(testPath).to.be.a.directory().include.files([configFilename])
			pipelines.forEach((pipeline) => {
				expect(path.resolve(testPath, pipeline)).to.be.a.directory()
			})
		})
		it('should add the background to header.genomes in config master configuration file.', function() {
			let phypro = new PhyPro()
			phypro.init(testPath)
			const config = phypro.config()
			expect(config.header.genomes.background).to.not.be.undefined
		})
		it('should add the reference to header.genomes in config master configuration file.', function() {
			let phypro = new PhyPro()
			phypro.init(testPath)
			const config = phypro.config()
			expect(config.header.genomes.reference).to.not.be.undefined
		})
		it('should add the initial config information for each pipeline in the master configuration file.', function() {
			let phypro = new PhyPro()
			phypro.init(testPath)
			pipelines.forEach((pipeline) => {
				const config = phypro.config()
				expect(config[pipeline]).to.not.be.undefined
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
	describe('_isValidProjectStructure', function() {
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
		it('should throw error if can\'t find config file', function() {
			let projectName = 'template'
			process.chdir(testPath)
			let phypro = new PhyPro(projectName)
			phypro.init(testPath)
			fs.unlinkSync('phypro.template.config.json')
			expect(phypro._isValidProjectStructure.bind(phypro)).to.throw('The config file for this project does not exists. Please check the project name and if this is the correct directory.')
		})
		it('should throw error if can\'t find phyloProfile directory', function() {
			let missingPipeline = 'phyloProfile'
			let projectName = 'template'
			let phypro = new PhyPro(projectName)
			process.chdir(testPath)
			phypro.init(testPath)
			rimraf.sync(path.resolve(testPath, missingPipeline))
			expect(phypro._isValidProjectStructure.bind(phypro)).to.throw('The current directory does not have the ' + missingPipeline + ' folder. Please check if this is the correct directory.')
		})
		it('should throw error if can\'t find refTree directory', function() {
			let missingPipeline = 'refTree'
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
	describe('_loadConfigFile function', function() {
		it('should load any valid json as config from file', function() {
			let configContent = {
				header: {
					ProjectName: 'template',
					history: {
						initDate: 'Sat Oct 14 2017 12:58:45 GMT-0700 (PDT)'
					}
				},
				phyloprofile: {},
				tree: {},
				empty: false
			}
			let projectName = 'template'
			let configFilename = 'loadConfig.phypro.template.config.json'
			let phypro = new PhyPro(projectName)
			phypro._loadConfigFile(path.resolve(testPath, configFilename))
			const config = phypro.config()
			expect(config).eql(configContent)
		})
		it('should throw error if file is corrupted', function() {
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
			expect(phypro._loadConfigFile.bind(phypro, path.resolve(testPath, configFilename))).to.throw('The config file exists but it seems to be corrupted.')
		})
	})
	describe('keepgoing function', function() {
		it('throws error if does not have the right directory structure', function() {
			let projectName = 'template'
			let phypro = new PhyPro(projectName)
			pipelines.forEach((pipeline) => {
				expect(phypro.keepGoing.bind(phypro, pipeline)).to.throw('The config file for this project does not exists. Please check the project name and if this is the correct directory.')
			})
		})
		it('It loads the standard config as default', function() {
			let projectName = 'template'
			let phypro = new PhyPro(projectName)
			process.chdir(testPath)
			phypro.init()
			pipelines.forEach((pipeline) => {
				phypro.keepGoing([pipeline])
			})
		})
		it('should make sure that config file has been validated')
		after(function() {
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

