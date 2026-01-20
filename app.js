// Ano no rodapé
document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Suavizar scroll para âncoras
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Se ainda não existe /login, evita 404 (MVP honesto)
  const loginLink = document.getElementById("loginLink");
  if (loginLink) {
    loginLink.addEventListener("click", (e) => {
      // Quando sua rota /login existir, mude para true
      const loginEnabled = false;

      if (!loginEnabled) {
        e.preventDefault();
        alert("Login ainda não está disponível no MVP público. Entre na lista de espera para o piloto.");
        const sec = document.querySelector("#inscricao");
        if (sec) sec.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Form “fake” (simulação). No backend, você troca por POST real.
  const form = document.getElementById("leadForm");
  const msg = document.getElementById("formMsg");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form).entries());
      if (msg) msg.textContent = "Enviando...";

      // Simulação de envio (troque por fetch para seu endpoint)
      await new Promise(r => setTimeout(r, 650));

      // Aqui você poderia fazer:
      // fetch("/api/leads/", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data)
      // });

      console.log("Lead capturado (simulado):", data);

      if (msg) msg.textContent = "Recebido. Você entrou na lista de espera do piloto.";
      form.reset();
    });
  }
});
