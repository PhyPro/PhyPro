'use strict'

let fs = require('fs'),
	path = require('path'),
	bunyan = require('bunyan'),
	mkdirp = require('mkdirp'),
	jsonfile = require('jsonfile')

const availablePipelines = require('../src/availablePipelines.json')

const pipelines = Object.keys(availablePipelines)

const mist3 = require('./Mist3Helper.js')
const ConfigUtils = require('./ConfigUtils.js')

module.exports =
class PhyPro {
	/**
	 * Creates an instance of PhyPro.
	 * @param {string} [ProjectName='']
	 */
	constructor(ProjectName = '') {
		this.config_ = {}
		this.config_.header = {}
		this.config_.header.ProjectName = ProjectName !== '' ? ProjectName : 'ProjectName'
		this.config_.header.genomes = {
			background: [],
			reference: []
		}
		this.config_.header.history = {}
		this.config_.empty = true
		this.log = bunyan.createLogger({name: 'PhyPro - ' + ProjectName})
	}

	config() {
		return this.config_
	}

	/**
	 * Initialize the directory structure and configuration file.
	 * @param {string} [localPath='./']
	 */
	init(localPath = './') {
		this.config_.header.history.initDate = Date()
		this.log.info('Project ' + this.config_.header.ProjectName + ' initialized.')

		pipelines.forEach((pipeline) => {
			let PipeInstance = eval(availablePipelines[pipeline].start),
				pipeInstance = new PipeInstance()
			this.config_[pipeline] = pipeInstance.config
			mkdirp.sync(path.resolve(localPath, pipeline))
			this.log.info('Pipeline ' + pipeline + ' initialized successfully')
		})
		let configFilename = 'phypro.' + this.config_.header.ProjectName + '.config.json'
		let configFullPath = path.resolve(localPath, configFilename)

		fs.writeFileSync(configFullPath, JSON.stringify(this.config_, null, ' '))
		console.log('Everything looks good, now you must config the config file and run this command again with the flag --keepgoing followed by the pipeline(s) you want to start running. You can run multiple pipelines as once, PhyPro will grab N-1 processors from your computer and divide equally between the tasks. For efficiency in big jobs, try running one pipeline at the time.')
	}

	loadConfigFile(configFilename) {
		let filename = configFilename ? configFilename : 'phypro.' + this.config_.header.ProjectName + '.config.json'
		try {
			let config = jsonfile.readFileSync(filename, 'utf8')
			this.config_ = config
			this.config_.empty = false
			this.log.info('Config loaded successfully')
		}
		catch (err) {
			throw new Error('The config file exists but it seems to be corrupted.')
		}
	}

	validateConfig() {
		const configUtils = new ConfigUtils(this.config_)
		configUtils.validate()
	}

	updateConfig() {
		const configUtils = new ConfigUtils(this.config_)
		configUtils.fixDuplicates()
		return configUtils.update().then(() => {
			this.config_ = configUtils.config()
			let N = 0
			Object.keys(this.config_.header.genomes).forEach((type) => {
				N += this.config_.header.genomes[type].length
			})
			this.log.info('There are ' + N + ' genomes in your config file')
		}).catch((err) => {
			console.log(err)
			throw new Error(err)
		})
	}

	keepGoing(pipelineChoices) {
		this.isValidProjectStructure_()
		if (this.config_.empty)
			this.loadConfigFile()
		pipelineChoices.forEach((pipeline) => {
			let PipeInstance = eval(availablePipelines[pipeline].start),
				pipeInstance = new PipeInstance()
			pipeInstance.loadConfig(this.config_[pipeline])
			this.log.info('Config file for ' + pipeline + ' loaded successfully')
			pipeInstance.keepGoing()
		})
	}

	logInfo(msg) {
		this.log.info(msg)
	}


	logWarn(msg) {
		this.log.warn(msg)
	}

	checkStructureOfConfig_() {
		if (!(this.config_.header))
			throw new Error('No (or misplaced) mandatory header section')
		if (!(this.config_.header.ProjectName))
			throw new Error('No (or misplaced) mandatory header.ProjectName section')
		if (!(this.config_.header.genomes))
			throw new Error('No (or misplaced) mandatory header.genomes section')
		let typeOfGenomes = ['background', 'reference']
		typeOfGenomes.forEach((type) => {
			if (!(this.config_.header.genomes[type]))
				throw new Error('No (or misplaced) mandatory header.genomes.' + type + ' section')
		})
	}

	isValidProjectStructure_() {
		if (!(fs.existsSync('phypro.' + this.config_.header.ProjectName + '.config.json')))
			throw new Error('The config file for this project does not exists. Please check the project name and if this is the correct directory.')
		pipelines.forEach((pipeline) => {
			if (!(fs.existsSync(pipeline)))
				throw new Error('The current directory does not have the ' + pipeline + ' folder. Please check if this is the correct directory.')
		})
		this.log.info('Project structure seems ok :)')
	}
}
