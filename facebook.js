
var LOG_LEVEL = 1;

function addDownloadLinkToFB(action){

	//Checking if dawn_downloader element already present in the page
	if(document.getElementById("dawn_downloader")!=null){
		log("Already download link is appended to the page. Returning to the base now ...");
		return;
	}

	var page = getPage(); 
	log("action : "+action);

	if(page.indexOf("sd_src")<0){
		log("sd_src itself is not there for action : "+action);
		return;
	}

	

	log("--------------------------------");
	log("FB Video download link");
	var sd_link = parseResponse(page,"sd_src","thumbnail_src");
	log("SD Link : " + sd_link);
	var hd_link = parseResponse(page,"hd_src","is_hds");
	log("HD Link : " + hd_link);
	log("--------------------------------");

	
	//If by chance, SD and HD link missed...
	if((sd_link.indexOf("http")<0) && (hd_link.indexOf("http"))){
		log("SD and HD link not available");return;
	}

	//Format of the Dawn_Downloader as below
	//Video Quality : <combobox> <hyperLink>

	var quality = document.createElement('b');
	quality.appendChild(document.createTextNode('Video Quality : ')); 

	var aTag = document.createElement('a');
	aTag.href = sd_link;
	aTag.innerHTML = "Download";
	aTag.onclick = function(){startDownload();return false;};
		
	var video_defn = null;
	//If HD link is not available, then appending only 'Standard' definition alone 	
	if(!hd_link){
		video_defn = ["Standard"];	
	}else{
		video_defn = ["Standard","High"];	
	}

	//Create and append select list
	var selectList = document.createElement("select");
	selectList.setAttribute("id", "mySelect");

	//Adding the onchange event only when HD link is available
	if(hd_link){
		selectList.addEventListener(
	     'change',
	     function() {
	     	log("changing the link");
	     	var downloadLink = this.selectedIndex ? hd_link : sd_link;
	     	aTag.setAttribute('href',downloadLink);
	     },
	     false
		);	
	}
	
	//Create and append the options
	for (var i = 0; i < video_defn.length; i++) {
	    var option = document.createElement("option");
	    option.setAttribute("value", video_defn[i]);
	    option.text = video_defn[i];
	    selectList.appendChild(option);
	}

	//The variable which will be point to the HTML element onto which append will happen
	var dawn_fb_entry_element = null;
	//Video is opened in a classical page
	if(action=="classical"){
		log("Trying to add download link in FB classical page");
		dawn_fb_entry_element = "#fbPhotoPageFeedback";
	}
	//Video is opened in the theatre effect page
	else{
		log("Trying to add download link in FB Theatre effect page")
		dawn_fb_entry_element = "#fbPhotoSnowliftActions";
	}

	$(dawn_fb_entry_element).prepend('<div id="dawn_downloader">');
	$("#dawn_downloader").append(quality);
	$("#dawn_downloader").append(selectList);
	//Adding the below item just to have a space between the combobox and the hyperlink. May be not a good idea. :(
	$("#dawn_downloader").append(" ");
	$("#dawn_downloader").append(aTag);
	log("Download link is appended successfully. :)");
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

function parseResponse(page,start,end){

	var link = page.substring(page.indexOf(start),page.indexOf(end));
	link = unescape(JSON.parse('"' + link + '"'));
	link = link.substring(link.indexOf("https"),link.lastIndexOf("\",\""));
	link = link.replace(/\\/g,"");
	return link;
}


function getPage(){
	return document.body.outerHTML;
}

function log(info){if(LOG_LEVEL){console.log(info)};}

addDownloadLinkToFB("classical");


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    
    log("Received message from background page");

    if (request.greeting == "UPDATE"){

      	if((getPage().indexOf("fbPhotoSnowliftDropdownButton"))>0){
      		setTimeout(addDownloadLinkToFB,1000,"theatre");	
      		log("will check for download link in 1 sec");
      	}
      
    }
});


