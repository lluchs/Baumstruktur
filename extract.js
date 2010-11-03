
window.addEvent('domready', function() {
	var posts = [];
	$$('.frm.pst').each(function(node) {
		var post = {};
		// id
		post.id = node.id.replace(/pid/, '').toInt();
		
		var hcl = node.getElement('.hcl').get('text');
		// author
		var author = /Von (.+)/.exec(hcl);
		if(author)
			post.author = author[1].trim();
		
		// time
		post.time = /Datum (.+)/.exec(hcl)[1];
		
		// content
		post.content = node.getElement('.ccl').get('html').replace(/<img.+>/g, '');
		
		// parent
		var parent = null;
		if(node.parentElement.className == "brn")
			parent = node.parentElement.id.replace(/brn/, '').toInt();
		post.parent = parent;
		
		posts.push(post);
	});
	
	var output = new Element('textarea');
	output.set('text', JSON.encode(posts));
	output.inject(document.body, 'top');
});
