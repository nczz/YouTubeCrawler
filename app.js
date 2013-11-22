var Crawler = require("crawler").Crawler;
var https = require('https');

var youtubeURL = "https://www.youtube.com/watch?v=";

var c = new Crawler({
	"maxConnections":10,

	// This will be called for each crawled page
	"callback":function(error,result,$) {
		 $(".related-video").each(function(index,a) {
			var ID = a.href.substr(32);
			//console.log("ID: "+ID);
			c.queue([{
				"uri":'https://gdata.youtube.com/feeds/api/videos/'+ID+'?v=2&alt=json',
				"jQuery":false,
				// The global callback won't be called
				"callback":function(error,result) {
					if (error) return;
					var entry = JSON.parse(result.body).entry;
					if (entry.yt$statistics.viewCount > 100000){
						console.log('title:'+entry.title.$t+' viewerCount:'+entry.yt$statistics.viewCount+' ID:'+entry.media$group.yt$videoid.$t);
					}
					c.queue(a.href);
				}
			}]);
			
		});
	}
});

c.queue([{
	"uri":"https://gdata.youtube.com/feeds/api/videos?q=新聞&orderby=viewCount&start-index=11&max-results=10&v=2&alt=json",
	"jQuery":false,
	// The global callback won't be called
	"callback":function(error,result) {
		if (error) return;
		var entry = JSON.parse(result.body).feed.entry;
		for (var i=0; i<entry.length; ++i){
			//c.queue(entry[i].media$group.yt$videoid.$t);
			if (entry[i].yt$statistics.viewCount > 100000){
				console.log('title:'+entry[i].title.$t+' viewerCount:'+entry[i].yt$statistics.viewCount+' ID:'+entry[i].media$group.yt$videoid.$t);
				//c.queue(entry[i].link[0].href);
				c.queue(youtubeURL+entry[i].media$group.yt$videoid.$t);
			}
		}
	}
}]);