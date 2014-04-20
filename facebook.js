function addDownloadLinkToFB(action){

	
	var page = getPage(); 
	console.log("action : "+action);

	if(page.indexOf("sd_src")<0){
		console.log("sd_src itself is not there for action : "+action);
		return;
	}

	console.log("--------------------------------");
	console.log("FB Video download link");
	var sd_link = parseResponse(page,"sd_src","thumbnail_src");
	console.log("SD Link : " + sd_link);
	var hd_link = parseResponse(page,"hd_src","is_hds");
	console.log("HD Link : " + hd_link);
	console.log("--------------------------------");

	
	
	if((sd_link.indexOf("http")<0) && (hd_link.indexOf("http"))){
		console.log("SD and HD link not available");return;
	}

	//Video is opened in a classical page
	if(action=="classical"){
		console.log("Trying to add download link in FB classical page");

		var quality = document.createElement('b');
		quality.appendChild(document.createTextNode('Video Quality : ')); 
	
		var aTag = document.createElement('a');
		// aTag.setAttribute('href',sd_link);
		aTag.href = sd_link;
		aTag.innerHTML = "Download";
		aTag.onclick = function(){startDownload();return false;};
			
		if(!hd_link){
			var array = ["Standard"];	
		}else{
			var array = ["Standard","High"];	
		}

		//Create and append select list
		var selectList = document.createElement("select");
		selectList.setAttribute("id", "mySelect");

		//Adding the onchange event only when HD link is available
		if(hd_link){
			selectList.addEventListener(
		     'change',
		     function() {
		     	console.log("changing the link");
		     	var downloadLink = this.selectedIndex ? hd_link : sd_link;
		     	aTag.setAttribute('href',downloadLink);
		     },
		     false
			);	
		}
		
		
		//Create and append the options
		for (var i = 0; i < array.length; i++) {
		    var option = document.createElement("option");
		    option.setAttribute("value", array[i]);
		    option.text = array[i];
		    selectList.appendChild(option);
		}

		

		//Video Quality : <combobox> <hyperLink>
		
		
		$("#u_0_4").prepend('<div id="dawn_downloader">');
		$("#dawn_downloader").append(quality);
		$("#dawn_downloader").append(selectList);
		//Adding the below item just to have a space between the combobox and the hyperlink. May be not a good idea. :(
		$("#dawn_downloader").append(" ");
		$("#dawn_downloader").append(aTag);


		console.log("anchor tag is appended in page");
	}else{

		
		console.log("Trying to add download link in FB Theatre effect page");

		// var quality = document.createTextNode('  ');
		var aTag = document.createElement('a');
		// aTag.setAttribute('href','');
		// aTag.setAttribute('onclick','');
		aTag.onclick = function() {test();};
		aTag.innerHTML = "Download";
		// $('#fbPhotoSnowliftActions div').append('<a class="fbPhotoSnowliftDropdownButton _p uiButton" href="#" role="button" aria-haspopup="true" aria-expanded="true" rel="toggle" id="u_jsonp_5_k" aria-owns="u_k_0"><span class="uiButtonText">Download</span></a>');
		$('#fbPhotoSnowliftActions div').append(aTag); 
	}

}

function getFileName(){
	//Using the page title as the file's name
	var fileName = document.getElementsByTagName("title")[0].innerHTML;	
	var reservedChars = ["|","\\","?","*","<","\"",":",">","/","%"];
	//Removing invalid file characters if any.  
	for (var i = 0; i < reservedChars.length; i++) {
			//Replacing all reserved characters with underscore
            fileName = fileName.replace(reservedChars[i], "_");
	}
	return fileName+".mp4";
}

function startDownload(){

	var a = document.createElement('a');
	a.href = $('#dawn_downloader a').attr('href');
	a.download = getFileName(); // Filename
	a.click();
}

/*
function withWait(i,callback,callback_arg) {          
   setTimeout(function () { 
      console.log(new Date());
      //  your code here                
      callback(callback_arg);
      if (--i) withWait(i,callback,callback_arg);      //  decrement i and call myLoop again if i > 0
   }, 1000)
}
*/


function parseResponse(page,start,end){

	var link = page.substring(page.indexOf(start),page.indexOf(end));
	console.log("start to end -------------->"+link);
	link = unescape(JSON.parse('"' + link + '"'));
	console.log("After escaping URL : ");
	console.log(link);
	link = link.substring(link.indexOf("https"),link.lastIndexOf("\",\""));
	return link;
}


function getPage(){
	return document.body.outerHTML;
}


addDownloadLinkToFB("classical");


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    
    console.log("Received message from background page");

    if (request.greeting == "UPDATE"){

      if((getPage().indexOf("fbPhotoSnowliftDropdownButton"))>0){
      	// withWait(1,addDownloadLinkToFB,"theatre");
      	setTimeout(addDownloadLinkToFB,1000,"theatre");	
      	console.log("will check for download link in 1 sec");
      }
      
    }
  });


