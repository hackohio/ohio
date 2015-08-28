
// QUERIES

var faq = 'https://docs.google.com/spreadsheets/d/1QDJP4So8Tz8z1DF9YtOuSq78OyQ6qAw5A9PB3MWZUqY/edit$gid=0'


function qEvents(selector) {
	var query = 'select A, B';

	sheetrock({
		url: faq,
		query: query,
		callback: function(error, options, response) {
			console.log(response.raw);
		}
	});
};


qEvents();