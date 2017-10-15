#!/usr/bin/env node
'use strict'

let path = require('path'),
	ArgumentParser = require('argparse').ArgumentParser

let PhyPro = require('../src/PhyPro.js')

let parser = new ArgumentParser({
	addHelp: true,
	description: 'PhyPro - Advanced Phylogenetic Profile for Biologists'
})

parser.addArgument(
	['ProjectName'],
	{
		help: 'Name of the Project',
		nargs: 1
	}
)

parser.addArgument(
	['--init'],
	{
		help: 'Initialize the directory structure and creates the config file',
		nargs: 0
	}
)

parser.addArgument(
	['--keepgoing'],
	{
		help: 'Search for the config file of the project name passed. If found, it will execute the next step of the chosen pipeline',
		nargs: 1,
		metavar: [
			'pipeline'
		],
		choices: [
			'phylo-profile',
			'ref-tree'
		]
	}
)


let args = parser.parseArgs(),
	ProjectName = args.ProjectName

if (args.init) {
	let phypro = new PhyPro(ProjectName)
	phypro.init()
}
