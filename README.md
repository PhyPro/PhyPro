# PhyPro - Advanced Phylogenetic Profile for Biologists

[![Build Status](https://travis-ci.org/PhyPro/PhyPro.svg?branch=develop)](https://travis-ci.org/PhyPro/PhyPro)
[![Coverage Status](https://coveralls.io/repos/github/PhyPro/PhyPro/badge.svg?branch=develop)](https://coveralls.io/github/PhyPro/PhyPro?branch=develop)

This is the javascript implementation of PhyPro.

## Install

You will to have npm and node running in your machine. Please look at this information on how to install them. Believe-me, it is easy.

Once you have them working,

```
$ npm install PhyPro -g
```

## Getting started

Start by making a new directory

```
$ mkdir ProjectName
$ cd ProjectName
$ phypro --init ProjectName
```

This will generate the file `phypro.ProjectName.config.json` that you must configure. It will also make a directory structure like this:

```
ProjectName/
    phylo-profile/
    ref-tree/
    phypro.ProjectName.config.json
```

## Configuring the config file


## Keep going

After you configure the config file, you are pretty much set. The next step is to tell PhyPro what you want it to do.

You can do that by the use of the flag --keepgoing. This flag must have at least one argument, which is the name of the pipeline you wish PhyPro to run. Notice that as of the version of this manual, the standard release of PhyPro has two pipelines: `phylo-profile` and `ref-tree`. You can pass either or both.

Now it comes the catch, this version is not on docker containers yet, so you will need to have the following softwares up and running:

```
blastp
rpsblast
formatdb
mafft-linsi
hmmer3
RAxML
```

in future versions, the docker container will have all these packages installed.

If you have all these softwares, you can _keep going_ with:
```
$ phypro t4p --keepgoing phylo-profile ref-tree
```

If PhyPro is capable to finish both pipelines without a hickup, it will automatically pack your results and it is ready to be loaded by the analyser.

## How to make a pipeline

First you need to write a class with the following modules:

Then you need to update the availablePipelines.json with yout custom pipeline
