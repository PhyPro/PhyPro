'use strict'

const stream = require('stream')
const fs = require('fs')
const bunyan = require('bunyan')

const log = bunyan.createLogger({name: 'saveFasta'})

module.exports = (fastaEntries, fastaFile) => {
	return new Promise((resolve, reject) => {
		const fastaEntriesStream = stream.Readable()
		const writeFastaStream = fs.createWriteStream(fastaFile)

		fastaEntries.forEach((entry) => fastaEntriesStream.push(entry))
		fastaEntriesStream.push(null)
		fastaEntriesStream.pipe(writeFastaStream)
			.on('finish', () => {
				log.info(`saved fasta in: ${fastaFile}`)
				resolve()
			})
			.on('error', (err) => {
				reject(err)
			})
	})
}
