var Sequelize = requiire('sequilize');
var sequilize = new Sequelize(undefined,undefined,undefined, {

	'dialect': 'sqlite',
	'storage', 'basic-sqlite-database.sqlite'

});

sequilize.sync().then(function(){
	console.log('Everything is synced');
});