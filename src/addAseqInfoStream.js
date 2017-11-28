'use strict'

const bunyan = require('bunyan')
const through2 = require('through2')
const sd = require('./SeqdepotHelper.js')

const seqdepotDefaults = {
	maxAseqsPerQuery: 1000
}

exports.stream = () => {
	let aseqs = []
	let entries = []
	return through2.obj((chunk, enc, next) => {
		chunk.forEach((item) => {
			if (item.aseq_id) {
				aseqs.push(item.aseq_id)
				entries.push(item)
			}
		})
		if (entries.length === seqdepotDefaults.maxAseqsPerQuery) {
			sd.getInfoFromAseqs(aseqs).then((items) => {
				items.forEach((item, i) => {
					if (item.id !== entries[i].aseq_id)
						throw new Error('Ooopsy, something is wrong. SeqDepot does not honor order')
					entries[i].sd = item
				})
				this.push(entries)
				entries = []
				aseqs = []
				next()
			})
		}
		next()
	}, function(flush) {
		if (aseqs.length !== 0) {
			sd.getInfoFromAseqs(aseqs).then((items) => {
				items.forEach((item, i) => {
					if (item.id !== entries[i].aseq_id)
						throw new Error('Ooopsy, something is wrong. SeqDepot does not honor order')
					entries[i].sd = item
				})
				this.push(entries)
				flush()
			})
		}
	})
}
