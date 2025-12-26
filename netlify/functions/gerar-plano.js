const OpenAI = require("openai");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method Not Allowed"
      };
    }

    const body = JSON.parse(event.body || "{}");

    const {
      respostas = {},
      diagnosticoBase = "",
      observacoes = "",
      diasPlano = 7
    } = body;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `
Você é um mentor humano especialista em comportamento, rotina e desenvolvimento pessoal.

Com base nas informações abaixo, gere:
1) Um diagnóstico claro e humano
2) Um plano EXTREMAMENTE detalhado, dia a dia, progressivo
3) Rotina adaptada a horários, domingo diferente, trabalho, alimentação, leitura
4) Nada repetido de um dia para o outro
5) Linguagem prática, direta, sem frases genéricas

RESPOSTAS:
${JSON.stringify(respostas, null, 2)}

DIAGNÓSTICO BASE:
${diagnosticoBase}

OBSERVAÇÕES DO USUÁRIO:
${observacoes}

DURAÇÃO DO PLANO:
${diasPlano} dias
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const plano = completion.choices[0].message.content;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ plano })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Erro interno na geração do plano",
        detalhes: error.message
      })
    };
  }
};
