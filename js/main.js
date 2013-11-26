var urlCount = 0;

function searchBtnEvent(){
	var keyword = $('#keyword').val().split('\n');
	if (keyword.length==1 && keyword[0]=='') return;
	var selectViewerCount = parseInt($('#viewerCount').val());
	var selectPages = parseInt($('#pages').val());
	if (isNaN(selectViewerCount) || isNaN(selectPages)) return;
	var count = 0;
	for (var i=0; i<keyword.length; ++i){
		if (keyword[i]!='')
		$.ajax({
		  url: "https://gdata.youtube.com/feeds/api/videos",
		  dataType: 'jsonp',  //use jsonp data type in order to perform cross domain ajax
		  crossDomain: true,
		  async: false,
		  data: {
		  	"q":keyword[i],
		  	"orderby":"viewCount",
		  	"start-index":50*(selectPages-1)+1,
		  	"max-results":50,
		  	"v":2,
		  	"alt":"json"},
		  success: function(resp){
		  	console.log(resp);
		  	var posts = resp.feed.entry;
		  	//var str = '<table border="1"><tbody><tr><th>標題</th><th>點閱數</th><th>連結</th></tr>';
			var str = '';
			//
		  	for (var i=0; i<posts.length; ++i){
		  		console.log(posts[i]);
		  		try{
		  			if (posts[i].yt$statistics.viewCount>selectViewerCount){
		  				//str+='<tr><td>'+posts[i].title.$t+'</td><td>'+posts[i].yt$statistics.viewCount+'</td><td><a target="_blank" href="https://www.youtube.com/watch?v='+posts[i].media$group.yt$videoid.$t+'">點此另開</a></td></tr>';
		  				++count;
		  				++urlCount;
		  				str += 'https://www.youtube.com/watch?v='+posts[i].media$group.yt$videoid.$t+'\n';
		  			}
		  			
		  		} catch(e){
		  			console.log(e);
		  		}
		  	}
		  	$('#resultURL').val(str+=$('#resultURL').val());//'符合條件的有：'+count+' 筆<br />'+str+'</tbody></table>'
		  	$('#result').html('本次搜尋結果數： '+count+' 筆，累計結果數：'+urlCount+' 筆');
		  },
		  error: function(err){
		  	console.log(err);
		  }
		});	
	}
}

function pagesOptionEvent(){
	$("#search").trigger("click");
}

function eventBinding(){
	$('#search').click(searchBtnEvent);
	$('#pages').change(pagesOptionEvent);
	$(".auto_select").mouseover(function(){ $(this).select();});
}

function main(){
	eventBinding();
}

$(document).ready(main);
