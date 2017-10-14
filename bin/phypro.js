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
	['--init'],
	{
		help: 'Initialize the directory structure and creates the config file',
		nargs: 1
	}
)

let args = parser.parseArgs(),
	ProjectName = args.init[0]

let phypro = new PhyPro(ProjectName)
phypro.init().catch((err) => {
	throw new Error(err)
})
