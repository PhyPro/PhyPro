'use strict'

let http = require('http')

let httpOptions = {
	method: 'GET',
	hostname: 'api.mistdb.com',
	port: 5000,
	headers: {}
}

class Taxonomy {
	constructor(taxonomyID, options) {
		this.taxonomyID = taxonomyID
		this.options = options
	}

	getIDs() {
		return new Promise((res, rej) => {
			this.httpRequest_().then((items) => {
				res(items)
			})
		})
	}

	makeNewick_(taxInfo) {
		return null
	}

	updateConfigFile(filename) {
		return null
	}

	httpRequest_() {
		return new Promise((resolve, reject) => {
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
						species.push(item)
					})
					resolve(species)
				})
			})
			req.end()
		})
	}
}


exports.Taxonomy = Taxonomy
