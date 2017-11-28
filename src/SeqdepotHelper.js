'use strict'

const http = require('http')
const Promise = require('bluebird')
const bunyan = require('bunyan')

const log = bunyan.createLogger(
	{
		name: 'SeqdepotHelper'
	}
)

let httpOptions = {
	method: 'GET',
	hostname: 'seqdepot.net'
}

exports.processRequest_ = (data, options = {throwError: true}) => {
	const entries = data.split('\n')
	const numberOfExpectedFields = 5
	// console.log(entries)
	const items = []
	let buffer = ''
	// console.log('\nEntries --> ' + JSON.stringify(entries))
	entries.forEach((item) => {
		// console.log(item)
		let info = item.split('\t')
		if (info.length !== numberOfExpectedFields) {
			buffer = item
		}
		else if (info[1] === '404') {
			log.warn('Aseq not found: ' + ((info[0] !== '') ? info[0] : info[4]))
			items.push({id: info[0]})
		}
		else if (info[1] !== '200') {
			log.error('SeqDepot problem with: ' + ((info[0] !== '') ? info[0] : info[4]))
			throw new Error('SeqDepot problem with:' + ((info[0] !== '') ? info[0] : info[4]))
			process.abort()
		}
		else {
			items.push(JSON.parse(info[3]))
		}
	// console.log('Return --> ' + JSON.stringify({buffer, items}))
	})
	return {buffer, items}
}

exports.getInfoFromAseqs = (aseqs = [], options = {throwError: true}) => {
	httpOptions.method = 'POST'
	httpOptions.path = '/api/v1/aseqs?type=aseq_id'
	const maxNumberOfAseq = 1000
	if (aseqs.length > maxNumberOfAseq)
		throw Error('Only 1000 aseqs can be called at once')
	const content = '\n' + aseqs.join('\n')
	httpOptions.headers = {
		'Content-Type': 'application/vnd.seqdepot.aseq_id+tsv'
	}
	log.info('Fetching sequence information from Seqdepot')
	const items = []
	let buffer = ''
	return new Promise((resolve, reject) => {
		const req = http.request(httpOptions, (res) => {
			if (res.statusCode !== 200)
				reject(res)
			res.on('data', (data) => {
				try {
					const info = exports.processRequest_(buffer + data.toString(), options)
					buffer = info.buffer
					info.items.forEach((item) => {
						items.push(item)
					})
				}
				catch (err) {
					reject(err)
				}
			})
			res.on('error', (err) => {
				reject(err)
			})
			res.on('end', () => {
				log.info('All set')
				resolve(items)
				// console.log(items)
			})
		})
		req.write(content)
		req.end()
	})
}

