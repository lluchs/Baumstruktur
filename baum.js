
var Post = new Class({
	Implements: Options,
	options: {
		id: null,
		author: '',
		time: '',
		content: '',
		parent: null
	},
	
	width: 0,
	children: [],
	
	initialize: function(options) {
		this.setOptions(options);
	},
	
	// sucht und speichert rekursiv seine Kinder, passt sich entsprechend an
	getChildren: function(posts) {
		// alle Kinder herausfiltern
		var children = posts.filter(function(post) {
			return post.parent == this.options.id;
		}, this);
		
		// Objekte dieser Klasse erzeugen
		children.each(function(options) {
			var child = new Post(options);
			child.getChildren(posts);
			
			this.width += child.width + 10; // Abstand
			this.children.push(child);
		}, this);
		
		this.width = Math.max(this.width, 500);
	},
	
	toElement: function() {
		var id = this.options.id,
		author = this.options.author,
		time = this.options.time,
		content = this.options.content;
		
		// umgebendes article-Element
		var article = new Element('article', {
			id: 'pid' + id
		});
		// Headerbereicht für Postinformationen
		var header = new Element('header').inject(article);
		// Autor
		if(author) {
			new Element('b', { text: 'Von ' }).inject(header);
			new Element('i', { text: author + ' ' }).inject(header);
		}
		// Datum
		new Element('b', { text: 'Datum ' }).inject(header);
		header.appendText(time);
		// Paragraph für Inhalt
		new Element('p', { html: content }).inject(article);
		
		return article;
	}
});

var Connection = new Class({
	height: 100,
	initialize: function(width) {
		this.canvas = new Element('canvas', {
			width: width,
			height: this.height
		});
		this.context = this.canvas.getContext('2d');
		this.width = width;
	},
	
	addLine: function(toX) {
		with(this.context) {
			moveTo(this.width/2, 0);
			lineTo(toX, this.height);
		}
	},
	
	toElement: function() {
		with(this.context) {
			strokeStyle = "blue"; 
			stroke();
		}
		return this.canvas;
	}
});

var Tree = new Class({
	root: null,
	
	initialize: function(posts) {
		this.root = new Post(posts[0]);
		this.root.getChildren(posts);
	},
	
	walk: function(post, xpos) {
		// Umgebender Container. Feste, zuvor berechnete Breite, float:left
		// Enthält Artikel und seine Kinder
		var container = new Element('div', {
			styles: {
				width: post.width,
				//'float': 'left',
				'margin-left': '5px',
				'margin-right': '5px',
				display: 'inline-block',
				'vertical-align': 'top'
			}
		});
		// Post
		$(post).inject(container);
		
		
		var div = new Element('div', {
			styles: {
				'margin-top': '-5px'
			}
		}).inject(container);
		
		// Verbindungslinien
		var connect = new Connection(post.width);
		var x = 0;
		
		// Fügt alle Container der Kinder ein
		post.children.each(function(child) {
			connect.addLine(x + child.width/2 + 5);
			x += child.width;
			
			this.walk(child).inject(div);
		}, this);
		
		if(x>0)
			$(connect).inject(div, 'before');
		
		return container;
	},
	
	toElement: function() {
		return this.walk(this.root);
	}
});

window.addEvent('domready', function() {
	$(new Tree(posts_json)).inject($('tree'));
});
