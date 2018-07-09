'use strict'

const bunyan = require('bunyan')
const mkdirp = require('mkdirp')
const path = require('path')

module.exports =
class Pipeline {
	/**
	 * Creates an instance of Pipeline.
	 *
	 * This instance is an abstraction class to build pipelines.
	 * As pipelines are very specific, all the logic behind it goes to the pipeline class extending this class.
	 * However, this class provides some functionality to deal with stages.
	 *
	 * @param {any} config
	 */
	constructor(config = {}) {
		this.name = 'pipeline'

		this.config_ = config

		this.config_[this.name] = this.config_[this.name] || {
			stages: ['init'],
			history: {},
			currentStage: 'init',
			stop: null
		}

		this.log = bunyan.createLogger({
			name: this.name
		})
	}

	/**
	 * Initialize the file structure required by the pipeline
	 * 
	 */
	init(pipelinePath) {
		const projectPath = this.getConfig().header.projectPath
		const pipePath = pipelinePath || `${projectPath}/${this.name}`
		mkdirp.sync(path.resolve(pipePath))
		this.getConfig()[this.name].path = pipePath
		this.addHistory('init')
		this.bumpStage()
	}

	/**
	 * Returns the config object
	 *
	 * @returns {Object}
	 */
	getConfig() {
		return this.config_
	}

	/**
	 * Update the config object with a new one
	 *
	 * @param {Object} config
	 * @returns {Object} new config
	 */
	setConfig(config) {
		this.config_ = config
		return this.config_
	}

	/**
	 * Return the current stage of the pipeline.
	 *
	 * @returns {String} stage
	 */
	getCurrentStage() {
		return this.config_[this.name].currentStage
	}

	/**
	 * Pass the name of a stage and verify if it is a valid stage.
	 *
	 * It will throw different errors in different cases.
	 *
	 * @param {String} stage
	 */
	isValidStage(stage) {
		if (this.config_[this.name].stages.indexOf(stage) === -1) {
			this.log.error(`This is an invalid stage: ${stage}`)
			throw Error(`This is an invalid stage: ${stage}`)
		}
		this.log.info(`Stage ${stage} is valid.`)
	}

	/**
	 * Sets new current stage
	 *
	 * @param {String} stage
	 *
	 */
	setCurrentStage(stage) {
		try {
			this.isValidStage(stage)
		}
		catch (err) {
			this.log.error(`Cannot set current stage to ${stage}. Invalid stage.`)
			throw err
		}
		this.config_[this.name].currentStage = stage
	}

	/**
	 * Returns the position of the stage within the pipeline.
	 *
	 * @param {String} stage
	 * @returns {Integer} stagePosition
	 */
	getStagePosition(stage) {
		return this.config_[this.name].stages.indexOf(stage)
	}

	/**
	 * Check if there is a next stage from a given position.
	 *
	 * @param {any} stage
	 * @returns {Boolean}
	 */
	checkForNextStage(stage) {
		const stagePosition = this.getStagePosition(stage)
		if (stagePosition === this.config_[this.name].stages.length - 1) {
			this.log.warn('There is no next stage')
			return false
		}
		return true
	}

	/**
	 * Returns the next stage in the pipeline.
	 * 
	 * @returns {String} stage
	 */
	getNextStage() {
		const currentStage = this.getCurrentStage()
		if (this.checkForNextStage(currentStage)) {
			const stagePosition = this.getStagePosition(currentStage)
			return this.config_[this.name].stages[stagePosition + 1]
		}
		return false
	}

	/**
	 * Returns true if it shouldn't pass to the next stage
	 * 
	 * @returns {Boolean}
	 */
	shouldStop() {
		const stopStage = this.config_[this.name].stop
		const nextStage = this.getNextStage()
		if (this.getStagePosition(stopStage) <= this.getStagePosition(nextStage) && stopStage !== null)
			return true
		return false
	}

	/**
	 * Returns the history of when each stage has been completed
	 * 
	 * @returns {Object} history
	 */
	getHistory() {
		return this.config_[this.name].history
	}

	/**
	 * Internal method to set history
	 *
	 * @param {any} newHistory
	 */
	setHistory_(newHistory) {
		this.config_[this.name].history = newHistory
	}

	/**
	 * Add stage history
	 *
	 * @param {any} stage
	 */
	addHistory(stage) {
		const history = this.getHistory()
		history[stage] = Date()
		this.setHistory_(history)
	}

	/**
	 * Bumps the config object to next stage.
	 * 
	 * Returns true if successful
	 * 
	 * @returns {Boolean}
	 */
	bumpStage() {
		const currentStage = this.getCurrentStage()
		this.log.debug(`Stage ${currentStage} executed sucessfuly.`)
		this.log.debug(`Should we stop here? ${this.shouldStop()}`)
		if (!this.shouldStop() && this.checkForNextStage(currentStage)) {
			const nextStage = this.getNextStage()
			this.log.debug(`The next stage is ${nextStage}`)
			this.setCurrentStage(nextStage)
			return true
		}
		this.log.warn(`The config file says to stop at ${this.config_[this.name].stop} which is the next stage. Stopping.`)
		return false
	}

	keepGoing(options) {
		const currentStage = this.getCurrentStage()
		this.log.info(`Preparing to execute stage: ${currentStage}`)
		return this[currentStage](options)
	}

	goToNextStage(options) {
		this.addHistory(this.getCurrentStage())
		if (this.bumpStage()) {
			const currentStage = this.getCurrentStage()
			this.log.info(`Preparing to execute stage: ${currentStage}`)
			return this[currentStage](options)
		}
		return false
	}

	endPipeline() {
		this.addHistory(this.getCurrentStage())
		return true
	}
}
