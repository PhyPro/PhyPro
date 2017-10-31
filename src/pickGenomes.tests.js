'use strict'

let expect = require('chai').expect

let pickGenomes = require('./pickGenomes.js')

describe('pickGenomes', function() {
	it('must not be undefined and to be an Array when no N is passed', function() {
		let taxid = 10
		return pickGenomes.pick(taxid).then(function(taxids) {
			expect(taxids).to.not.be.undefined
			expect(taxids).to.be.an('array')
		})
	})
	it('must not be undefined and to be an Array when N is passed and it is smaller than the number of possible genomes', function() {
		let taxid = 10
		let N = 2
		return pickGenomes.pick(taxid, N).then(function(taxids) {
			expect(taxids).to.not.be.undefined
			expect(taxids).to.be.an('array')
			expect(taxids.length).eql(N)
		})
	})
	it('must not be undefined and to be an Array and must return all elements when N is passed and it is larger than the number of possible genomes', function() {
		let taxid = 10
		let N = 12
		return pickGenomes.pick(taxid, N).then(function(taxids) {
			expect(taxids).to.not.be.undefined
			expect(taxids).to.be.an('array')
			expect(taxids.length).eql(4)
		})
	})
	it('must return an Array of numbers when N is not passed', function() {
		let taxid = 10
		return pickGenomes.pick(taxid).then(function(taxids) {
			taxids.forEach(function(id) {
				expect(id).to.be.a('number')
			})
		})
	})
	it('must return an Array of numbers when N is passed', function() {
		let taxid = 10
		let N = 3
		return pickGenomes.pick(taxid, N).then(function(taxids) {
			taxids.forEach(function(id) {
				expect(id).to.be.a('number')
			})
		})
	})
	it('should work with deep nodes', function() {
		this.timeout(100000)
		let taxid = 28211
		let N = 10
		return pickGenomes.pick(taxid, N).then(function(taxids) {
			expect(taxids).to.not.be.undefined
			expect(taxids).to.be.an('array')
			expect(taxids.length).eql(N)
		})
	})
})
