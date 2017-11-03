#!/usr/bin/env node
'use strict'

let path = require('path'),
	ArgumentParser = require('argparse').ArgumentParser

let PhyPro = require('../src/PhyPro.js')

const availablePipelines = require('../src/availablePipelines.json')

let pipelines = Object.keys(availablePipelines)

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
	['--keep-going'],
	{
		help: 'Search for the config file of the project name passed. If found, it will execute the next step of the chosen pipeline',
		nargs: '+',
		metavar: [
			'pipeline'
		],
		choices: pipelines
	}
)

let args = parser.parseArgs(),
	ProjectName = args.ProjectName[0]

let phypro = new PhyPro(ProjectName)

if (args.init)
	phypro.init()
else
	phypro.keepGoing(args.keep_going)
