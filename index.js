'use strict';
//require('newrelic');
//var basicAuth = require('basic-auth-connect');
var config = require('config');
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var util = require('util');
var bodyParser = require('body-parser');
var uuid = require('node-uuid');
//var MongoClient = require('mongodb').MongoClient;
var config = {appRoot: __dirname // required config
};

tracks = require('./tracks.json');
app.use(bodyParser.json());

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 3000;
  app.listen(port);
});

// function hello(req, res) {
    // var name = 'stranger';
    // var hello = util.format('Hello, %s', name);
    // res.json(hello);
// }
// app.get('/', hello);



// if(process.env.BASIC_AUTH_PASS)
	// app.use(basicAuth(function(user,pass){
		// return process.env.BASIC_AUTH_PASS === pass || process.env.BASIC_AUTH_PASS2 === pass;
	// }));

app.get('/vcap', function(req,res){res.send(process.env.VCAP_APPLICATION)});

	
var playlist = [];

app.route('playlist') //:userId/playlist')
	.get(function(req,res){ // get all playlist names&public
		if(playlist.length==0)
			res.status(404).send('There are no playlist created yet.');
		// var x, y=1;
		// var list = "Nazwa, publiczna: \n";
		res.send(playlist.values().filter(function(playlist){
			//return playlist.userId === userId
		}));
	})
	.post(function(req,res){ // create new playlist
		var id = uuid.v4();
		var list = req.body;
		//list.userId = req.params.userId;
		list.id = id;
		list.name = req.query.name;
		list.public = req.query.public; //yes/no
		playlist.set(id, list);
		res.send('Playlista dodana pomyślnie.\n').send({id: id});
	});
	

function findPlaylist(req,res,next){
	if(req.params.id <= 0)
			res.status(404).send('Numery playlist zaczynają się od \'1\'');
		else if(req.params.id > playlist.length || isNaN(req.params.id))
			res.sendStatus(404);
	var id = req.params.id;
	var list = playlist.get(id);
	if(!playlist){ // || playlist.userId !== req.params.userId){
		return res.status(404).send({message: "Playlisty nie znaleziono."});
	}
	req.playlist = list;
	next();
}

function findTracks(ids){
	return tracks.filter(function (track){
		return ids.some(function (id){
			return track.id == id;
		});
	});
}
	
app.route('playlist/:id') //:userId/playlist/:id')
	.get(findPlaylist, function(req,res){ // show playlist name&tracks
		// var z = req.params.id - 1;
		// var x, list = "";
		// for(x in playlist[z]){
			// list+=playlist[z][x]+', ';
		// }
		res.send(req.playlist);	
	})
	.post(findPlaylist, function(req,res){ // add up to 3 new tracks
		// var i = req.params.id -1;
		// if(req.query.one)
			// playlist[i].push(req.query.one);
		// if(req.query.two)
			// playlist[i].push(req.query.two);
		// if(req.query.three)
			// playlist[i].push(req.query.three);
		var tracks = req.plalist.tracks;
		if(!tracks){
			tracks = [];
		}
		if(req.query.ids){
			var ids = req.query.ids.split(',');
			req.plalist.tracks = tracks.concat(findTracks(ids));
		}
		res.send('Dodano nowe piosenki.');
	})
	.delete(findPlaylist, function(req,res){ // remove track
		//var i = req.params.id -1;
		//var songId = req.query.id+1;
		//if(songId <= playlist[i].length)
		// playlist.del(req.params.playlistId);
		var tracks = req.playlist.tracks;
		if (tracks && req.query.ids) {
			var ids = req.query.ids.split(',');
			req.playlist.tracks = tracks.filter(function (track) {
				return ids.every(function (id) {
					return id !== track.id
				});
			});
		}
		res.send();
	})
	.put(findPlaylist, function(req,res){ // make playlist public
		// if(!req.body){
			// return res.status(400).send({message:"Nieprawidłowe dane"});
		// }
		// req.body.userId = req.params.userId;
		// req.body.id = req.params.id;
		// playlist.set(req.params.playlistId, req.body);
		
		plalist[req.params.playlistId].public = 'yes';
		res.send('Twoja lista jest teraz publiczna');
	});