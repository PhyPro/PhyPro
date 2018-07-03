'use strict'

const Pfql = require('pfql')
const seqdepot2pfql = require('seqdepot-to-pfql')

class BuildProteinFamilyFiles {
	constructor(pfqlRules) {
		this.pfqlRules = pfqlRules
	}
}