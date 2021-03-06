var express 	= require('express')
	, app 	= express()
	, cloudKit = require('./cloudkit.js')
	, fetch = require('node-fetch')
	, bodyParser 	= require("body-parser")
	, port 	= 5000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('port', (process.env.PORT || port));

types = [
	'Curiosity'
	, 'Likes'
]

cloudKit.configure({
	services: {
		fetch: fetch
	},
	containers: [{
	    containerIdentifier: 'iCloud.BEPiD.FourCults',
	    apiToken: 'e47278e18287d24daca29ad25bcbe4febe1fab11b979b52a6d91a0d0f55dc7d3',
	    environment: 'development'
	}]
})

app.get('/likes/:recordName', function(req, res) {
	var query = [{fieldName: 'curiosity', comparator: 'EQUALS', fieldValue: {value: {recordName: req.params.recordName, type: 'REFERENCE'}}}]
	cloudKit.getAllContainers()[0].publicCloudDatabase.performQuery({ recordType: types[1], filterBy: query }).then(function(response) {
		res.json({ total: response._results.length })
	}, function(error) {
		res.json(error)
	})
})

app.get('/points/:recordName', function(req, res) {
	var query = [{fieldName: 'curiosity', comparator: 'EQUALS', fieldValue: {value: {recordName: req.params.recordName, type: 'REFERENCE'}}}]
	cloudKit.getAllContainers()[0].publicCloudDatabase.performQuery({ recordType: types[1], filterBy: query }).then(function(response) {
		if (response._results.length === 0) {
			res.json({ points: 0, total: 0 });
			return;
		}
		var points = 0
		for (var i = 0; i < response._results.length; i++) {
			points += response._results[i].fields.points.value
		}
		points /= response._results.length
		res.json({ points: points, total: response._results.length })
	}, function(error) {
		res.json(error)
	})
})

app.get('/curiosities/:countryName', function(req, res) {
	var query = [{fieldName: 'countryName', comparator: 'EQUALS', fieldValue: {value: req.params.countryName, type: "STRING"}}]
	cloudKit.getAllContainers()[0].publicCloudDatabase.performQuery({ recordType: types[0], filterBy: query }).then(function(response) {
		var results = []
		for(var i=0; i<response._results.length; i++) {
			var result = {}
			result.countryName 	= response._results[i].fields.countryName.value
			result.cityName 	= response._results[i].fields.cityName.value
			result.body 		= response._results[i].fields.body.value
			result.title 		= response._results[i].fields.title.value
			result.device 		= response._results[i].fields.device.value
			result.createdAt 	= response._results[i].created.timestamp
			result.recordName 	= response._results[i].recordName
			results.push(result)
		}
		res.json(results)
	}, function(error) {
		res.json(error)
	})
})

app.post('/curiosities', function(req, res) {
	var query = [{fieldName: 'cityName', comparator: 'EQUALS', fieldValue: {value: req.body.city, type: "STRING"}}]
	cloudKit.getAllContainers()[0].publicCloudDatabase.performQuery({ recordType: types[0], filterBy: query }).then(function(response) {
		var results = []
		for(var i=0; i<response._results.length; i++) {
			var result = {}
			result.countryName 	= response._results[i].fields.countryName.value
			result.cityName 	= response._results[i].fields.cityName.value
			result.body 		= response._results[i].fields.body.value
			result.title 		= response._results[i].fields.title.value
			result.device 		= response._results[i].fields.device.value
			result.createdAt 	= response._results[i].created.timestamp
			result.recordName 	= response._results[i].recordName
			results.push(result)
		}
		res.json(results)
	}, function(error) {
		res.json(error)
	})
})

app.listen(app.get('port'), function() {
	console.log('servidor rodando na porta: ' + port)
})
