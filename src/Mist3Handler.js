'use strict'

let http = require('http')

let httpOptions = {
	method: 'GET',
	hostname: 'api.mistdb.com',
	port: 5000,
	headers: {}
}

module.exports =

class Taxonomy {
	constructor(taxonomyID, options) {
		this.taxonomyID = taxonomyID
		this.options = options
	}

	getIDs() {
		let ids = this.httpRequest_()
		return ids
	}

	updateConfigFile(filename) {
		return null
	}

	httpRequest_() {
		httpOptions.path = '/v1/taxonomy/' + this.taxonomyID + '/children'
		let req = http.request(httpOptions, function(res) {
			let chunks = []
			res.on('data', function(chunk) {
				chunks.push(chunk)
			})
			res.on('end', function() {
				let items = JSON.parse(Buffer.concat(chunks))
				let species = []
				items.forEach((item) => {
					// if (item.rank === 'species')
					species.push(item.id)
				})
				console.log(species.length)
				return species
			})
		})
		req.end()
	}
}

