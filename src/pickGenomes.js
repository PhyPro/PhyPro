'use strict'

const bunyan = require('bunyan')
const Promise = require('bluebird')
const TntTree = require('tnt.tree')
const fs = require('fs')

const mist3 = require('./Mist3Helper.js')
const SampleTaxonomy = require('./SampleTaxonomy.js')


const log = bunyan.createLogger({
	name: 'pickGenomes'
})

exports.pick = (taxonomyID, N = 0) => {
	return new Promise((res, rej) => {
		makeTaxTree_(taxonomyID).then((tree) => {
			let selected = sampleGenomes_(tree, N)
			res(selected)
		})
	})
}

exports.updatePhyProConfig = (configFileName, taxids) => {
	log.info('Updating config file: ' + configFileName)
	let configJSON = JSON.parse(fs.readFileSync(configFileName).toString())
	if (configJSON.header.backgroundGenomes.length === 0) {
		configJSON.header.backgroundGenomes = taxids
	}
	else {
		log.warn('Found existing taxids, will add the new ones.')
		taxids.forEach((taxid) => {
			configJSON.header.backgroundGenomes.push(taxid)
		})
	}
	fs.writeFileSync(configFileName, JSON.stringify(configJSON, null, ' '))
}

function sampleGenomes_(treeObj, N) {
	let results = [],
		selectTaxIDs = []
	let numberOfGenomes = treeObj.root().get_all_leaves().length
	log.info('Number of taxonomy IDs of genomes fetched: ' + numberOfGenomes)
	if (N < numberOfGenomes && N !== 0) {
		let sampleTax = new SampleTaxonomy(treeObj.data())
		results = sampleTax.pick(N)
	}
	else {
		if (N > numberOfGenomes)
			log.warn('Number of genomes requested is larger than the ones retrieved decendent from this taxonomy ID. Will return all of them.')
		results = treeObj.root().get_all_leaves()
	}
	results.forEach((item) => {
		let taxData = {
			taxid: item.property('id'),
			name: item.property('name')
		}
		selectTaxIDs.push(taxData)
	})
	return selectTaxIDs
}


function makeTaxTree_(taxonomyID) {
	return new Promise((res, rej) => {
		mist3.getChildren(taxonomyID).then((items) => {
			try {
				let taxTree = new TntTree()
				let totalTaxIDs = items.length
				taxTree.data(items[0])
				for (let i = 1; i < items.length; i++) {
					if (i % 100 === 0) {
						log.info('Processing taxonomy items: ' + i + '/' + totalTaxIDs)
					}
					let parentID = items[i].parent_taxonomy_id
					let parent = taxTree.root().find_node((node) => {
						return node.property('id') === parentID
					})
					if (parent.is_leaf())
						parent.property('children', [items[i]])
					else
						parent.property('children').push(items[i])
				}
				res(taxTree)
			}
			catch (err) {
				rej(err)
			}
		})
	})
}
