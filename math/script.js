	let websiteversion = localStorage?.getItem("version");

	if (websiteversion != "1") {
		localStorage.removeItem("studylog");
	}

	localStorage.setItem("version", "1");	
	
	//populate the question columns automatically
	for (let i=1; i<61; i++) {

		let string = `
			<div class="testquestionrow">
				<button class="testquestionbuttons" id="testquestionbutton${i}">${i}.</button>
				<select class="testquestionanswerselects" id="testquestionanswer${i}">
					<option value=""></option>
					<option value="A">A</option>
					<option value="B">B</option>
					<option value="C">C</option>
					<option value="D">D</option>
					<option value="E">E</option>
				</select>
			</div>`

		if (i < 21) {
			document.getElementById("questioncolumn1").insertAdjacentHTML("beforeend", string);
		} else if (i < 41) {
			document.getElementById("questioncolumn2").insertAdjacentHTML("beforeend", string);
		} else {
			document.getElementById("questioncolumn3").insertAdjacentHTML("beforeend", string);
		}
		
	}

	//populate the answer columns automatically
	for (let i=1; i<61; i++) {

		let string = `
			<div class="testquestionrow">
				<button class="testanswerbuttons" id="testanswerbutton${i}">${i}.</button>
				<span id="testanswer${i}"></span>
			</div>`

		if (i < 21) {
			document.getElementById("answercolumn1").insertAdjacentHTML("beforeend", string);
		} else if (i < 41) {
			document.getElementById("answercolumn2").insertAdjacentHTML("beforeend", string);
		} else {
			document.getElementById("answercolumn3").insertAdjacentHTML("beforeend", string);
		}

	}

	//this is setup for the different modes
	let questiontype, difficulty, year, mode, pkey, questionnum, imgpath, time, totaltime, accuracy, imgpathcheck, answervalue, currentquestion, interval, alertboxcondition, abouttime, timeelapsedstring, accuracystring, datetime, newlog;
	let questionstotal = 0
	let questionscorrect = 0
	let score = 0
	let timerstatus = 1
	let currentpage = "mainmenu"
	const numlist = [];
	const questionlist = [];
	var answerkey = {};
	fetch("answers.json")
	.then(response => response.json())
	.then(data => answerkey = data)
	

	//update these numbers you go, the number is the amount of questions in that category
	const maxnum = {
	invitationalsalgebra: "172",
	invitationalsgeometry: "144",
	invitationalscalculus: "92",
	invitationalsstatistics: "67",
	invitationalsanyquestions: "480",
	districtalgebra: "89",
	districtgeometry: "68",
	districtcalculus: "45",
	districtstatistics: "36",
	districtanyquestions: "240",
	regionalalgebra: "79",
	regionalgeometry: "71",
	regionalcalculus: "48",
	regionalstatistics: "42",
	regionalanyquestions: "240",
	statealgebra: "83",
	stategeometry: "74",
	statecalculus: "48",
	statestatistics: "35",
	stateanyquestions: "240",
	anytestalgebra: "423",
	anytestgeometry: "357",
	anytestcalculus: "233",
	anyteststatistics: "180",
	anytestanyquestions: "1200",
	}

	const categoryname = {
	invitationals: "Invitationals",
	district: "District",
	regional: "Regional",
	state: "State",
	anytest: "Any Test",
	algebra: "Algebra",
	geometry: "Geometry",
	statistics: "Statistics",
	calculus: "Calculus",
	anyquestions: "Any Questions",
	"invitational a": "Invitational A",
	"invitational b": "Invitational B"
	}

	//to main menu button code
	document.getElementById("mainmenubutton").addEventListener("click", function () {
		window.location.assign("/")
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

	//practice mode button code
	document.getElementById("practicebutton").addEventListener("click", function () {
	document.getElementById("mainmenu").style.display = "none";
	document.getElementById("practicesettings").style.display = "block";
	currentpage = "practicesettings";
	})

	//test mode button code
	document.getElementById("testbutton").addEventListener("click", function () {
	document.getElementById("mainmenu").style.display = "none";
	document.getElementById("testsettings").style.display = "block";
	currentpage = "testsettings";
	})

	//randomized test mode button code
	document.getElementById("rtestbutton").addEventListener("click", function () {
	document.getElementById("mainmenu").style.display = "none";
	document.getElementById("rtestsettings").style.display = "block";
	currentpage = "rtestsettings";
	})
		
	//this function and randomQuestion give a question that is not repeated
	function numList() {
	for (let i = 0; i < Number(maxnum[pkey]); i++) {
	var j = i + 1
	numlist[i] = j.toString();
	}}

	function randomQuestion() {
	var numtemp = Math.floor(Math.random() * Number(maxnum[pkey]));
	questionnum = numlist[numtemp];
	numlist.splice(numtemp, 1);
	var maxnumnew = Number(maxnum[pkey])-1
	maxnum[pkey] = maxnumnew.toString()
	}

	//this function creates a list of random questions for rtest mode
	function randomquestionListMaker() {
		pkey = difficulty + "algebra";
		numList();
		for (let i = 1; i < 22; i++) {
			randomQuestion();
			imgpath = "questions/practice/" + difficulty + "/" + "algebra" + "/" + questionnum + ".webp";
			questionlist[i] = imgpath
		}
		pkey = difficulty + "geometry";
		numlist.length = 0;
		numList();
		for (let i = 22; i < 40; i++) {
			randomQuestion();
			imgpath = "questions/practice/" + difficulty + "/" + "geometry" + "/" + questionnum + ".webp";
			questionlist[i] = imgpath
		}
		pkey = difficulty + "calculus";
		numlist.length = 0;
		numList();
		for (let i = 40; i < 52; i++) {
			randomQuestion();
			imgpath = "questions/practice/" + difficulty + "/" + "calculus" + "/" + questionnum + ".webp";
			questionlist[i] = imgpath
		}
		pkey = difficulty + "statistics";
		numlist.length = 0;
		numList();
		for (let i = 52; i < 61; i++) {
			randomQuestion();
			imgpath = "questions/practice/" + difficulty + "/" + "statistics" + "/" + questionnum + ".webp";
			questionlist[i] = imgpath
		}
	}

	//this function creates a questionlist for regular test mode
	function questionListMaker () {
		for (let i=1; i < 61; i++) {
		imgpath = "questions/test/" + year + "/" + difficulty + "/" + i.toString() + ".webp";
		questionlist[i] = imgpath
		}
	}

	//these two make the current question selector and the selector on the right for the current question match
	const testquestionanswercurrentselect = document.getElementById("testquestionanswercurrent");

	document.getElementById("testquestioncolumncontainer").addEventListener("change", function(event) {
		if (event.target.id.replace("testquestionanswer", "") === currentquestion) {
			testquestionanswercurrentselect.value = event.target.value;
		}
	})

	testquestionanswercurrentselect.addEventListener("change", function() {
		document.getElementById("testquestionanswer" + currentquestion).value = testquestionanswercurrentselect.value;
	})

	//this function creates a timer
	function testtimer() {
		//time after first timer update, set starting time in html
		let	testtimer1 = 39
		let	testtimer2 = 59
		interval = setInterval(function() {
			if (timerstatus == 1) {
				document.getElementById("testtimer1").textContent = String(testtimer1).padStart(2,"0");
				document.getElementById("testtimer2").textContent = String(testtimer2).padStart(2,"0");
				if (testtimer1 == 0 && testtimer2 == 0) {
					clearInterval(interval);
					setTimeout(function() {
					testEnd();
					},1000)
				}
				testtimer2 -=1
				if (testtimer2 == -1) {
					testtimer2 = 59;
					testtimer1 -=1;
				}
			}
		},1000)
	}

	//timer pause functions
	function testTimerPausePlay() {
	if (timerstatus == 1) {
		timerstatus = 0;
		document.getElementById("testpausebutton").src = "assets/images/playbutton.png"
	} else {
		timerstatus = 1;
		document.getElementById("testpausebutton").src = "assets/images/pausebutton.png"
	}
	}
	document.getElementById("testpausebutton").addEventListener("click", testTimerPausePlay);

	//this function builds the the log for the current session
	function logBuilder() {
		const date = new Date(datetime)
		const datestring = date.toLocaleDateString("default", {month: "long", day: "numeric", year: "numeric"}) + " " + date.toLocaleTimeString("default", {hour: "numeric", minute: "numeric"})
		let modeadd
		if (mode === "Practice") {
			modeadd = "(" + categoryname[difficulty] + ", " + categoryname[questiontype] + ")";
		} else if (mode === "Test") {
			modeadd = "(" + categoryname[difficulty] + ", " + year + ")";
		} else {
			modeadd = "(" + categoryname[difficulty] + ")";
		}
		newlog = "Subject: Mathematics\n"
		newlog += "Mode: " + mode + " " + modeadd + "\n";
		newlog += "Date: " + datestring + "\n";
		if (mode === "Practice") {
			newlog += "Time Spent: " + timeelapsedstring + "\n";
		} else {
			newlog += "Score: " + String(score) + "\n";
		}
		newlog += "Correct Answers: " + String(questionscorrect) + "\n";
		newlog += "Questions Attempted: " + String(questionstotal) + "\n";
		newlog += "Accuracy: " + accuracystring;
	}

	//this function saves the log to local storage
	function logSave () {
		let currentlog = localStorage?.getItem("studylog");
		if (currentlog) {
			currentlog = newlog + "\n\n\n" + currentlog;
			let logcap = currentlog.split("\n\n\n", 50);
			currentlog = logcap.join("\n\n\n")
			localStorage.setItem("studylog", currentlog)
		} else {
			localStorage.setItem("studylog", newlog)
		}
	}

	//practice mode start button code
	function startPractice() {
		difficulty = document.querySelector('input[name="difficultyp"]:checked')?.value;
		questiontype = document.querySelector('input[name="questiontypep"]:checked')?.value;
		mode = "Practice";
		pkey = difficulty + questiontype;
		
		if (!questiontype || !difficulty) {
			document.getElementById("settingsalertbox").style.display = "flex";
			setTimeout(function () {
			document.getElementById("settingsalertbox").style.display = "none"
			}, 3000);
		} else {
		currentpage = "practicepage";
		document.getElementById("practicesettings").style.display = "none";
		document.getElementById("practicepage").style.display = "block";
		window.numList()
		window.randomQuestion()
		imgpath = "questions/practice/" + difficulty + "/" + questiontype + "/" + questionnum + ".webp";
		document.getElementById("practicequestion").src = imgpath;
		time = totaltime = datetime = Date.now();
		document.addEventListener("keydown", function(e) {
			if (e.key === "ArrowRight") {
				practiceNext()
			}
		})
		}
	}
	document.getElementById("startbuttonp").addEventListener("click", startPractice);

	//part of start test code for regular test
	function startTest() {
		difficulty = document.querySelector('input[name="difficultyt"]:checked')?.value;
		year = document.querySelector('input[name="yeart"]:checked')?.value;
		alertboxcondition = (!difficulty || !year);
		window.questionListMaker();
		mode = "Test";
	}
	
	//part of start test code for random test
	function startRTest() {
		difficulty = document.querySelector('input[name="difficultyr"]:checked')?.value;
		alertboxcondition = (!difficulty);
		window.randomquestionListMaker();
		mode = "Randomized Test";
	}

	//test mode start button code
	function startAnyTest() {
		currentquestion = "1"
		
		if (alertboxcondition) {
			document.getElementById("settingsalertbox").style.display = "flex";
			setTimeout(function () {
			document.getElementById("settingsalertbox").style.display = "none"
			}, 3000);
		} else {
		datetime = Date.now();
		currentpage = "testpage";
		imgpath = questionlist[currentquestion];
		document.getElementById("currenttestquestion").textContent = "(" + currentquestion + ".)";
		document.getElementById("testquestion").src = imgpath;

		document.getElementById("testquestioncolumncontainer").addEventListener("click", function(e) {
			if (e.target.classList.contains("testquestionbuttons")) {
				currentquestion = e.target.id.replace("testquestionbutton","")
				imgpath = questionlist[currentquestion];
				testquestionanswercurrentselect.value = document.getElementById("testquestionanswer" + currentquestion).value;
				document.getElementById("currenttestquestion").textContent = "(" + currentquestion + ".)";
				document.getElementById("testquestion").src = imgpath;
			}
		})
		
		document.addEventListener("keydown", function(e) {
			if (e.key === "ArrowLeft" && currentpage === "testpage") {
				testBack();
				e.preventDefault();
			}
			if (e.key === "ArrowRight" && currentpage === "testpage") {
				testNext();
				e.preventDefault();
			}
		})

		document.getElementById("testsettings").style.display = "none";
		document.getElementById("rtestsettings").style.display = "none";
		document.getElementById("testpage").style.display = "block";
		testtimer()
		}
		
	}
	document.getElementById("startbuttont").addEventListener("click", function() {
		window.startTest();
		window.startAnyTest();
	});
	document.getElementById("startbuttonr").addEventListener("click", function() {
		window.startRTest();
		window.startAnyTest();
	});

	//this is for practice mode buttons
	function questioncountpractice () {
		if (imgpath != imgpathcheck) {
			if (answervalue) {
				questionscorrect += 1
				questionstotal += 1
			} else {
				questionstotal += 1
			}
			imgpathcheck = imgpath
		}
	}

	function practiceSubmit() {
	if (document.querySelector('input[name="practiceanswer"]:checked')?.value) {
	time = Date.now() - time;
	if (time > 60000) {
		document.getElementById("timeelapsedcorrect").textContent = Math.round(time / 60000 * 100) / 100 + " minutes";
		document.getElementById("timeelapsedincorrect").textContent = Math.round(time / 60000 * 100) / 100 + " minutes";
	} else {
		document.getElementById("timeelapsedcorrect").textContent = Math.round(time / 1000 * 100) / 100 + " seconds";
		document.getElementById("timeelapsedincorrect").textContent = Math.round(time / 1000 * 100) / 100 + " seconds";
	}
	answervalue = (answerkey[imgpath] === document.querySelector('input[name="practiceanswer"]:checked')?.value)
	if (answervalue) {
		document.querySelectorAll('input[name="practiceanswer"]').forEach(rb => rb.checked = false);
		document.getElementById("practiceanswercorrect").style.display = "flex";
		setTimeout(function () {
		document.getElementById("practiceanswercorrect").style.display = "none"
		}, 3500);
	} else {
		document.querySelectorAll('input[name="practiceanswer"]').forEach(rb => rb.checked = false);
		document.getElementById("correctanswer").textContent = answerkey[imgpath];
		document.getElementById("practiceanswerincorrect").style.display = "flex";
		setTimeout(function () {
		document.getElementById("practiceanswerincorrect").style.display = "none"
		}, 3500);
	}
	window.questioncountpractice()
	time = Date.now() + 3500; //adjust time to account for the alert box display time
	}
	}

	function practiceNext() {
	if (document.getElementById("practicepage").style.display === "block") {
		document.querySelectorAll('input[name="practiceanswer"]').forEach(rb => rb.checked = false);
		if (maxnum[pkey] != "0") {
			randomQuestion();
			imgpath = "questions/practice/" + difficulty + "/" + questiontype + "/" + questionnum + ".webp";
			document.getElementById("practicequestion").src = imgpath;
		} else {
			totaltime = Date.now() - totaltime
			document.getElementById("questionscomplete").style.display = "flex";
			setTimeout(function () {
				document.getElementById("questionscomplete").style.display = "none";
				document.getElementById("practicepage").style.display = "none";
				document.getElementById("practiceend").style.display = "block";
				document.getElementById("questionsattemptedpractice").textContent = questionstotal;
				document.getElementById("questionscorrectpractice").textContent = questionscorrect;
				document.getElementById("accuracypractice").textContent = Math.round(questionscorrect / questionstotal * 1000) / 10 + "%";
				if (totaltime > 60000) {
				document.getElementById("timeelapsedpractice").textContent = Math.round(totaltime / 60000 * 100) / 100 + " minutes";
				} else {
				document.getElementById("timeelapsedpractice").textContent = Math.round(totaltime / 1000 * 100) / 100 + " seconds";
				}
			}, 5000);
		}
		time = Date.now();
	}
	}
	function practiceEndSession () {
		currentpage = "practiceend";
		totaltime = Date.now() - totaltime
		if (totaltime > 60000) {
			timeelapsedstring = String(Math.round(totaltime / 60000 * 100) / 100) + " minutes";
		} else {
			timeelapsedstring = String(Math.round(totaltime / 1000 * 100) / 100) + " seconds";
		}
		accuracy = Math.round(questionscorrect / questionstotal * 1000) / 10;
		if (!isNaN(accuracy)) {
			accuracystring = String(accuracy) + "%";
		} else {
			accuracystring = "N/A";
		}
		window.logBuilder();
		window.logSave();
		document.getElementById("practicepage").style.display = "none";
		document.getElementById("practiceend").style.display = "block";
		document.getElementById("questionsattemptedpractice").textContent = questionstotal;
		document.getElementById("questionscorrectpractice").textContent = questionscorrect;
		document.getElementById("accuracypractice").textContent = accuracystring;
		document.getElementById("timeelapsedpractice").textContent = timeelapsedstring;
	}

	document.getElementById("psubmit").addEventListener("click", practiceSubmit);
	document.getElementById("pnext").addEventListener("click", practiceNext);
	document.getElementById("pend").addEventListener("click", practiceEndSession);

	//test mode functions below

	function testNext () {
		if (Number(currentquestion) < 60 && document.getElementById("testpage").style.display === "block") {
			num = Number(currentquestion);
			num += 1;
			currentquestion = num.toString();
			imgpath = questionlist[currentquestion];
			testquestionanswercurrentselect.value = document.getElementById("testquestionanswer" + currentquestion).value;
			document.getElementById("currenttestquestion").textContent = "(" + currentquestion + ".)";
			document.getElementById("testquestion").src = imgpath;
		}
	}

	function testBack () {
		if (Number(currentquestion) > 1 && document.getElementById("testpage").style.display === "block") {
			num = Number(currentquestion);
			num -= 1;
			currentquestion = num.toString();
			imgpath = questionlist[currentquestion];
			testquestionanswercurrentselect.value = document.getElementById("testquestionanswer" + currentquestion).value;
			document.getElementById("currenttestquestion").textContent = "(" + currentquestion + ".)";
			document.getElementById("testquestion").src = imgpath;
		}
	}

	function testEnd() {
		clearInterval(interval);
		currentpage = "testend";
		document.getElementById("testpage").style.display = "none";
		document.getElementById("testend").style.display = "block";
		for (let i=1; i<61; i++) {
			answer = document.querySelector('select[id="testquestionanswer'+ i.toString() +'"]').value;
			imgpath = questionlist[i];
			correctanswer = answerkey[imgpath];
			document.getElementById("testanswer"+i.toString()).textContent = correctanswer;
			if (!answer) {
				document.getElementById("testanswerbutton"+i.toString()).style.color = "black"
			} else if (answer === correctanswer) {
				score += 6
				questionstotal += 1
				questionscorrect += 1
				document.getElementById("testanswerbutton"+i.toString()).style.color = "green"
			} else {
				score -= 2
				questionstotal += 1
				document.getElementById("testanswerbutton"+i.toString()).style.color = "red"
			}
		}
		accuracy = Math.round(questionscorrect / questionstotal * 1000) / 10;
		if (!isNaN(accuracy)) {
			accuracystring = String(accuracy) + "%";
		} else {
			accuracystring = "N/A";
		}
		document.getElementById("testscore").textContent = score
		document.getElementById("accuracytest").textContent = accuracystring;
		document.getElementById("questionsattemptedtest").textContent = questionstotal;
		document.getElementById("questionscorrecttest").textContent = questionscorrect;
		window.logBuilder();
		window.logSave();

		document.getElementById("testanswercolumncontainer").addEventListener("click", function(e) {
			if (e.target.classList.contains("testanswerbuttons")) {
				currentquestion = Number(e.target.id.replace("testanswerbutton",""));
				answer = document.querySelector('select[id="testquestionanswer'+ currentquestion.toString() +'"]').value;
				imgpath = questionlist[currentquestion];
				document.getElementById("correctanswertestimage").textContent = answerkey[imgpath];
				document.getElementById("youranswertestimage").textContent = answer
				if (!answer) {
					document.getElementById("youranswertestimage").textContent = "None"
				}
				document.getElementById("questionboxtestresults").src = imgpath;
				currentpage = "testendimage";
				document.getElementById("testend").style.display = "none";
				document.getElementById("testendimage").style.display = "block";
			}
		})
	}

	function testEndImage2testEnd() {
		currentpage = "testend";
		document.getElementById("testendimage").style.display = "none";
		document.getElementById("testend").style.display = "block";
	}

	document.getElementById("tnext").addEventListener("click", testNext);
	document.getElementById("tback").addEventListener("click", testBack);
	document.getElementById("endtestbutton").addEventListener("click", testEnd);
	document.getElementById("testendimagebutton").addEventListener("click", testEndImage2testEnd);
