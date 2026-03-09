let courses = JSON.parse(localStorage.getItem("courses")) || []
let studySessions = JSON.parse(localStorage.getItem("study")) || []
let attendance = JSON.parse(localStorage.getItem("attendance")) || []

function toggleSidebar(){
document.getElementById("sidebar").classList.toggle("collapsed")
document.getElementById("overlay").classList.toggle("active")
}

function showPage(page){
document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"))
document.getElementById(page).classList.add("active")

document.getElementById("sidebar").classList.add("collapsed")
document.getElementById("overlay").classList.remove("active")
}

function save(){
localStorage.setItem("courses",JSON.stringify(courses))
localStorage.setItem("study",JSON.stringify(studySessions))
localStorage.setItem("attendance",JSON.stringify(attendance))
}

/* COURSES */

function addCourse(){

let name=document.getElementById("courseName").value
let day=document.getElementById("courseDay").value
let time=document.getElementById("courseTime").value

if(!name||!time)return alert("Fill all fields")

courses.push({name,day,time})

save()
renderCourses()
renderAttendanceSelect()
updateDashboard()

}

function deleteCourse(index){

let removed=courses.splice(index,1)[0]

attendance=attendance.filter(a=>a.course!==removed.name)

save()

renderCourses()
renderAttendanceSelect()
renderAttendanceTable()
updateDashboard()

}

function renderCourses(){

let grid=document.getElementById("timetableGrid")
grid.innerHTML=""

courses.forEach((c,i)=>{

let card=document.createElement("div")
card.className="courseCard"

card.innerHTML=`
<div>${c.name} (${c.day} ${c.time})</div>
<button onclick="deleteCourse(${i})">X</button>
`

grid.appendChild(card)

})

}

/* ATTENDANCE */

function renderAttendanceSelect(){

let sel=document.getElementById("attendanceCourseSelect")
sel.innerHTML=""

courses.forEach(c=>{

let opt=document.createElement("option")
opt.value=c.name
opt.text=c.name
sel.appendChild(opt)

})

}

function logAttendance(){

let course=document.getElementById("attendanceCourseSelect").value
let date=document.getElementById("attendanceDate").value
let time=document.getElementById("attendanceTime").value

if(!course||!date||!time)return alert("Fill all fields")

attendance.push({course,date,time})

save()

renderAttendanceTable()
updateDashboard()

}

function renderAttendanceTable(){

let tbody=document.querySelector("#attendanceTable tbody")
tbody.innerHTML=""

attendance.forEach(a=>{

let tr=document.createElement("tr")

tr.innerHTML=`
<td>${a.course}</td>
<td>${a.date}</td>
<td>${a.time}</td>
`

tbody.appendChild(tr)

})

}

/* STUDY */

function logStudy(){

let subject=document.getElementById("studySubject").value
let hours=parseFloat(document.getElementById("studyHours").value)

if(!subject||!hours)return alert("Fill all fields")

studySessions.push({subject,hours})

save()

renderStudy()
updateDashboard()

}

function renderStudy(){

let list=document.getElementById("studyList")

list.innerHTML=""

studySessions.forEach(s=>{

let li=document.createElement("li")
li.innerText=`${s.subject} — ${s.hours} hrs`
list.appendChild(li)

})

}

/* DASHBOARD */

function updateDashboard(){

document.getElementById("dashCourses").innerText=courses.length
document.getElementById("dashClasses").innerText=attendance.length

let total=studySessions.reduce((a,b)=>a+b.hours,0)
document.getElementById("dashStudy").innerText=total

}

/* SPLASH */

window.addEventListener("load",()=>{

setTimeout(()=>{
document.getElementById("splash").style.opacity="0"

setTimeout(()=>{
document.getElementById("splash").style.display="none"
},1000)

},2500)

})

/* INIT */

renderCourses()
renderAttendanceSelect()
renderAttendanceTable()
renderStudy()
updateDashboard()
