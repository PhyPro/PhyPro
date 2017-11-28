'use strict'

let seqdepot = require('./SeqdepotHelper.js')
let mist3 = require('./Mist3Helper.js')

const aseqs = require('./CheA.Vibrio.aseqs.json')


seqdepot.getSequenceFromAseqs(aseqs).then((items) => {
	console.log(items.length)
}).catch((err) => {
	console.log(err)
})
