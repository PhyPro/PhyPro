'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
const expect = chai.expect
const should = chai.should

const seqdepot = require('./SeqdepotHelper')

describe.skip('SeqdepotHelper', function() {
	describe('getInfoFromAseqs', function() {
		it('should pass', function() {
			const aseqs = [
				'62RT8aw4XKfx3s3eVAIORA',
				'zh5zUmI5sl8BCOqsc6Hw7A'
			]
			return seqdepot.getInfoFromAseqs(aseqs, {throwError: false}).then((items) => {
				items.forEach((item) => {
					expect(aseqs).to.include(item.id)
				}, (err) => {
					console.log(err)
				})
			})
		})
		it('should pass skipping error', function() {
			const aseqs = [
				'62RT8aw4XKfx3s3eVAIORA',
				'zh5zUmI5sl8BCOqsc6Hw7A',
				'2j4a_hWdrNNLGPfaljH_xA'
			]
			return seqdepot.getInfoFromAseqs(aseqs, {throwError: false}).then((items) => {
				items.forEach((item) => {
					if (item)
						expect(aseqs).to.include(item.id)
				}, (err) => {
					console.log(err)
				})
			})
		})
		it('should pass skipping error', function() {
			const aseqs = [
				'62RT8aw4XKfx3s3eVAIORA',
				null,
				'zh5zUmI5sl8BCOqsc6Hw7A'
			]
			return seqdepot.getInfoFromAseqs(aseqs, {throwError: false}).then((items) => {
				console.log(items.length)
				items.forEach((item) => {
					if (item)
						expect(aseqs).to.include(item.id)
				}, (err) => {
					console.log(err)
				})
			})
		})
	})
	describe('processRequest_', function() {
		it('should work', function() {
			const brokenEntry = [
				'eALFsiVPvD8jtNe_9Qifig\t200\teALFsiVPvD8jtNe_9Qifig\t{"_s":"ddddT-T-T---dT-TTT-TTTTT-","l":393,"s":"MTIMLCVTGSVAAVETVKLARELKRKGFQVKCFMTDGACDIINPYALEFATGEKVITKLTGNIEHVKYADEDLILVAPATANVISKFAYKIADNPINTLLLTASGYDTPIIFVPSMHQSMYRAVEENIQKLKKEGVVFMEPKQEENKAKFPSVDDIVLQAQKATSAGGLEDRHVLVSAGGTYEDIDPIRGITNRSSGKMGVELAKEAFRRGAEVTIITGRVEVEIPKVFNRIKVESSREMAKALEENLIDCDVFIAAAAVSDFTVAEVGSVTEKGSITERGFKISSASEATLKLKPAPKIINQVKEHNPAIYLVGFKAEYNVSRDELVESAKRRMRESGADLMVANDVAEAGAGFGSDQNKVVLVDDEIWEIPLSTKEEIAALVIGRIVERII","t":{"gene3d":[["3.40.50.1950","",2,164,4.8e-35],["3.40.50.10300","Phosphopantothenoylcysteine synthetase. Chain A",168,391,3.5e-64]],"panther":[["PTHR14359",1,393,7.1e-110],["PTHR14359:SF6",1,393,7.1e-110]],"pfam28":[["DFP",169,365,"..",1,1,186,"[]",169,365,"..",191.1,5.5e-60,9.2e-57,0.89],["Flavoprotein",1,123,"[.",0.2,1,133,"[.",1,126,"[.",81.8,1.3e-26,2.1e-23,0.96]],"signalp":{"e":16},"superfam":[["SSF52507","Homo-oligomeric flavin-containing Cys decarboxylases, HFCD",1,193,5.3e-34],["SSF102645","CoaB-like",166,392,2.0e-58]],"targetp":{"p":12},"tigrfam":[["TIGR00521","coaBC_dfp",2,388,7.8e-119]]},"x":{"gi":[490128757,407816059],"uni":["K2QEU7"]},"id":"eALFsiVPvD8jtNe_9Qifig"}\t\nLJ56TLRt7Cd3W4FH46SLNA\t200\tLJ56TLRt7Cd3W4FH46SLNA\t{"_s":"TTdd--------T------TdTdT-","l":756,"s":"MSFDVDEEILQDFLVEAGEILEQLQEQLVDLENNPEDANLLNAIFRGYHTVKGGAGFLSLTELVEICHGAENVFDVMRNGQRTLTPELMDIILQATDVVVDMFERVKSQEPLEPADAKLVDTLHKLSKPESPDENIFDTDESAPSAQPEIASEPEPELEFDFVDEAPAPASSGGDIDEISEDEFEALLDELHGSSAPGKSAPGQSATGTKSEAKASAAPSSDVTSPDVSSSSGDDITDDEFEALLDDLHGKGKFSAAEESAAPSQPAPQSTSASGDEEITDDEFEALLDQLHGSGQGPTVQSASDTKAPEPNVDKAATEAIQKAKQSAPAAAKAAPAASAPSKAASAAPASKDAGKKDEKKASPSSPPAETTVRVDTKRLDQIMNMVGELVLVRNRLISLGINTNDESMSKAIANLDVVTGDLQGAVMKTRMQPIKKVFGRFPRVVRDLARSLKKEITLELEGEETDLDKNLVEALADPLVHLVRNSVDHGVEMPDDRAASGKPRMGTVKLSASQEGDHILLTIEDDGKGMDPEKLKEIAISRGVLDADAAARMSDVEAFNLIFAPGFSTKTEISDISGRGVGMDVVKTKINQLNGTVNIDSQLGKGTRLEIKVPLTLAILPTLMIIIGKQTFALPLGSVSEIINMDIKKTNTVDGQLTMIVRSKAIPLFFLGDWLIRGPKSIEREKGHVVVVQVGTRQVGFVVDALIGQEEVVIKPLDALLQGTPGMAGATITSDGGIALILDIPSLLKRYARKP","t":{"agfam1":[["HK_CA:Che",431,616,"..",1,187,"[]",263.739,1.051e-78]],"coils":[[14,41]],"pfam27":[["CheW",624,751,"..",0.4,3,136,"..",622,753,"..",77.4,1.2e-24,4', 
				'.5e-22,0.96],["HATPase_c",478,616,"..",0.1,4,110,"..",475,617,"..",74.2,2.0e-22,3.9e-21,0.95],["Hpt",8,108,"..",0.1,1,89,"[.",8,109,"..",71.6,1.9e-22,2.6e-20,0.98],["H-kinase_dim",371,430,"..",2.5,2,68,".]",370,430,"..",59.8,3.5e-19,1.5e-16,0.98]],"pfam28":[["CheW",624,751,"..",0.4,3,136,"..",622,753,"..",77.2,9.7e-25,5.1e-22,0.96],["Hpt",8,105,"..",0.1,1,81,"[.",8,109,"..",67.1,3.3e-21,6.7e-19,0.9],["HATPase_c",478,616,"..",0.1,4,105,"..",475,617,"..",65.4,8.9e-20,2.6e-18,0.84],["H-kinase_dim",371,430,"..",2.1,2,69,".]",370,430,"..",52.8,3.1e-17,2.1e-14,0.97]],"pfam29":[["CheW",624,751,"..",0.4,3,136,"..",622,753,"..",77.2,1.6e-24,5.1e-22,0.96],["Hpt",8,105,"..",0.1,1,81,"[.",8,109,"..",66.8,6.1e-21,8.2e-19,0.9],["HATPase_c",478,617,"..",0.1,4,109,"..",476,618,"..",66.3,7.9e-20,1.8e-18,0.9],["H-kinase_dim",371,430,"..",2.1,2,69,".]",370,430,"..",52.8,5.0e-17,2.2e-14,0.97]],"segs":[[19,28],[210,235],[255,274],[322,352],[453,470],[690,704]]},"x":{"gi":[692175752]},"id":"LJ56TLRt7Cd3W4FH46SLNA"}\t'
			]
			let buffer = ''
			const items = []
			brokenEntry.forEach((data) => {
				// console.log('\nRawData -> ' + data)
				const info = seqdepot.processRequest_(buffer + data)
				buffer = info.buffer
				info.items.forEach((item) => {
					items.push(item)
				})
			})
			expect(items.length).eql(2)
		})
	})
})
