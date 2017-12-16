'use strict'

const bunyan = require('bunyan')
const through2 = require('through2')
const mist3 = require('./Mist3Helper.js')
const Transform = require('stream').Transform

const mist3Defaults = {
	maxAseqsPerQuery: 1000
}

module.exports =
class AddAseqInfoStream extends Transform {
	constructor() {
		super({objectMode: true})
		this.aseqs = []
		this.entries = []
		this.log = bunyan.createLogger({
			name: 'AddAseqInfoStream'
		})
	}

	_transform(chunk, enc, next) {
		chunk.forEach((item) => {
			if (item.aseq_id) {
				this.aseqs.push(item.aseq_id)
				this.entries.push(item)
			}
		})
		const self = this
		this.log.info('Aseqs collected: ' + this.aseqs.length)
		if (this.entries.length >= mist3Defaults.maxAseqsPerQuery) {
			this.log.info('Asking MiST3 for info')
			const aseqsToGo = this.aseqs.splice(0, mist3Defaults.maxAseqsPerQuery)
			const entriesToGo = this.entries.splice(0, mist3Defaults.maxAseqsPerQuery)
			const enhancedEntries = []
			mist3.getInfoFromAseqs(aseqsToGo)
				.then((aseqInfos) => {
					entriesToGo.forEach((entry) => {
						const aseqInfo = aseqInfos.filter((info) => {
							return info.id === entry.aseq_id
						})
						entry.ai = aseqInfo[0]
						enhancedEntries.push(entry)
					})
					self.push(enhancedEntries)
					next()
				})
				.catch((err) => {
					console.log(err)
					process.abort()
				})
		}
		else {
			next()
		}
	}

	_flush(done) {
		this.log.info('Asking MiST3 for info one last time')
		const enhancedEntries = []
		mist3.getInfoFromAseqs(this.aseqs)
			.then((aseqInfos) => {
				this.entries.forEach((entry) => {
					const aseqInfo = aseqInfos.filter((info) => {
						return info.id === entry.aseq_id
					})
					entry.ai = aseqInfo[0]
					enhancedEntries.push(entry)
				})
				this.push(enhancedEntries)
				done()
			})
			.catch((err) => {
				console.log(err)
			})
	}
}
