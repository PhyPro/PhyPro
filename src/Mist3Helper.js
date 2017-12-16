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

exports.getGenesByGenome = (version) => {
	const allGenes = []
	let page = 1
	const getGenes = (v, p) => {
		return new Promise((resolve, reject) => {
			exports.getGenesByGenomePerPage(v, p)
				.then((newGenes) => {
					if (newGenes.length !== 0) {
						newGenes.forEach((gene) => {
							allGenes.push(gene)
						})
						p++
						resolve(getGenes(v, p))
					}
					else {
						resolve(allGenes)
					}
				})
		})
	}
	return getGenes(version, page)
}


exports.getGenomeInfoByVersion = (version) => {
	httpOptions.path = '/v1/genomes/' + version
	httpOptions.method = 'GET'
	httpOptions.header = {}
	return new Promise((resolve, reject) => {
		log.info('Fetching info from genome: ' + version )
		const req = http.request(httpOptions, function(res) {
			const chunks = []
			res.on('data', function(chunk) {
				chunks.push(chunk)
			})
			res.on('end', function() {
				log.info('Information from genome ' + version + ' was received.')
				const info = JSON.parse(Buffer.concat(chunks))
				resolve(info)
			})
		})
		req.end()
	})
}

exports.getGenesByGenomePerPage = (version, page = 1) => {
	const genesPerPage = 100
	httpOptions.method = 'GET'
	httpOptions.header = {}
	httpOptions.path = '/v1/genomes/' + version + '/genes?per_page=' + genesPerPage + '&page=' + page
	return new Promise((resolve, reject) => {
		log.info('Fetching genes from MiST3 : ' + version + ' page ' + page)
		const req = http.request(httpOptions, function(res) {
			const chunks = []
			res.on('data', function(chunk) {
				chunks.push(chunk)
			})
			res.on('end', function() {
				log.info('Information from genome ' + version + ' was received.')
				const newGenes = JSON.parse(Buffer.concat(chunks))
				resolve(newGenes)
			})
		})
		req.end()
	})
}

exports.getGenomesByTaxids = (taxids = []) => {
	const taxidList = taxids.join(',')
	httpOptions.method = 'GET'
	httpOptions.header = {}
	httpOptions.path = '/v1/genomes?where.taxonomy_id=' + taxidList
	return new Promise((resolve, reject) => {
		log.info('Fetching genome information from MiST3')
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

exports.getInfoFromAseqs = (aseqs = [], options = {throwError: true}) => {
	httpOptions.method = 'POST'
	httpOptions.path = '/v1/aseqs'
	httpOptions.headers = {
		'Content-Type': 'application/json'
	}
	const content = JSON.stringify(aseqs)
	log.info(`Fetching information for ${aseqs.length} sequences from MiST3`)
	let buffer = []
	return new Promise((resolve, reject) => {
		const req = http.request(httpOptions, (res) => {
			if (res.statusCode === 400)
				reject(res)
			if (res.statusCode !== 200)
				reject(res)
			res.on('data', (data) => {
				buffer.push(data)
			})
			res.on('error', reject)
			res.on('end', () => {
				log.info('All set')
				const items = JSON.parse(Buffer.concat(buffer))
				resolve(items)
			})
		})
		req.write(content)
		req.end()
	})
}
