'use strict'

const path = require('path')

const Pipeline = require('./Pipeline.js')


module.exports =
class RefTree extends Pipeline {
	constructor(config) {
		super()
		this.name = 'refTree'

		this.config_ = config
		this.config_[this.name] = this.config_[this.name] || {
			stages: [
				'init',
				'fetchGenomes',
				'fetchCDDs',
				'buildRPSdb',
				'runRPS',
				'alignSeqs',
				'concatSeqs',
				'gBlock',
				'phylogeny',
				'processTree'
			],
			history: {},
			currentStage: 'init',
			stop: null,
			gblockRules: {},
			phylogeny: {
				software: '',
				settings: ''
			},
			cdds: []
		}

		this.config_[this.name].path = this.config_[this.name].path || path.resolve(this.config_.header.projectName, this.name)
	}
}
