import React, { useState, useEffect } from 'react';
import { FormData, GeminiResponse, ApprovedVersionsStore } from '../types';
import { COOKBOOK } from '../data/cookbook';
import { generateCategoryDescription } from '../services/geminiService';

interface CategoryFormProps {
  isThinkingMode: boolean;
  setApprovedVersions: React.Dispatch<React.SetStateAction<ApprovedVersionsStore>>;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ isThinkingMode, setApprovedVersions }) => {
  const [formData, setFormData] = useState<FormData>({
    category: '',
    canal_gerar: 'iFood / Rappi / 99Food',
    comprimento_desejado: 'apps_curto',
    observacoes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeminiResponse | null>(null);
  const [error, setError] = useState('');
  const [editableDescription, setEditableDescription] = useState('');

  const categories = [...new Set(Object.values(COOKBOOK).map(dish => dish.category))].sort();

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      setError('Por favor, selecione uma categoria.');
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError('');

    try {
      const response = await generateCategoryDescription(formData, isThinkingMode);
      setResult(response);
      setEditableDescription(response.descricao);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao gerar a descrição.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = () => {
    if (result && formData.category && formData.canal_gerar) {
      setApprovedVersions(prev => {
        const updatedCategoryVersions = {
          ...(prev[formData.category as string] || {}),
          [formData.canal_gerar as string]: {
            descricao: editableDescription,
            keywords: result.keywords,
            emojis: result.emojis,
          }
        };
        return {
          ...prev,
          [formData.category as string]: updatedCategoryVersions
        };
      });
      alert('Versão aprovada e registrada com sucesso!');
    } else {
        alert('Não há resultado para aprovar. Por favor, gere uma descrição primeiro.');
    }
  };


  return (
    <div className="p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">Escolha a Categoria <span className="text-orange-400">*</span></label>
          <select 
            id="category" 
            value={formData.category || ''} 
            onChange={(e) => handleChange('category', e.target.value)} 
            required
            className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          >
            <option value="" disabled>Selecione uma categoria</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="canal_gerar" className="block text-sm font-medium mb-1">Gerar para qual canal <span className="text-orange-400">*</span></label>
          <select 
            id="canal_gerar"
            value={formData.canal_gerar}
            onChange={(e) => handleChange('canal_gerar', e.target.value)}
            required
            className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          >
            <option>iFood / Rappi / 99Food</option>
            <option>Site (Wix)</option>
            <option>Google Meu Negócio</option>
            <option>WhatsApp (mensagem atendimento)</option>
            <option>Cardápio físico</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="comprimento_desejado" className="block text-sm font-medium mb-1">Comprimento/versão <span className="text-orange-400">*</span></label>
           <select
             id="comprimento_desejado"
             value={formData.comprimento_desejado}
             onChange={(e) => handleChange('comprimento_desejado', e.target.value)}
             required
             className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none"
           >
             <option value="apps_curto">Apps — curto (≤200 chars)</option>
             <option value="site_longo">Site — longo (2–3 parágrafos)</option>
             <option value="google_curto">Google — muito curto (≤120 chars)</option>
             <option value="whatsapp_msg">WhatsApp — 2 frases + CTA</option>
             <option value="cardapio_impresso">Cardápio — 1–2 linhas</option>
           </select>
        </div>

        <div>
          <label htmlFor="observacoes" className="block text-sm font-medium mb-1">Observações/Instruções (opcional)</label>
          <textarea
            id="observacoes"
            value={formData.observacoes || ''}
            onChange={(e) => handleChange('observacoes', e.target.value)}
            placeholder="Ex: Focar na origem dos ingredientes, usar um tom mais informal, etc."
            className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            rows={3}
          />
        </div>

        <div className="pt-4 border-t border-gray-700">
          <button type="submit" disabled={isLoading} className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            {isLoading ? 'Gerando...' : 'Gerar Descrição da Categoria'}
          </button>
        </div>
      </form>
      
      {(isLoading || result || error) && (
        <div className="mt-8">
            <h2 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-4">Resultado da Geração</h2>
            {isLoading && (
                <div className="flex justify-center items-center p-8 bg-gray-800/50 rounded-lg">
                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s] mx-2"></div>
                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
                </div>
            )}
            {error && <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300 whitespace-pre-wrap">{error}</div>}
            {result && (
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase">DESCRIÇÃO GERADA ({result.canal}) - Editável</h3>
                    <textarea
                      value={editableDescription}
                      onChange={(e) => setEditableDescription(e.target.value)}
                      className="w-full p-2 mt-1 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none text-white text-base resize-y"
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-between items-start text-sm pt-2">
                    <div>
                      <h3 className="font-semibold text-gray-400 uppercase">Keywords SEO</h3>
                      <p className="text-gray-300">{result.keywords.join(', ')}</p>
                    </div>
                    <div className="text-right">
                       <h3 className="font-semibold text-gray-400 uppercase">Emojis</h3>
                       <p className="text-2xl">{result.emojis.join(' ')}</p>
                    </div>
                  </div>
                   <div className="text-xs text-gray-500 text-right pt-2">
                      Fonte: <span className="font-mono bg-gray-700 px-2 py-1 rounded">{result.fonte}</span>
                   </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-600">
                        <button type="button" onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Aprovar e Registrar</button>
                        <button type="button" onClick={(e) => { e.preventDefault(); handleSubmit(e); }} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Gerar Outra Versão</button>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default CategoryForm;
