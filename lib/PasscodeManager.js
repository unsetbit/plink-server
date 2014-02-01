module.exports = function create(maxTimeout){
	return new TemporalPasscodeManager(maxTimeout);
};

function TemporalPasscodeManager(maxTimeout){
	this.passcodes = {};
	this.maxTimeout = maxTimeout;
};

module.exports.TemporalPasscodeManager = TemporalPasscodeManager;

TemporalPasscodeManager.prototype.get = function(passcode){
	return this.passcodes[passcode];
};

TemporalPasscodeManager.prototype.removeAll = function(address){
	var toRemove = [],
		passcode;

	for(passcode in this.passcodes){
		if(this.passcodes[passcode] === address){
			toRemove.push(passcode);
		}
	}

	toRemove.forEach(this.remove.bind(this));
};

TemporalPasscodeManager.prototype.remove = function(passcode){
	var address = this.passcodes[passcode]; 
	delete this.passcodes[passcode];

	return address;
};

TemporalPasscodeManager.prototype.has = function(passcode){
	return (passcode in this.passcodes);
};

TemporalPasscodeManager.prototype.set = function(passcode, address, timeout){
	var self = this;

	this.passcodes[passcode] = address;

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