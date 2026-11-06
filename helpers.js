// Shared interactive helpers for the workbook (imported by each module via OJS).
function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => (e[k] = v));
  kids.forEach((k) => e.append(k));
  return e;
}

// Knowledge check: a labelled radio group with screen-reader-announced feedback.
export function quiz(id, question, options, answer, explain) {
  const box = el("fieldset", { className: "quiz-q" });
  box.append(el("legend", { className: "quiz-legend", textContent: "Knowledge check: " + question }));
  const fb = el("div", { className: "quiz-feedback" });
  fb.setAttribute("role", "status");
  fb.setAttribute("aria-live", "polite");
  options.forEach((o, i) => {
    const input = el("input", { type: "radio", name: id, id: `${id}-${i}` });
    input.onchange = () => {
      const ok = i === answer;
      fb.className = "quiz-feedback " + (ok ? "ok" : "no");
      fb.textContent = ok
        ? "✔ Correct! " + explain
        : "✘ Not quite. Re-read the section above and try another answer.";
    };
    box.append(el("label", { className: "quiz-option", htmlFor: input.id }, input, " " + o));
  });
  box.append(fb);
  return box;
}

// Notes box saved in the browser, with a visible label for screen readers.
export function notes(key, prompt) {
  const id = `notes-${key}`;
  const ta = el("textarea", { rows: 4, id, className: "notes-box" });
  ta.value = localStorage.getItem(key) || "";
  ta.oninput = () => localStorage.setItem(key, ta.value);
  return el("div", { className: "notes-wrap" },
    el("label", { htmlFor: id, className: "notes-label", textContent: prompt }),
    ta,
    el("small", { className: "notes-hint", textContent: "Saved automatically in this browser." }));
}

// To-do checklist with a progress count, saved in the browser.
export function checklist(key, items) {
  const wrap = el("fieldset", { className: "quiz-q" });
  wrap.append(el("legend", { className: "quiz-legend", textContent: "Module to-do list" }));
  const progress = el("div", { className: "checklist-progress" });
  progress.setAttribute("role", "status");
  progress.setAttribute("aria-live", "polite");
  const boxes = [];
  const update = () => {
    const n = boxes.filter((b) => b.checked).length;
    progress.textContent = `${n} of ${items.length} complete`;
  };
  items.forEach((t, i) => {
    const k = `${key}-${i}`;
    const cb = el("input", { type: "checkbox", id: k, checked: localStorage.getItem(k) === "1" });
    cb.onchange = () => {
      localStorage.setItem(k, cb.checked ? "1" : "0");
      update();
    };
    boxes.push(cb);
    wrap.append(el("label", { className: "quiz-option", htmlFor: k }, cb, " " + t));
  });
  wrap.append(progress);
  update();
  return wrap;
}
