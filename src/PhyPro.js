'use strict'

let fs = require('fs'),
	path = require('path'),
	bunyan = require('bunyan'),
	mkdirp = require('mkdirp')

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

		this.config.phyloprofile = {}
		mkdirp.sync(path.resolve(localPath, 'phylo-profile'))
		this.log.info('Pipeline phyloprofile initialized successfully')

		this.config.tree = {}
		mkdirp.sync(path.resolve(localPath, 'ref-tree'))
		this.log.info('Pipeline tree initialized successfully')

		let configFilename = 'phypro.' + this.config.header.ProjectName + '.config.json'
		let configFullPath = path.resolve(localPath, configFilename)

		fs.writeFile(configFullPath, JSON.stringify(this.config, null, ' '))
	}

	loadExistingConfig(configFilename = '') {
		this.config = require(configFilename)
	}
}
