document.addEventListener("DOMContentLoaded", () => {
  // ===== Utils =====
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function appendMany(params, key, value) {
    if (value == null) return;

    if (Array.isArray(value)) {
      value.filter(Boolean).forEach((v) => params.append(key, String(v)));
      return;
    }

    const s = String(value).trim();
    if (!s) return;
    params.append(key, s);
  }

  // ==========================================================
  // FORM 1 — PILOTO B2G (link base + entries = os seus do exemplo)
  // ==========================================================
  const B2G_FORM_BASE =
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

  function buildB2GUrl(data) {
    const url = new URL(B2G_FORM_BASE);
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

    // checkboxes (podem ser múltiplos)
    appendMany(url.searchParams, B2G_ENTRY.prioridade, data.prioridade);
    appendMany(url.searchParams, B2G_ENTRY.pagamento, data.pagamento);

    return url.toString();
  }

  if (validationForm) {
    validationForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const raw = Object.fromEntries(new FormData(validationForm).entries());

      // coletar checkboxes certinho
      const prioridadeChecks = [
        ...validationForm.querySelectorAll('input[name="prioridade"]:checked')
      ].map((i) => i.value);

      const pagamentoChecks = [
        ...validationForm.querySelectorAll('input[name="pagamento"]:checked')
      ].map((i) => i.value);

      const data = {
        ...raw,
        prioridade: prioridadeChecks,
        pagamento: pagamentoChecks
      };

      // campos obrigatórios mínimos (ajusta se quiser)
      const required = ["nome", "email", "orgao", "cargo", "uf", "municipio", "dor", "piloto", "reuniao"];
      const missing = required.filter((k) => !data[k] || String(data[k]).trim() === "");
      if (missing.length) {
        if (formMsg) formMsg.textContent = "Preencha os campos obrigatórios antes de enviar.";
        return;
      }

      const url = buildB2GUrl(data);

      if (formMsg) formMsg.textContent = "Redirecionando para o Google Form (B2G)…";
      await sleep(100);

      // usa location.href pra evitar bloqueio de popup
      try {
        window.location.href = url;
      } catch (err) {
        // fallback: abre o form base
        window.location.href = B2G_FORM_BASE + "?usp=pp_url";
      }
    });
  }

  // ==========================================================
  // FORM 2 — FEEDBACK EXPLORER (link base + entry = seu exemplo)
  // ==========================================================
  const FEEDBACK_FORM_BASE =
    "https://docs.google.com/forms/d/e/1FAIpQLSf3EV_0LYt30X_teZbpl7lNFI71MY93BFxdxHCMe1jgOBP-JQ/viewform";

  const FEEDBACK_ENTRY_MSG = "entry.28047785";

  const feedbackForm = document.getElementById("explorerFeedbackForm");
  const feedbackMsg = document.getElementById("feedbackMsg");

  function buildFeedbackUrl(payload) {
    const url = new URL(FEEDBACK_FORM_BASE);
    url.searchParams.set("usp", "pp_url");
    url.searchParams.set(FEEDBACK_ENTRY_MSG, payload);
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

      const payload =
        "Feedback Explorer — Horizonte Afro\n" +
        "Nome: " + (data.fb_nome || "-") + "\n" +
        "E-mail: " + (data.fb_email || "-") + "\n\n" +
        String(data.fb_msg).trim();

      const url = buildFeedbackUrl(payload);

      if (feedbackMsg) feedbackMsg.textContent = "Redirecionando para o Google Form de feedback…";
      await sleep(100);

      try {
        window.location.href = url;
      } catch (err) {
        window.location.href = FEEDBACK_FORM_BASE + "?usp=pp_url";
      }
    });
  }
});
