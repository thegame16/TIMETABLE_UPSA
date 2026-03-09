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
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"))
  document.getElementById(page).classList.add("active")
  // Collapse sidebar & overlay
  document.getElementById("sidebar").classList.add("collapsed")
  document.getElementById("overlay").classList.remove("active")
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
    courses.push({name, day, time, presentMarked:false, absentMarked:false})
    save()
    renderCourses()
    renderAttendance()
  } else { alert("Please fill all course details") }
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
// ATTENDANCE TRACKER (TABLE)
// =====================
function renderAttendance(){
  const container = document.getElementById("attendanceContainer")
  container.innerHTML = ""
  if(courses.length === 0){ container.innerHTML = "<p>No courses added yet.</p>"; return }

  const table = document.createElement("table")
  table.className = "attendanceTable"
  table.innerHTML = `
    <thead>
      <tr>
        <th>Course</th>
        <th>Day</th>
        <th>Time</th>
        <th>Present</th>
        <th>Absent</th>
      </tr>
    </thead>
    <tbody></tbody>
  `
  const tbody = table.querySelector("tbody")
  courses.forEach((c, i)=>{
    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td>${c.name}</td>
      <td>${c.day}</td>
      <td>${c.time}</td>
      <td><input type="checkbox" onclick="markPresent(${i}, this)" ${c.presentMarked?'checked':''}></td>
      <td><input type="checkbox" onclick="markAbsent(${i}, this)" ${c.absentMarked?'checked':''}></td>
    `
    tbody.appendChild(tr)
  })
  container.appendChild(table)
}

function markPresent(i, checkbox){
  courses[i].presentMarked = checkbox.checked
  if(checkbox.checked) courses[i].absentMarked = false
  save()
  renderAttendance()
}

function markAbsent(i, checkbox){
  courses[i].absentMarked = checkbox.checked
  if(checkbox.checked) courses[i].presentMarked = false
  save()
  renderAttendance()
}

// =====================
// TESTS
// =====================
function addTest(){
  let title = document.getElementById("testTitle").value
  let date = document.getElementById("testDate").value
  if(title && date){ tests.push({title,date}); save(); renderTests() }
  else{ alert("Please fill test name and date") }
}

function renderTests(){
  const list = document.getElementById("testList")
  list.innerHTML = ""
  tests.forEach(t=>{
    const days = Math.ceil((new Date(t.date) - new Date()) / (1000*60*60*24))
    const li = document.createElement("li")
    li.innerHTML = `${t.title} — ${days} days remaining`
    list.appendChild(li)
  })
}

// =====================
// STUDY
// =====================
function logStudy(){
  const subject = document.getElementById("studySubject").value
  const hours = parseFloat(document.getElementById("studyHours").value)
  if(subject && hours){ studySessions.push({subject,hours}); save(); renderStudy(); updateCharts() }
  else{ alert("Please fill study subject and hours") }
}

function renderStudy(){
  const list = document.getElementById("studyList")
  list.innerHTML = ""
  studySessions.forEach(s=>{
    const li = document.createElement("li")
    li.innerHTML = `${s.subject} — ${s.hours} hrs`
    list.appendChild(li)
  })
}

// =====================
// ANALYTICS
// =====================
function updateCharts(){
  // Attendance Chart
  const attendanceData = courses.map(c => c.presentMarked ? 1 : 0)
  const labels = courses.map(c => c.name)
  new Chart(document.getElementById("attendanceChart"),{
    type:"bar",
    data:{labels,datasets:[{label:"Attendance Ticks", data:attendanceData, backgroundColor:'#00e5ff'}]},
    options:{responsive:true, maintainAspectRatio:false, scales:{y:{beginAtZero:true, max:1}}}
  })

  // Study Pie Chart
  const studyMap = {}
  studySessions.forEach(s => { studyMap[s.subject] = (studyMap[s.subject]||0)+s.hours })
  new Chart(document.getElementById("studyChart"),{
    type:"pie",
    data:{labels:Object.keys(studyMap), datasets:[{data:Object.values(studyMap), backgroundColor:['#00e5ff','#ff6ec7','#ffc300','#6a0dad','#00ff7f']}]},
    options:{responsive:true, maintainAspectRatio:false}
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
