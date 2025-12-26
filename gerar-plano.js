import OpenAI from "openai";

export default async (req) => {
  const token = req.headers.authorization;

  if (!token) {
    return {
      statusCode: 401,
      body: "Não autorizado"
    };
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const { respostas, observacoes } = JSON.parse(req.body);

  const prompt = `
Você é um especialista humano em comportamento.
Analise profundamente as respostas e observações.
Explique o perfil da pessoa e gere um plano diário detalhado,
variável, progressivo e personalizado.

Respostas:
${JSON.stringify(respostas)}

Observações:
${observacoes}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [{ role: "user", content: prompt }]
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      resultado: completion.choices[0].message.content
    })
  };
};
// const token = req.headers.authorization;

// if (!token) {
//   return {
//     statusCode: 401,
//     body: "Não autorizado"
//   };
// }
