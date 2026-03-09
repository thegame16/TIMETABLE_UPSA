let courses = JSON.parse(localStorage.getItem("courses")) || []
let tests = JSON.parse(localStorage.getItem("tests")) || []
let studySessions = JSON.parse(localStorage.getItem("study")) || []

let selectedCourseIndex = null; // track which course modal is open

// SIDEBAR
function toggleSidebar(){
  document.getElementById("sidebar").classList.toggle("collapsed")
  document.getElementById("overlay").classList.toggle("active")
}

// SHOW PAGE
function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"))
  document.getElementById(page).classList.add("active")
  document.getElementById("sidebar").classList.add("collapsed")
  document.getElementById("overlay").classList.remove("active")
}

// SAVE
function save(){
  localStorage.setItem("courses", JSON.stringify(courses))
  localStorage.setItem("tests", JSON.stringify(tests))
  localStorage.setItem("study", JSON.stringify(studySessions))
}

// TIMETABLE
function addCourse(){
  let name = document.getElementById("courseName").value
  let day = document.getElementById("courseDay").value
  let time = document.getElementById("courseTime").value
  if(name && day && time){
    courses.push({name, day, time, attendance: []})
    save()
    renderCourses()
  } else alert("Fill all course details")
}

function renderCourses(){
  let grid = document.getElementById("timetableGrid")
  grid.innerHTML=""
  courses.forEach((c,i)=>{
    let card=document.createElement("div")
    card.className="courseCard"
    card.innerHTML=`<h3>${c.name}</h3><p>${c.day}</p><p>${c.time}</p>`
    card.onclick = ()=>openAttendanceModal(i)
    grid.appendChild(card)
  })
}

// ATTENDANCE MODAL
function openAttendanceModal(index){
  selectedCourseIndex = index
  const course = courses[index]
  document.getElementById("modalCourseTitle").innerText = `${course.name} (${course.day} ${course.time})`
  document.getElementById("attendanceDate").value = ""
  renderAttendanceHistory()
  document.getElementById("attendanceModal").style.display="flex"
}

function closeAttendanceModal(){
  document.getElementById("attendanceModal").style.display="none"
  selectedCourseIndex = null
}

function markAttendance(status){
  if(selectedCourseIndex === null) return
  const date = document.getElementById("attendanceDate").value
  if(!date){ alert("Select a date"); return }
  courses[selectedCourseIndex].attendance.push({date,status})
  save()
  renderAttendanceHistory()
  updateCharts()
}

function renderAttendanceHistory(){
  if(selectedCourseIndex===null) return
  const history = courses[selectedCourseIndex].attendance
  const ul = document.getElementById("attendanceHistory")
  ul.innerHTML=""
  history.sort((a,b)=> new Date(a.date) - new Date(b.date))
  history.forEach(entry=>{
    const li=document.createElement("li")
    li.innerText = `${entry.date} — ${entry.status}`
    ul.appendChild(li)
  })
}

// TESTS
function addTest(){
  let title=document.getElementById("testTitle").value
  let date=document.getElementById("testDate").value
  if(title && date){ tests.push({title,date}); save(); renderTests() }
  else alert("Fill test name & date")
}
function renderTests(){
  const list=document.getElementById("testList")
  list.innerHTML=""
  tests.forEach(t=>{
    let days=Math.ceil((new Date(t.date)-new Date())/(1000*60*60*24))
    let li=document.createElement("li")
    li.innerText=`${t.title} — ${days} days remaining`
    list.appendChild(li)
  })
}

// STUDY
function logStudy(){
  const subject=document.getElementById("studySubject").value
  const hours=parseFloat(document.getElementById("studyHours").value)
  if(subject && hours){ studySessions.push({subject,hours}); save(); renderStudy(); updateCharts() }
  else alert("Fill subject & hours")
}
function renderStudy(){
  const list=document.getElementById("studyList")
  list.innerHTML=""
  studySessions.forEach(s=>{
    const li=document.createElement("li")
    li.innerText = `${s.subject} — ${s.hours} hrs`
    list.appendChild(li)
  })
}

// ANALYTICS
function updateCharts(){
  // Attendance chart shows number of attended classes per course
  const labels = courses.map(c=>c.name)
  const attendanceData = courses.map(c=>c.attendance.filter(a=>a.status==="Present").length)
  new Chart(document.getElementById("attendanceChart"),{
    type:"bar",
    data:{labels, datasets:[{label:"Classes Attended", data:attendanceData, backgroundColor:'#00e5ff'}]},
    options:{responsive:true, maintainAspectRatio:false, scales:{y:{beginAtZero:true}}}
  })

  // Study pie chart
  const studyMap = {}
  studySessions.forEach(s=>{ studyMap[s.subject]=(studyMap[s.subject]||0)+s.hours })
  new Chart(document.getElementById("studyChart"),{
    type:"pie",
    data:{labels:Object.keys(studyMap), datasets:[{data:Object.values(studyMap), backgroundColor:['#00e5ff','#ff6ec7','#ffc300','#6a0dad','#00ff7f']}]},
    options:{responsive:true, maintainAspectRatio:false}
  })
}

// INITIAL RENDER
renderCourses()
renderTests()
renderStudy()
updateCharts()
