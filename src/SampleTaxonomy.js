'use strict'

const TntTree = require('tnt.tree')
const tree = new TntTree()

module.exports =
class PickSampleGenomes {
	constructor(genomes = []) {
		this.tree = tree.data(genomes)
	}

	pick(N) {
		let root = this.tree.root()
		return this.pickNodes_(root, N)
	}

	calcProb_(treeObj, iniProb) {
		if (treeObj.children) {
			let N = treeObj.children.length
			let unBiasProb = iniProb / N
			treeObj.children
				.forEach((child) => {
					child.sampProb = unBiasProb
					this.calcProb_(child, unBiasProb)
				})
		}
		return treeObj
	}

	pickNodes_(node, N) {
		this.calcProb_(node.data(), 1)
		let allLeaves = node.get_all_leaves()
		return this.getRandomWeighted(allLeaves, N)
	}

	getRandomWeighted(nodes, N) {
		let results = []
		for (let i = 0; i < N; i++) {
			let random = Math.random()
			let cumsum = 0
			let chosen = -1
			this.shuffle_(nodes)
			for (let j = 0; j < nodes.length; j++) {
				let node = nodes[j].data()
				chosen = j
				if (random < node.sampProb + cumsum)
					break
				else
					cumsum += node.sampProb
			}
			let chosenItem = nodes.splice(chosen, 1)[0]
			results.push(chosenItem)
			let adjust = 1 - chosenItem.sampProb
			nodes.forEach((node) => {
				node.sampProb /= adjust
			})
		}
		return results
	}

	/**
	 * Mike Bostock example.
	 * 
	 * @param {any} array 
	 * @returns 
	 */
	shuffle_(array) {
		let m = array.length,
			i = 0,
			t = 0
		while (m) {
			// Pick a remaining element…
			i = Math.floor(Math.random() * m--)
			t = array[m]
			array[m] = array[i]
			array[i] = t
		}
		return array
	}
}
