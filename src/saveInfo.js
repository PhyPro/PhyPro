'use strict'

const stream = require('stream')
const fs = require('fs')
const zlib = require('zlib')
const bunyan = require('bunyan')

const log = bunyan.createLogger({name: 'saveInfo'})

module.exports = (geneInfo, geneInfoFile) => {
	return new Promise((resolve, reject) => {
		const gzip = zlib.createGzip()
		const geneInfoStream = stream.Readable()
		const writeInfoStream = fs.createWriteStream(geneInfoFile)

		geneInfoStream.push(JSON.stringify(geneInfo, null, ' '))
		geneInfoStream.push(null)
		geneInfoStream.pipe(gzip).pipe(writeInfoStream)
			.on('finish', () => {
				log.info(`saved gene Info in: ${geneInfoFile}`)
				resolve()
			})
			.on('error', (err) => {
				reject(err)
			})
	})
}
