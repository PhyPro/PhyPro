'use strict'

const bunyan = require('bunyan')

const mist3 = require('./Mist3Helper.js')
const pfql = require('pfql')

const typesOfGenomes = ['reference', 'background']

module.exports =
class ConfigUtils {
	constructor(config) {
		this.config_ = config
		this.taxids_ = []
		this.log = bunyan.createLogger({name: 'ConfigUtils'})
	}

	config() {
		return this.config_
	}

	validate() {
		this.checkStructureOfConfig_()
		this.checkGenomes_()
		this.checkPfqlRules_(this.config_.phyloProfile.pfqlDefinitions)
	}

	fixDuplicates() {
		typesOfGenomes.forEach((type) => {
			this.popDuplicates_(type)
		})
	}

	update() {
		return this.updateTaxInfoMiST_('reference').then(() => this.updateTaxInfoMiST_('background'))
	}

	getTaxids(header) {
		const source = header || this.config_.header
		if (this.taxids_.length === 0) {
			typesOfGenomes.forEach((type) => {
				source.genomes[type].forEach((genome) => {
					this.taxids_.push(genome.taxid)
				})
			})
		}
		return this.taxids_
	}

	popDuplicates_(type) {
		const genomes = this.config_.header.genomes[type]
		const toPop = []
		for (let i = 0; i < genomes.length; i++) {
			let taxid = 0
			if (genomes[i].constructor === Number)
				taxid = genomes[i]
			else
				taxid = genomes[i].taxid

			if (this.taxids_.indexOf(taxid) === -1)
				this.taxids_.push(taxid)
			else
				toPop.push(i)
		}
		while (toPop.length)
			genomes.splice(toPop.pop(), 1)
	}

	checkStructureOfConfig_() {
		if (!(this.config_.header))
			throw new Error('No (or misplaced) mandatory header section')
		if (!(this.config_.header.projectName))
			throw new Error('No (or misplaced) mandatory header.projectName section')
		if (!(this.config_.header.genomes))
			throw new Error('No (or misplaced) mandatory header.genomes section')
		let typeOfGenomes = ['background', 'reference']
		typeOfGenomes.forEach((type) => {
			if (!(this.config_.header.genomes[type]))
				throw new Error('No (or misplaced) mandatory header.genomes.' + type + ' section')
		})
	}

	checkGenomes_() {
		this.checkStructureOfGenomes_('background')
		this.checkStructureOfGenomes_('reference')
	}

	updateTaxInfoMiST_(type) {
		let taxidItems = this.config_.header.genomes[type]
		let promises = []
		for (let i = 0; i < taxidItems.length; i++) {
			if (taxidItems[i].constructor === Number) {
				taxidItems[i] = {
					taxid: taxidItems[i]
				}
			}
			promises.push(mist3.getChildren(taxidItems[i].taxid))
		}
		return Promise.all(promises)
			.then((results) => {
				results.forEach((items, i) => {
					let mistItem = {}
					if (!(items))
						throw new Error('Invalid taxid. Not in MiST database: ' + taxidItems[i].taxid)
					else if (items.length !== 1)
						throw new Error('Invalid Taxid. The taxid ' + taxidItems[i].taxid + ' does not belong to a genome in MiST database.')
					else
						mistItem = items[0]
					taxidItems[i] = this.fixInfo_(taxidItems[i], mistItem)
				})
			})
	}

	fixInfo_(item, mistItem) {
		if (!(item.name)) {
			item.name = mistItem.name
		}
		else if (item.name !== mistItem.name) {
			item.name_user = item.name
			item.name = mistItem.name
		}
		return item
	}

	checkStructureOfGenomes_(type) {
		let newGenomes = []
		this.config_.header.genomes[type].forEach((item) => {
			if (item.constructor !== Number && item.constructor !== Object) {
				throw new Error('This item is neither a Number or an Object: ' + JSON.stringify(item))
			}
			else if (item.constructor === Object) {
				let keys = Object.keys(item)
				if (keys.indexOf('taxid') === -1)
					throw new Error('Genome taxonomy object missing "taxid" key.\n Offending item is: ' + JSON.stringify(item))
				else if (item.taxid.constructor !== Number)
					throw new Error('This item does not contain a valid taxid. Taxids should be an integer Number.\n Offending item is ' + JSON.stringify(item))
			}
		})
	}

	checkPfqlRules_(rules) {
		const pfqlService = new pfql.PFQLService(rules)
		try {
			pfqlService.initRules()
		}
		catch (err) {
			throw new Error(err.message)
		}
	}
}
