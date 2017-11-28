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
	method: 'GET',
	hostname: 'api.mistdb.com',
	port: 5000,
	headers: {},
	agent: false
}

exports.getImmediateChildren = (taxid) => {
	return new Promise((resolve, reject) => {
		log.info('Fetching taxonomy information from Mist3 for taxid: ' + taxid)
		httpOptions.path = '/v1/taxonomy/' + taxid + '/children?immediate=true'
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
	return new Promise((resolve, reject) => {
		log.info('Fetching taxonomy information from Mist3 for taxid: ' + taxid)
		httpOptions.path = '/v1/taxonomy/' + taxid + '/children'
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
		return new Promise((resolve, rejectg) => {
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
	const genes = []
	const genesPerPage = 100
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

exports.getSequenceFromAseqs = (aseqs = []) => {
	httpOptions.method = 'POST'
	httpOptions.path = '/v1/aseqs'
	const content = 'eALFsiVPvD8jtNe_9Qifig\nY-Vq_1fWWNkEnvpwVCRotw'
	log.info('Fetching sequence information from MiST3')
	const req = http.request(httpOptions, (res) => {
		console.log(res.statusCode)
		console.log(res.statusMessage)
		res.on('data', console.log)
		res.on('error', console.log)
	})
	req.write(content)
	req.end()
}
