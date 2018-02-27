'use strict'

const http = require('http')
const Promise = require('bluebird')
const bunyan = require('bunyan')

const log = bunyan.createLogger(
	{
		name: 'Mist3Helper'
	}
)

let httpOptions = {
	hostname: 'api.mistdb.com',
	port: 5000,
	agent: false
}

const kDefaults = {
	maxTaxonomy: 30
}


exports.getImmediateChildren = (taxid) => {
	httpOptions.method = 'GET'
	httpOptions.header = {}
	httpOptions.path = '/v1/taxonomy/' + taxid + '/children?immediate=true'
	return new Promise((resolve, reject) => {
		log.info('Fetching taxonomy information from Mist3 for taxid: ' + taxid)
		const req = http.request(httpOptions, function(res) {
			const chunks = []
			res.on('data', function(chunk) {
				chunks.push(chunk)
			})
			res.on('end', function() {
				log.info('received information from taxid ' + taxid)
				let items = JSON.parse(Buffer.concat(chunks))
				let taxids = []
				if (items) {
					items.forEach((item) => {
						taxids.push(item)
					})
				}
				resolve(taxids)
			})
		})
		req.end()
	})
}

exports.getChildren = (taxid) => {
	httpOptions.method = 'GET'
	httpOptions.header = {}
	httpOptions.path = '/v1/taxonomy/' + taxid + '/children'
	return new Promise((resolve, reject) => {
		log.info('Fetching taxonomy information from Mist3 for taxid: ' + taxid)
		const req = http.request(httpOptions, function(res) {
			const chunks = []
			res.on('data', function(chunk) {
				chunks.push(chunk)
			})
			res.on('end', function() {
				log.info('received information from taxid ' + taxid)
				log.info(httpOptions.path)
				let items = JSON.parse(Buffer.concat(chunks))
				let taxids = []
				if (items) {
					items.forEach((item) => {
						taxids.push(item)
					})
				}
				resolve(taxids)
			})
		})
		req.end()
	})
}

const getGenomesByTaxidsBatch = (taxids = []) => {
	const taxidList = taxids.join(',')
	httpOptions.method = 'GET'
	httpOptions.header = {}
	httpOptions.path = '/v1/genomes?where.taxonomy_id=' + taxidList
	return new Promise((resolve, reject) => {
		let count = 0
		const req = http.request(httpOptions, function(res) {
			const chunks = []
			res.on('data', function(chunk) {
				chunks.push(chunk)
			})
			res.on('end', function() {
				log.info('Information received')
				const genomes = JSON.parse(Buffer.concat(chunks))
				resolve(genomes)
			})
		})
		req.end()
	})
}

exports.getGenomesByTaxids = (taxids = []) => {
	log.info('Fetching genome information from MiST3')
	return new Promise((resolve, reject) => {
		const taxidsBatches = []

		const unique = taxids.filter((v, i, a) => {
			return a.indexOf(v) === i
		})

		log.info(`There are ${unique.length} unique taxids`)

		while (unique.length !== 0) {
			const batch = unique.splice(0, kDefaults.maxTaxonomy)
			taxidsBatches.push(getGenomesByTaxidsBatch(batch))
		}
		let allGenomeInfo = []
		Promise.all(taxidsBatches)
			.then((genomeInfoBatches) => {
				genomeInfoBatches.forEach((genomeInfoBatch) => {
					allGenomeInfo = allGenomeInfo.concat(genomeInfoBatch)
				})
				resolve(allGenomeInfo)
			})
			.catch(reject)
	})
}
