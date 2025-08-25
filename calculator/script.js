	let websiteversion = localStorage?.getItem("version");

	if (websiteversion != "1") {
		localStorage.removeItem("studylog");
	}

	localStorage.setItem("version", "1");	

	let answers = []



	for (let i=1; i < 71; i++) {
		//fill test drop down with numbers
		document.getElementById("testquestionanswercurrent").insertAdjacentHTML("beforeend", `<option value="${i}" id="testoption${i}">${i}</option>\n`)
		//fill review drop down with numbers
		document.getElementById("testanswercurrent").insertAdjacentHTML("beforeend", `<option value="${i}" id="reviewoption${i}">${i}</option>\n`)
		//fill test answer list with null
		answers[i] = ""
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
	anytestanyquestions: "1750",
	anytestpunch: "875",
	anytestword: "525",
	anytestgeometry: "350",
	invitationalsanyquestions: "700",
	invitationalspunch: "350",
	invitationalsword: "210",
	invitationalsgeometry: "140",
	districtanyquestions: "350",
	districtpunch: "175",
	districtword: "105",
	districtgeometry: "70",
	regionalanyquestions: "350",
	regionalpunch: "175",
	regionalword: "105",
	regionalgeometry: "70",
	stateanyquestions: "350",
	statepunch: "175",
	stateword: "105",
	stategeometry: "70",
	}

	const categoryname = {
	invitationals: "Invitationals",
	district: "District",
	regional: "Regional",
	state: "State",
	anytest: "Any Test",
	punch: "Punch Problems",
	geometry: "Geometry",
	word: "Word Problems",
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
		pkey = difficulty + "punch";
		numList();
		for (let i = 1; i < 36; i++) {
			randomQuestion();
			imgpath = "questions/practice/" + difficulty + "/" + "punch" + "/" + questionnum + ".webp";
			questionlist[i] = imgpath
		}
		pkey = difficulty + "word";
		numlist.length = 0;
		numList();
		for (let i = 36; i < 57; i++) {
			randomQuestion();
			imgpath = "questions/practice/" + difficulty + "/" + "word" + "/" + questionnum + ".webp";
			questionlist[i] = imgpath
		}
		pkey = difficulty + "geometry";
		numlist.length = 0;
		numList();
		for (let i = 57; i < 71; i++) {
			randomQuestion();
			imgpath = "questions/practice/" + difficulty + "/" + "geometry" + "/" + questionnum + ".webp";
			questionlist[i] = imgpath
		}
	}

	//this function creates a questionlist for regular test mode
	function questionListMaker () {
		for (let i=1; i < 71; i++) {
		imgpath = "questions/test/" + year + "/" + difficulty + "/" + i.toString() + ".webp";
		questionlist[i] = imgpath
		}
	}

	//fixes backspace and enter key functionality
	function backspacefix(event) {
		let box = event.target;
		box.setSelectionRange(box.value.length, box.value.length)
		if (box.value.endsWith("^") && event.key == "Backspace") {
			box.value = box.value.replace("x10", "")
		}
		if (event.key == "Enter") {
			event.preventDefault()
			if (currentpage == "practicepage") {
				if (box.value) {
					practiceSubmit()
				} else {
					practiceNext()
				}
			} else {
				testNext()
			}
		}
	}

	//this makes the input only take correct inputs
	function inputwhitelist(event) {
		let box = event.target
		box.setSelectionRange(box.value.length, box.value.length)
		box.value = box.value.replace(/[^\d\-\.x]/g, "").replace("x10", "x10^")
		if ([".", "-."].includes(box.value)) {
			box.value = box.value.replace(".", "0.")
		}
		if (box.value.includes("x10^")) {
			box.value = box.value.replace(/x$/, "")
		}
		else {
			document.getElementById("x10button").disabled = false
			document.getElementById("x10buttontest").disabled = false
			if (box.value.endsWith("x")) {
				box.value += "10^"
				document.getElementById("x10button").disabled = true
				document.getElementById("x10buttontest").disabled = true
			}
		}
	}

	//x10button function
	function x10button(event) {
		let box = document.getElementById("practiceinput")
		if (!box.value.includes("x10^")) {
			box.value += "x10^"
			event.target.disabled = true
		}
	}

	//x10button function for test
	function x10buttontest(event) {
		let box = document.getElementById("testinput")
		if (!box.value.includes("x10^")) {
			box.value += "x10^"
			event.target.disabled = true
		}
	}

	document.getElementById("practiceinput").addEventListener("click", e => {
		e.target.setSelectionRange(e.target.value.length, e.target.value.length)
	})
	document.getElementById("practiceinput").addEventListener("keydown", backspacefix)
	document.getElementById("practiceinput").addEventListener("input", inputwhitelist)
	document.getElementById("x10button").addEventListener("click", x10button)

	document.getElementById("testinput").addEventListener("click", e => {
		e.target.setSelectionRange(e.target.value.length, e.target.value.length)
	})
	document.getElementById("testinput").addEventListener("keydown", backspacefix)
	document.getElementById("testinput").addEventListener("input", inputwhitelist)
	document.getElementById("x10buttontest").addEventListener("click", x10buttontest)


	//updates the answer list in test mode when you type in the box
	function answerupdater() {
		let input = document.getElementById("testinput")
		answers[Number(currentquestion)] = input.value
		let option = document.getElementById(`testoption${Number(currentquestion)}`)
		option.textContent = (option.textContent.includes("✦")) ? option.textContent.replace("✦ ", "") :  option.textContent.replace(/^/, "✦ ")
		document.getElementById(`reviewoption${Number(currentquestion)}`).textContent = option.textContent
	}
	document.getElementById("testinput").addEventListener("input", answerupdater)
	
	//this function creates a timer
	function testtimer() {
		//time after first timer update, set starting time in html
		let	testtimer1 = 29
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
		newlog = "Subject: Calculator Applications\n"
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

	function gradeQuestion(useranswer, correctanswers) {
		//checks if the users answer is an exact match
		if (correctanswers.includes(useranswer)) {
			return true
		}

		//this is if the correct answer is a money or integer answer, so it cant be converted to sci notation
		if (!correctanswers[1]) {

			//checks if the dollar answer is within one digit
			if (correctanswers[0] && correctanswers[0].includes(".")) {
				let allowederror = Number(correctanswers[0].replace(/\d(?=.*\d)/g, "0").replace(/\d(?!.*\d)/g, "1")) * 1.4
				if (useranswer.length == correctanswers[0].length && Math.abs(Number(useranswer) - Number(correctanswers[0])) < allowederror) {
					return true
				}
			}

			//this is here because if the dollar answer cant match, it wont match anywhere else. also, integers cant match anywhere except exactly
			return false

		}

		//if the users answer is not scientific notation, convert it to it because its easier to work with, only if a normal notation is accepted
		if (!useranswer.includes("x") && correctanswers[0]) {

			let sigdigits

			if (useranswer.includes(".")) {
				sigdigits = useranswer.replace(/[.-]/g, "").replace(/^0+/, "").length
			} 
			else {
				sigdigits = useranswer.replace(/0+$/, "").replace(/-/g, "").replace(/^0+/, "").length
			}

			useranswer = Number(useranswer).toExponential(sigdigits-1).replace("e", "x10^").replace("+", "")
			

		}


		//always runs if the first two dont work, this is for scientific notation
		let usersignificand = useranswer.slice(0, useranswer.indexOf("x"))
		let userexponent = useranswer.slice(useranswer.indexOf("^")+1)
		let answersignificand = correctanswers[1].slice(0, correctanswers[1].indexOf("x"))
		let answerexponent = correctanswers[1].slice(correctanswers[1].indexOf("^")+1)
		let allowederror = Number(answersignificand.replace(/\d(?=.*\d)/g, "0").replace(/\d(?!.*\d)/g, "1").replace("-", "")) * 1.4
		if (userexponent == answerexponent && usersignificand.length == answersignificand.length && Math.abs(Number(usersignificand) - Number(answersignificand)) < allowederror) {
			return true
		}



		//this is for sig digit problems that dont meet the above
		if (correctanswers[2]) {

			let usersignificand = useranswer.slice(0, useranswer.indexOf("x"))
			let userexponent = useranswer.slice(useranswer.indexOf("^")+1)
			let answersignificand = correctanswers[1].slice(0, correctanswers[1].indexOf("x"))
			let answerexponent = correctanswers[1].slice(correctanswers[1].indexOf("^")+1)
			let lowestSD = Math.min((usersignificand.match(/\d/g) || []).length, correctanswers[2])
			if (lowestSD < 2) {
				return false
			}
			let roundedusersig = Math.round((Number(usersignificand) + Number.EPSILON) * 10 ** (lowestSD - 1)) / 10 ** (lowestSD - 1)
			let roundedanswersig = Math.round((Number(answersignificand) + Number.EPSILON) * 10 ** (lowestSD - 1)) / 10 ** (lowestSD - 1)
			if (userexponent == answerexponent && Math.abs(roundedanswersig - roundedusersig) < 10 ** -(lowestSD + 4)) {
				return "partial"
			}
			
		}

		return false
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
		numList()
		randomQuestion()
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
		questionListMaker();
		mode = "Test";
	}
	
	//part of start test code for random test
	function startRTest() {
		difficulty = document.querySelector('input[name="difficultyr"]:checked')?.value;
		alertboxcondition = (!difficulty);
		randomquestionListMaker();
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
		document.getElementById("testquestion").src = imgpath;
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
	let useranswer = document.getElementById("practiceinput").value
	if (useranswer) {
	time = Date.now() - time;
	answervalue = gradeQuestion(useranswer, answerkey[imgpath])
	if (time > 60000) {
		document.getElementById("timeelapsedcorrect").textContent = Math.round(time / 60000 * 100) / 100 + " minutes";
		document.getElementById("timeelapsedincorrect").textContent = Math.round(time / 60000 * 100) / 100 + " minutes";
		document.getElementById("timeelapsedpartial").textContent = Math.round(time / 60000 * 100) / 100 + " minutes";
	} else {
		document.getElementById("timeelapsedcorrect").textContent = Math.round(time / 1000 * 100) / 100 + " seconds";
		document.getElementById("timeelapsedincorrect").textContent = Math.round(time / 1000 * 100) / 100 + " seconds";
		document.getElementById("timeelapsedpartial").textContent = Math.round(time / 1000 * 100) / 100 + " seconds";
	}
	if (answervalue == "partial") {
		document.getElementById("partialsigfigs").textContent = answerkey[imgpath][2]
		document.getElementById("practiceanswerpartial").style.display = "flex";
		setTimeout(function () {
		document.getElementById("practiceanswerpartial").style.display = "none"
		}, 3500);
	}
	else if (answervalue) {
		document.getElementById("practiceanswercorrect").style.display = "flex";
		setTimeout(function () {
		document.getElementById("practiceanswercorrect").style.display = "none"
		}, 3500);
	} else {
		document.getElementById("correctanswer").textContent = answerkey[imgpath].filter(item => typeof item === "string").join(" or ");
		document.getElementById("practiceanswerincorrect").style.display = "flex";
		setTimeout(function () {
		document.getElementById("practiceanswerincorrect").style.display = "none"
		}, 3500);
	}
	questioncountpractice()
	time = Date.now() + 3500; //adjust time to account for the alert box display time
	document.getElementById("practiceinput").value = ""
	
	}
	}

	function practiceNext() {
	if (document.getElementById("practicepage").style.display === "block") {
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
		document.getElementById("practiceinput").value = "";
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
		if (Number(currentquestion) < 70 && document.getElementById("testpage").style.display === "block") {
			num = Number(currentquestion);
			num += 1;
			document.getElementById("testinput").value = answers[num]
			currentquestion = num.toString();
			document.getElementById("testquestionanswercurrent").value = currentquestion
			imgpath = questionlist[currentquestion];
			document.getElementById("testquestion").src = imgpath;
		}
	}

	function testBack () {
		if (Number(currentquestion) > 1 && document.getElementById("testpage").style.display === "block") {
			num = Number(currentquestion);
			num -= 1;
			document.getElementById("testinput").value = answers[num]
			currentquestion = num.toString();
			document.getElementById("testquestionanswercurrent").value = currentquestion
			imgpath = questionlist[currentquestion];
			document.getElementById("testquestion").src = imgpath;
		}
	}

	function testQuestionSelector(e) {
		currentquestion = e.target.value;
		document.getElementById("testinput").value = answers[Number(currentquestion)]
		imgpath = questionlist[currentquestion];
		document.getElementById("testquestion").src = imgpath;
	}

	function testEnd() {
		clearInterval(interval);
		currentpage = "testend";
		document.getElementById("testpage").style.display = "none";
		document.getElementById("testend").style.display = "block";
		let addstate = false
		for (let i=70; i>0; i--) {
			let answer = answers[i]
			imgpath = questionlist[i];

			if (answer) {
				answerstatus = gradeQuestion(answer, answerkey[imgpath])
			} else {
				answerstatus = false
			}
			
			if (!addstate && answer) {
				addstate = true
				score += 5*i
			}

			if (addstate) {
				if (answerstatus == "partial") {
					score -= 2
					questionstotal += 1
					questionscorrect += 1
					answers[i] = [answer, "partial"]
				}
				else if (answerstatus) {
					questionstotal += 1
					questionscorrect += 1
					answers[i] = [answer, true]
				} else {
					score -= 7
					questionstotal += 1
					answers[i] = [answer, false]
				}
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

		document.getElementById("reviewbutton").addEventListener("click", function(e) {
			currentquestion = 1;
			let answer = answers[currentquestion]
			imgpath = questionlist[currentquestion];
			document.getElementById("correctanswertestimage").textContent = answerkey[imgpath].filter(item => typeof item === "string").join(" or ");
			document.getElementById("youranswertestimage").textContent = answer[0]
			if (!answer[0]) {
				document.getElementById("youranswertestimage").textContent = "None"
				if (answer[1] === false) {
					document.getElementById("youranswertestimage").classList.toggle("green", answer[1])
					document.getElementById("youranswertestimage").classList.toggle("orange", (answer[1] ==="partial"))
					document.getElementById("youranswertestimage").classList.toggle("red", !answer[1])
				} else {
					document.getElementById("youranswertestimage").classList.remove("green", "red", "orange")
				}
			} else {
				document.getElementById("youranswertestimage").classList.toggle("green", answer[1])
				document.getElementById("youranswertestimage").classList.toggle("orange", (answer[1] ==="partial"))
				document.getElementById("youranswertestimage").classList.toggle("red", !answer[1])
			}
			document.getElementById("questionboxtestresults").src = imgpath;
			currentpage = "testendimage";
			document.getElementById("testend").style.display = "none";
			document.getElementById("testendimage").style.display = "block";
			})
			
		document.addEventListener("keydown", function(e) {
			if (e.key === "ArrowLeft" && currentpage === "testendimage") {
				testReviewBack();
				e.preventDefault();
			}
			if (e.key === "ArrowRight" && currentpage === "testendimage") {
				testReviewNext();
				e.preventDefault();
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
	document.getElementById("testquestionanswercurrent").addEventListener("change", testQuestionSelector);
	document.getElementById("endtestbutton").addEventListener("click", testEnd);
	document.getElementById("testendimagebutton").addEventListener("click", testEndImage2testEnd);

	function testReviewNext () {
		if (currentquestion < 70 && document.getElementById("testendimage").style.display === "block") {
			currentquestion += 1
			document.getElementById("testanswercurrent").value = currentquestion.toString()
			let answer = answers[currentquestion]
			imgpath = questionlist[currentquestion];
			document.getElementById("correctanswertestimage").textContent = answerkey[imgpath].filter(item => typeof item === "string").join(" or ");
			document.getElementById("youranswertestimage").textContent = answer[0]
			if (!answer[0]) {
				document.getElementById("youranswertestimage").textContent = "None"
				if (answer[1] === false) {
					document.getElementById("youranswertestimage").classList.toggle("green", answer[1])
					document.getElementById("youranswertestimage").classList.toggle("orange", (answer[1] ==="partial"))
					document.getElementById("youranswertestimage").classList.toggle("red", !answer[1])
				} else {
					document.getElementById("youranswertestimage").classList.remove("green", "red", "orange")
				}
			} else {
				document.getElementById("youranswertestimage").classList.toggle("green", answer[1])
				document.getElementById("youranswertestimage").classList.toggle("orange", (answer[1] ==="partial"))
				document.getElementById("youranswertestimage").classList.toggle("red", !answer[1])
			}
			document.getElementById("questionboxtestresults").src = imgpath;
		}
	}

	function testReviewBack () {
		if (currentquestion > 1 && document.getElementById("testendimage").style.display === "block") {
			currentquestion -= 1
			document.getElementById("testanswercurrent").value = currentquestion.toString()
			let answer = answers[currentquestion]
			imgpath = questionlist[currentquestion];
			document.getElementById("correctanswertestimage").textContent = answerkey[imgpath].filter(item => typeof item === "string").join(" or ");
			document.getElementById("youranswertestimage").textContent = answer[0]
			if (!answer[0]) {
				document.getElementById("youranswertestimage").textContent = "None"
				if (answer[1] === false) {
					document.getElementById("youranswertestimage").classList.toggle("green", answer[1])
					document.getElementById("youranswertestimage").classList.toggle("orange", (answer[1] ==="partial"))
					document.getElementById("youranswertestimage").classList.toggle("red", !answer[1])
				} else {
					document.getElementById("youranswertestimage").classList.remove("green", "red", "orange")
				}
			} else {
				document.getElementById("youranswertestimage").classList.toggle("green", answer[1])
				document.getElementById("youranswertestimage").classList.toggle("orange", (answer[1] ==="partial"))
				document.getElementById("youranswertestimage").classList.toggle("red", !answer[1])
			}
			document.getElementById("questionboxtestresults").src = imgpath;
		}
	}

	function testAnswerSelector(e) {
		currentquestion = Number(e.target.value);
		let answer = answers[currentquestion]
		imgpath = questionlist[currentquestion];
		document.getElementById("correctanswertestimage").textContent = answerkey[imgpath].filter(item => typeof item === "string").join(" or ");
		document.getElementById("youranswertestimage").textContent = answer[0]
		if (!answer[0]) {
			document.getElementById("youranswertestimage").textContent = "None"
			if (answer[1] === false) {
				document.getElementById("youranswertestimage").classList.toggle("green", answer[1])
				document.getElementById("youranswertestimage").classList.toggle("orange", (answer[1] ==="partial"))
				document.getElementById("youranswertestimage").classList.toggle("red", !answer[1])
			} else {
				document.getElementById("youranswertestimage").classList.remove("green", "red", "orange")
			}
		} else {
			document.getElementById("youranswertestimage").classList.toggle("green", answer[1])
			document.getElementById("youranswertestimage").classList.toggle("orange", (answer[1] ==="partial"))
			document.getElementById("youranswertestimage").classList.toggle("red", !answer[1])
		}
		document.getElementById("questionboxtestresults").src = imgpath;
	}

	document.getElementById("timgnext").addEventListener("click", testReviewNext);
	document.getElementById("timgback").addEventListener("click", testReviewBack);
	document.getElementById("testanswercurrent").addEventListener("change", testAnswerSelector)
