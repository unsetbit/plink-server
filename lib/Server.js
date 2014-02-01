var Onramp = require('../../onramp');
var createPasscodeManager = require('./PasscodeManager.js');
var createConnection = require('./Connection.js');

module.exports = function create(options){
	options = options || {};
	
	var onramp = Onramp.create(options);

	return new Server(onramp, options.defaultTimeout);
};

function Server(connectionEmitter, defaultPasscodeTimeout){
    this.passcodeManager = createPasscodeManager(defaultPasscodeTimeout);
	this.connectionEmitter = connectionEmitter;
	
	this.connectionEmitter.on('connection', this.connectionHandler.bind(this));
};

module.exports.Server = Server;

Server.prototype.connectionHandler = function(connection){
	console.log('new connection: ' + connection.address);
	createConnection(connection, this.passcodeManager);
};
