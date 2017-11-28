'use strict'

const bunyan = require('bunyan')
const through2 = require('through2')
const sd = require('./SeqdepotHelper.js')
const Transform = require('stream').Transform

const seqdepotDefaults = {
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
		if (this.entries.length >= seqdepotDefaults.maxAseqsPerQuery) {
			this.log.info('Asking SeqDepot for info')
			const aseqsToGo = this.aseqs.splice(0, seqdepotDefaults.maxAseqsPerQuery)
			const entriesToGo = this.entries.splice(0, seqdepotDefaults.maxAseqsPerQuery)
			sd.getInfoFromAseqs(aseqsToGo).then(function(items) {
				items.forEach((item, i) => {
					if (item.id !== entriesToGo[i].aseq_id)
						throw new Error('Ooopsy, something is wrong. SeqDepot does not honor order')
					entriesToGo[i].sd = item
				})
				self.push(entriesToGo)
				next()
			}).catch((err) => {
				console.log(err)
				process.abort()
			})
		}
		else {
			next()
		}
	}

	_flush(done) {
		this.log.info('Asking SeqDepot for info one last time')
		sd.getInfoFromAseqs(this.aseqs).then((items) => {
			items.forEach((item, i) => {
				if (item.id !== this.entries[i].aseq_id)
					throw new Error('Ooopsy, something is wrong. SeqDepot does not honor order')
				this.entries[i].sd = item
			})
			this.push(this.entries)
			done()
		})
	}
}
