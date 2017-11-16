'use strict'

const bunyan = require('bunyan')
const stream = require('stream')

const mist3 = require('./Mist3Helper.js')


module.exports =
class FetchGenomes extends stream.Readable {
	constructor(genome, options = {objectMode: true}) {
		super(options)
		this.genome = genome
		this.log = bunyan.createLogger({name: 'FetchGenomes'})
		this.page = 1
	}

	_read(size) {
		const getGenes = (v, p) => {
			return new Promise((resolve, reject) => {
				this.log.info('Initiating stream')
				mist3.getGenesByGenomePerPage(v, p)
					.then((newGenes) => {
						if (newGenes.length !== 0)
							this.push(newGenes)
						else
							this.push(null)
					})
			})
		}
		getGenes(this.genome, this.page)
		this.page++
	}
}
