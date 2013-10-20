var
	_    = require('lodash'),
	util = require('util')
	;


var Tag = exports.Tag = function Tag(tag, count)
{
	this.tag = tag;
	this.count = count;
};

Tag.prototype.tag = '';
Tag.prototype.count = 0;
Tag.prototype.type = null;

Tag.prototype.url = function url()
{
	return this.tag;
};

Tag.prototype.ljtag = function ljtag()
{
	return this.tag;
}

Tag.prototype.link = function link(lj)
{
	if (lj)
		return this.ljtag();
	return this.url();
};

Tag.prototype.delicious = function delicious()
{
	return '<a href="http://pinboard.in/u:#{account}/' + this.toString() + '">' +  this.tag+ '</a>';
};

Tag.prototype.sortkey = function sortkey()
{
	return this.tag;
};

Tag.prototype.toString = function toString()
{
	if (this.type)
		return this.type + ':' + this.tag;
	return this.tag;
};


var Category = exports.Category = function Category(tag, count)
{
	Tag.call(this);
	this.type = 'cat';
}
util.inherits(Category, Tag);

Category.titles = {};
Category.sortkeys = {};

Category.setup = function(titles, order)
{
	_.each(titles, function(v, k)
	{
		Category.titles[k] = v;
	});

	for (var i = 0; i < order.length; i++)
	{
		var c = order[i];
		Category.sortkeys[c] = i + '_' + c;
	}
};

Category.prototype.sortkey = function()
{
	return Category.sortkeys[this.tag] || '9_' + this.tag;
};

Category.prototype.ljtag = function()
{
	return Category.titles[this.tag] || this.tag;
};
