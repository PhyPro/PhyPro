'use strict'

const Pipeline = require('./Pipeline.js')

module.exports =
class PhyloProfile extends Pipeline {
	constructor() {
		super({objectMode: true})
		this.config.FQLSetsOfRules = []
		this.config.trimRules = {}
		this.config.genomes = []
		this.config.referenceGenomes = []
	}
}
