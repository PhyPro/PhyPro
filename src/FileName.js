'use strict'

module.exports =
class FileName {
	constructor(ProjectName, type) {
		this.ProjectName = ProjectName
	}

	genomeInfoZip(taxid) {
		return 'phypro.' + this.ProjectName + '.genes.' + taxid + '.json.gz'
	}

	genomeInfo(taxid) {
		return 'phypro.' + this.ProjectName + '.genes.' + taxid + '.json'
	}

	genomeFasta(taxid) {
		return 'phypro.' + this.ProjectName + '.aa.' + taxid + '.fa'
	}
}
