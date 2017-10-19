# PhyPro - Advanced Phylogenetic Profile for Biologists

[![Build Status](https://travis-ci.org/PhyPro/PhyPro.svg?branch=develop)](https://travis-ci.org/PhyPro/PhyPro)
[![Coverage Status](https://coveralls.io/repos/github/PhyPro/PhyPro/badge.svg?branch=develop)](https://coveralls.io/github/PhyPro/PhyPro?branch=develop)

This is the javascript implementation of PhyPro.

## Install

We need to have npm and node running in our machine. Please look at this information on how to install them. Believe-me, it is easy.

Once we have them working,

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

This will generate the file `phypro.ProjectName.config.json` that we must configure. It will also make a directory structure like this:

```
ProjectName/
    phylo-profile/
    ref-tree/
    phypro.ProjectName.config.json
```

## Configuring the config file

The first thing we need to tell PhyPro is to determine the genomes in the scope of our phylogenetic profile. PhyPro is heavily integrated with MiST3 and uses taxonomy identifiers to identify the genomes.

However, it can be cumbersome to manually include each identifier number in the config file. For that reason, PhyPro has a helper command line application that allows the user to make somewhat complex queries to MiST3 database natively.

The application is called `phypro-getGenomes`

For example, let's suppose we want 100 genomes sampled from proteobacteria. `phypro-getGenomes` will try to balance the examples among the ranks below proteobacteria.

However, the input node is the taxonomy identifier of that level and can be found at the [NCBI Taxonomy](https://www.ncbi.nlm.nih.gov/taxonomy). For example, Proteobacteria's taxonomy id is `1224`.

```
$ phypro-getGenomes -t 1224 -N 100 > protbac.100.taxID.dat
```

This command will save to `protbac.100.taxID.dat` 100 randomly selected taxonomy ids from species under the taxonomic node of Protebacteria. `phypro-getGenomes` will try to spread the picks accross the taxonomic tree.

Conveniently, there is also the flag `--update` which will take the project name as an argument and will be pushed add the ids to the list already existent in the config file.

## Keep going

After we configure the config file, we are pretty much set. The next step is to tell PhyPro what we want it to do.

we can do that by the use of the flag --keepgoing. This flag must have at least one argument, which is the name of the pipeline we wish PhyPro to run. Notice that as of the version of this manual, the standard release of PhyPro has two pipelines: `phylo-profile` and `ref-tree`. we can pass either or both.

Now it comes the catch, this version is not on docker containers yet, so we will need to have the following softwares up and running:

```
blastp
rpsblast
formatdb
mafft-linsi
hmmer3
RAxML
```

in future versions, the docker container will have all these packages installed.

If we have all these softwares, we can _keep going_ with:
```
$ phypro t4p --keepgoing phylo-profile ref-tree
```

If PhyPro is capable to finish both pipelines without a hickup, it will automatically pack our results and it is ready to be loaded by the analyser.

## How to make a pipeline

First we need to write a class with the following modules:

Then we need to update the availablePipelines.json with wet custom pipeline
