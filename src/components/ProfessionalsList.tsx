
import React, { useState } from 'react';
import { Professional } from '../types';

interface ProfessionalsListProps {
  professionals: Professional[];
  onAddProfessional: (firstName: string, lastName: string) => void;
  onEditProfessional: (id: string, firstName: string, lastName: string) => void;
  onDeleteProfessional: (id: string) => void;
  onImportProfessionals: (professionals: { firstName: string; lastName: string }[]) => void;
}

const ProfessionalsList: React.FC<ProfessionalsListProps> = ({
  professionals,
  onAddProfessional,
  onEditProfessional,
  onDeleteProfessional,
  onImportProfessionals,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName.trim() && lastName.trim()) {
      if (editingId) {
        onEditProfessional(editingId, firstName.trim(), lastName.trim());
        setEditingId(null);
      } else {
        onAddProfessional(firstName.trim(), lastName.trim());
        setShowAddModal(false);
      }
      setFirstName('');
      setLastName('');
    }
  };

  const handleEdit = (professional: Professional) => {
    setEditingId(professional.id);
    setFirstName(professional.firstName);
    setLastName(professional.lastName);
    setOpenMenuId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce professionnel ?')) {
      onDeleteProfessional(id);
    }
    setOpenMenuId(null);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      const importedProfessionals: { firstName: string; lastName: string }[] = [];
      
      lines.forEach((line, index) => {
        // Ignorer la première ligne si elle contient des en-têtes
        if (index === 0 && (line.toLowerCase().includes('prénom') || line.toLowerCase().includes('nom'))) {
          return;
        }
        
        const [firstName, lastName] = line.split(',').map(item => item.trim().replace(/"/g, ''));
        if (firstName && lastName) {
          importedProfessionals.push({ firstName, lastName });
        }
      });

      if (importedProfessionals.length > 0) {
        onImportProfessionals(importedProfessionals);
        setShowImportModal(false);
        // Reset file input
        if (event.target) {
          event.target.value = '';
        }
      } else {
        alert('Aucun professionnel valide trouvé dans le fichier. Vérifiez le format : Prénom,Nom');
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Professionnels</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
          >
            📤 Importer CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
          >
            + Ajouter un professionnel
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {professionals.map((professional) => (
          <div
            key={professional.id}
            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div>
              <h3 className="font-medium text-gray-800">
                {professional.firstName} {professional.lastName}
              </h3>
              <p className="text-sm text-gray-500">
                Ajouté le {new Date(professional.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => setOpenMenuId(openMenuId === professional.id ? null : professional.id)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
              >
                ⋮
              </button>
              {openMenuId === professional.id && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
                  <button
                    onClick={() => handleEdit(professional)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 rounded-t-lg"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(professional.id)}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-b-lg"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {professionals.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">Aucun professionnel enregistré</p>
            <p className="text-sm">Commencez par ajouter votre premier professionnel</p>
          </div>
        )}
      </div>

      {(showAddModal || editingId) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {editingId ? 'Modifier le professionnel' : 'Ajouter un professionnel'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Prénom"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingId(null);
                    setFirstName('');
                    setLastName('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  {editingId ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Importer des professionnels (CSV)
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Format attendu : une ligne par professionnel avec Prénom,Nom
              </p>
              <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                Exemple :<br/>
                Jean,Dupont<br/>
                Marie,Martin<br/>
                Pierre,Bernard
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner le fichier CSV
              </label>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileImport}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalsList;
