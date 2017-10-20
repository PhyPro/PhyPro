'use strict'

let fs = require('fs'),
	path = require('path'),
	bunyan = require('bunyan'),
	mkdirp = require('mkdirp'),
	jsonfile = require('jsonfile')

const availablePipelines = require('../src/availablePipelines.json')

const pipelines = Object.keys(availablePipelines)

module.exports =
class PhyPro {
	/**
	 * Creates an instance of PhyPro.
	 * @param {string} [ProjectName='']
	 */
	constructor(ProjectName = '') {
		this.config = {}
		this.config.header = {}
		this.config.header.ProjectName = ProjectName !== '' ? ProjectName : 'ProjectName'
		this.log = bunyan.createLogger({name: 'PhyPro - ' + ProjectName})
	}

	/**
	 * Initialize the directory structure and configuration file.
	 * @param {string} [localPath='./']
	 */
	init(localPath = './') {
		this.config.header.initDate = Date()
		this.log.info('Project ' + this.config.header.ProjectName + ' initialized.')

		pipelines.forEach((pipeline) => {
			let PipeInstance = eval(availablePipelines[pipeline].start),
				pipeInstance = new PipeInstance()
			this.config[pipeline] = pipeInstance.config
			mkdirp.sync(path.resolve(localPath, pipeline))
			this.log.info('Pipeline ' + pipeline + ' initialized successfully')
		})
		let configFilename = 'phypro.' + this.config.header.ProjectName + '.config.json'
		let configFullPath = path.resolve(localPath, configFilename)

		fs.writeFileSync(configFullPath, JSON.stringify(this.config, null, ' '))
		console.log('Everything looks good, now you must config the config file and run this command again with the flag --keepgoing followed by the pipeline(s) you want to start running. You can run multiple pipelines as once, PhyPro will grab N-1 processors from your computer and divide equally between the tasks. For efficiency in big jobs, try running one pipeline at the time.')
	}

	validateConfig() {
		return null
	}

	keepGoing(pipelineChoices) {
		this._isValidProjectStructure()
		this._loadConfig()
		pipelineChoices.forEach((pipeline) => {
			let PipeInstance = eval(availablePipelines[pipeline].start),
				pipeInstance = new PipeInstance()
			pipeInstance.loadConfig(this.config[pipeline])
			this.log.info('Config file for ' + pipeline + ' loaded successfully')
			pipeInstance.keepGoing()
		})
	}

	_isValidProjectStructure() {
		if (!(fs.existsSync('phypro.' + this.config.header.ProjectName + '.config.json')))
			throw new Error('The config file for this project does not exists. Please check the project name and if this is the correct directory.')
		pipelines.forEach((pipeline) => {
			if (!(fs.existsSync(pipeline)))
				throw new Error('The current directory does not have the ' + pipeline + ' folder. Please check if this is the correct directory.')
		})
		this.log.info('Project structure seems ok :)')
	}

	_loadConfig(configFilename) {
		let filename = configFilename ? configFilename : 'phypro.' + this.config.header.ProjectName + '.config.json'
		try {
			let config = jsonfile.readFileSync(filename, 'utf8')
			this.config = config
			this.log.info('Config loaded successfully')
		}
		catch (err) {
			throw new Error('The config file exists but it seems to be corrupted.')
		}
	}
}
