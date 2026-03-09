let courses = JSON.parse(localStorage.getItem("courses")) || []
let studySessions = JSON.parse(localStorage.getItem("study")) || []
let attendance = JSON.parse(localStorage.getItem("attendance")) || []

let studyInterval = null
let remainingTime = 0

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
  renderStudyCourseSelect()
  updateDashboard()
}

function deleteCourse(index){
  let removed=courses.splice(index,1)[0]
  attendance=attendance.filter(a=>a.course!==removed.name)
  studySessions=studySessions.filter(s=>s.course!==removed.name)
  save()
  renderCourses()
  renderAttendanceSelect()
  renderAttendanceTable()
  renderStudyCourseSelect()
  renderStudy()
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

function renderStudyCourseSelect(){
  let sel=document.getElementById("studyCourseSelect")
  sel.innerHTML=""
  courses.forEach(c=>{
    let opt=document.createElement("option")
    opt.value=c.name
    opt.text=c.name
    sel.appendChild(opt)
  })
}

function startStudy(){
  if(studyInterval) return alert("A study session is already running")
  
  let course=document.getElementById("studyCourseSelect").value
  let duration=parseInt(document.getElementById("studyDuration").value)
  if(!course||!duration) return alert("Fill all fields")
  
  remainingTime = duration * 60
  updateStudyTimerDisplay()
  
  studyInterval = setInterval(()=>{
    remainingTime--
    updateStudyTimerDisplay()
    
    if(remainingTime <=0){
      clearInterval(studyInterval)
      studyInterval = null
      logStudySession(course,duration)
      document.getElementById("studyTimer").innerText="✅ Study session completed!"
    }
    
  },1000)
}

function updateStudyTimerDisplay(){
  let mins = Math.floor(remainingTime/60)
  let secs = remainingTime % 60
  document.getElementById("studyTimer").innerText = `⏱ ${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`
}

function logStudySession(course,duration){
  let now = new Date()
  studySessions.push({
    course,
    duration,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString()
  })
  save()
  renderStudy()
  updateDashboard()
}

function renderStudy(){
  let list=document.getElementById("studyList")
  list.innerHTML=""
  studySessions.forEach(s=>{
    let li=document.createElement("li")
    li.innerText=`${s.course} — ${s.duration} min | ${s.date} ${s.time}`
    list.appendChild(li)
  })
}

/* DASHBOARD */

function updateDashboard(){
  document.getElementById("dashCourses").innerText=courses.length
  document.getElementById("dashClasses").innerText=attendance.length
  let total=studySessions.reduce((a,b)=>a+b.duration,0)
  document.getElementById("dashStudy").innerText=total
}

/* SPLASH */

window.addEventListener("load",()=>{
  setTimeout(()=>{
    document.getElementById("splash").style.opacity="0"
    setTimeout(()=>{document.getElementById("splash").style.display="none"},1000)
  },2500)
})

/* INIT */

renderCourses()
renderAttendanceSelect()
renderStudyCourseSelect()
renderAttendanceTable()
renderStudy()
updateDashboard()
