'use strict'

const http = require('http')
const lodash = require('lodash')
const Promise = require("bluebird")

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

	makeJsonTree() {
		return new Promise((res, rej) => {
			this.jsonTree = {
				name: this.taxonomyID
			}
			this.makeJsonSubTree_(this.taxonomyID).then((subtree) => {
				if (subtree.length !== 0)
					this.jsonTree.children.push(subtree)
				res()
			})
		})
	}

	makeJsonSubTree_(taxid) {
		return new Promise((res, rej) => {
			this.getImmediateChildren_(taxid).then((items) => {
				try {
					items.shift()
					console.log('taxId: ' + taxid)
					console.log(items)
					let jsonTree = []
					let subTrees = []
					items.forEach((item) => {
						let jsonTreeItem = {
							name: item.id
						}
						subTrees.push(this.makeJsonSubTree_(item.id))
					})
					Promise.all(subTrees).then((subTreeResults) => {
						let children = []
						subTreeResults.forEach((subTree) => {
							if (subTree.length > 0)
								children.push(subTree)
						})
						if (children.length > 0)
							jsonTree.children = children
						res(jsonTree)
					})
				}
				catch (err) {
					rej(err)
				}
			})
		})
	}

	getImmediateChildren_(taxid) {
		return new Promise((resolve, reject) => {
			httpOptions.path = '/v1/taxonomy/' + taxid + '/children?immediate=true'
			console.log(httpOptions.path)
			let req = http.request(httpOptions, function(res) {
				let chunks = []
				res.on('data', function(chunk) {
					chunks.push(chunk)
				})
				res.on('end', function() {
					let items = JSON.parse(Buffer.concat(chunks))
					let species = []
					console.log(taxid)
					console.log(items)
					if (items) {
						items.forEach((item) => {
							// if (item.rank === 'species')
							species.push(item)
						})
					}
					resolve(species)
				})
			})
			req.end()
		})
	}

	updateConfigFile(filename) {
		return null
	}


}


exports.Taxonomy = Taxonomy
