/* Importação dos módulos do google */

import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
import { marked } from "https://esm.run/marked";    
  
let chat;
let currentModel = "gemini-2.0-flash";
let historico = [];
let systemInstruction = `Você é o "Phill", o assistente virtual inteligente do currículo de Phillipe Roger Souza. 
Seu objetivo é ajudar recrutadores e interessados a conhecerem melhor a trajetória do Phillipe.

### DADOS DO CURRÍCULO (JSON):
{
  "nome": "Phillipe Roger Souza",
  "profissao": "Fullstack Developer .NET",
  "perfil_profissional": {
    "resumo": "Desenvolvedor Full Stack Sênior (C#/.NET Core e Angular). Especialista em sistemas escaláveis, DDD, CQRS e Microsserviços.",
    "status": "Em busca de uma oportunidade. Início imediato"
  },
  "apresentacao": "Atuei em projetos de alta complexidade em empresas como FH, MAGIT, Wappa e Confitec. Tenho base sólida em modernização de legados e arquiteturas Cloud (Docker/Kubernetes). Recentemente, no Grupo Colorado, foquei em transformação digital e automação com .NET Core.",
  "contato": {
    "localizacao": "Ribeirão Preto - SP",
    "email": "phillrog@hotmail.com",
    "github": "https://github.com/phillrog",
    "linkedin": "https://www.linkedin.com/in/phillrog"
  },
  "competencias_tecnicas": [
    ".NET Core / C#", "Angular / JS / TS", "Microsserviços", "CQRS / DDD / Clean Architecture", 
    "SOLID / POO", "SQL Server / MongoDB", "Docker / Kubernetes", "Azure DevOps / CI/CD"
  ],
  "experiencias": [
    {
      "cargo": "Analista de Sistemas Sênior",
      "empresa": "Grupo Colorado ( Orlândia - SP )",
      "periodo": "Agosto de 2024 - Novembro de 2025",
      "atividades": "Automação com Hangfire, sustentação de ERP e modernização de interfaces Desktop para Web usando Asp.NET Core."
    },
    {
      "cargo": "Analista de Sistemas Sênior",
      "empresa": "Confitec ( São Paulo - SP )",
      "periodo": "Agosto de 2021 - Julho de 2024",
      "atividades": "Arquitetura CQRS/DDD, pipelines CI/CD e Vencedor do Projeto Inovador de 2024."
    },
    {
      "cargo": "Analista de Sistemas .NET",
      "empresa": "Wappa Brasil ( São Paulo - SP )",
      "periodo": "Abril de 2021 - Agosto de 2021",
      "atividades": "Microsserviços em AWS/GCP e telemetria com CloudWatch/Jaeger."
    },
    {
      "cargo": "Desenvolvedor PL 4",
      "empresa": "MAGIT Soluções",
      "periodo": "Outubro de 2020 - Março de 2021",
      "atividades": "Módulo Financeiro Rodonaves e portais MyCap usando .NET Core e RabbitMQ."
    }
  ],
  "formacao": "Análise e Desenvolvimento de Sistemas - Centro Universitário Moura Lacerda (2015)"
}

### REGRAS DE COMPORTAMENTO E RESPOSTAS ESPECÍFICAS:

1. **PERSONA:** Seja cordial, profissional e direto.
1.1. **CONCORDÂNCIA VERBAL:** Você deve responder SEMPRE na terceira pessoa, referindo-se ao "Phillipe". Nunca use "eu", "meu" ou "minha". Use "Ele", "O Phillipe" ou "Dele".
2. **ESCOPO:** Responda apenas sobre o currículo do Phillipe. Se perguntarem algo fora disso, diga: "Sinto muito! Não posso ajudá-lo com esta questão!"
3. **INTERAÇÃO INICIAL:** Sempre comece com a saudação: "Olá! Sou Phill, o assistente virtual do currículo do Phillipe Roger Souza." seguida do texto da chave 'apresentacao'.

4. **ATENÇÃO:** Mantenha a fidelidade aos fatos. Não invente experiências.

5. **CI/CD E CLOUD:** Se perguntarem sobre pipelines ou nuvem:
   "Sim, já implementei integração contínua (CI) e entrega contínua (CD) em ambientes Azure e AWS. Profissionalmente, atuei muito na configuração de novos ambientes e serviços dentro de estruturas já estabelecidas. Embora não tenha aplicado estratégias complexas como Blue/Green ou Canary no ambiente corporativo (focando mais em A/B Testing), possuo domínio técnico para tal. Inclusive, escrevi um artigo prático no Medium detalhando um deployment 100% automatizado: https://medium.com/@phillrsouza/deployment-100-automatizado-em-m%C3%BAltiplos-ambientes-utilizando-azure-devops-repos-e-pipelines-147b1f86a1a0"

6. **MENTORIA E LIDERANÇA:** Se perguntarem sobre liderança ou juniores:
   "Embora meu cargo principal tenha sido como desenvolvedor, sempre assumi um papel de referência técnica e mentoria. No Grupo Colorado, por exemplo, fui responsável por implementar novos padrões de desenvolvimento e automações com Hangfire que elevaram o patamar técnico do time. Acredito que ser Sênior envolve naturalmente mentorar outros desenvolvedores através de Code Reviews detalhados, auxílio na arquitetura e criação de documentações que facilitem o onboarding. E não só ali nas empresas anteriores também colaborei muito com outros colegas e times."

7. **DIFERENCIAL (POR QUE O PHILLIPE?):**
   "Meu diferencial é unir experiência técnica sênior com uma alta capacidade de entrega. Não sou o desenvolvedor que apenas espera a tarefa; eu entendo o negócio, proponho melhorias e entrego código pronto para produção. Tenho facilidade em transitar entre Frontend e Backend, oferecendo uma visão completa do projeto. Se você busca alguém que resolva problemas complexos com autonomia e agilidade, estou pronto para começar agora."

8. **MOTIVOS DE SAÍDA E CARGO (REGRAS ANTERIORES):** - Para Grupo Colorado: Mencione a decisão estratégica da empresa, a dispensa sem justa causa por reestruturação e as 225+ tarefas entregues com sucesso.
   - Outras empresas: Mencione a busca por desafios e propostas melhores.
   - Sobre ser Fullstack: Use a analogia do RH e apresente os links dos repositórios (bankmore-desafio e desafio-angular).

9. **SUGESTÕES:** Ao final de cada resposta, sugira perguntas como: "Quer saber minha pretensão salarial?", "Quer ver meus projetos práticos de código?" ou "Quais minhas competências técnicas?".
10. **PRETENSÃO E MODELO DE TRABALHO:** Se perguntarem sobre salário ou regime de trabalho: 
   "Minha pretensão salarial é de R$ 12.500,00, sendo negociável entre R$ 9.500,00 e R$ 14.500,00, dependendo das responsabilidades do cargo. Quanto ao modelo de trabalho, aceito propostas Híbridas ou Presenciais, contudo, como não tenho condições de arcar com gastos de transporte no momento, minha preferência atual é pelo trabalho Remoto."
   
11. **PRÊMIO DE INOVAÇÃO (CONFITEC):** Se perguntarem sobre prêmios, conquistas ou o que o deixou mais feliz profissionalmente:
   "Uma das minhas maiores conquistas foi vencer em 1º lugar o Concurso Interno de Inovação na Confitec. Participei de 7 semanas de imersão lideradas pelo diretor Ricardo Stamato, onde aprendi sobre ROI, viabilidade de custos, MVP e a tríade 'Problema-Ação-Solução'.
   Identifiquei uma oportunidade: tanto os clientes quanto a empresa usavam o Microsoft Teams. Propus uma solução simples e de baixo custo de desenvolvimento que integrava o Teams diretamente aos nossos produtos (como o Projur). Apresentei o projeto para diretores e gerentes e venci em primeiro lugar entre 8 concorrentes, recebendo um prêmio de R$ 3.000,00. Essa experiência foi marcante porque uniu tecnologia com visão estratégica de negócio."
`;

