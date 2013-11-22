function searchBtnEvent(){
	var keyword = $('#keyword').val();
	if (keyword=='') return;
	var selectViewerCount = parseInt($('#viewerCount').val());
	var selectPages = parseInt($('#pages').val());
	if (isNaN(selectViewerCount) || isNaN(selectPages)) return;
	$.ajax({
	  url: "https://gdata.youtube.com/feeds/api/videos",
	  dataType: 'jsonp',  //use jsonp data type in order to perform cross domain ajax
	  crossDomain: true,
	  data: {
	  	"q":keyword,
	  	"orderby":"viewCount",
	  	"start-index":50*(selectPages-1)+1,
	  	"max-results":50,
	  	"v":2,
	  	"alt":"json"},
	  success: function(resp){
	  	console.log(resp);
	  	var posts = resp.feed.entry;
	  	var str = '<table border="1"><tbody><tr><th>標題</th><th>點閱數</th><th>連結</th></tr>';
		var count = 0;
	  	for (var i=0; i<posts.length; ++i){
	  		console.log(posts[i]);
	  		try{
	  			if (posts[i].yt$statistics.viewCount>selectViewerCount){
	  				str+='<tr><td>'+posts[i].title.$t+'</td><td>'+posts[i].yt$statistics.viewCount+'</td><td><a target="_blank" href="https://www.youtube.com/watch?v='+posts[i].media$group.yt$videoid.$t+'">點此另開</a></td></tr>';
	  				++count;
	  			}
	  			
	  		} catch(e){
	  			console.log(e);
	  		}
	  	}
	  	$('#result').html('符合條件的有：'+count+' 筆<br />'+str+'</tbody></table>');
	  },
	  error: function(err){
	  	console.log(err);
	  }
	});
}

function pagesOptionEvent(){
	$("#search").trigger("click");
}

function eventBinding(){
	$('#search').click(searchBtnEvent);
	$('#pages').change(pagesOptionEvent);
}

function main(){
	eventBinding();
}

$(document).ready(main);
