var
	_    = require('lodash'),
	util = require('util')
	;

//----------------------------------------------------------------------

function Tag(tag, count)
{
	this.tag = tag;
	this.count = count;
};

Tag.allTags = {};
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
};

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

var miscTag = new Tag('Misc', 1);
Tag.allTags[miscTag.name] = miscTag;

//----------------------------------------------------------------------

function Category(tag, count)
{
	Tag.call(this, tag, count);
	this.type = 'cat';
};
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

//----------------------------------------------------------------------

function Poster(tag, count, type, site)
{
	Tag.call(this, tag, count);
	this.type = type;
	this.site = site;
};
util.inherits(Poster, Tag);

Poster.prototype.ljtag = function()
{
	switch (this.site)
	{
	case 'ao3':
	case 'ffnet':
	case 'ij':
	case 'dw':
		return this.url();

	case 'lj':
	default:
		var result = '<lj ';
		if (this.type === 'comm')
			result += 'comm=';
		else if (this.type === 'poster')
			result += 'user=';
		result += '"' + this.tag + '">';
		return result;
	}
};

Poster.prototype.url = function()
{
	if (this.type === 'comm')
	{
		switch (this.site)
		{
			case 'ao3':
				return util.format('<span style="white-space:nowrap;"><a href="http://archiveofourown.org/users/%s"><img src="http://www.buffyworld.com/images/AO3.png" alt="[info]" width=16 height=16 style="vertical-align: text-bottom; border: 0; padding-right: 2px;" /></a><a href="http://archiveofourown.org/users/%s"><b>%s</b></a></span>', this.tag, this.tag, this.tag);

			case 'ffnet':
				return 'TBD FF.net';

			case 'ij':
				return util.format('<b><a href="http://community.insanejournal.com/%s/"><img src="http://www.insanejournal.com/img/community.gif" alt="[info]" width=16 height=16 style="vertical-align: bottom; border: 0;" />%s</a></b>', this.tag, this.tag);

			case 'dw':
				return util.format('<b><a href="http://community.dreamwidth.org/%s/"><img src="http://s.dreamwidth.org/img/silk/identity/community.png" alt="[info]" width=16 height=16 style="vertical-align: bottom; border: 0;" />%s</a></b>', this.tag, this.tag);

			case 'lj':
			default:
				return util.format('<b><a href="http://community.livejournal.com/%s/"><img src="http://stat.livejournal.com/img/community.gif" alt="[info]" width=16 height=16 style="vertical-align: bottom; border: 0;" />%s</a></b>', this.tag, this.tag);

		}
	}
	else if (this.type === 'poster')
	{
		switch (this.site)
		{
			case 'ao3':
				return util.format('<span style="white-space:nowrap;"><a href="http://archiveofourown.org/users/%s"><img src="http://www.buffyworld.com/images/AO3.png" alt="[info]" width=16 height=16 style="vertical-align: text-bottom; border: 0; padding-right: 2px;" /></a><a href="http://archiveofourown.org/users/%s"><b>%s</b></a></span>', this.tag, this.tag, this.tag);

			case 'ffnet':
				return 'TBD FF.net';

			case 'ij':
				return util.format('<b><a href="http://%s.insanejournal.com/"><img src="http://www.insanejournal.com/img/userinfo.gif" alt="[info]" width="17" height="17" style="vertical-align: bottom; border: 0;" />%s</a></b>', this.tag, this.tag);

			case 'dw':
				return util.format('<b><a href="http://%s.dreamwidth.org/"><img src="http://s.dreamwidth.org/img/silk/identity/user.png" alt="[info]" width="17" height="17" style="vertical-align: bottom; border: 0;" />%s</a></b>', this.tag, this.tag);

			case 'lj':
			default:
				return util.format('<b><a href="http://%s.livejournal.com/"><img src="http://stat.livejournal.com/img/userinfo.gif" alt="[info]" width="17" height="17" style="vertical-align: bottom; border: 0;" />%s</a></b>', this.tag, this.tag);

		}
	}
	else
		return this.tag;
};

//----------------------------------------------------------------------

