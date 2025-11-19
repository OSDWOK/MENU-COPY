import React, { useState, useEffect } from 'react';
import { FormData, FormField, GeminiResponse, UploadedFile, ApprovedVersionsStore } from '../types';
import { FORM_SCHEMA } from '../data/schema';
import { COOKBOOK } from '../data/cookbook';
import { generateDescription } from '../services/geminiService';

interface CopywritingFormProps {
  isThinkingMode: boolean;
  setApprovedVersions: React.Dispatch<React.SetStateAction<ApprovedVersionsStore>>;
}

const CopywritingForm: React.FC<CopywritingFormProps> = ({ isThinkingMode, setApprovedVersions }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeminiResponse | null>(null);
  const [error, setError] = useState('');
  const [editableDescription, setEditableDescription] = useState('');

  useEffect(() => {
    const initialData: FormData = {};
    FORM_SCHEMA.fields.forEach(field => {
      initialData[field.id] = field.default !== undefined ? field.default : Array.isArray(field.options) && (field.type === 'checkbox_group' || field.type === 'checkbox') ? [] : '';
    });
    setFormData(initialData);
  }, []);

  const handleChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));

    if (id === 'prato' && value) {
      const dish = COOKBOOK[value];
      if (dish) {
        setFormData(prev => ({
          ...prev,
          prato: value,
          categoria: dish.category,
          ingredientes: dish.ingredients.join('\n'),
        }));
      }
    }
  };

  const handleCheckboxChange = (id: string, value: string) => {
    const currentValues = formData[id] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    handleChange(id, newValues);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Por favor, selecione um arquivo PDF.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64StringWithPrefix = loadEvent.target?.result as string;
        if (base64StringWithPrefix) {
           const base64String = base64StringWithPrefix.split(',')[1];
           const uploadedFile: UploadedFile = {
              name: file.name,
              mimeType: file.type,
              data: base64String,
           };
           handleChange('ficha_tecnica_upload', uploadedFile);
        }
      };
      reader.onerror = () => {
         setError('Falha ao ler o arquivo.');
      }
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    handleChange('ficha_tecnica_upload', null);
    const fileInput = document.getElementById('ficha_tecnica_upload-input') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError('');

    try {
      const response = await generateDescription(formData, isThinkingMode);
      setResult(response);
      setEditableDescription(response.descricao);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao gerar a descrição.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = () => {
    if (result && formData.prato && formData.canal_gerar) {
      setApprovedVersions(prev => {
        const updatedPratoVersions = {
          ...(prev[formData.prato as string] || {}),
          [formData.canal_gerar as string]: {
            descricao: editableDescription,
            keywords: result.keywords,
            emojis: result.emojis,
          }
        };
        return {
          ...prev,
          [formData.prato as string]: updatedPratoVersions
        };
      });
      alert('Versão aprovada e registrada com sucesso!');
    } else {
        alert('Não há resultado para aprovar. Por favor, gere uma descrição primeiro.');
    }
  };
  
  const renderField = (field: FormField) => {
    const commonProps = "w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none";
    
    switch (field.type) {
      case 'file':
        const uploadedFile = formData.ficha_tecnica_upload as UploadedFile | undefined;
        return (
            <div className="flex flex-col items-start gap-2">
                <label htmlFor="ficha_tecnica_upload-input" className="w-full text-center cursor-pointer p-3 bg-gray-700 rounded-md border border-dashed border-gray-500 hover:border-orange-500 hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="text-gray-300">
                        {uploadedFile ? 'Trocar Ficha Técnica (PDF)' : 'Anexar Ficha Técnica (PDF)'}
                    </span>
                </label>
                <input type="file" id="ficha_tecnica_upload-input" onChange={handleFileChange} className="sr-only" accept="application/pdf" />
                
                {uploadedFile && (
                    <div className="flex items-center justify-between w-full p-2 pl-3 bg-gray-800 border border-gray-700 rounded-md text-sm">
                        <span className="text-gray-300 truncate">{uploadedFile.name}</span>
                        <button type="button" onClick={clearFile} className="ml-2 p-1 text-gray-400 hover:text-white hover:bg-red-500 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        );
      case 'select':
        return (
          <select id={field.id} value={formData[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} required={field.required} className={commonProps}>
            <option value="" disabled>{field.placeholder || 'Selecione'}</option>
            {field.options?.map(opt => (
                typeof opt === 'string' ? <option key={opt} value={opt}>{opt}</option> : <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      case 'textarea':
        return <textarea id={field.id} value={formData[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} required={field.required} readOnly={field.readonly} placeholder={field.placeholder} className={`${commonProps} ${field.readonly ? 'bg-gray-800' : ''}`} rows={field.readonly ? 5 : 3}></textarea>;
      case 'checkbox':
         return (
             <div>
                 {field.options?.map(opt => {
                    const option = typeof opt === 'string' ? { value: opt, label: opt } : opt;
                     return (
                         <div key={option.value} className="flex items-center gap-2">
                             <input type="checkbox" id={`${field.id}-${option.value}`} value={option.value} checked={formData[field.id]?.includes(option.value)} onChange={() => handleCheckboxChange(field.id, option.value)} className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500" />
                             <label htmlFor={`${field.id}-${option.value}`}>{option.label}</label>
                         </div>
                     );
                 })}
             </div>
         );
      case 'checkbox_group':
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                 {field.options?.map(opt => {
                    const optionValue = typeof opt === 'string' ? opt : opt.value;
                    const optionLabel = typeof opt === 'string' ? opt : opt.label;
                     return (
                         <div key={optionValue} className="flex items-center gap-2">
                             <input type="checkbox" id={`${field.id}-${optionValue}`} value={optionValue} checked={formData[field.id]?.includes(optionValue)} onChange={() => handleCheckboxChange(field.id, optionValue)} className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500" />
                             <label htmlFor={`${field.id}-${optionValue}`}>{optionLabel}</label>
                         </div>
                     );
                 })}
             </div>
        );
      case 'url':
      case 'text':
      default:
        return <input type={field.type === 'url' ? 'url' : 'text'} id={field.id} value={formData[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} required={field.required} readOnly={field.readonly} placeholder={field.placeholder} className={`${commonProps} ${field.readonly ? 'bg-gray-800' : ''}`} />;
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {FORM_SCHEMA.fields.map(field => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium mb-1">{field.label} {field.required && <span className="text-orange-400">*</span>}</label>
            {renderField(field)}
            {field.description && <p className="text-xs text-gray-400 mt-1">{field.description}</p>}
          </div>
        ))}

        <div className="pt-4 border-t border-gray-700">
          <button type="submit" disabled={isLoading} className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            {isLoading ? 'Gerando...' : 'Gerar Versão para o Canal Selecionado'}
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

export default CopywritingForm;
