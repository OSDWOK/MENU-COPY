import { FormSchema } from '../types';

export const FORM_SCHEMA: FormSchema = {
  "title": "Formulário - Geração de descrições | O Sopro da Wok",
  "description": "Ficha técnica + controles para gerar descrições canal a canal a partir do cookbook oficial.",
  "fields": [
    {
      "id": "prato",
      "type": "select",
      "label": "Escolha o prato (do cookbook)",
      "required": true,
      "placeholder": "Selecione o nome do prato",
      "options": [
        "Arroz Jasmin", "Chapati", "Satay Bovino", "Satay Camarão", "Satay Frango", "Satay Mignon Suíno", "Satay Shitake", "Satay Tofu e Missô", "Sunomono", "Curry Massaman Bovino", "Curry Massaman Camarão", "Curry Massaman Frango", "Curry Massaman Suíno", "Curry Massaman Tofu", "Curry Verde Bovino", "Curry Verde Camarão", "Curry Verde Frango", "Curry Verde Shiitake", "Curry Verde Suíno", "Curry Verde Tofu", "Curry Verde Vegetais", "Curry Vermelho Bovino", "Curry Vermelho Camarão", "Curry Vermelho Frango", "Curry Vermelho Shiitake", "Curry Vermelho Suíno", "Curry Vermelho Tofu", "Curry Vermelho Vegetais", "Dumpling Imperial (Camarão e Suíno)", "Dumpling Sagrado (Suíno)", "Dumpling Supremo (Camarão Glutinoso)", "Dumpling Zen (Shiitake)", "Kids Arroz Bovino", "Kids Arroz Frango", "Kids Macarrão Bovino", "Kids Macarrão Frango", "Chilli Oil", "Molho Azedo e Picante", "Molho de Gergelim", "Molho Sweet and Sour", "Molho Tamarindo e Manga", "Nam Jim Jeaw", "Ultimate Soy Souce", "Nasi Goreng Bovino", "Nasi Goreng Camarão", "Nasi Goreng Frango", "Nasi Goreng Ovos", "Nasi Goreng Shiitake", "Nasi Goreng Suíno", "Nasi Goreng Tofu", "Nasi Goreng Vegetais", "Salada Thai Bovino", "Salada Thai Camarão", "Salada Thai Frango", "Salada Thai Mignon Suíno", "Salada Thai Tofu", "Dumpling Néctar (Gergelim e Mel)", "Gulab Jamun", "Khao Niao Mamuang", "Basílico Bovino", "Basílico Camarão", "Basílico Suíno", "Nenas Camarão", "Nenas Suíno", "Nenas Tofu", "Yaki Udon Bovino", "Yaki Udon Camarão", "Yaki Udon Frango", "Yaki Udon Misto", "Yaki Udon Shiitake", "Yaki Udon Suíno", "Yaki Udon Tofu", "Yaki Udon Vegetais", "Yakisoba Bovino", "Yakisoba Camarão", "Yakisoba Frango", "Yakisoba Misto", "Yakisoba Shiitake", "Yakisoba Suíno", "Yakisoba Tofu", "Yakisoba Vegetais"
      ]
    },
    {
      "id": "ficha_tecnica_upload",
      "type": "file",
      "label": "Ficha Técnica Atualizada (Opcional)",
      "description": "Anexe um arquivo PDF da ficha técnica se houverem alterações no cookbook."
    },
    { "id": "categoria", "type": "text", "label": "Categoria (auto)", "required": true, "readonly": true, "description": "Preenchido automaticamente a partir do cookbook." },
    { "id": "ingredientes", "type": "textarea", "label": "Ingredientes (principal / sub-recipes) — auto", "required": true, "readonly": true, "description": "Lista de ingredientes carregada do cookbook." },
    {
      "id": "perfil_sabor", "type": "select", "label": "Perfil de sabor (escolha ou adicione)", "required": false,
      "options": ["Umami equilibrado", "Picante", "Cítrico e fresco", "Cremoso e aveludado", "Doce e ácido", "Defumado e intenso", "Levemente adocicado"]
    },
    {
      "id": "usar_wok", "type": "checkbox", "label": "Incluir menção ao wok hei?", "required": true,
      "options": [{ "value": "sim", "label": "Sim — destacar 'sopro da wok' / wok hei" }], "default": ["sim"]
    },
    {
      "id": "alergenicos", "type": "checkbox_group", "label": "Alérgenos conhecidos (marque todos aplicáveis)", "required": false,
      "options": ["Amendoim", "Castanha", "Peixes/Frutos do mar", "Glúten (trigo)", "Soja", "Laticínios", "Ovos", "Gergelim", "Outro"]
    },
    {
      "id": "nivel_picancia",
      "type": "select",
      "label": "Nível de picância customizável?",
      "required": true,
      "description": "Selecione se o cliente pode escolher o nível de picância do prato.",
      "options": [
        { "value": "nao_aplicavel", "label": "Não aplicável" },
        { "value": "0_a_5", "label": "Sim, de 0 (sem) a 5 (máxima)" }
      ],
      "default": "nao_aplicavel"
    },
    {
      "id": "veg_vegan", "type": "select", "label": "Opção veg/vegana?", "required": false,
      "options": [{ "value": "nenhuma", "label": "Nenhuma" }, { "value": "veg", "label": "Vegetariano" }, { "value": "vegan", "label": "Vegano" }, { "value": "opcao_substitutiva", "label": "Versão alternativa disponível" }]
    },
    { "id": "porcao_tamanho", "type": "text", "label": "Porção / tamanho (ex.: individual, família)", "required": false },
    { "id": "origem_fornecedor", "type": "text", "label": "Ingrediente premium / fornecedor (opcional)", "required": false, "description": "Ex.: 'Camarão Vannamei 30/40 — fornecedor X'" },
    { "id": "tempo_preparo", "type": "text", "label": "Tempo médio preparo/retirada (minutos)", "required": false, "validation": { "pattern": "^\\d{1,3}$", "message": "Insira número em minutos" } },
    { "id": "foto_url", "type": "url", "label": "Foto do prato (URL)", "required": false },
    { "id": "observacoes", "type": "textarea", "label": "Observações do gerente (opcional)", "required": false, "placeholder": "Instruções de tom, restrições, promoções..." },
    {
      "id": "canal_gerar", "type": "select", "label": "Gerar para qual canal", "required": true,
      "options": ["iFood / Rappi / 99Food", "Site (Wix)", "Google Meu Negócio", "WhatsApp (mensagem atendimento)", "Cardápio físico"]
    },
    {
      "id": "comprimento_desejado", "type": "select", "label": "Comprimento/versão", "required": true,
      "options": [{ "value": "apps_curto", "label": "Apps — curto (≤200 chars)" }, { "value": "site_longo", "label": "Site — longo (2–3 parágrafos)" }, { "value": "google_curto", "label": "Google — muito curto (≤120 chars)" }, { "value": "whatsapp_msg", "label": "WhatsApp — 2 frases + CTA" }, { "value": "cardapio_impresso", "label": "Cardápio — 1–2 linhas" }],
      "default": "apps_curto"
    }
  ]
};