var tagFactory = exports.tagFactory = function tagFactory(items)
{
	// Parses data returned by the bookmark site api into a tag. Assumes that
	// tags are prefixed with category:
	// comm:lj_comm_name
	// poster:lj_user_name
	// cat:entry_category
	// Tags without prefixes are assumed to be straight categories, as used
	// in the giles_watchers post headers.

	var tag, count;

	if (typeof items === 'object')
	{
		tag = items.tag;
		count = items.count;
	}
	else
	{
		count = 1;
		tag = items;
	}

	var result;

	var idx = tag.indexOf(':');
	if (idx === -1)
		return new Tag(tag, count);

	var cat = tag.substring(0, idx);
	tag = tag.substring(idx + 1);

	if ('poster' === cat)
		return new Poster(tag, count, 'poster', 'lj');
	if ('comm' === cat)
		return new Poster(tag, count, 'comm', 'lj');
	if ('cat' === cat || 'category' === cat)
		return new Category(tag, count);

	if ('series' === cat)
	{
		var r = new Tag(tag, count);
		r.type = 'series';
		return r;
	}

	if ('ij-poster' === cat || 'ijposter' === cat)
		return new Poster(tag, count, 'poster', 'ij');
	if ('ij-comm' === cat || 'ijcomm' === cat)
		return new Poster(tag, count, 'comm', 'ij');

	if ('dw-poster' === cat || 'dwposter' === cat)
		return new Poster(tag, count, 'poster', 'dw');
	if ('dw-comm' === cat || 'dwcomm' === cat)
		return new Poster(tag, count, 'comm', 'dw');

	if ('ao3' === cat)
		return new Poster(tag, count, 'poster', 'ao3');

	if ('ffnet' === cat || 'ff.net' === cat)
		return new Poster(tag, count, 'poster', 'ffnet');
};

//----------------------------------------------------------------------

function Item(bookmark)
{
	this.bookmark = bookmark;
	this.posters  = [];
	this.tags     = [];
	this.parseTags(bookmark.tags || '');
};

Item.prototype.bookmark = null;
Item.prototype.tags     = null;
Item.prototype.series   = null;
Item.prototype.category = null;
Item.prototype.posters  = null;
Item.prototype.next     = null;

Item.prototype.parseTags = function(taglist)
{
	var tags = taglist.split(' ');

	for (var i = 0; i < tags.length; i++)
	{
		var t = tags[i];
		var tag;

		if (Tag.allTags[t])
			tag = Tag.allTags[t];
		else
		{
			tag = tagFactory(t);
			Tag.allTags[t] = tag;
		}

		if (!tag)
		{
			console.log('failed to get tag from:', t);
			continue;
		}

		switch (tag.type)
		{
			case 'poster':
			case 'comm':
				this.posters.push(tag);
				break;

			case 'series':
				this.series = tag.tag;
				break;

			case 'cat':
			case 'category':
				this.category = tag;
				break;
		}
	}

	if (!this.category)
		this.category = miscTag;
};

Item.prototype.sortkey = function()
{
	return this.category.sortkey() + '_' + this.bookmark.time + '_' + this.bookmark.description;
};

Item.prototype.posterlinks = function(ljtags)
{
	if (this.posters.length === 1)
		return this.posters[0].link(ljtags);
	if (this.posters.length === 0)
		return '';

	var result = _.map(this.posters, function(p)
	{
		return p.link(ljtags);
	});

	return result.join(' &amp; ');
};

Item.prototype.link = function()
{
	if (!this.bookmark.description && !this.bookmark.href)
		return '[none]';

	var desc = (this.bookmark.description ? this.bookmark.description : this.bookmark.href);
	return util.format('<a href="%s">%s</a>', this.bookmark.href, desc);
};

Item.prototype.serieslinks = function()
{
	var result = this.link();
	if (this.next)
		result += ', ' + this.next.serieslinks();
	return result;
};

Item.prototype.entry = function(ljtags)
{
	var result;
	if (this.posters.length > 0)
		result = '+ ' + this.posterlinks(ljtags) + ':';
	else
		result = '+';

	if (this.series && this.next)
		result += ' ' + this.serieslinks();
	else
		result += ' ' + this.link();

	if (this.bookmark.extended)
		result += ' - ' + this.bookmark.extended;

	return result;
};

Item.comparator = function(left, right)
{
	var lkey = left.sortkey();
	var rkey = right.sortkey();

	if (lkey < rkey)
		return -1;
	if (rkey > lkey)
		return 1;
	return 0;
};

module.exports =
{
	Item:     Item,
	Tag:      Tag,
	Category: Category,
	Poster:   Poster,
}
