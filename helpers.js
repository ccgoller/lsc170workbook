// Shared interactive helpers for the workbook (imported by each module via OJS).
function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => (e[k] = v));
  kids.forEach((k) => e.append(k));
  return e;
}

export function quiz(id, question, options, answer, explain) {
  const box = el("div", { className: "quiz-q" }, el("p", { innerHTML: `<b>${question}</b>` }));
  const fb = el("div", { className: "quiz-feedback" });
  options.forEach((o, i) => {
    const input = el("input", { type: "radio", name: id });
    input.onchange = () => {
      const ok = i === answer;
      fb.className = "quiz-feedback " + (ok ? "ok" : "no");
      fb.textContent = ok ? "✔ Correct! " + explain : "✘ Not quite — try again.";
    };
    const lbl = el("label", { style: "display:block" }, input, " " + o);
    box.append(lbl);
  });
  box.append(fb);
  return box;
}

export function notes(key, prompt) {
  const ta = el("textarea", { rows: 4, placeholder: prompt, style: "width:100%" });
  ta.value = localStorage.getItem(key) || "";
  ta.oninput = () => localStorage.setItem(key, ta.value);
  return ta;
}

export function checklist(key, items) {
  const wrap = el("div", { className: "quiz-q" });
  items.forEach((t, i) => {
    const k = `${key}-${i}`;
    const cb = el("input", { type: "checkbox", checked: localStorage.getItem(k) === "1" });
    cb.onchange = () => localStorage.setItem(k, cb.checked ? "1" : "0");
    wrap.append(el("label", { style: "display:block" }, cb, " " + t));
  });
  return wrap;
}
