var placeholders = ["Find your city and press enter", "Living in Antwerp? Try 'Antwerp' and hit enter ;)", "Come on, have a look!", "Try something like 'San Francisco', or 'Brussels'.."], last_placeholder_index = 0;
$(document).ready(function(){
	if($(window).width() >= "768"){
		initiateNumbers();
		setTimeout(function(){
			//Clear the placeholder
			clearPlaceholder();
		}, 3000);
	}else{
		$("#searchForPlace").attr("placeholder", '"Antwerp"');
	}
});

function clearPlaceholder(){
	var intervalVar = setInterval(function(){
		var placeholder_text = $("#searchForPlace").attr("placeholder");
		if(placeholder_text == ""){
			clearInterval(intervalVar);
			fillPlaceholder();
		}else{
			$("#searchForPlace").attr("placeholder", placeholder_text.substring(0, placeholder_text.length-1));
		}
	}, 50);
}

function fillPlaceholder(){
	var new_placeholder_index;
	do{
		new_placeholder_index = Math.floor(Math.random() * placeholders.length);
	}while(new_placeholder_index == last_placeholder_index);
	last_placeholder_index = new_placeholder_index;
	var count = 1;
	var adding = setInterval(function(){
		var placeholder_text = $("#searchForPlace").attr("placeholder");
		if(placeholder_text == placeholders[new_placeholder_index]){
			clearInterval(adding);
			setTimeout(function(){
				clearPlaceholder();
			}, 3000);
		}else{
			$("#searchForPlace").attr("placeholder", placeholders[new_placeholder_index].substring(0, count));
			count++;
		}
	}, 50);
}

function fillElement(element, value, from = "left"){
	$(element).html(" ");count = 0;
	value = value.toString();
	var adding = setInterval(function(){
		if(count > value.length){
			clearInterval(adding);
			return true;
		}else{
			switch(from){
				case "left":
				default:
					$(element).html(value.substring(0, count));
					break;
				case "right":
					$(element).html(value.substring(count, (value.length-count)));
					break;
			}
			count++;
		}
	}, 50);
}

function initiateNumbers(){
	fillElement($("#session"), Math.floor(Math.random() * 100000000)+536135, "right");
	fillElement($("#userid"), Math.floor(Math.random() * 100000000)+53613, "right");
	var duration = 0;$("#duration").html(readTime(duration));
	setInterval(function(){
		duration++;
		$("#duration").html(readTime(duration));
	}, 1000);
}

function readTime(duration){
	var h=0,m=0,s=0;
	s = duration % 60;
	m = Math.floor(duration/60) % 60;
	h = Math.floor(duration/(60*60)) % 24;
	if(s < 10){
		s = "0" + s;
	}
	if(m < 10){
		m = "0" + m;
	}
	if(h < 10){
		h = "0" + h;
	}
	return h + ":" + m + ":" + s;
}