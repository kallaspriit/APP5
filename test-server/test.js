var Base = function() {
	this.counter = 0;
	this.obj = {
		test: 0
	};
};

Base.prototype.test = function() {
	this.counter++;
	this.obj.test++;
};

var Sub = function() {

};

Sub.prototype = new Base();

var a = new Base();
a.test();
console.log('a', a.counter, a.obj);

var b = new Base();
b.test();
console.log('b', b.counter, a.obj);

var c = new Sub();
c.test();
console.log('c', c.counter, a.obj);