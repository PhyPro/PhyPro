'use strict'

const expect = require('chai').expect

const BlastUtils = require('./BlastUtils')

const kDefaults = {
	numBlastThreads: 4,
	outputFormat: '"6 qseqid sseqid bitscore pident evalue qlen length"',
	maxEvalue: 1,
	maxTargetSeqs: 1000
}

describe('BlastUtils', function() {
	describe('setNewParams and getParams', function() {
		it('should change params', function() {
			const newParams = {
				not: 'a good param'
			}
			const blastUtils = new BlastUtils()
			const defaultParams = blastUtils.getParams()
			blastUtils.setNewParams(newParams)
			expect(blastUtils.getParams()).to.be.not.eql(defaultParams)
			expect(blastUtils.getParams()).to.be.eql(newParams)
		})
	})
	describe('buildBlastpCommand', function() {
		it('should build a command using default params', function() {
			const expectedCommand = 'blastp -db mydb -query myquery -out myoutputFile.dat -num_threads 4 -outfmt "6 qseqid sseqid bitscore pident evalue qlen length" -evalue 1 -max_target_seqs 1000'
			const blastUtils = new BlastUtils()
			const command = blastUtils.buildBlastpCommand('mydb', 'myquery', 'myoutputFile.dat')
			expect(command).eql(expectedCommand)
		})
		it('should be able to change default commands during initialization', function() {
			const blastpParams = [
				['num_threads', kDefaults.numBlastThreads],
				['outfmt', kDefaults.outputFormat],
				['evalue', 1E-10],
				['max_target_seqs', 1001]
			]
			const params = {
				blastp: blastpParams
			}
			const expectedCommandOne = 'blastp -db mydb -query myquery -out myoutputFile.dat -num_threads 4 -outfmt "6 qseqid sseqid bitscore pident evalue qlen length" -evalue 1e-10 -max_target_seqs 1001'
			const blastUtils = new BlastUtils(params)
			const commandOne = blastUtils.buildBlastpCommand('mydb', 'myquery', 'myoutputFile.dat')
			expect(commandOne).eql(expectedCommandOne)
			const expectedCommandTwo = 'blastp -db myOtherDb -query myOtherQuery -out myOtherOutputFile.dat -num_threads 4 -outfmt "6 qseqid sseqid bitscore pident evalue qlen length" -evalue 1e-10 -max_target_seqs 1001'
			const commandTwo = blastUtils.buildBlastpCommand('myOtherDb', 'myOtherQuery', 'myOtherOutputFile.dat')
			expect(commandTwo).eql(expectedCommandTwo)
		})
		it('should be able to change default commands during function call', function() {
			const blastpParams = [
				['num_threads', kDefaults.numBlastThreads],
				['outfmt', kDefaults.outputFormat],
				['evalue', 1E-10],
				['max_target_seqs', 1001]
			]
			const expectedCommandOne = 'blastp -db mydb -query myquery -out myoutputFile.dat -num_threads 4 -outfmt "6 qseqid sseqid bitscore pident evalue qlen length" -evalue 1 -max_target_seqs 1000'
			const blastUtils = new BlastUtils()
			const commandOne = blastUtils.buildBlastpCommand('mydb', 'myquery', 'myoutputFile.dat')
			expect(commandOne).eql(expectedCommandOne)
			const expectedCommandTwo = 'blastp -db myOtherDb -query myOtherQuery -out myOtherOutputFile.dat -num_threads 4 -outfmt "6 qseqid sseqid bitscore pident evalue qlen length" -evalue 1e-10 -max_target_seqs 1001'
			const commandTwo = blastUtils.buildBlastpCommand('myOtherDb', 'myOtherQuery', 'myOtherOutputFile.dat', blastpParams)
			expect(commandTwo).eql(expectedCommandTwo)
		})
	})
	describe('buildMakeDatabaseCommand', function() {
		it('should build a command using default params', function() {
			const expectedCommand = 'makeblastdb -in myFastaFile.fa -out mydb -dbtype prot'
			const blastUtils = new BlastUtils()
			const command = blastUtils.buildMakeDatabaseCommand('myFastaFile.fa', 'mydb')
			expect(command).eql(expectedCommand)
		})
		it('should be able to change default commands during initialization', function() {
			const makeblastdbParams = [
				['dbtype', 'nucl']
			]
			const params = {
				makeblastdb: makeblastdbParams
			}
			const expectedCommandOne = 'makeblastdb -in myFastaFile.fa -out mydb -dbtype nucl'
			const blastUtils = new BlastUtils(params)
			const commandOne = blastUtils.buildMakeDatabaseCommand('myFastaFile.fa', 'mydb')
			expect(commandOne).eql(expectedCommandOne)
			const expectedCommandTwo = 'makeblastdb -in myOtherFastaFile.fa -out myOtherDb -dbtype nucl'
			const commandTwo = blastUtils.buildMakeDatabaseCommand('myOtherFastaFile.fa', 'myOtherDb')
			expect(commandTwo).eql(expectedCommandTwo)
		})
		it('should be able to change default commands during function call', function() {
			const makeblastdbParams = [
				['dbtype', 'nucl']
			]
			const expectedCommandOne = 'makeblastdb -in myFastaFile.fa -out mydb -dbtype prot'
			const blastUtils = new BlastUtils()
			const commandOne = blastUtils.buildMakeDatabaseCommand('myFastaFile.fa', 'mydb')
			expect(commandOne).eql(expectedCommandOne)
			const expectedCommandTwo = 'makeblastdb -in myOtherFastaFile.fa -out myOtherDb -dbtype nucl'
			const commandTwo = blastUtils.buildMakeDatabaseCommand('myOtherFastaFile.fa', 'myOtherDb', makeblastdbParams)
			expect(commandTwo).eql(expectedCommandTwo)
		})
	})
})
