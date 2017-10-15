'use strict'

let fs = require('fs'),
	path = require('path'),
	bunyan = require('bunyan'),
	mkdirp = require('mkdirp'),
	jsonfile = require('jsonfile')


const pipelines = ['phylo-profile', 'ref-tree']

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
			this.config.phyloprofile = {}
			mkdirp.sync(path.resolve(localPath, pipeline))
			this.log.info('Pipeline ' + pipeline + ' initialized successfully')
		})

		let configFilename = 'phypro.' + this.config.header.ProjectName + '.config.json'
		let configFullPath = path.resolve(localPath, configFilename)

		fs.writeFileSync(configFullPath, JSON.stringify(this.config, null, ' '))
	}

	keepgoing(pipeline) {
		this._isValidProjectStructure()
		this._loadConfig()
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
