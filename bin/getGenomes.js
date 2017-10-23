#!/usr/bin/env node
'use strict'

const path = require('path')
const ArgumentParser = require('argparse').ArgumentParser

const Mist3Tax = require('../src/Mist3Handler.js').Taxonomy

let parser = new ArgumentParser({
	addHelp: true,
	description: 'Get genomes - Tool to select genomes from MiST3 database.\n This application requires connection to the MiST3 database via internet or locally.'
})

parser.addArgument(
	['taxid'],
	{
		help: 'taxonomy id (NCBI) of the last common ancestor of the group wanted',
		nargs: 1
	}
)

parser.addArgument(
	['--random'],
	{
		help: 'Sample N genomes from the taxonomy tree. It picks representatives trying to maximize coverage of lineages',
		nargs: 1,
		metavar: ['N']
	}
)

parser.addArgument(
	['--updateConfig'],
	{
		help: 'Automatically update the data to the correct place in the config file of the project. Must pass the project name and be in the project\'s root directory',
		nargs: 1,
		metavar: [
			'ProjectName'
		]
	}
)

parser.addArgument(
	['--output'],
	{
		help: 'Determine the name of the file to output a list of taxonomy IDs.',
		nargs: 1,
		metavar: ['filename.txt']
	}
)


let args = parser.parseArgs()

console.log(args.random[0])

let mist3tax = new Mist3Tax(args.taxid[0], args.random[0])

console.log(mist3tax.taxonomyID)
