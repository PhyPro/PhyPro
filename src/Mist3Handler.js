'use strict'

const http = require('http')
const lodash = require('lodash')
const Promise = require('bluebird')

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
			let jsonTree = {
				name: this.taxonomyID
			}
			this.makeJsonSubTree_(this.taxonomyID).then((subtree) => {
				if (subtree.length !== 0)
					jsonTree.children = subtree
				this.jsonTree = jsonTree
				res(jsonTree)
			})
		})
	}

	makeJsonSubTree_(taxid) {
		return new Promise((res, rej) => {
			this.getImmediateChildren_(taxid).then((items) => {
				try {
					let jsonTree = []
					let subTrees = []
					items.forEach((item) => {
						let jsonTreeItem = {
							name: item.id
						}
						jsonTree.push(jsonTreeItem)
						subTrees.push(this.makeJsonSubTree_(item.id))
					})
					Promise.all(subTrees).then((subTreeResults) => {
						subTreeResults.forEach((subTree, i) => {
							if (subTree.length > 0)
								jsonTree[i].children = subTree
						})
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
			let req = http.request(httpOptions, function(res) {
				let chunks = []
				res.on('data', function(chunk) {
					chunks.push(chunk)
				})
				res.on('end', function() {
					let items = JSON.parse(Buffer.concat(chunks))
					let species = []
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
