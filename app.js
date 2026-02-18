document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // =========================
  // FORM 1 — B2G (prefill completo)
  // =========================
  const B2G_FORM_VIEW_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSf568b_tzt5jsOCEglAr_fnhPVIDeVOG6Fuy-l1i1E_t_M42w/viewform";

  const B2G_ENTRY = {
    nome: "entry.1364320595",
    email: "entry.1560870156",
    orgao: "entry.2074803104",
    cargo: "entry.1121925840",
    uf: "entry.211494027",
    municipio: "entry.1370040767",
    escolas: "entry.43014791",
    whats: "entry.818163933",
    dor: "entry.962060619",
    piloto: "entry.498836888",
    prioridade: "entry.442180220", // checkbox
    pagamento: "entry.1005602",    // checkbox
    reuniao: "entry.329198512"
  };

  const validationForm = document.getElementById("validationForm");
  const formMsg = document.getElementById("formMsg");

  function appendMany(params, key, value) {
    if (value == null) return;
    if (Array.isArray(value)) {
      value.filter(Boolean).forEach(v => params.append(key, String(v)));
      return;
    }
    const s = String(value).trim();
    if (!s) return;
    if (s.includes(",")) s.split(",").map(x => x.trim()).filter(Boolean).forEach(v => params.append(key, v));
    else params.append(key, s);
  }

  function buildB2GUrl(data) {
    const url = new URL(B2G_FORM_VIEW_URL);
    url.searchParams.set("usp", "pp_url");

    appendMany(url.searchParams, B2G_ENTRY.nome, data.nome);
    appendMany(url.searchParams, B2G_ENTRY.email, data.email);
    appendMany(url.searchParams, B2G_ENTRY.orgao, data.orgao);
    appendMany(url.searchParams, B2G_ENTRY.cargo, data.cargo);
    appendMany(url.searchParams, B2G_ENTRY.uf, data.uf);
    appendMany(url.searchParams, B2G_ENTRY.municipio, data.municipio);
    appendMany(url.searchParams, B2G_ENTRY.escolas, data.escolas);
    appendMany(url.searchParams, B2G_ENTRY.whats, data.whats);
    appendMany(url.searchParams, B2G_ENTRY.dor, data.dor);
    appendMany(url.searchParams, B2G_ENTRY.piloto, data.piloto);
    appendMany(url.searchParams, B2G_ENTRY.reuniao, data.reuniao);

    // checkboxes
    appendMany(url.searchParams, B2G_ENTRY.prioridade, data.prioridade);
    appendMany(url.searchParams, B2G_ENTRY.pagamento, data.pagamento);

    return url.toString();
  }

  if (validationForm) {
    validationForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const raw = Object.fromEntries(new FormData(validationForm).entries());
      const prioridadeChecks = [...validationForm.querySelectorAll('input[name="prioridade"]:checked')].map(i => i.value);
      const pagamentoChecks = [...validationForm.querySelectorAll('input[name="pagamento"]:checked')].map(i => i.value);

      const data = {
        ...raw,
        prioridade: prioridadeChecks.length ? prioridadeChecks : raw.prioridade,
        pagamento: pagamentoChecks.length ? pagamentoChecks : raw.pagamento
      };

      const required = ["nome", "email", "orgao", "cargo", "uf", "municipio", "dor", "piloto", "reuniao"];
      const missing = required.filter(k => !data[k] || String(data[k]).trim() === "");
      if (missing.length) {
        if (formMsg) formMsg.textContent = "Preencha os campos obrigatórios antes de enviar.";
        return;
      }

      if (formMsg) formMsg.textContent = "Abrindo Google Form (B2G) com respostas pré-preenchidas...";
      await new Promise(r => setTimeout(r, 120));

      window.open(buildB2GUrl(data), "_blank", "noopener,noreferrer");

      if (formMsg) formMsg.textContent = "Finalize o envio no Google Form que abriu na nova aba.";
      validationForm.reset();
    });
  }

  // =========================
  // FORM 2 — Feedback Explorer (o link que você mandou)
  // =========================
  const FEEDBACK_FORM_VIEW_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSf3EV_0LYt30X_teZbpl7lNFI71MY93BFxdxHCMe1jgOBP-JQ/viewform";

  // Campo único do seu form:
  // ...&entry.28047785=...
  const FEEDBACK_ENTRY = { msg: "entry.28047785" };

  const feedbackForm = document.getElementById("explorerFeedbackForm");
  const feedbackMsg = document.getElementById("feedbackMsg");

  function buildFeedbackUrl(payload) {
    const url = new URL(FEEDBACK_FORM_VIEW_URL);
    url.searchParams.set("usp", "pp_url");
    url.searchParams.set(FEEDBACK_ENTRY.msg, payload);
    return url.toString();
  }

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(feedbackForm).entries());

      if (!data.fb_msg || String(data.fb_msg).trim() === "") {
        if (feedbackMsg) feedbackMsg.textContent = "Escreva seu feedback antes de enviar.";
        return;
      }

      // Coloca contexto junto (pra você saber de quem veio quando abrir as respostas)
      const payload =
        "Feedback Explorer — Horizonte Afro\n" +
        "Nome: " + (data.fb_nome || "-") + "\n" +
        "E-mail: " + (data.fb_email || "-") + "\n\n" +
        String(data.fb_msg).trim();

      if (feedbackMsg) feedbackMsg.textContent = "Abrindo Google Form de feedback (pré-preenchido)...";
      await new Promise(r => setTimeout(r, 120));

      window.open(buildFeedbackUrl(payload), "_blank", "noopener,noreferrer");

      if (feedbackMsg) feedbackMsg.textContent = "Finalize o envio no Google Form que abriu na nova aba.";
      feedbackForm.reset();
    });
  }
});
