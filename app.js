document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const loginLink = document.getElementById("loginLink");
  if (loginLink) {
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Login ainda não está disponível no MVP público. Entre na lista de espera para o piloto.");
      document.querySelector("#inscricao")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  const GOOGLE_FORM_BASE_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSdZMJjvLbsqj9n_QcaF35bkEsDPBx12vbf383bY80-1qYEXkQ/viewform";

  const ENTRY = {
    nome: "entry.2141837322",
    email: "entry.753412924",
    perfil: "entry.1245015387",
    cidade: "entry.1470869443",
    mensagem: "entry.1755395265"
  };

  const form = document.getElementById("leadForm");
  const msg = document.getElementById("formMsg");

  function buildPrefillUrl(data) {
    const url = new URL(GOOGLE_FORM_BASE_URL);
    url.searchParams.set("usp", "pp_url");
    url.searchParams.set(ENTRY.nome, data.nome || "");
    url.searchParams.set(ENTRY.email, data.email || "");
    url.searchParams.set(ENTRY.perfil, data.perfil || "");
    url.searchParams.set(ENTRY.cidade, data.cidade || "");
    url.searchParams.set(ENTRY.mensagem, data.mensagem || "");
    return url.toString();
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());

      if (!data.nome || !data.email || !data.perfil) {
        if (msg) msg.textContent = "Preencha nome, e-mail e perfil.";
        return;
      }

      if (msg) msg.textContent = "Abrindo o Google Form com seus dados preenchidos...";
      await new Promise(r => setTimeout(r, 300));

      window.open(buildPrefillUrl(data), "_blank", "noopener,noreferrer");

      if (msg) msg.textContent = "Finalize o envio no Google Form que abriu na nova aba.";
      form.reset();
    });
  }
});
