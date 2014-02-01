module.exports = function create(connection, passcodeManager){
	return new Connection(connection, passcodeManager);
};

function Connection(connection, passcodeManager){
	this.connection = connection;
	this.passcodeManager = passcodeManager;
	
	connection.on('message', this.messageHandler.bind(this));
	connection.on('close', this.closeHandler.bind(this));
};

module.exports.Connection = Connection;

Connection.prototype.messageHandler = function(message){
	if(!message.type) return;
	
	var passcodeManager = this.passcodeManager,
		connection = this.connection;

	switch(message.type){
		case 'use passcode':
			if(passcodeManager.has(message.passcode)){
				connection.send({
					type: 'address',
					passcode: message.passcode,
					address: passcodeManager.get(message.passcode)
				});
			} else {
				connection.send({
					type: 'invalid passcode',
					passcode: message.passcode
				});
			}
			break;
		case 'set passcode':
			if(passcodeManager.has(message.passcode)){
				connection.send({
					type: 'passcode not set',
					passcode: message.passcode
				});
			} else {
				passcodeManager.set(message.passcode, connection.address, message.timeout);
			
				connection.send({
					type: 'passcode set',
					passcode: message.passcode
				});
			}
			break;
		case 'revoke passcode':
			if(connection.address === passcodeManager.get(message.passcode)){
				passcodeManager.remove(message.passcode);

				connection.send({
					type: 'passcode revoked',
					passcode: message.passcode
				});
			} else {
				connection.send({
					type: 'passcode not revoked',
					passcode: message.passcode
				});				
			}
			break;
	}
};

Connection.prototype.closeHandler = function(){
		this.passcodeManager.removeAll(this.connection.address);
};