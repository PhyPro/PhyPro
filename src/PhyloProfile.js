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
		this.config.FQLSetsOfRules = []
		this.config.trimRules = {}
		this.config.genomes = []
		this.config.referenceGenomes = []
	}

	keepGoing() {

	}
}
