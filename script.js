	let websiteversion = localStorage?.getItem("version");

	if (websiteversion != "1") {
		localStorage.removeItem("studylog");
	}

	localStorage.setItem("version", "1");	

	currentpage="mainmenu"
	
	//to main menu button code
	document.getElementById("mainmenubutton").addEventListener("click", function () {
	location.reload();
	})

	//about this site button code
	document.getElementById("aboutbutton").addEventListener("click", function () {
	document.getElementById(currentpage).style.display = "none";
	document.getElementById("studylog").style.display = "none";
	document.getElementById("aboutthissite").style.display = "block";
	if (currentpage === "testpage" && timerstatus == 1) {
		window.testTimerPausePlay();
	}
	if (currentpage === "practicepage"){
		abouttime = Date.now();
	}
	})

	//about this site back button code
	document.getElementById("aboutthissiteback").addEventListener("click", function () {
	document.getElementById("aboutthissite").style.display = "none";
	document.getElementById(currentpage).style.display = "block";
	if (abouttime) {
		abouttime = Date.now() - abouttime;
		time += abouttime;
		totaltime += abouttime;
	}
	})

	//study log button code
	document.getElementById("logbutton").addEventListener("click", function () {
	document.getElementById(currentpage).style.display = "none";
	document.getElementById("aboutthissite").style.display = "none";
	document.getElementById("studylog").style.display = "block";
	if (currentpage === "testpage" && timerstatus == 1) {
		window.testTimerPausePlay();
	}
	if (currentpage === "practicepage"){
		abouttime = Date.now();
	}
	let studylog = localStorage?.getItem("studylog");
	if (studylog) {
		document.getElementById("logbox").textContent = studylog;
	} else {
		document.getElementById("logbox").style.textAlign = "center";
		document.getElementById("logbox").textContent = "Nothing here yet.";
	}
	})

	//study log back button code
	document.getElementById("studylogback").addEventListener("click", function () {
	document.getElementById("logbox").style.textAlign = "left";
	document.getElementById("studylog").style.display = "none";
	document.getElementById(currentpage).style.display = "block";
	if (abouttime) {
		abouttime = Date.now() - abouttime;
		time += abouttime;
		totaltime += abouttime;
	}
	})

	//math button code
	document.getElementById("mathbutton").addEventListener("click", function () {
		window.location.assign("/math")
	})

	//science button code
	document.getElementById("sciencebutton").addEventListener("click", function () {
		window.location.assign("/science")
	})

	//calculator button code
	document.getElementById("calculatorbutton").addEventListener("click", function () {
		window.location.assign("/calculator")
	})
		
