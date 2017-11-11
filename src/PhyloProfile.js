'use strict'

const Pipeline = require('./Pipeline.js')

const stages = [
	'init',
	'fetchGenomeData',
	'fetchProteinData',
	'makeFastaFiles',
	'trimSequences',
	'BLASTAll',
	'ParseBLASTData'
]

module.exports =
class PhyloProfile extends Pipeline {
	constructor() {
		super({objectMode: true})
		this.config.PFQLDefinitions = []
		this.config.trimRules = {}
	}

	keepGoing() {

	}
}
