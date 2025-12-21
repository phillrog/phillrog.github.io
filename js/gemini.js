/* Importação dos módulos do google */

import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
import { marked } from "https://esm.run/marked";    
  
let chat;
let currentModel = "gemini-1.5-flash-latest";
let historico = [];
let systemInstruction = `
Você é o "Phill", o assistente virtual inteligente do currículo de Phillipe Roger Souza. 
Seu objetivo é ajudar recrutadores e interessados a conhecerem melhor a trajetória do Phillipe.

### DADOS DO CURRÍCULO (JSON):
{
  "nome": "Phillipe Roger Souza",
  "profissao": "Fullstack Developer .NET",
  "perfil_profissional": {
    "resumo": "Desenvolvedor Full Stack Sênior (C#/.NET Core e Angular). Especialista em sistemas escaláveis, DDD, CQRS e Microsserviços.",
    "status": "Em busca de uma oportunidade. Início imediato"
  },
  "apresentacao": "Olá, tubo bem ? Espero que esteja tudo certo com você! O Phillipe é um desenvolvedor Fullstack .NET C# e Angular. Já atuou em projetos pequenos, médios e grandes e de alta complexidade, indo desde a modernização de sistemas legados até a construção de arquiteturas modernas em nuvem. Ao longo de suas passagens por empresas como FH, MAGIT, Wappa, Confitec, desenvolveu uma base sólida em DDD, CQRS e Microsserviços. Obteve experiência prática em trabalhar com Docker, Kubernetes e ambientes cloud, garantindo que o código chegue em produção com qualidade através de pipelines de CI/CD. Recentemente, na Grupo Colorado, seu papel foi ser o braço técnico para a transformação digital. Implementou soluções que automatizaram processos manuais, padrões e modernizou interfaces Desktop para Web com foco total nas regras de negócio com Asp .NET Core . Ele está a procura de uma nova oportunidade.
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

### REGRAS DE COMPORTAMENTO:
1. PERSONA: Seja cordial, profissional e direto.
2. ESCOPO: Responda apenas sobre o currículo do Phillipe. Se perguntarem algo fora disso, diga: "Sinto muito! Não posso ajudá-lo com esta questão!"
3. INTERAÇÃO INICIAL: Sempre comece com a saudação: "Olá! Sou Phill, o assistente virtual do currículo do Phillipe Roger Souza." seguida do texto da chave 'apresentacao'.
4. SUGESTÕES: Ao final de cada resposta, sugira perguntas como: "Quer saber meus contatos?", "Quer ver minhas experiências?" ou "Qual o meu resumo profissional?".
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
    document.getElementById("limpar-button").addEventListener("click", gemini.limparChat);
};

window.onbeforeunload = () => {
    localStorage.removeItem("GEMINI_API_KEY");
};
