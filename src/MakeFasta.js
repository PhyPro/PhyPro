'use strict'

const bunyan = require('bunyan')
const Transform = require('stream').Transform
const seqdepot = require('./SeqdepotHelper.js')


const seqdepotDefaults = {
	maxAseqsPerQuery: 1000
}

const fastaTagDefaults = {
	orgIdSeparator: '_',
	featureSeparator: '|'
}


module.exports =
class MakeFasta extends Transform {
	constructor(info) {
		super({objectMode: true})
		this.info_ = info
		this.sequence_ = ''
		this.entries_ = []
		this.aseqs_ = []
	}

	_transform(chunk, enc, next) {
		this.entries_.push({
			tag: this.generateTag_(chunk),
			aseq: chunk.aseq_id
		})
		this.aseqs_.push(chunk.aseq_id)

		if (this.entries_.length === seqdepotDefaults.maxAseqsPerQuery) {
			seqdepot.getInfoFromAseqs(aseqs).then((items) => {
				items.forEach((item, i) => {
					if (item.id !== this.entries_[i].aseq)
						throw new Error('Ooopsy, something is wrong. SeqDepot does not honor order')
					const entry = this.makeFastaEntry_(this.entries_[i].tag, item.s)
				})
			})
		}
		next()
	}

	makeFastaEntry_(header, sequence) {
		return '>' + header + '\n' + sequence
	}

	generateTag_(geneInfo) {
		const genus = this.info_.genus
		const species = this.info_species.split(' ')[1]
		const id = this.info_.taxonomy_id

		const orgID = genus.substring(0, 2) +
			fastaTagDefaults.orgIdSeparator + 
			species.substring(0, 3) + 
			fastaTagDefaults.orgIdSeparator +
			id
		
		return orgID + fastaTagDefaults.featureSeparator + geneInfo.stable_id
	}	

}