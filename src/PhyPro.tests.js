'use strict'

const path = require('path')
const fs = require('fs')
const glob = require('glob')
const rimraf = require('rimraf')

const chai = require('chai')
const chaiFs = require('chai-fs')

chai.use(chaiFs)

const expect = chai.expect

let PhyPro = require('./PhyPro.js')

const testPath = path.resolve(__dirname, 'test-data')
const availablePipelines = require('../src/availablePipelines.js')
const pipelines = Object.keys(availablePipelines)

describe.skip('PhyPro', function() {
	describe('init function', function() {
		beforeEach(function() {
			const projectNames = ['template', 'projectName']
			projectNames.forEach((projectName) => {
				rimraf.sync(path.resolve(testPath, projectName))
			})
			const configFilenamePattern = path.resolve(testPath, 'phypro.*.config.json')
			const files = glob.glob.sync(configFilenamePattern)
			files.forEach(function(file) {
				fs.unlinkSync(file)
			})
		})
		it('should build directory structure and config file', function() {
			const projectName = 'template'
			const configFilename = 'phypro.template.config.json'
			const phypro = new PhyPro(projectName)
			phypro.init(testPath)
			expect(testPath).to.be.a.directory().include.files([configFilename])
			pipelines.forEach((pipeline) => {
				expect(path.resolve(testPath, projectName, pipeline)).to.be.a.directory()
			})
		})
		it('should use generic projectName if no Project name is passed to constructor', function() {
			const projectName = 'projectName'
			let configFilename = 'phypro.projectName.config.json'
			let phypro = new PhyPro()
			phypro.init(testPath)
			expect(testPath).to.be.a.directory().include.files([configFilename])
			pipelines.forEach((pipeline) => {
				expect(path.resolve(testPath, projectName, pipeline)).to.be.a.directory()
			})
		})
		it('should add the background to header.genomes in config master configuration file.', function() {
			let phypro = new PhyPro()
			phypro.init(testPath)
			const config = phypro.getConfig()
			expect(config.header.genomes.background).to.not.be.undefined
		})
		it('should add the reference to header.genomes in config master configuration file.', function() {
			let phypro = new PhyPro()
			phypro.init(testPath)
			const config = phypro.getConfig()
			expect(config.header.genomes.reference).to.not.be.undefined
		})
		it('should add the initial config information for each pipeline in the master configuration file.', function() {
			let phypro = new PhyPro()
			phypro.init(testPath)
			pipelines.forEach((pipeline) => {
				const config = phypro.getConfig()
				expect(config[pipeline]).to.not.be.undefined
			})
		})
		it('should add the initial config for each pipeline not the objectMode.', function() {
			let phypro = new PhyPro()
			phypro.init(testPath)
			pipelines.forEach((pipeline) => {
				const config = phypro.getConfig()
				expect(config[pipeline]).not.eql({
					objectMode: true
				})
			})
		})
		afterEach(function() {
			const projectNames = ['template', 'projectName']
			projectNames.forEach((projectName) => {
				rimraf.sync(path.resolve(testPath, projectName))
			})
			let configFilenamePattern = path.resolve(testPath, 'phypro.*.config.json')
			let files = glob.glob.sync(configFilenamePattern)
			files.forEach(function(file) {
				fs.unlinkSync(file)
			})
		})
	})
	describe('isValidProjectStructure_', function() {
		beforeEach(function() {
			const projectNames = ['template', 'projectName']
			projectNames.forEach((projectName) => {
				rimraf.sync(path.resolve(testPath, projectName))
			})
			let configFilenamePattern = path.resolve(testPath, 'phypro.*.config.json')
			let files = glob.glob.sync(configFilenamePattern)
			files.forEach(function(file) {
				fs.unlinkSync(file)
			})
		})
		it('should throw error if can\'t find phyloProfile directory', function() {
			let missingPipeline = 'phyloProfile'
			let projectName = 'template'
			let phypro = new PhyPro(projectName)
			phypro.init(testPath)
			const missingPipelinePath = phypro.getConfig()[missingPipeline].path
			console.log(missingPipelinePath)
			rimraf.sync(missingPipelinePath)
			expect(phypro.isValidProjectStructure_.bind(phypro)).to.throw('The current directory does not have the ' + missingPipeline + ' folder. Please check if this is the correct directory.')
		})
		it('should throw error if can\'t find refTree directory', function() {
			let missingPipeline = 'refTree'
			let projectName = 'template'
			let phypro = new PhyPro(projectName)
			phypro.init(testPath)
			rimraf.sync(path.resolve(testPath, projectName, missingPipeline))
			expect(phypro.isValidProjectStructure_.bind(phypro)).to.throw('The current directory does not have the ' + missingPipeline + ' folder. Please check if this is the correct directory.')
			let configFilename = 'phypro.template.config.json'
			expect(testPath).to.be.a.directory().include.files([configFilename])
		})
		it('should pass if everything is ok', function() {
			let projectName = 'template'
			let phypro = new PhyPro(projectName)
			phypro.init(testPath)
			phypro.isValidProjectStructure_()
		})
		afterEach(function() {
			const projectNames = ['template', 'projectName']
			projectNames.forEach((projectName) => {
				rimraf.sync(path.resolve(testPath, projectName))
			})
			let configFilenamePattern = path.resolve(testPath, 'phypro.*.config.json')
			let files = glob.glob.sync(configFilenamePattern)
			files.forEach(function(file) {
				fs.unlinkSync(file)
			})
		})
	})
	describe('loadConfigFile function', function() {
		it('should load any valid json as config from file', function() {
			let configContent = {
				header: {
					projectName: 'template',
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
			phypro.loadConfigFile(path.resolve(testPath, configFilename))
			const config = phypro.getConfig()
			expect(config).eql(configContent)
		})
		it('should throw error if file is corrupted', function() {
			let configContent = {
				header: {
					projectName: 'template',
					initDate: 'Sat Oct 14 2017 12:58:45 GMT-0700 (PDT)'
				},
				phyloprofile: {},
				tree: {}
			}
			let projectName = 'template'
			let configFilename = 'corrupted.phypro.template.config.json'
			let phypro = new PhyPro(projectName)
			expect(phypro.loadConfigFile.bind(phypro, path.resolve(testPath, configFilename))).to.throw('The config file exists but it seems to be corrupted.')
		})
	})
	describe('keepgoing function', function() {
		beforeEach(function() {
			const projectNames = ['template', 'projectName']
			projectNames.forEach((projectName) => {
				rimraf.sync(path.resolve(testPath, projectName))
			})
			let configFilenamePattern = path.resolve(testPath, 'phypro.*.config.json')
			let files = glob.glob.sync(configFilenamePattern)
			files.forEach(function(file) {
				fs.unlinkSync(file)
			})
		})
		it('throws error if does not have the right directory structure', function() {
			let projectName = 'template'
			let phypro = new PhyPro(projectName)
			pipelines.forEach((pipeline) => {
				expect(phypro.keepGoing.bind(phypro, pipeline)).to.throw('The config file for this project does not exists. Please check the project name and if this is the correct directory.')
			})
		})
		it('It loads the standard config as default')
		it('should make sure that config file has been validated')
 		afterEach(function() {
			const projectNames = ['template', 'projectName']
			projectNames.forEach((projectName) => {
				rimraf.sync(path.resolve(testPath, projectName))
			})
			let configFilenamePattern = path.resolve(testPath, 'phypro.*.config.json')
			let files = glob.glob.sync(configFilenamePattern)
			files.forEach(function(file) {
				fs.unlinkSync(file)
			})
		})
	})
	describe('storeInfo_', function() {
		it('should work', function() {
			this.timeout(35000)
			process.chdir(testPath)
			const expectedNumProteins = [660, 5572, 2248]
			const projectName = 'template'
			const phypro = new PhyPro(projectName)
			const configFile = 'validateOk.phypro.template.config.json'
			phypro.init()
			phypro.loadConfigFile(configFile)
			return phypro.storeInfo_().then(() => {
				const configFilenamePattern = path.resolve(testPath, projectName, 'genomicInfo', 'phypro.template*.fa')
				const files = glob.glob.sync(configFilenamePattern)
				const fastaEntries = []
				files.forEach((file) => {
					const data = fs.readFileSync(file).toString()
					fastaEntries.push((data.match(/>/g) || []).length)
				})
				return expect(fastaEntries).eql(expectedNumProteins)
			})
		})
		after(function() {
			const projectNames = ['template', 'projectName']
			projectNames.forEach((projectName) => {
				rimraf.sync(path.resolve(testPath, projectName))
			})
			let configFilenamePattern = path.resolve(testPath, 'phypro.*.config.json')
			let files = glob.glob.sync(configFilenamePattern)
			files.forEach(function(file) {
				fs.unlinkSync(file)
			})
		})
	})
})

