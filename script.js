// =====================
// DATA STORAGE
// =====================
let courses = JSON.parse(localStorage.getItem("courses")) || []
let tests = JSON.parse(localStorage.getItem("tests")) || []
let studySessions = JSON.parse(localStorage.getItem("study")) || []

// =====================
// SIDEBAR TOGGLE
// =====================
function toggleSidebar(){
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("overlay")
  sidebar.classList.toggle("collapsed")
  overlay.classList.toggle("active")
}

// =====================
// SHOW PAGE FUNCTION
// Sidebar auto-retract on mobile
// =====================
function showPage(page){
  // Hide all pages
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"))
  
  // Show selected page
  document.getElementById(page).classList.add("active")
  
  // Collapse sidebar and remove overlay (mobile-friendly)
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("overlay")
  sidebar.classList.add("collapsed")   // Retract sidebar
  overlay.classList.remove("active")    // Remove overlay
}

// =====================
// LOCAL STORAGE SAVE
// =====================
function save(){
  localStorage.setItem("courses", JSON.stringify(courses))
  localStorage.setItem("tests", JSON.stringify(tests))
  localStorage.setItem("study", JSON.stringify(studySessions))
}

// =====================
// COURSES / TIMETABLE
// =====================
function addCourse(){
  let name = document.getElementById("courseName").value
  let day = document.getElementById("courseDay").value
  let time = document.getElementById("courseTime").value
  
  if(name && day && time){
    courses.push({name, day, time, present:0, total:0})
    save()
    renderCourses()
    renderAttendance()
  } else {
    alert("Please fill all course details")
  }
}

function renderCourses(){
  let grid = document.getElementById("timetableGrid")
  grid.innerHTML = ""
  
  courses.forEach((c, i)=>{
    let card = document.createElement("div")
    card.className = "courseCard"
    card.innerHTML = `
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

// =====================
// ATTENDANCE TRACKER
// =====================
function renderAttendance(){
  let container = document.getElementById("attendanceContainer")
  container.innerHTML = ""
  
  courses.forEach((c,i)=>{
    let percent = c.total ? Math.round((c.present / c.total) * 100) : 0
    let div = document.createElement("div")
    div.className = "attendanceCard"
    div.innerHTML = `
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

// =====================
// TEST SCHEDULER
// =====================
function addTest(){
  let title = document.getElementById("testTitle").value
  let date = document.getElementById("testDate").value
  
  if(title && date){
    tests.push({title,date})
    save()
    renderTests()
  } else {
    alert("Please fill test name and date")
  }
}

function renderTests(){
  let list = document.getElementById("testList")
  list.innerHTML = ""
  
  tests.forEach(t=>{
    let days = Math.ceil((new Date(t.date) - new Date()) / (1000*60*60*24))
    let li = document.createElement("li")
    li.innerHTML = `${t.title} — ${days} days remaining`
    list.appendChild(li)
  })
}

// =====================
// STUDY SESSIONS
// =====================
function logStudy(){
  let subject = document.getElementById("studySubject").value
  let hours = parseFloat(document.getElementById("studyHours").value)
  
  if(subject && hours){
    studySessions.push({subject, hours})
    save()
    renderStudy()
    updateCharts()
  } else {
    alert("Please fill study subject and hours")
  }
}

function renderStudy(){
  let list = document.getElementById("studyList")
  list.innerHTML = ""
  
  studySessions.forEach(s=>{
    let li = document.createElement("li")
    li.innerHTML = `${s.subject} — ${s.hours} hrs`
    list.appendChild(li)
  })
}

// =====================
// ANALYTICS / CHARTS
// =====================
function updateCharts(){
  // Attendance Chart
  let attendanceData = courses.map(c => c.total ? Math.round((c.present / c.total) * 100) : 0)
  let labels = courses.map(c => c.name)
  
  new Chart(document.getElementById("attendanceChart"),{
    type: "bar",
    data: { labels, datasets: [{ label:"Attendance %", data:attendanceData, backgroundColor:'#00e5ff' }] },
    options:{ responsive:true, maintainAspectRatio:false }
  })

  // Study Pie Chart
  let studyMap = {}
  studySessions.forEach(s => { 
    if(!studyMap[s.subject]) studyMap[s.subject] = 0
    studyMap[s.subject] += s.hours
  })
  
  new Chart(document.getElementById("studyChart"),{
    type:"pie",
    data:{ labels:Object.keys(studyMap), datasets:[{ data:Object.values(studyMap), backgroundColor:['#00e5ff','#ff6ec7','#ffc300','#6a0dad','#00ff7f'] }] },
    options:{ responsive:true, maintainAspectRatio:false }
  })
}

// =====================
// INITIAL RENDER
// =====================
renderCourses()
renderAttendance()
renderTests()
renderStudy()
updateCharts()
