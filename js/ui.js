// This file contains DOM rendering and visual helper functions.
const studentList = document.querySelector("#student-list");
const emptyState = document.querySelector("#empty-state");

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

function renderStudents(students) {
  emptyState.classList.toggle("hidden", students.length !== 0);
  studentList.innerHTML = students.map((student) => `
    <tr>
      <td><strong>${escapeHtml(student.name)}</strong><span class="student-email">${escapeHtml(student.email)}</span></td>
      <td>${escapeHtml(student.rollNumber)}</td>
      <td><span class="department-pill">${escapeHtml(student.department)}</span></td>
      <td>${escapeHtml(student.phone)}</td>
      <td>${student.skills.map((skill) => `<span class="skill-pill">${escapeHtml(skill)}</span>`).join("") || "—"}</td>
      <td class="actions"><button class="action-button" data-action="edit" data-id="${student.id}" type="button">Edit</button><button class="action-button delete" data-action="delete" data-id="${student.id}" type="button">Delete</button></td>
    </tr>`).join("");
}

function renderStats(students) {
  document.querySelector("#total-students").textContent = students.length;
  document.querySelector("#total-departments").textContent = new Set(students.map((student) => student.department)).size;
  const newest = [...students].sort((a, b) => b.createdAt - a.createdAt)[0];
  document.querySelector("#newest-student").textContent = newest ? newest.name.split(" ")[0] : "—";
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.querySelector("#toast-container").append(toast);
  setTimeout(() => toast.remove(), 3200);
}

function setFieldError(input, message = "") {
  const field = input.closest(".field");
  field?.classList.toggle("has-error", Boolean(message));
  const error = field?.querySelector(".error-message");
  if (error) error.textContent = message;
}
