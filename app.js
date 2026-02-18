document.addEventListener("DOMContentLoaded", () => {
  console.log("APP JS CARREGOU ✅");

  // ===== FORM 1 (B2G) =====
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
    prioridade: "entry.442180220",
    pagamento: "entry.1005602",
    reuniao: "entry.329198512"
  };

  const validationForm = document.getElementById("validationForm");
  const formMsg = document.getElementById("formMsg");

  console.log("validationForm existe?", !!validationForm);

  function appendMany(params, key, value) {
    if (value == null) return;
    if (Array.isArray(value)) {
      value.filter(Boolean).forEach(v => params.append(key, String(v)));
      return;
    }
    const s = String(value).trim();
    if (!s) return;
    params.append(key, s);
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
    (data.prioridade || []).forEach(v => url.searchParams.append(B2G_ENTRY.prioridade, v));
    (data.pagamento || []).forEach(v => url.searchParams.append(B2G_ENTRY.pagamento, v));

    return url.toString();
  }

  if (validationForm) {
    validationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("SUBMIT B2G DISPAROU ✅");

      const raw = Object.fromEntries(new FormData(validationForm).entries());
      const prioridadeChecks = [...validationForm.querySelectorAll('input[name="prioridade"]:checked')].map(i => i.value);
      const pagamentoChecks = [...validationForm.querySelectorAll('input[name="pagamento"]:checked')].map(i => i.value);

      const data = {
        ...raw,
        prioridade: prioridadeChecks,
        pagamento: pagamentoChecks
      };

      const url = buildB2GUrl(data);
      console.log("URL B2G:", url);
      alert("Vou abrir este link:\n\n" + url);

      if (formMsg) formMsg.textContent = "Abrindo Google Form (B2G)…";
      window.location.href = url; // troca aba atual (menos bloqueio que popup)
    });
  } else {
    console.error("Não encontrei #validationForm no HTML.");
  }

  // ===== FORM 2 (Feedback Explorer) =====
  const FEEDBACK_FORM_VIEW_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSf3EV_0LYt30X_teZbpl7lNFI71MY93BFxdxHCMe1jgOBP-JQ/viewform";

  const FEEDBACK_ENTRY = { msg: "entry.28047785" };

  const feedbackForm = document.getElementById("explorerFeedbackForm");
  const feedbackMsg = document.getElementById("feedbackMsg");

  console.log("explorerFeedbackForm existe?", !!feedbackForm);

  function buildFeedbackUrl(payload) {
    const url = new URL(FEEDBACK_FORM_VIEW_URL);
    url.searchParams.set("usp", "pp_url");
    url.searchParams.set(FEEDBACK_ENTRY.msg, payload);
    return url.toString();
  }

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("SUBMIT FEEDBACK DISPAROU ✅");

      const data = Object.fromEntries(new FormData(feedbackForm).entries());
      if (!data.fb_msg || String(data.fb_msg).trim() === "") {
        if (feedbackMsg) feedbackMsg.textContent = "Escreva seu feedback antes de enviar.";
        return;
      }

      const payload =
        "Feedback Explorer — Horizonte Afro\n" +
        "Nome: " + (data.fb_nome || "-") + "\n" +
        "E-mail: " + (data.fb_email || "-") + "\n\n" +
        String(data.fb_msg).trim();

      const url = buildFeedbackUrl(payload);
      console.log("URL Feedback:", url);
      alert("Vou abrir este link:\n\n" + url);

      if (feedbackMsg) feedbackMsg.textContent = "Abrindo Google Form de feedback…";
      window.location.href = url;
    });
  } else {
    console.error("Não encontrei #explorerFeedbackForm no HTML.");
  }
});
