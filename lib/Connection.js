function Connection(connection, keyManager){
	this.connection = connection;
	this.keyManager = keyManager;
	
	connection.on('message', this.messageHandler.bind(this));
	connection.on('close', this.closeHandler.bind(this));
};

Connection.create = function(connection, keyManager){
	return new Connection(connection, keyManager);
}

module.exports = Connection;

Connection.prototype.messageHandler = function(message){
	if(!message.type) return;
	
	var keyManager = this.keyManager,
		connection = this.connection;

	switch(message.type){
		case 'use key':
			if(keyManager.has(message.key)){
				connection.send({
					type: 'address',
					key: message.key,
					address: keyManager.get(message.key)
				});
			} else {
				connection.send({
					type: 'invalid key',
					key: message.key
				});
			}
			break;
		case 'set key':
			if(keyManager.has(message.key)){
				connection.send({
					type: 'key not set',
					key: message.key
				});
			} else {
				keyManager.set(message.key, connection.address, message.timeout);
			
				connection.send({
					type: 'key set',
					key: message.key
				});
			}
			break;
		case 'revoke key':
			if(connection.address === keyManager.get(message.key)){
				keyManager.remove(message.key);

				connection.send({
					type: 'key revoked',
					key: message.key
				});
			} else {
				connection.send({
					type: 'key not revoked',
					key: message.key
				});				
			}
			break;
	}
};

Connection.prototype.closeHandler = function(){
		this.keyManager.removeAll(this.connection.address);
};