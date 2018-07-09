'use strict'

const path = require('path')
const fs = require('fs')

const BlastUtils = require('./BlastUtils')

const getProteinFamilyFastaNames = (info) => {
	info.pfqlDefinitions.forEach((definition) => {
		const filename = 'phypro.' + info.projectName + '.genes.' + definition.prot_fam + '.fa'
		const fullPath = path.resolve(info.outputPath, filename)
		streams.push(fs.createWriteStream(fullPath))
	})
	return streams
}

module.exports = (info, options) => {
	const blastUtils = new BlastUtils()

}
