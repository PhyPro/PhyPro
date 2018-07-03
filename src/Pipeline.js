'use strict'

module.exports =

class Pipeline {
	constructor() {
		this.config = {}
		this.config.history = {}
		this.config.stage = 'init'
		this.config.stop = ''
	}

	loadConfig(config) {
		this.config = config
	}

	keepGoing() {
		return null
	}
}
