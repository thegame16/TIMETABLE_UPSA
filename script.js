// ===== Data =====
let courses = JSON.parse(localStorage.getItem("courses")) || []
let studySessions = JSON.parse(localStorage.getItem("study")) || []
let attendance = JSON.parse(localStorage.getItem("attendance")) || []

// ===== Sidebar =====
function toggleSidebar(){
  document.getElementById("sidebar").classList.toggle("collapsed")
  document.getElementById("overlay").classList.toggle("active")
}

function showPage(page){
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"))
  document.getElementById(page).classList.add("active")
  document.getElementById("sidebar").classList.add("collapsed")
  document.getElementById("overlay").classList.remove("active")
}

// ===== Save =====
function save(){
  localStorage.setItem("courses", JSON.stringify(courses))
  localStorage.setItem("study", JSON.stringify(studySessions))
  localStorage.setItem("attendance", JSON.stringify(attendance))
}

// ===== Courses =====
function addCourse(){
  let name = document.getElementById("courseName").value
  let day = document.getElementById("courseDay").value
  let time = document.getElementById("courseTime").value
  if(name && day && time){
    courses.push({name, day, time})
    save(); renderCourses(); renderAttendanceSelect(); updateDashboard()
  } else alert("Fill all fields")
}

function deleteCourse(index){
  if(!confirm("Delete this course?")) return
  const deletedCourse = courses.splice(index, 1)[0]
  attendance = attendance.filter(a => a.course !== deletedCourse.name)
  save(); renderCourses(); renderAttendanceSelect(); renderAttendanceTable(); updateDashboard()
}

function renderCourses(){
  const grid = document.getElementById("timetableGrid")
  grid.innerHTML = ""
  courses.forEach((c,i)=>{
    const card = document.createElement("div")
    card.className = "courseCard"
    card.innerHTML = `<div>${c.name} (${c.day} ${c.time})</div><button onclick="deleteCourse(${i})">X</button>`
    grid.appendChild(card)
  })
}

// ===== Attendance Dropdown =====
function renderAttendanceSelect(){
  const sel = document.getElementById("attendanceCourseSelect")
  sel.innerHTML = ""
  if(courses.length === 0){
    const opt = document.createElement("option")
    opt.text = "No courses added"
    opt.value = ""
    sel.appendChild(opt)
    return
  }
  const defaultOpt = document.createElement("option")
  defaultOpt.text = "Select Course"
  defaultOpt.value = ""
  sel.appendChild(defaultOpt)
  courses.forEach(c=>{
    const opt = document.createElement("option")
    opt.value = c.name
    opt.text = c.name
    sel.appendChild(opt)
  })
}

// ===== Attendance Logging =====
function logAttendance(){
  const course = document.getElementById("attendanceCourseSelect").value
  const date = document.getElementById("attendanceDate").value
  const time = document.getElementById("attendanceTime").value
  if(!course || !date || !time){alert("Fill all fields");return}
  attendance.push({course,date,time})
  save(); renderAttendanceTable(); updateDashboard()
}

function renderAttendanceTable(){
  const tbody = document.querySelector("#attendanceTable tbody")
  tbody.innerHTML = ""
  attendance.forEach(a=>{
    const tr = document.createElement("tr")
    tr.innerHTML = `<td>${a.course}</td><td>${a.date}</td><td>${a.time}</td>`
    tbody.appendChild(tr)
  })
}

// ===== Study =====
function logStudy(){
  const subject = document.getElementById("studySubject").value
  const hours = parseFloat(document.getElementById("studyHours").value)
  if(subject && hours){studySessions.push({subject,hours});save(); renderStudy(); updateDashboard()}
  else alert("Fill all fields")
}

function renderStudy(){
  const list = document.getElementById("studyList")
  list.innerHTML = ""
  studySessions.forEach(s=>{
    const li = document.createElement("li")
    li.innerText = `${s.subject} — ${s.hours} hrs`
    list.appendChild(li)
  })
}

// ===== Dashboard (Cards Only) =====
function updateDashboard(){
  document.getElementById("dashCourses").innerText = courses.length
  document.getElementById("dashClasses").innerText = attendance.length
  const totalStudy = studySessions.reduce((a,b)=>a+b.hours,0)
  document.getElementById("dashStudy").innerText = totalStudy
}

// ===== Splash Page Logic =====
window.addEventListener('load', () => {
  // Show splash page first
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("splash").classList.add("active");

  // After 3 seconds, hide splash and show the "original" page
  setTimeout(() => {
    document.getElementById("splash").classList.remove("active");

    // Determine which page to show by default
    // You can use localStorage to remember last active page
    let lastPage = localStorage.getItem("lastPage") || "dashboard";
    document.getElementById(lastPage).classList.add("active");

    // Update dashboard data
    updateDashboard();
  }, 3000);
});

// ===== Remember last active page =====
function showPage(page){
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(page).classList.add("active");

  // Collapse sidebar and hide overlay
  document.getElementById("sidebar").classList.add("collapsed");
  document.getElementById("overlay").classList.remove("active");

  // Save the current page as last active
  localStorage.setItem("lastPage", page);
}

// ===== INITIAL RENDER =====
renderCourses()
renderAttendanceSelect()
renderAttendanceTable()
renderStudy()
updateDashboard()
