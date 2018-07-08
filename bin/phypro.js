#!/usr/bin/env node
'use strict'

let path = require('path'),
	ArgumentParser = require('argparse').ArgumentParser

let PhyPro = require('../src/PhyPro.js')

const availablePipelines = require('../src/availablePipelines.js')

const pipelines = Object.keys(availablePipelines)

let parser = new ArgumentParser({
	addHelp: true,
	description: 'PhyPro - Advanced Phylogenetic Profile for Biologists'
})

parser.addArgument(
	['projectName'],
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
	['--check-config'],
	{
		help: 'Validate and update existing config file.',
		nargs: 0
	}
)

parser.addArgument(
	['--fetch-data'],
	{
		help: 'Fetch data relevant to both pipelines.',
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
	projectName = args.projectName[0]

let phypro = new PhyPro(projectName)

if (args.init) {
	phypro.init()
}
else if (args.check_config) {
	phypro.loadConfigFile()
	phypro.validateConfig()
	phypro.updateConfig().then(() => {
		phypro.logInfo('Config was updated with information and it seems good to go.')
	})
		.catch((err) => {
			console.log(err)
		})
}
else if (args.fetch_data) {
	phypro.loadConfigFile()
	phypro.fetchData()
		.then(() => {
			phypro.logInfo('Data is in place, proceed with the pipeline of choice.')
		})
		.catch((err) => {
			console.log(err)
			throw err
		})
}
else {
	phypro.keepGoing(args.keep_going)
}
