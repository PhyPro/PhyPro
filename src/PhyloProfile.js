'use strict'

const bunyan = require('bunyan')
const path = require('path')

const Pipeline = require('./Pipeline')
const ConfigUtils = require('./ConfigUtils')

const makeFastaFiles = require('./pipelines/phyloProfile/MakeFastaFiles')

module.exports =
class PhyloProfile extends Pipeline {
	constructor(config = {}) {
		super()
		this.name = 'phyloProfile'

		this.config_ = config
		this.config_[this.name] = this.config_[this.name] || {
			stages: [
				'makeFastaFiles',
				'trimSequences',
				'blastAll',
				'parseBlastData'
			],
			history: {},
			currentStage: 'init',
			stop: null,
			pfqlDefinitions: []
		}
	}

	getConfig() {
		return this.config_
	}

	setPipelineOutputPath(newPath) {
		this.config_[this.name].path = newPath
	}

	makeFastaFiles(options = {allowOverlap: false}) {
		const configUtils = new ConfigUtils()
		const listOfTaxIds = configUtils.getTaxids(this.config_.header)
		const info = {
			listOfTaxIds,
			genomicInfoPath: this.config_.header.genomicInfoPath,
			outputPath: this.config_[this.name].path,
			projectName: this.config_.header.projectName,
			pfqlDefinitions: this.config_[this.name].pfqlDefinitions
		}
		return makeFastaFiles(info, options)
			.then(() => {
				this.log.info('Files done')
				return options
			})
			.then((opt) => {
				super.goToNextStage(opt)
			})
	}

	trimSequences(options) {
		this.log.info('Starting trimSequences pipeline')
		return super.goToNextStage(options)
	}

	blastAll(options) {
		this.log.info('Starting blastAll pipeline')
		return super.goToNextStage(options)
	}

	parseBlastData(options) {
		this.log.info('Starting parseBlastData pipeline')
		return true
	}
}
