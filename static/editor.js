var subjects = null;
var schedule = null;

function fetchSchedule() {
	var d = new Date();
	var today = d.getDay();
	var scheduleXhttpRequest = new XMLHttpRequest();
	var subjectsXhttpRequest = new XMLHttpRequest();
	scheduleXhttpRequest.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var week = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
			var startGrade = 5;
			var subjectOptions = '';
			for (var key in subjects) {
				if (subjects.hasOwnProperty(key)) {
					subjectOptions += '<option value="' + key + '">' + subjects[key] + '</option>';
				}
			}
			var scheduleElement = document.getElementById('schedule');
			schedule = JSON.parse(scheduleXhttpRequest.responseText);
			for (var i = 1; i <= schedule.length; ++i) {  // Iterate over weekdays
				scheduleElement.innerHTML += '<tr id="weekday-' + i + '"><td class="weekday-label">' + (i == today ? '<b><u>' : '') +
					week[i] + (i == today ? '</u></b>' : '') + '</td></tr>';
				var weekdayElement = document.getElementById('weekday-' + i);
				for (var j = 0; j < schedule[i - 1].length; ++j) {  // Iterate over grades
					weekdayElement.innerHTML += '<td><table><tbody id="grade-' + (j + startGrade) + '-' + i + '"></tbody></table></td>'
					var gradeElement = document.getElementById('grade-' + (j + startGrade) + '-' + i);
					for (var k = 0; k < schedule[i - 1][j].length; ++k) {  // Iterate over lessons
						gradeElement.innerHTML += '<tr id="lesson-' + (j + startGrade) + '-' + (k + 1) + '-' + i + '"><td>' + (k + 1) +
							'</td><td>' + (schedule[i - 1][j][k] != '' ? '<select id="select-' + (j + startGrade) + '-' + (k + 1) + '-' + i + '">' + subjectOptions + '</select>' : '') + '</td></tr>';
					};
				};
			};
			for (var i = 1; i <= schedule.length; ++i) {
				for (var j = 0; j < schedule[i - 1].length; ++j) {
					for (var k = 0; k < schedule[i - 1][j].length; ++k) {
						document.getElementById('select-' + (j + startGrade) + '-' + (k + 1) + '-' + i).value = schedule[i - 1][j][k];
					}
				}
			}
		}
	};
	subjectsXhttpRequest.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			subjects = JSON.parse(subjectsXhttpRequest.responseText);
			scheduleXhttpRequest.open("GET", "/static/schedule.json", true);
			scheduleXhttpRequest.send();
		}
	}
	subjectsXhttpRequest.open("GET", "/static/subjects.json", true);
	subjectsXhttpRequest.send();
}
