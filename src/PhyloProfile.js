'use strict'

const Pipeline = require('./Pipeline.js')

const stages = [
	'makeFastaFiles',
	'trimSequences',
	'BLASTAll',
	'ParseBLASTData'
]

module.exports =
class PhyloProfile extends Pipeline {
	constructor() {
		super({objectMode: true})
		this.config.PfqlDefinitions = []
		this.config.trimRules = {}
	}

	keepGoing() {

	}
}
