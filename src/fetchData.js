'use strict'

const bunyan = require('bunyan')
const log = bunyan.createLogger({name: 'FetchData'})

const mist3 = require('node-mist3')

module.exports = (genome) => {
	const mistGenes = new mist3.Genes()
	const mkFasta = new mist3.MakeFasta(genome)

	return mistGenes.byGenome(genome.version)
		.then((newGenes) => {
			log.debug('Adding aseq info')
			return mistGenes.addAseqInfo(newGenes, {keepGoing: true})
		})
		.catch((err) => {
			throw err
		})
		.then((newGenes) => {
			log.debug('Processing gene info')
			const fastaEntries = mkFasta.process(newGenes, {skipNull: true})
			return {
				fastaEntries,
				genes: newGenes
			}
		})
		.catch((err) => {
			throw err
		})
}
