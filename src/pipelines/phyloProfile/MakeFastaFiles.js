'use strict'

const bunyan = require('bunyan')
const Writable = require('stream').Writable
const Transform = require('stream').Transform
const zlib = require('zlib')
const path = require('path')
const fs = require('fs')
const JSONStream = require('JSONStream')
const CombinedStream = require('combined-stream2')

const mist3 = require('node-mist3')
const mist2pfql = require('mist3-to-pfql')
const Pfql = require('pfql')

class SavePFQLResults extends Writable {
	constructor(saveStreams, options = {allowOverlap: false}) {
		super({objectMode: true})
		this.saveStreams = saveStreams
		this.options = options
		this.genomeInfo = {}
		this.log = bunyan.createLogger({name: 'savePFQLResults'})
	}

	addGenomeInfo_(genomeVersion) {
		const genomes = new mist3.Genomes()
		return genomes.getGenomeInfoByVersion(genomeVersion).then((genomeInfo) => {
			this.genomeInfo[genomeVersion] = genomeInfo
			return genomeInfo
		})
	}

	getGenomeVersion_(gene) {
		return gene.stable_id.split('-')[0]
	}

	_write(gene, enc, next) {
		const genomeVersion = this.getGenomeVersion_(gene)
		if (gene.ai.PFQLMatches.length === 1) {
			const streamIndex = gene.ai.PFQLMatches[0]
			if (!this.genomeInfo[genomeVersion]) {
				this.addGenomeInfo_(genomeVersion).then((genomeInfo) => {
					const mkFasta = new mist3.MakeFasta(genomeInfo)
					const fastaEntry = mkFasta.processOne(gene)
					this.saveStreams[streamIndex].write(fastaEntry)
				})
			}
			else {
				const mkFasta = new mist3.MakeFasta(this.genomeInfo[genomeVersion])
				const fastaEntry = mkFasta.processOne(gene)
				this.saveStreams[streamIndex].write(fastaEntry)
			}
		}
		else if (!this.options.allowOverlap) {
			this.log.error(`Found protein matching two protein family definitions. ${gene.stable_id} is present in ${JSON.stringify(gene.ai.PFQLMatches)}`)
			this.emit('error', new Error(`Found protein matching two protein family definitions. ${gene.stable_id} is present in ${JSON.stringify(gene.ai.PFQLMatches)}`))
		}
		else {
			this.log.warn(`Found protein matching two protein family definitions. ${gene.stable_id} is present in ${JSON.stringify(gene.ai.PFQLMatches)}`)
		}
		next()
	}
}

class FindProteins extends Transform {
	constructor(pfqlRules) {
		super({objectMode: true})
		this.pfqlService = new Pfql.PFQLService(pfqlRules)
	}

	initRules() {
		this.pfqlService.initRules()
	}

	_transform(chunk, enc, next) {
		const gene = chunk
		if (gene.ai) {
			gene.ai = mist2pfql.parse(gene.ai)
			gene.ai = this.pfqlService.findMatches(gene.ai)
			if (gene.ai.PFQLMatches.length !== 0)
				this.push(gene)
		}
		next()
	}

	_flush(done) {
		this.push(null)
		done()
	}
}

const createWritableStreamsForEachProteinFamily = (info) => {
	const streams = []
	info.pfqlDefinitions.forEach((definition) => {
		const filename = 'phypro.' + info.projectName + '.genes.' + definition.prot_fam + '.fa'
		const fullPath = path.resolve(info.outputPath, filename)
		streams.push(fs.createWriteStream(fullPath))
	})
	return streams
}

module.exports = (info, options = {allowOverlap: false}) => {
	const log = bunyan.createLogger({
		name: 'makeFastaFiles'
	})
	log.info('Starting makeFastaFiles pipeline!')
	log.debug(info)
	const savingStreams = createWritableStreamsForEachProteinFamily(info)
	const allFilesStream = CombinedStream.create()
	info.listOfTaxIds.forEach((taxid) => {
		const filename = 'phypro.' + info.projectName + '.genes.' + taxid + '.json.gz'
		const filenameFullPath = path.resolve(info.genomicInfoPath, filename)
		const readFileStream = fs.createReadStream(filenameFullPath)
		log.info(`adding ${filename} to the stream`)
		allFilesStream.append(readFileStream)
	})

	const gunzip = zlib.createUnzip()
	const findProteins = new FindProteins(info.pfqlDefinitions)
	const saveResults = new SavePFQLResults(savingStreams, options)

	findProteins.initRules()
	return new Promise((resolve, reject) => {
		allFilesStream
			.pipe(gunzip)
			.pipe(JSONStream.parse('*'))
			.pipe(findProteins)
			.pipe(saveResults)
			.on('finish', () => {
				log.info('All protein families are saved in fasta files')
				savingStreams.forEach((streamFile) => {
					streamFile.end()
				})
				resolve()
			})
			.on('error', (err) => {
				reject(err)
			})
	})
}
