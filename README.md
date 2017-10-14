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

This will generate the file `phypro.ProjectName.config.json` that you will have to configure later. It will also make a directory structure like this:

```
ProjectName/
    phylo-profile/
    ref-tree/
    phypro.ProjectName.config.json
```
