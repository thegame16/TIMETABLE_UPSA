let courses=JSON.parse(localStorage.getItem("courses"))||[]
let studySessions=JSON.parse(localStorage.getItem("study"))||[]
let attendance=[]

// Sidebar
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

// Save
function save(){
  localStorage.setItem("courses",JSON.stringify(courses))
  localStorage.setItem("study",JSON.stringify(studySessions))
  localStorage.setItem("attendance",JSON.stringify(attendance))
}

// Courses
function addCourse(){
  let name=document.getElementById("courseName").value
  let day=document.getElementById("courseDay").value
  let time=document.getElementById("courseTime").value
  if(name && day && time){
    courses.push({name,day,time})
    save(); renderCourses(); renderAttendanceSelect(); updateDashboard()
  }else alert("Fill all fields")
}
function deleteCourse(index){
  if(!confirm("Delete this course?")) return
  courses.splice(index,1)
  attendance=attendance.filter(a=>a.course!==courses[index]?.name)
  save(); renderCourses(); renderAttendanceSelect(); renderAttendanceTable(); updateDashboard()
}
function renderCourses(){
  const grid=document.getElementById("timetableGrid")
  grid.innerHTML=""
  courses.forEach((c,i)=>{
    const card=document.createElement("div")
    card.className="courseCard"
    card.innerHTML=`<div>${c.name} (${c.day} ${c.time})</div><button onclick="deleteCourse(${i})">X</button>`
    grid.appendChild(card)
  })
}

// Attendance Logging
function renderAttendanceSelect(){
  const sel=document.getElementById("attendanceCourseSelect")
  sel.innerHTML="<option>Select Course</option>"
  courses.forEach(c=>{
    const opt=document.createElement("option"); opt.value=c.name; opt.text=c.name; sel.appendChild(opt)
  })
}
function logAttendance(){
  const course=document.getElementById("attendanceCourseSelect").value
  const date=document.getElementById("attendanceDate").value
  const time=document.getElementById("attendanceTime").value
  if(!course||!date||!time){alert("Fill all fields");return}
  attendance.push({course,date,time})
  save(); renderAttendanceTable(); updateDashboard()
}
function renderAttendanceTable(){
  const tbody=document.querySelector("#attendanceTable tbody")
  tbody.innerHTML=""
  attendance.forEach(a=>{
    const tr=document.createElement("tr")
    tr.innerHTML=`<td>${a.course}</td><td>${a.date}</td><td>${a.time}</td>`
    tbody.appendChild(tr)
  })
}

// Study
function logStudy(){
  const subject=document.getElementById("studySubject").value
  const hours=parseFloat(document.getElementById("studyHours").value)
  if(subject && hours){studySessions.push({subject,hours});save(); renderStudy(); updateDashboard()}
  else alert("Fill all fields")
}
function renderStudy(){
  const list=document.getElementById("studyList")
  list.innerHTML=""
  studySessions.forEach(s=>{
    const li=document.createElement("li")
    li.innerText=`${s.subject} — ${s.hours} hrs`
    list.appendChild(li)
  })
}

// Dashboard & Charts
function updateDashboard(){
  document.getElementById("dashCourses").innerText=courses.length
  document.getElementById("dashClasses").innerText=attendance.length
  const totalStudy=studySessions.reduce((a,b)=>a+b.hours,0)
  document.getElementById("dashStudy").innerText=totalStudy

  // Attendance Chart
  const labels=courses.map(c=>c.name)
  const data=courses.map(c=>attendance.filter(a=>a.course===c.name).length)
  new Chart(document.getElementById("attendanceChart"),{
    type:"bar",
    data:{labels,datasets:[{label:"Classes Logged",data,backgroundColor:'#00e5ff'}]},
    options:{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true}}}
  })

  // Study Chart
  const studyMap={}
  studySessions.forEach(s=>{studyMap[s.subject]=(studyMap[s.subject]||0)+s.hours})
  new Chart(document.getElementById("studyChart"),{
    type:"pie",
    data:{labels:Object.keys(studyMap),datasets:[{data:Object.values(studyMap),backgroundColor:['#00e5ff','#ff6ec7','#ffc300','#6a0dad','#00ff7f']}]},
    options:{responsive:true,maintainAspectRatio:false}
  })
}

// INITIAL RENDER
renderCourses()
renderAttendanceSelect()
renderAttendanceTable()
renderStudy()
updateDashboard()
