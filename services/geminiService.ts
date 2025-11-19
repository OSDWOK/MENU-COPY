
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { FormData, GeminiResponse, Message, Sender, UploadedFile } from '../types';

const buildPromptFromForm = (formData: FormData): string => {
  const ingredientsText = Array.isArray(formData.ingredientes)
    ? formData.ingredientes.map(ing => `- ${ing}`).join('\n')
    : formData.ingredientes;
  
  const fileInstruction = formData.ficha_tecnica_upload 
    ? `
### INSTRUÇÃO CRÍTICA
Uma imagem da ficha técnica atualizada foi anexada. **Use a imagem como a fonte primária e única de verdade para nome do prato e ingredientes.** Ignore os campos de texto abaixo se conflitarem com a imagem.
`
    : `
Gere uma descrição de marketing para o prato a seguir, com base na ficha técnica abaixo.
`;

  return `
${fileInstruction}
Siga estritamente o formato de saída JSON definido nas suas instruções de sistema.

### Contexto
- **Canal de Destino:** ${formData.canal_gerar}
- **Comprimento Solicitado:** ${formData.comprimento_desejado}
- **Público-alvo:** Clientes do restaurante O Sopro da Wok em Curitiba.

### Ficha Técnica do Prato (do Cookbook - use apenas se não houver anexo)
- **Nome do Prato:** ${formData.prato}
- **Categoria:** ${formData.categoria}
- **Ingredientes:**
${ingredientsText}
- **Perfil de Sabor:** ${formData.perfil_sabor || 'Não especificado'}
- **Porção/Tamanho:** ${formData.porcao_tamanho || 'Não especificado'}
- **Alérgenos:** ${formData.alergenicos?.join(', ') || 'Nenhum informado'}
- **Nível de Picância Customizável:** ${formData.nivel_picancia === '0_a_5' ? 'Sim, o cliente pode escolher de 0 a 5.' : 'Não aplicável'}
- **Opção Veg/Vegana:** ${formData.veg_vegan || 'Não aplicável'}

### Diretrizes de Copywriting
- **Mencionar Wok Hei?** ${formData.usar_wok?.includes('sim') ? 'Sim, destaque a técnica do wok hei de forma sutil.' : 'Não'}
- **Ingrediente Premium a Destacar:** ${formData.origem_fornecedor || 'Nenhum'}
- **Observações Adicionais:** ${formData.observacoes || 'Nenhuma'}
`;
}

const buildPromptForCategory = (formData: FormData): string => {
  const observationsInstruction = formData.observacoes
    ? `
### Observações Adicionais
- ${formData.observacoes}
`
    : '';

  return `
Gere uma descrição de marketing para a categoria de pratos a seguir.
Siga estritamente as regras para "GERAÇÃO POR CATEGORIA" definidas nas suas instruções de sistema.
Foque no conceito geral da categoria, no estilo de comida, e na experiência que ela proporciona. NÃO liste ingredientes específicos de pratos individuais.

### Contexto
- **Categoria:** ${formData.category}
- **Canal de Destino:** ${formData.canal_gerar}
- **Comprimento Solicitado:** ${formData.comprimento_desejado}
- **Público-alvo:** Clientes do restaurante O Sopro da Wok em Curitiba.${observationsInstruction}
`;
};


export const generateDescription = async (formData: FormData, isThinkingMode: boolean): Promise<GeminiResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelName = isThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    const modelConfig = isThinkingMode 
      ? { thinkingConfig: { thinkingBudget: 32768 } }
      : {};

    const prompt = buildPromptFromForm(formData);
    const uploadedFile = formData.ficha_tecnica_upload as UploadedFile | undefined;

    let contents: any;

    if (uploadedFile) {
        contents = {
            parts: [
                { text: prompt },
                {
                    inlineData: {
                        mimeType: uploadedFile.mimeType,
                        data: uploadedFile.data,
                    },
                },
            ],
        };
    } else {
        contents = prompt;
    }


    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        ...modelConfig,
      }
    });
    
    try {
      const cleanedText = response.text.replace(/^```json\s*|```\s*$/g, '');
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Error parsing JSON response from Gemini:", parseError);
      console.error("Raw Gemini response text:", response.text);
      return {
        descricao: `Falha ao processar a resposta da IA. Resposta recebida:\n${response.text}`,
        keywords: [],
        emojis: [],
        fonte: 'erro de processamento',
        canal: formData.canal_gerar || 'desconhecido'
      };
    }

  } catch (error) {
    console.error("Error generating response from Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Desculpe, ocorreu um erro ao conectar com a IA: ${error.message}`);
    }
    throw new Error("Desculpe, ocorreu um erro desconhecido ao conectar com a IA.");
  }
};

export const generateCategoryDescription = async (formData: FormData, isThinkingMode: boolean): Promise<GeminiResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelName = isThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    const modelConfig = isThinkingMode 
      ? { thinkingConfig: { thinkingBudget: 32768 } }
      : {};

    const prompt = buildPromptForCategory(formData);

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        ...modelConfig,
      }
    });
    
    try {
      const cleanedText = response.text.replace(/^```json\s*|```\s*$/g, '');
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Error parsing JSON response from Gemini:", parseError);
      console.error("Raw Gemini response text:", response.text);
      return {
        descricao: `Falha ao processar a resposta da IA. Resposta recebida:\n${response.text}`,
        keywords: [],
        emojis: [],
        fonte: 'erro de processamento',
        canal: formData.canal_gerar || 'desconhecido'
      };
    }

  } catch (error) {
    console.error("Error generating response from Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Desculpe, ocorreu um erro ao conectar com a IA: ${error.message}`);
    }
    throw new Error("Desculpe, ocorreu um erro desconhecido ao conectar com a IA.");
  }
};

export const generateResponse = async (messages: Message[], isThinkingMode: boolean): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelName = isThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    const modelConfig = isThinkingMode 
      ? { thinkingConfig: { thinkingBudget: 32768 } }
      : {};

    const contents = messages.map(message => ({
        role: message.sender === Sender.User ? 'user' : 'model',
        parts: [{ text: message.text }]
    }));

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        ...modelConfig,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating response from Gemini:", error);
    if (error instanceof Error) {
        return `Desculpe, ocorreu um erro ao conectar com a IA: ${error.message}`;
    }
    return "Desculpe, ocorreu um erro desconhecido ao conectar com a IA.";
  }
};