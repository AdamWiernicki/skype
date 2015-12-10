'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var util = require('util');
var MongoClient = require('mongodb').MongoClient;
module.exports = app; // for testing
var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);
});

function hello(req, res) {
    var name = 'stranger';
    var hello = util.format('Hello, %s', name);
    res.json(hello);
}
app.get('/', hello);

var playlist = [];

app.route('/playlist')
	.get(function(req,res){ // get all playlist names&public
		if(playlist.length==0)
			res.status(404).send('There are no playlist created yet.');
		var x, y=1;
		var list = "ID, Nazwa, publiczna: \n";
		for(x in playlist){
			list+=y+", "+playlist[x][0]+", "+playlist[x][1]+",\n";
			y++;
		}
		res.send(list);
	})
	.post(function(req,res){ // create new playlist
		var list = [];
		list[0] = req.query.name;
		list[1] = req.query.public; //yes/no
		playlist.push(list);
		res.send('Playlista dodana pomyślnie');
	});
	
app.route('/playlist/:id')
	.get(function(req,res){ // show playlist name&tracks
		if(req.params.id <= 0)
			res.status(404).send('Numery playlist zaczynają się od \'1\'');
		else if(req.params.id > playlist.length || isNaN(req.params.id))
			res.sendStatus(404);
		else{
			var z = req.params.id - 1;
			var x, list = "";
			for(x in playlist[z]){
				list+=playlist[z][x]+', ';
			}
			res.send(req.params.id+', '+list);
		}
			
	})
	.post(function(req,res){ // add up to 3 new tracks
		var i = req.params.id -1;
		if(req.query.one)
			playlist[i].push(req.query.one);
		if(req.query.two)
			playlist[i].push(req.query.two);
		if(req.query.three)
			playlist[i].push(req.query.three);
		res.send('Dodano nowe piosenki.');
	})
	.delete(function(req,res){ // remove 1 track
		//var i = req.params.id -1;
		//var songId = req.query.id+1;
		//if(songId <= playlist[i].length)
			
		res.send('TODO: remove 1 track');
	})
	.put(function(req,res){ // make playlist public
		var y = req.params.id;
		if(y<0 || y>playlist.length)
			res.status(404).send('Nie ma playlisty o tym numerze');
		playlist[y][1] = yes;
		res.send('Twoja lista jest teraz publiczna');
	});