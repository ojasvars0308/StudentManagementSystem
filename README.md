# StudentHub — learn by building

This project is a complete, browser-only Student Management System. Open `index.html` with VS Code's **Live Server** extension to run it. Your student data is saved in the browser's Local Storage, so it remains after a refresh.

## Folder guide

```text
student-management/
├── index.html       # Page structure: headings, form, table, buttons
├── css/style.css    # All visual design and responsive layout rules
├── js/storage.js    # Saving and loading with Local Storage
├── js/ui.js         # Drawing the table, stats, toasts, validation messages
├── js/app.js        # App logic: CRUD, events, search, sorting, CSV export
└── assets/          # Place images/icons here later if you need them
```

## Step by step guide

### Hours 1–3: HTML

Start in `index.html`. It contains the page skeleton (`<!DOCTYPE html>`, `head`, and `body`), then semantic sections for the header, dashboard, registration form, student table, footer, toast container, and confirmation modal. Each input has a matching `label`; its `name` attribute lets JavaScript read it later. Do not add behaviour here—HTML describes *what is on the page*.

### Hours 4–6: CSS and responsive design

Then open `css/style.css`. At the top, `:root` defines reusable colour variables. The form and statistics use CSS Grid; the header and small alignment groups use Flexbox. The `@media (max-width: 760px)` block makes the form, cards, and controls stack on phones. Change a variable such as `--accent` to see how variables style the whole site.

### Hours 7–8: JavaScript data and functions

Open `js/app.js`. The `students` variable is an array of student objects. Each object has `name`, `rollNumber`, `department`, `email`, `phone`, `skills`, `id`, and `createdAt`. Functions such as `getVisibleStudents()`, `validate()`, and `resetForm()` give each task one clear responsibility. CRUD means Create (add), Read (render), Update (edit), and Delete.

### Hours 9–10: DOM and events

`js/ui.js` uses `document.querySelector()` to select HTML elements and `innerHTML` to render the student rows. Back in `js/app.js`, `addEventListener()` listens for form submit, table button clicks, search/filter input, and theme changes. The table uses event delegation: one listener on the table handles all Edit/Delete buttons.

### Hours 11–12: validation and Local Storage

`validate()` checks empty fields, email format, a 10-digit phone number, and duplicate roll numbers before a student is saved. `js/storage.js` uses `JSON.stringify()` before saving the array and `JSON.parse()` when loading it. Keep storage code in this separate file so the app remains organized.

### Hours 13–14: search, filter, sorting, statistics

`getVisibleStudents()` uses `filter()` for name/roll-number search and department filtering, then `sort()` for ordering. `renderStats()` uses the students array to display totals and department count. Try changing the controls above the table and inspect the function as you do.

### Hours 15–16: production features and publishing

The finished app includes a theme toggle, toast messages, empty state, delete confirmation, and CSV export. To publish it: initialize a Git repository, commit these files, push to GitHub, then enable GitHub Pages (Settings → Pages → deploy from the main branch) or drag the folder into Netlify. No backend is needed for this version.

## Best way to study it

1. Run the app and add two students.
2. Read the matching roadmap section above.
3. Make one small change yourself—add a department, change a colour, or add another skill checkbox.
4. Refresh the browser and verify the data persists.

Tip: Browser DevTools (`F12`) → Application → Local Storage lets you inspect the saved student JSON.
