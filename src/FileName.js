'use strict'

module.exports =
class FileName {
	constructor(projectName, type) {
		this.projectName = projectName
	}

	genomeInfoZip(taxid) {
		return 'phypro.' + this.projectName + '.genes.' + taxid + '.json.gz'
	}

	genomeInfo(taxid) {
		return 'phypro.' + this.projectName + '.genes.' + taxid + '.json'
	}

	genomeFasta(taxid) {
		return 'phypro.' + this.projectName + '.aa.' + taxid + '.fa'
	}
}
