function KeyManager(maxTimeout){
	this.keys = {};
	this.maxTimeout = maxTimeout;
};

KeyManager.create = function(maxTimeout){
	return new KeyManager(maxTimeout);
};

module.exports = KeyManager;

KeyManager.prototype.get = function(passcode){
	return this.keys[passcode];
};

KeyManager.prototype.removeAll = function(address){
	var toRemove = [],
		passcode;

	for(passcode in this.keys){
		if(this.keys[passcode] === address){
			toRemove.push(passcode);
		}
	}

	toRemove.forEach(this.remove.bind(this));
};

KeyManager.prototype.remove = function(passcode){
	var address = this.keys[passcode]; 
	delete this.keys[passcode];

	return address;
};

KeyManager.prototype.has = function(passcode){
	return (passcode in this.keys);
};

KeyManager.prototype.set = function(passcode, address, timeout){
	var self = this;

	this.keys[passcode] = address;

	// If this passcode is timed, revoke it after timeout
	if(timeout || this.maxTimeout){
		// If they're both defined, choose the lesser
		if(this.maxTimeout && timeout) timeout = Math.min(this.maxTimeout, timeout);
		
		// If timeout not defined, use the max
		if(!timeout) timeout = this.maxTimeout;

		setTimeout(function(){
			self.remove(passcode);
		}, timeout);
	}
};