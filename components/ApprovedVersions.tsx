import React, { useState, useMemo } from 'react';
// FIX: Import ApprovedVersion type to fix typing error.
import { ApprovedVersionsStore, ApprovedVersion } from '../types';
import { COOKBOOK } from '../data/cookbook';

interface ApprovedVersionsProps {
  approvedVersions: ApprovedVersionsStore;
  setApprovedVersions: React.Dispatch<React.SetStateAction<ApprovedVersionsStore>>;
}

const ApprovedVersions: React.FC<ApprovedVersionsProps> = ({ approvedVersions, setApprovedVersions }) => {
  // State for the form to add/edit
  const [editItem, setEditItem] = useState('');
  const [editChannel, setEditChannel] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // State for the query section
  const [queryItem, setQueryItem] = useState('');

  // Memoized data sources for selects
  const dishes = useMemo(() => Object.keys(COOKBOOK).sort(), []);
  const categories = useMemo(() => [...new Set(Object.values(COOKBOOK).map(dish => dish.category))].sort(), []);
  const channels = useMemo(() => [
    'iFood / Rappi / 99Food',
    'Site (Wix)',
    'Google Meu Negócio',
    'WhatsApp (mensagem atendimento)',
    'Cardápio físico'
  ], []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem || !editChannel || !editDescription.trim()) {
      alert('Por favor, preencha todos os campos para salvar.');
      return;
    }
    setApprovedVersions(prev => {
      const updatedItemVersions = {
        ...(prev[editItem] || {}),
        [editChannel]: {
          descricao: editDescription,
          keywords: prev[editItem]?.[editChannel]?.keywords || [],
          emojis: prev[editItem]?.[editChannel]?.emojis || [],
        }
      };
      return {
        ...prev,
        [editItem]: updatedItemVersions
      };
    });
    alert('Versão salva com sucesso!');
    // Reset form
    setEditItem('');
    setEditChannel('');
    setEditDescription('');
  };

  const handleQueryItemChange = (itemName: string) => {
    setQueryItem(itemName);
  };
  
  const handleEditSelection = (itemName: string, channelName: string) => {
    setEditItem(itemName);
    setEditChannel(channelName);
    setEditDescription(approvedVersions[itemName]?.[channelName]?.descricao || '');
    const editForm = document.getElementById('edit-form');
    editForm?.scrollIntoView({ behavior: 'smooth' });
  }

  const versionsForQueryItem = queryItem ? approvedVersions[queryItem] : null;

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {/* Section 1: Query */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-600 pb-2">Consultar Versões Aprovadas</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="queryItem" className="block text-sm font-medium mb-1">Selecione um prato ou categoria</label>
            <select
              id="queryItem"
              value={queryItem}
              onChange={(e) => handleQueryItemChange(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="">-- Selecione --</option>
              <optgroup label="Pratos">
                {dishes.map(dish => <option key={dish} value={dish}>{dish}</option>)}
              </optgroup>
              <optgroup label="Categorias">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </optgroup>
            </select>
          </div>

          {queryItem && (
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-lg font-bold mb-3 text-orange-400">{queryItem}</h3>
              {versionsForQueryItem && Object.keys(versionsForQueryItem).length > 0 ? (
                <ul className="space-y-3">
                  {Object.entries(versionsForQueryItem).map(([channel, version]) => {
                    // FIX: Cast 'version' to 'ApprovedVersion' because Object.entries returns value as 'unknown'.
                    const typedVersion = version as ApprovedVersion;
                    return (
                    <li key={channel} className="p-3 bg-gray-900/50 rounded-md border border-gray-600">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-300">{channel}</h4>
                        <button onClick={() => handleEditSelection(queryItem, channel)} className="text-xs text-orange-400 hover:underline">Editar</button>
                      </div>
                      <p className="mt-1 text-white whitespace-pre-wrap">{typedVersion.descricao}</p>
                      {typedVersion.keywords && typedVersion.keywords.length > 0 && <p className="text-xs mt-2 text-gray-400"><b>Keywords:</b> {typedVersion.keywords.join(', ')}</p>}
                      {typedVersion.emojis && typedVersion.emojis.length > 0 && <p className="text-2xl mt-1">{typedVersion.emojis.join(' ')}</p>}
                    </li>
                  );
                })}
                </ul>
              ) : (
                <p className="text-gray-400">Nenhuma versão aprovada encontrada para este item.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Add/Edit Form */}
      <section id="edit-form">
        <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-600 pb-2">Adicionar / Editar Versão Manualmente</h2>
        <form onSubmit={handleSave} className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-4">
          <div>
            <label htmlFor="editItem" className="block text-sm font-medium mb-1">Prato ou Categoria <span className="text-orange-400">*</span></label>
            <select
              id="editItem"
              value={editItem}
              onChange={(e) => setEditItem(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="">-- Selecione --</option>
              <optgroup label="Pratos">
                {dishes.map(dish => <option key={dish} value={dish}>{dish}</option>)}
              </optgroup>
              <optgroup label="Categorias">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </optgroup>
            </select>
          </div>
          <div>
            <label htmlFor="editChannel" className="block text-sm font-medium mb-1">Canal <span className="text-orange-400">*</span></label>
            <select
              id="editChannel"
              value={editChannel}
              onChange={(e) => setEditChannel(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="">-- Selecione --</option>
              {channels.map(channel => <option key={channel} value={channel}>{channel}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="editDescription" className="block text-sm font-medium mb-1">Descrição Aprovada <span className="text-orange-400">*</span></label>
            <textarea
              id="editDescription"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              rows={5}
              placeholder="Digite ou cole aqui a descrição final..."
            />
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
              Salvar Versão
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ApprovedVersions;