'use strict'

const Pipeline = require('./Pipeline.js')

const stages = [
	'fetchGenomes',
	'fetchCDDs',
	'buildRPSdb',
	'runRPS',
	'alignSeqs',
	'concatSeqs',
	'gBlock',
	'phylogeny',
	'processTree'
]

module.exports =
class RefTree extends Pipeline {
	constructor() {
		super({objectMode: true})
		this.config.gblockRules = {}
		this.config.phylogeny = {
			software: '',
			settings: ''
		}
		this.config.cdds = []
	}
}
