// This is the app controller: it connects storage, UI, form data, and user events.
let students = getStudents();
let editingId = null;
let pendingDeleteId = null;

const form = document.querySelector("#student-form-element");
const searchInput = document.querySelector("#search");
const departmentFilter = document.querySelector("#filter-department");
const sortSelect = document.querySelector("#sort-students");
const modal = document.querySelector("#confirm-modal");

function getVisibleStudents() {
  const query = searchInput.value.trim().toLowerCase();
  const department = departmentFilter.value;
  const [property, direction] = sortSelect.value.split("-");
  return students
    .filter((student) => !department || student.department === department)
    .filter((student) => student.name.toLowerCase().includes(query) || student.rollNumber.toLowerCase().includes(query))
    .sort((a, b) => {
      if (property === "newest") return b.createdAt - a.createdAt;
      const left = property === "roll" ? a.rollNumber : a.name;
      const right = property === "roll" ? b.rollNumber : b.name;
      return left.localeCompare(right) * (direction === "desc" ? -1 : 1);
    });
}

function refresh() {
  renderStudents(getVisibleStudents());
  renderStats(students);
}

function getFormData() {
  return {
    name: form.name.value.trim(), 
    rollNumber: form.rollNumber.value.trim(), 
    department: form.department.value,
    email: form.email.value.trim(), 
    phone: form.phone.value.trim(),
    skills: [...form.querySelectorAll('input[name="skills"]:checked')].map((input) => input.value)
  };
}

function validate(data) {
  let valid = true;
  
  const rules = [
    [form.name, data.name ? "" : "Enter the student's naamkaran."],
    [form.rollNumber, data.rollNumber ? "" : "Enter a roll number."],
    [form.department, data.department ? "" : "Choose a department."],
    [form.email, /^\S+@\S+\.\S+$/.test(data.email) ? "" : "Enter a valid email address."],
    [form.phone, /^\d{10}$/.test(data.phone.replace(/[\s-]/g, "")) ? "" : "Enter a valid 10-digit phone number."]
  ];

  rules.forEach(([input, error]) => { setFieldError(input, error); if (error) valid = false; });

  const duplicate = students.some((student) => student.rollNumber.toLowerCase() === data.rollNumber.toLowerCase() && student.id !== editingId);

  if (duplicate) { setFieldError(form.rollNumber, "This roll number already exists."); valid = false; }
  return valid;
}

function resetForm() {
  form.reset(); editingId = null;
  document.querySelector("#form-title").textContent = "Add a student";
  document.querySelector("#submit-button").textContent = "Save student";
  document.querySelector("#cancel-edit").classList.add("hidden");
  form.querySelectorAll(".field").forEach((field) => field.classList.remove("has-error"));
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); 
  const data = getFormData();

  if (!validate(data)) return;

  if (editingId) {
    students = students.map((student) => student.id === editingId ? { ...student, ...data } : student);
    showToast("Student details updated.");
  } else {
    students.push({ ...data, id: crypto.randomUUID(), createdAt: Date.now() });
    showToast("Student added successfully.");
  }
  saveStudents(students); resetForm(); refresh();
});

studentList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]"); if (!button) return;
  const student = students.find((item) => item.id === button.dataset.id); if (!student) return;
  if (button.dataset.action === "edit") {
    editingId = student.id;
    Object.entries(student).forEach(([key, value]) => { if (form[key] && key !== "skills") form[key].value = value; });
    form.querySelectorAll('input[name="skills"]').forEach((input) => input.checked = student.skills.includes(input.value));
    document.querySelector("#form-title").textContent = `Edit ${student.name}`;
    document.querySelector("#submit-button").textContent = "Update student";
    document.querySelector("#cancel-edit").classList.remove("hidden");
    document.querySelector("#student-form").scrollIntoView({ behavior: "smooth" });
  } else { pendingDeleteId = student.id; modal.classList.remove("hidden"); }
});

document.querySelector("#cancel-edit").addEventListener("click", resetForm);
document.querySelector("#modal-cancel").addEventListener("click", () => modal.classList.add("hidden"));
document.querySelector("#modal-confirm").addEventListener("click", () => {
  students = students.filter((student) => student.id !== pendingDeleteId); saveStudents(students); modal.classList.add("hidden"); refresh(); showToast("Student deleted.", "danger");
});

[searchInput, departmentFilter, sortSelect].forEach((control) => control.addEventListener("input", refresh));

document.querySelector("#theme-toggle").addEventListener("click", () => {
  const theme = document.body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(theme); saveTheme(theme);
});

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  const button = document.querySelector("#theme-toggle");
  button.textContent = theme === "dark" ? "☀" : "☾";
  button.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
}

document.querySelector("#export-csv").addEventListener("click", () => {
  if (!students.length) return showToast("There is no data to export.", "danger");
  const rows = [["Name", "Roll Number", "Department", "Email", "Phone", "Skills"], ...students.map((s) => [s.name, s.rollNumber, s.department, s.email, s.phone, s.skills.join(", ")])];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); link.download = "students.csv"; link.click(); URL.revokeObjectURL(link.href);
  showToast("CSV exported successfully.");
});

applyTheme(getTheme());
refresh();