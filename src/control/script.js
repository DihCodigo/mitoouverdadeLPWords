document.getElementById("searchBtn").addEventListener("click", function() {
  const urlInput = document.getElementById("urlInput").value;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Limpa resultados anteriores

  // URL do serviço de proxy
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://archive.org/wayback/available?url=' + urlInput)}`;

  // Faz a requisição para a API do Wayback Machine através do proxy
  fetch(proxyUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error('Erro na resposta da rede: ' + response.status);
          }
          return response.json();
      })
      .then(data => {
          try {
              const jsonData = JSON.parse(data.contents);
              if (jsonData.archived_snapshots && jsonData.archived_snapshots.closest) {
                  const closest = jsonData.archived_snapshots.closest;
                  const resultHtml = `
                      <p><strong>Data do Primeiro Acesso:</strong> ${closest.timestamp}</p>
                      <p><strong>Link:</strong> <a href="${closest.url}" target="_blank">${closest.url}</a></p>
                  `;
                  resultsDiv.innerHTML = resultHtml;
              } else {
                  resultsDiv.innerHTML = "<p>Nenhum registro encontrado.</p>";
              }
          } catch (jsonError) {
              console.error("Erro ao analisar JSON:", jsonError);
              resultsDiv.innerHTML = "<p>Erro ao processar os dados retornados. A URL pode não estar disponível.</p>";
          }
      })
      .catch(error => {
          console.error("Erro ao buscar dados:", error);
          resultsDiv.innerHTML = "<p>Erro ao buscar dados. Tente novamente.</p>";
      });
});
