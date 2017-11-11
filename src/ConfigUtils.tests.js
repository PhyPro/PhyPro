'use strict'

const chai = require('chai')
const expect = chai.expect

const ConfigUtils = require('./ConfigUtils.js')

describe('ConfigUtils', function() {
	describe('config()', function() {
		it('should return the config JSON', function() {
			const config = {
				header: {
					ProjectName: 'template',
					genomes: {
						reference: []
					}
				}
			}
			const configUtils = new ConfigUtils(config)
			expect(configUtils.config()).eql(config)
		})
	})
	describe('validate()', function() {
		it('throws error if session "header" is missing', function() {
			let config = {other: ''}
			const configUtils = new ConfigUtils(config)
			expect(configUtils.validate.bind(configUtils)).to.throw('No (or misplaced) mandatory header section')
		})
		it('throws error if session "header.ProjectName" is missing', function() {
			let config = {
				header: {
					genomes: {}
				}
			}
			const configUtils = new ConfigUtils(config)
			expect(configUtils.validate.bind(configUtils)).to.throw('No (or misplaced) mandatory header.ProjectName section')
		})
		it('throws error if session "header.ProjectName" is missing', function() {
			let config = {
				header: {
					genomes: {}
				}
			}
			const configUtils = new ConfigUtils(config)
			expect(configUtils.validate.bind(configUtils)).to.throw('No (or misplaced) mandatory header.ProjectName section')
		})
		it('throws error if session "header.genomes" is missing', function() {
			let config = {
				header: {
					ProjectName: 'template'
				}
			}
			const configUtils = new ConfigUtils(config)
			expect(configUtils.validate.bind(configUtils)).to.throw('No (or misplaced) mandatory header.genomes section')
		})
		it('throws error if session "header.genomes.background" is missing', function() {
			let config = {
				header: {
					ProjectName: 'template',
					genomes: {
						reference: []
					}
				}
			}
			const configUtils = new ConfigUtils(config)
			expect(configUtils.validate.bind(configUtils)).to.throw('No (or misplaced) mandatory header.genomes.background section')
		})
		it('throws error if session "header.genomes.reference" is missing', function() {
			let config = {
				header: {
					ProjectName: 'template',
					genomes: {
						background: []
					}
				}
			}
			const configUtils = new ConfigUtils(config)
			expect(configUtils.validate.bind(configUtils)).to.throw('No (or misplaced) mandatory header.genomes.reference section')
		})
		it('should throw error if item in background and reference are not Numbers or Objects', function() {
			let config = {
				header: {
					ProjectName: 'template',
					genomes: {
						background: [
							'121'
						],
						reference: []
					}
				}
			}
			const configUtils = new ConfigUtils(config)
			expect(configUtils.validate.bind(configUtils)).to.throw('This item is neither a Number or an Object: "121"')
		})
		it('should throw error if item in background and reference are not Numbers or Objects', function() {
			let config = {
				header: {
					ProjectName: 'template',
					genomes: {
						background: [
							[1]
						],
						reference: []
					}
				}
			}
			const configUtils = new ConfigUtils(config)
			expect(configUtils.validate.bind(configUtils)).to.throw('This item is neither a Number or an Object: [1]')
		})
		it('should throw error if Object in background does not have a the key "taxid"', function() {
			let config = {
				header: {
					ProjectName: 'template',
					genomes: {
						background: [
							{
								name: 'my bug'
							}
						],
						reference: []
					}
				}
			}
			const configUtils = new ConfigUtils(config)
			expect(configUtils.validate.bind(configUtils)).to.throw('Genome taxonomy object missing "taxid" key.\n Offending item is: {"name":"my bug"}')
		})
		it('should throw error if Object in reference does not have a the key "taxid"', function() {
			let config = {
				header: {
					ProjectName: 'template',
					genomes: {
						reference: [
							{
								name: 'my bug'
							}
						],
						background: []
					}
				}
			}
			const configUtils = new ConfigUtils(config)
			expect(configUtils.validate.bind(configUtils)).to.throw('Genome taxonomy object missing "taxid" key.\n Offending item is: {"name":"my bug"}')
		})
	})
	describe('fixDuplicates()', function() {
		it('should eliminate duplicates', function() {
			let config = {
				header: {
					ProjectName: 'template',
					genomes: {
						reference: [
							{
								taxid: 211586
							},
							211586
						],
						background: []
					}
				}
			}
			const configUtils = new ConfigUtils(config)
			configUtils.fixDuplicates()
			const newConfig = configUtils.config()
			expect(newConfig.header.genomes.reference.length).eql(1)
		})
		it('should eliminate duplicates', function() {
			let config = {
				header: {
					ProjectName: 'template',
					genomes: {
						reference: [
							{
								taxid: 211586
							},
							211586
						],
						background: []
					}
				}
			}
			const configUtils = new ConfigUtils(config)
			configUtils.fixDuplicates()
			const newConfig = configUtils.config()
			expect(newConfig.header.genomes.reference.length).eql(1)
		})
		it('should eliminate duplicates in background and keep reference', function() {
			let config = {
				header: {
					ProjectName: 'template',
					genomes: {
						reference: [
							{
								taxid: 211586
							},
							211586
						],
						background: [
							{
								taxid: 211586
							},
							{
								taxid: 211586
							},
							{
								taxid: 211586
							},
							208964
						]
					}
				}
			}
			const configUtils = new ConfigUtils(config)
			configUtils.fixDuplicates()
			const newConfig = configUtils.config()
			expect(newConfig.header.genomes.reference.length).eql(1)
			expect(newConfig.header.genomes.background.length).eql(1)
		})
	})
	describe('update()', function() {
		it('Throw error if passed taxid is not a MiST genome', function() {
			let config = {
				header: {
					ProjectName: 'template',
					genomes: {
						reference: [
							{
								taxid: 10
							}
						],
						background: []
					}
				}
			}
			const configUtils = new ConfigUtils(config)
			return configUtils.update().then()
				.catch(function(err) {
					expect(err.message).to.equal('Invalid Taxid. The taxid 10 does not belong to a genome in MiST database.')
				})
		})
		it('should complete info in item', function() {
			let config = {
				header: {
					ProjectName: 'template',
					genomes: {
						reference: [
							{
								taxid: 211586
							}
						],
						background: []
					}
				}
			}
			let expectedGenomes = {
				reference: [
					{
						taxid: 211586,
						name: 'Shewanella oneidensis MR-1'
					}
				],
				background: []
			}
			const configUtils = new ConfigUtils(config)
			return configUtils.update().then(() => {
				const newConfig = configUtils.config()
				expect(newConfig.header.genomes).eql(expectedGenomes)
			})
		})
		it('should complete info in multiple taxonomy items even if it is just a number not an object', function() {
			let config = {
				header: {
					ProjectName: 'template',
					genomes: {
						reference: [211586, 208964],
						background: []
					}
				}
			}
			let expectedGenomes = {
				reference: [
					{
						taxid: 211586,
						name: 'Shewanella oneidensis MR-1'
					},
					{
						name: 'Pseudomonas aeruginosa PAO1',
						taxid: 208964
					}
				],
				background: []
			}
			const configUtils = new ConfigUtils(config)
			return configUtils.update().then(() => {
				const newConfig = configUtils.config()
				expect(newConfig.header.genomes).eql(expectedGenomes)
			})
		})
		it('should complete info in taxonomy item even if it is just a number not an object - in background genomes too', function() {
			let config = {
				header: {
					ProjectName: 'template',
					genomes: {
						background: [211586],
						reference: []
					}
				}
			}
			let expectedGenomes = {
				background: [
					{
						taxid: 211586,
						name: 'Shewanella oneidensis MR-1'
					}
				],
				reference: []
			}
			const configUtils = new ConfigUtils(config)
			return configUtils.update().then(() => {
				const newConfig = configUtils.config()
				expect(newConfig.header.genomes).eql(expectedGenomes)
			})
		})
	})
	describe('checkPfqlRules_', function() {
		it('should re-throw error from PFQL', function() {
			const rules = [
				{
					rules: [
						{
							Npos: [
								{
									resource: 'pfam30',
									feasture: 'Secretin'
								}
							]
						}
					]
				}
			]
			const configUtils = new ConfigUtils({})
			expect(configUtils.checkPfqlRules_.bind(configUtils, rules)).to.throw('Each Npos rule must explicitly define a feature: \n{"resource":"pfam30","feasture":"Secretin"}')
		})
		it('correct rules must pass', function() {
			const rules = [
				{
					rules: [
						{
							Npos: [
								{
									resource: 'pfam30',
									feature: 'Secretin'
								}
							]
						}
					]
				}
			]
			const configUtils = new ConfigUtils({})
			expect(configUtils.checkPfqlRules_.bind(configUtils, rules)).to.not.throw()
		})
	})
})
