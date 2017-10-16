'use strict'

const Pipeline = require('./Pipeline.js')

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
