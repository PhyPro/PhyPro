# PhyPro - Advanced Phylogenetic Profile for Biologists

[![Build Status](https://travis-ci.org/PhyPro/phypro.svg?branch=develop)](https://travis-ci.org/PhyPro/phypro)
[![Coverage Status](https://coveralls.io/repos/github/PhyPro/phypro/badge.svg?branch=develop)](https://coveralls.io/github/PhyPro/phypro?branch=develop)
[![License](https://img.shields.io/badge/license-CC0--1.0-blue.svg)](https://creativecommons.org/publicdomain/zero/1.0/legalcode)


This is the javascript implementation of PhyPro.

## Install

We need to have npm and node running in our machine. Please look at this information on how to install them. Believe-me, it is easy.

Once we have them working,

```
$ npm install phypro -g
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
    phyloProfile/
    refTree/
    phypro.ProjectName.config.json
```

## Configuring the config file

The config file has a `header` section where most of the higher level information is stored, and additional sections to every other pipeline. Currently, there are only two pipelines in the official PhyPro release: `phyloProfile` and `refTree`. Each section contains fields that must be completed to tell PhyPro what to do.

### Selecting background genomes.

The first thing we need to tell PhyPro is the genomes we want in our phylogenetic profile. PhyPro is heavily integrated with MiST3 and uses NCBI's taxonomy identifiers to identify the genomes. This information is placed in the `header` section of the config file under the keys `backgroundGenomes` and `referenceGenomes` because it is central to both pipelines.

PhyPro accepts two types of data here: it can be an array of taxonomy IDs or an array of Objects each one with two fields `name` and `taxid`, like this:

```json
{
  "name": "Myxococcus xanthus DK 1622",
  "taxid":  246197
}
```

In either case, we can chose to incorporate notes in other fields, but those will be ignored by PhyPro.

If an array of taxonomy IDs is passed instead of this object, PhyPro will replace the array with an object with the correct `name` and `taxid` fields.

While it might be trivial to pick the reference genomes by hand, the power of phylogenetic profile really shines when a balanced set of background genomes is selected. However, it can be cumbersome to manually include each of the hundreds of taxonomy identifier in the config file. For that reason, PhyPro has a helper command line application that selects genomes for us.

The application is called `phypro-pickGenomes`

For example, let's suppose we want 100 genomes sampled from _Proteobacteria_. `phypro-pickGenomes` will try to balance the examples among the ranks below _Proteobacteria_.

The input node is the taxonomy identifier of that level and can be found at the [NCBI Taxonomy](https://www.ncbi.nlm.nih.gov/taxonomy). For example, _Proteobacteria_'s taxonomy id is `1224`.

```
$ phypro-pickGenomes 1224 --random 100
```

This command will save to `pickGenomes.selection.json` 100 randomly selected taxonomy ids from species under the taxonomic node of Protebacteria. `phypro-pickGenomes` will try to spread the picks across the taxonomic tree.

Conveniently, there is also the flag `--update-config` which will take the project name as an argument and will be push the ids to the list already existent in the config file.

### Selecting reference Genomes

We may want to know more about systems from specific organisms. For that, we have the `referenceGenomes` field in the config file.

There is no automated way to fill this section as they should be carefully curated. Ideally, we would keep a `json` file with the information about the genomes of interest and copy its contents to the config file.

This is an example of how to organize the information about the genomes of interest.

```json
[
    {
        "name": "Legionella pneumophila subsp. pneumophila str. Philadelphia 1",
        "taxid": 272624,
        "pathogen": true,
        "collaborator": "John Doe"
    },
    {
        "name": "Myxococcus xanthus DK 1622",
        "taxid":  246197
    },
    {
        "name": "Pseudomonas aeruginosa PAO1",
        "taxid":  208964
    },
]
```

As in the background genomes, PhyPro does not care of any of the fields but the `taxid` and `name`. Thus, it might be useful to keep notes about each of the reference genome and etc. 

### Defining protein families

There are many ways to search for a certain protein family computationally. PhyPro builds up on another tool called PFQL - Protein Feature Query Language to perform this task more robustly. PFQL is able to filter proteins that has a specific feature architecture. It is called "feature" because it is a generalization of domain architecture. So PhyPro expects us to defiine a protein family by explicitly writing PFQL rules that defines a protein family.

These rules are writen in the config file under the key: `phyloProfile.PfqlDefinitions`

Please read the documentation on PFQL [here](https://github.com/biowonks/pfql/blob/master/manual.md)

### Defining CDDs


## Validate config file

To avoid wasting time, before we start the pipelines, PhyPro will ask to validate the config file and inform of any mistaken we might have made:

```
$ phypro --check-config ProjectName
```

It will try to be as informative as possible about any issue the config file might have. However, there are two special sections that are more error prone and PhyPro naturally pays more attention to them:


### Validating backgroundGenomes and referenceGenomes

First, PhyPro will parse the `*Genomes` and make sure that the information in these two sections of the config file are sound.

First, since not all taxonomy IDs from the NCBI are in the MiST3 database, PhyPro will validate each taxid number against the database and let us know if there is any problem with that. Also, if we make a mistake in the field `name`, PhyPro will correct that and place the old value of this field under the key `nameByUser`. For this reason, we don't need to complete the field `name` ourselves as PhyPro will complete it for us during the validation process.

### Validating PFQL rules

PFQL rules will be validated by loading them up to a temporary PFQL instance. It will throw any problems with the rules that PFQL finds it. If you find a problem with the PFQL rule that was not cought, please contact the PFQL team in their [issue tracker](https://github.com/biowonks/pfql/issues).

### Fetching, parsing and storing relevant protein information.
After we configure the config file, we are pretty much set. The next step is to tell PhyPro to get the relevant data and parse it in different files that makes sense.

We can run it by this simple command:
```
$ phypro ProjectName --fetch-data
```

 PhyPro uses the concept of `streams`. That means that as the data start to pour from the MiST3 database servers, PhyPro immediately start to parse the data in two fronts:

* the raw combined output from MiST3 and SeqDepot is compacted and stored in `.json.gz` files
* whole genome fasta files are produced and stored in `.fa` files

> Note about the fasta files: PhyPro uses the following tag system: `Xx_yyy|genome_version-locus`. The `Xx` is the first two letters of the genus and `yyy` the first three characters of the species name. The pipe symbol `|` is used to divide this "human readable" hint of from which organism this is from and the what MiST3 calls `stable id`. This id is the new accession number of the genome version in the NCBI database following by the new locus tag.

## PhyloProfile pipeline

```
Next, PhyPro automatically will stream all `.json` files through a pipeline that uses the PFQL rules to build fasta files with members of each protein family.

In summary the `--fetch-data` step is:

1) get data from MiST3 and SeqDepot database
2) store raw data in `.json.gz` format and sequence data in fasta file format.
3) builds fasta files with sequences for each protein family described in the config file.
```


## Keep going

we can do that by the use of the flag --keep-going. This flag must have at least one argument, which is the name of the pipeline we wish PhyPro to run. Notice that as of the version of this manual, the standard release of PhyPro has two pipelines: `phyloProfile` and `refTree`. we can pass either or both.

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
$ phypro t4p --keepgoing phyloProfile refTree
```

If PhyPro is capable to finish both pipelines without a hickup, it will automatically pack our results and it is ready to be loaded by the analyser.

## How to make a pipeline

First we need to write a class with the following modules:

Then we need to update the availablePipelines.json with wet custom pipeline
