'use strict'

const expect = require('chai').expect
const Pipeline = require('./Pipeline')


describe('Pipeline', function() {
	describe('getConfig', function() {
		it('should return config object', function() {
			const pipeline = new Pipeline()
			const expectedConfig = {
				pipeline: {
					stages: ['init'],
					history: {},
					currentStage: 'init',
					stop: null
				}
			}
			expect(pipeline.getConfig()).eql(expectedConfig)
		})
	})
	describe('setConfig', function() {
		it('should set a new config object and return', function() {
			const pipeline = new Pipeline()
			const newConfig = {
				pipeline: {
					stages: ['init', 'stage1'],
					history: {},
					currentStage: 'init',
					stop: null
				}
			}
			const updatedConfig = pipeline.setConfig(newConfig)
			expect(pipeline.getConfig()).eql(newConfig)
			expect(updatedConfig).eql(newConfig)
		})
	})
	describe('getCurrentStage', function() {
		it('should get current stage', function() {
			const pipeline = new Pipeline()
			const currentStage = pipeline.getCurrentStage()
			const expectedStage = 'init'
			expect(currentStage).eql(expectedStage)
		})
	})
	describe('setCurrentStage', function() {
		it('should set current stage', function() {
			const pipeline = new Pipeline()
			const newConfig = {
				pipeline: {
					stages: ['init', 'stage1'],
					history: {},
					currentStage: 'init',
					stop: null
				}
			}
			pipeline.setConfig(newConfig)
			const expectedStage = 'stage1'
			pipeline.setCurrentStage(expectedStage)
			expect(pipeline.getCurrentStage()).eql(expectedStage)
		})
	})
	describe('getNextStage', function() {
		it('should get next stage', function() {
			const pipeline = new Pipeline()
			const newConfig = {
				pipeline: {
					stages: ['init', 'stage1'],
					history: {},
					currentStage: 'init',
					stop: null
				}
			}
			pipeline.setConfig(newConfig)
			const nextStage = pipeline.getNextStage()
			const expectedStage = 'stage1'
			expect(nextStage).eql(expectedStage)
		})
		it('should throw an error if there is no next stage', function() {
			const pipeline = new Pipeline()
			expect(() => {
				pipeline.getNextStage()
			}).throw('There is no next stage')
		})
	})
	describe('bumpStage', function() {
		it('should bump to next stage', function() {
			const pipeline = new Pipeline()
			const newConfig = {
				pipeline: {
					stages: ['init', 'stage1'],
					history: {},
					currentStage: 'init',
					stop: null
				}
			}
			pipeline.setConfig(newConfig)
			pipeline.bumpStage()
			const currentStage = pipeline.getCurrentStage()
			const expectedStage = 'stage1'
			expect(currentStage).eql(expectedStage)
		})
		it('should bump twice if run it twice in a row', function() {
			const pipeline = new Pipeline()
			const newConfig = {
				pipeline: {
					stages: ['init', 'stage1', 'stage2'],
					history: {},
					currentStage: 'init',
					stop: null
				}
			}
			pipeline.setConfig(newConfig)
			pipeline.bumpStage()
			pipeline.bumpStage()
			const currentStage = pipeline.getCurrentStage()
			const expectedStage = 'stage2'
			expect(currentStage).eql(expectedStage)
		})
		it('should respect stop', function() {
			const pipeline = new Pipeline()
			const newConfig = {
				pipeline: {
					stages: ['init', 'stage1', 'stage2'],
					history: {},
					currentStage: 'init',
					stop: 'stage2'
				}
			}
			pipeline.setConfig(newConfig)
			pipeline.bumpStage()
			expect(pipeline.getCurrentStage()).eql('stage1')
			expect(pipeline.bumpStage()).to.be.false
			expect(pipeline.getCurrentStage()).eql('stage1')
		})
		it('should write in history', function() {
			const pipeline = new Pipeline()
			const newConfig = {
				pipeline: {
					stages: ['init', 'stage1'],
					history: {},
					currentStage: 'init',
					stop: null
				}
			}
			pipeline.setConfig(newConfig)
			pipeline.bumpStage()
			const history = pipeline.getHistory()
			const historyKeys = Object.keys(history)
			const expectedHistoryKey = 'init'
			expect(historyKeys).to.include(expectedHistoryKey)
		})
	})
})
