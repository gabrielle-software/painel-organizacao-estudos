(() => {
  "use strict";

  const STORAGE_KEY = "studyflow.tasks.v1";
  const $ = (selector) => document.querySelector(selector);
  const elements = {
    list: $("#task-list"),
    empty: $("#empty-state"),
    dialog: $("#task-dialog"),
    form: $("#task-form"),
    title: $("#task-title"),
    subject: $("#task-subject"),
    date: $("#task-date"),
    priority: $("#task-priority"),
    dialogTitle: $("#dialog-title"),
    save: $("#save-task"),
    error: $("#form-error"),
    search: $("#search-input"),
    subjectFilter: $("#subject-filter"),
    statusFilter: $("#status-filter"),
    toast: $("#toast")
  };

  let tasks = loadTasks();
  let editingId = null;
  let toastTimer;

  function loadTasks() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved.filter(isValidTask) : [];
    } catch {
      return [];
    }
  }

  function isValidTask(task) {
    return task && typeof task.id === "string" &&
      typeof task.title === "string" && typeof task.subject === "string" &&
      typeof task.date === "string" &&
      ["low", "medium", "high"].includes(task.priority) &&
      typeof task.completed === "boolean";
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return true;
    } catch {
      showToast("Não foi possível salvar neste navegador.");
      return false;
    }
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function formatDate(value) {
    if (!value) return "Sem prazo";
    const [year, month, day] = value.split("-").map(Number);
    return new Intl.DateTimeFormat("pt-BR").format(new Date(year, month - 1, day));
  }

  function dateLabel(value) {
    if (!value) return "Sem prazo";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [year, month, day] = value.split("-").map(Number);
    const due = new Date(year, month - 1, day);
    const diff = Math.round((due - today) / 86400000);
    if (diff < 0) return "Atrasada";
    if (diff === 0) return "Para hoje";
    if (diff === 1) return "Para amanhã";
    return formatDate(value);
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2400);
  }

  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const progress = total ? Math.round((completed / total) * 100) : 0;
    $("#total-count").textContent = total;
    $("#pending-count").textContent = pending;
    $("#completed-count").textContent = completed;
    $("#progress-value").textContent = progress;
    $("#progress-bar").style.width = progress + "%";
  }

  function updateSubjectFilter() {
    const selected = elements.subjectFilter.value;
    const subjects = [...new Set(tasks.map((task) => task.subject.trim()).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "pt-BR"));
    elements.subjectFilter.innerHTML = '<option value="all">Todas</option>' +
      subjects.map((subject) => '<option value="' + escapeHTML(subject) + '">' + escapeHTML(subject) + '</option>').join("");
    elements.subjectFilter.value = subjects.includes(selected) ? selected : "all";
  }

  function render() {
    updateStats();
    updateSubjectFilter();
    const query = elements.search.value.trim().toLocaleLowerCase("pt-BR");
    const subject = elements.subjectFilter.value;
    const status = elements.statusFilter.value;
    const filtered = tasks.filter((task) => {
      const matchesQuery = (task.title + " " + task.subject).toLocaleLowerCase("pt-BR").includes(query);
      const matchesSubject = subject === "all" || task.subject === subject;
      const matchesStatus = status === "all" || (status === "completed" ? task.completed : !task.completed);
      return matchesQuery && matchesSubject && matchesStatus;
    }).sort((a, b) => Number(a.completed) - Number(b.completed) || a.date.localeCompare(b.date));

    elements.list.innerHTML = filtered.map((task) => {
      const priorityNames = { high: "Alta", medium: "Média", low: "Baixa" };
      return '<article class="task-row' + (task.completed ? ' is-completed' : '') + '">' +
        '<input class="task-check" type="checkbox" data-action="toggle" data-id="' + task.id + '" ' +
          (task.completed ? "checked" : "") + ' aria-label="Marcar ' + escapeHTML(task.title) + ' como concluída">' +
        '<div class="task-main"><div class="task-title">' + escapeHTML(task.title) + '</div>' +
          '<div class="task-meta"><span class="subject-chip">' + escapeHTML(task.subject) + '</span>' +
          '<span>◷ ' + escapeHTML(dateLabel(task.date)) + '</span></div></div>' +
        '<span class="priority ' + task.priority + '">' + priorityNames[task.priority] + '</span>' +
        '<div class="task-actions"><button class="icon-button" type="button" data-action="edit" data-id="' + task.id + '" aria-label="Editar tarefa">✎</button>' +
        '<button class="icon-button" type="button" data-action="delete" data-id="' + task.id + '" aria-label="Excluir tarefa">⌫</button></div></article>';
    }).join("");

    const hasTasks = filtered.length > 0;
    elements.list.hidden = !hasTasks;
    elements.empty.classList.toggle("visible", !hasTasks);
    const noTasksAtAll = tasks.length === 0;
    elements.empty.querySelector("h3").textContent = noTasksAtAll ? "Nenhuma tarefa por aqui" : "Nenhum resultado encontrado";
    elements.empty.querySelector("p").textContent = noTasksAtAll
      ? "Adicione sua primeira tarefa e comece a organizar seus estudos."
      : "Tente alterar a busca ou os filtros para encontrar suas tarefas.";
    $("#empty-add").hidden = !noTasksAtAll;
  }

  function openDialog(task = null) {
    editingId = task ? task.id : null;
    elements.form.reset();
    elements.error.textContent = "";
    elements.dialogTitle.textContent = task ? "Editar tarefa" : "Nova tarefa";
    elements.save.textContent = task ? "Salvar alterações" : "Salvar tarefa";
    if (task) {
      elements.title.value = task.title;
      elements.subject.value = task.subject;
      elements.date.value = task.date;
      elements.priority.value = task.priority;
    } else {
      const today = new Date();
      const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      elements.date.value = localDate;
      elements.priority.value = "medium";
    }
    elements.dialog.showModal();
    elements.title.focus();
  }

  function closeDialog() {
    elements.dialog.close();
    editingId = null;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const title = elements.title.value.trim();
    const subject = elements.subject.value.trim();
    const date = elements.date.value;
    const priority = elements.priority.value;
    if (!title || !subject || !date) {
      elements.error.textContent = "Preencha todos os campos para continuar.";
      return;
    }
    if (!["low", "medium", "high"].includes(priority)) {
      elements.error.textContent = "Selecione uma prioridade válida.";
      return;
    }
    if (editingId) {
      const task = tasks.find((item) => item.id === editingId);
      if (task) Object.assign(task, { title, subject, date, priority });
      showToast("Tarefa atualizada!");
    } else {
      tasks.push({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random(), title, subject, date, priority, completed: false, createdAt: new Date().toISOString() });
      showToast("Tarefa adicionada!");
    }
    persist();
    closeDialog();
    render();
  }

  function handleTaskAction(event) {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const { action, id } = target.dataset;
    const task = tasks.find((item) => item.id === id);
    if (!task) return;
    if (action === "toggle") {
      task.completed = target.checked;
      persist();
      render();
      showToast(task.completed ? "Tarefa concluída. Muito bem!" : "Tarefa reaberta.");
    } else if (action === "edit") {
      openDialog(task);
    } else if (action === "delete") {
      if (!window.confirm('Deseja realmente excluir a tarefa "' + task.title + '"?')) return;
      tasks = tasks.filter((item) => item.id !== id);
      persist();
      render();
      showToast("Tarefa excluída.");
    }
  }

  $("#add-task-top").addEventListener("click", () => openDialog());
  $("#add-task-main").addEventListener("click", () => openDialog());
  $("#empty-add").addEventListener("click", () => openDialog());
  $("#close-dialog").addEventListener("click", closeDialog);
  $("#cancel-dialog").addEventListener("click", closeDialog);
  elements.form.addEventListener("submit", handleSubmit);
  elements.list.addEventListener("click", handleTaskAction);
  elements.list.addEventListener("change", handleTaskAction);
  elements.search.addEventListener("input", render);
  elements.subjectFilter.addEventListener("change", render);
  elements.statusFilter.addEventListener("change", render);
  elements.dialog.addEventListener("click", (event) => {
    if (event.target === elements.dialog) closeDialog();
  });

  const now = new Date();
  $("#today-label").textContent = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(now).toLocaleUpperCase("pt-BR");
  render();
})();