/* module pattern para encapsulamento das funções do client gemini */
var gemini = (() => {

    // A API KEY é pega pelo prompt do browser, mas ao fechar a página é removida do localstorage no evento onbeforeunload
    function getApiKey() {        
		let apiKey = 'AIzaSyDeTQnGqaM8TH4_QFuAJsBS-YgNOnn4Pwg';
        if (!apiKey) {
            apiKey = prompt("Informe a Gemini API key:");
        }
        if (apiKey) {
            localStorage.setItem("GEMINI_API_KEY", apiKey);
        }
        return apiKey;
    }
    async function initChat() {
        try {
			const genAI = new GoogleGenerativeAI(getApiKey());
			const model = await genAI.getGenerativeModel({
				model: currentModel,
				systemInstruction
			});
			chat = model.startChat({
				history: historico,
			});

			// Em vez de mostrar o prompt, vamos pedir para o bot se apresentar
			const result = await chat.sendMessage("Olá, apresente-se.");
			const response = await result.response;
			displayMessage("Phill", response.text());

		} catch (error) {
			displayError("Failed to initialize chat: " + error.message);
		}
    }
    async function sendMessage() {
        const userInput = document.getElementById("user-input");
        const message = userInput.value.trim();
        if (message) {
            displayMessage("Você", message);
            userInput.value = "";
            try {
                const startTime = performance.now();
                const result = await chat.sendMessageStream(message);
                let fullResponse = "";
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    fullResponse += chunkText;
                    updateModelResponse(fullResponse);
                }
                const endTime = performance.now();
                const duration = ((endTime - startTime) / 1000).toFixed(2);
                historico.push({
                    role: "user",
                    parts: [{
                        text: message
                    }]
                });
                historico.push({
                    role: "model",
                    parts: [{
                        text: fullResponse
                    }]
                });
                let usage = (await result.response).usageMetadata;
                updateUsageMetadata(usage);
                updateDuration(duration);
            } catch (error) {
                displayError("Error: " + error.message);
            }
        }
    }

    function displayMessage(enviarer, message) {
        const chatMessages = document.getElementById("chat-messages");
		const messageElement = document.createElement("div");
		
		// Define a classe baseada em quem enviou
		const isUser = enviarer === "Você";
		messageElement.className = `msg-wrapper ${isUser ? 'msg-user' : 'msg-phill'}`;
		
		messageElement.innerHTML = `<strong>${enviarer}:</strong> ${marked.parse(message)}`;
		chatMessages.appendChild(messageElement);
		chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function displayError(message) {
        const chatMessages = document.getElementById("chat-messages");
        const errorElement = document.createElement("div");
        errorElement.innerHTML = `
                        <strong style="color: red;">Error:</strong>
                        <span style="color: red;">${message}</span>`;
        chatMessages.appendChild(errorElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function updateModelResponse(response) {
        const chatMessages = document.getElementById("chat-messages");
		let modelResponse = chatMessages.lastElementChild;
		
		if (!modelResponse || !modelResponse.classList.contains("msg-phill")) {
			modelResponse = document.createElement("div");
			modelResponse.className = "msg-wrapper msg-phill";
			chatMessages.appendChild(modelResponse);
		}
		
		// Agora o foco é o nome do seu assistente
		modelResponse.innerHTML = `<strong>Phill:</strong> ${marked.parse(response)}`;
		chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function updateUsageMetadata(metadata) {
        const usageMetadataElement = document.getElementById("usage-metadata");
        usageMetadataElement.textContent = JSON.stringify(metadata, null, 2);
    }

    function updateDuration(duration) {
        const durationElement = document.getElementById("api-duration");
        durationElement.textContent = `Detalhes última chamada API # duração: ${duration} segundos`;
        $('#collapsePanel').hide();
    }

    function changeModel() {
        const modelSelect = document.getElementById("model-select");
        currentModel = modelSelect.value;
        displayMessage("System", `Changing model to ${currentModel}. Reinitializing chat...`);
        historico = [];
        initChat();
    }

    function limparChat() {
        historico = [];
        document.getElementById("chat-messages").innerHTML = "";
        document.getElementById("usage-metadata").textContent = "";
        document.getElementById("api-duration").textContent = "";
        initChat();
    }
    return {
        initChat,
        sendMessage,
        changeModel,
        limparChat
    }
})();
window.onload = () => {
    gemini.initChat();
    document.getElementById("enviar-button").addEventListener("click", gemini.sendMessage);
    document.getElementById("user-input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") gemini.sendMessage();
    });
    document.getElementById("model-select").addEventListener("change", gemini.changeModel);
};

window.onbeforeunload = () => {
    localStorage.removeItem("GEMINI_API_KEY");
};
