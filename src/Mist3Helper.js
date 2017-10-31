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
		let req = http.request(httpOptions, function(res) {
			let chunks = []
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

exports.getChildren = (taxid) => {
	return new Promise((resolve, reject) => {
		log.info('Fetching taxonomy information from Mist3 for taxid: ' + taxid)
		httpOptions.path = '/v1/taxonomy/' + taxid + '/children'
		let req = http.request(httpOptions, function(res) {
			let chunks = []
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
