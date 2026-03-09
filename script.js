let courses = JSON.parse(localStorage.getItem("courses")) || []
let tests = JSON.parse(localStorage.getItem("tests")) || []
let studySessions = JSON.parse(localStorage.getItem("study")) || []

function toggleSidebar(){
document.getElementById("sidebar").classList.toggle("collapsed")
}

function showPage(page){

document.querySelectorAll(".page").forEach(p=>{
p.classList.remove("active")
})

document.getElementById(page).classList.add("active")

}

function save(){
localStorage.setItem("courses",JSON.stringify(courses))
localStorage.setItem("tests",JSON.stringify(tests))
localStorage.setItem("study",JSON.stringify(studySessions))
}


/* COURSES */

function addCourse(){

let name=document.getElementById("courseName").value
let day=document.getElementById("courseDay").value
let time=document.getElementById("courseTime").value

courses.push({name,day,time,present:0,total:0})

save()

renderCourses()
renderAttendance()

}

function renderCourses(){

let grid=document.getElementById("timetableGrid")
grid.innerHTML=""

courses.forEach((c,i)=>{

let card=document.createElement("div")
card.className="courseCard"

card.innerHTML=`
<h3>${c.name}</h3>
<p>${c.day}</p>
<p>${c.time}</p>
<button onclick="removeCourse(${i})">Delete</button>
`

grid.appendChild(card)

})

}

function removeCourse(i){

courses.splice(i,1)

save()

renderCourses()
renderAttendance()

}


/* ATTENDANCE */

function renderAttendance(){

let container=document.getElementById("attendanceContainer")

container.innerHTML=""

courses.forEach((c,i)=>{

let percent=c.total?Math.round((c.present/c.total)*100):0

let div=document.createElement("div")

div.className="attendanceCard"

div.innerHTML=`
<h3>${c.name}</h3>

<p>Attendance: ${percent}%</p>

<button onclick="present(${i})">Present</button>
<button onclick="absent(${i})">Absent</button>
`

container.appendChild(div)

})

}

function present(i){

courses[i].present++
courses[i].total++

save()

renderAttendance()
updateCharts()

}

function absent(i){

courses[i].total++

save()

renderAttendance()
updateCharts()

}


/* TESTS */

function addTest(){

let title=document.getElementById("testTitle").value
let date=document.getElementById("testDate").value

tests.push({title,date})

save()

renderTests()

}

function renderTests(){

let list=document.getElementById("testList")
list.innerHTML=""

tests.forEach(t=>{

let days=Math.ceil((new Date(t.date)-new Date())/(1000*60*60*24))

let li=document.createElement("li")

li.innerHTML=`${t.title} — ${days} days remaining`

list.appendChild(li)

})

}


/* STUDY */

function logStudy(){

let subject=document.getElementById("studySubject").value
let hours=parseFloat(document.getElementById("studyHours").value)

studySessions.push({subject,hours})

save()

renderStudy()
updateCharts()

}

function renderStudy(){

let list=document.getElementById("studyList")
list.innerHTML=""

studySessions.forEach(s=>{

let li=document.createElement("li")

li.innerHTML=`${s.subject} — ${s.hours} hrs`

list.appendChild(li)

})

}


/* ANALYTICS */

function updateCharts(){

let attendanceData=courses.map(c=>c.total?Math.round((c.present/c.total)*100):0)

let labels=courses.map(c=>c.name)

new Chart(document.getElementById("attendanceChart"),{
type:"bar",
data:{
labels:labels,
datasets:[{
label:"Attendance %",
data:attendanceData
}]
}
})

let studyMap={}

studySessions.forEach(s=>{
if(!studyMap[s.subject]) studyMap[s.subject]=0
studyMap[s.subject]+=s.hours
})

new Chart(document.getElementById("studyChart"),{
type:"pie",
data:{
labels:Object.keys(studyMap),
datasets:[{
data:Object.values(studyMap)
}]
}
})

}

renderCourses()
renderAttendance()
renderTests()
renderStudy()
updateCharts()
