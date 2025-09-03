import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Save, 
  Send, 
  Upload,
  X,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockDepartments } from '../../data/mockData';
import { RequestItem } from '../../types';

const requestSchema = z.object({
  department: z.string().min(1, 'Departamento é obrigatório'),
  urgency: z.enum(['normal', 'urgent', 'critical']),
  requestType: z.enum(['material', 'service', 'equipment']),
  items: z.array(z.object({
    description: z.string().min(1, 'Descrição é obrigatória'),
    quantity: z.number().min(0.01, 'Quantidade deve ser maior que 0'),
    unit: z.string().min(1, 'Unidade é obrigatória'),
    estimatedValue: z.number().min(0, 'Valor deve ser maior ou igual a 0').optional(),
    specifications: z.string().optional(),
    suggestedSupplier: z.string().optional(),
  })).min(1, 'Pelo menos um item é obrigatório'),
  justification: z.string().min(10, 'Justificativa deve ter pelo menos 10 caracteres'),
  expectedDate: z.string().min(1, 'Data prevista é obrigatória'),
  deliveryLocation: z.string().min(1, 'Local de entrega é obrigatório'),
  observations: z.string().optional(),
  projectCode: z.string().optional(),
});

type RequestFormData = z.infer<typeof requestSchema>;

export function NewRequestForm() {
  const navigate = useNavigate();
  const { createRequest, addNotification } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [searchHistoryModal, setSearchHistoryModal] = useState<{
    isOpen: boolean;
    itemIndex: number;
    searchTerm: string;
  }>({
    isOpen: false,
    itemIndex: -1,
    searchTerm: ''
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
    reset,
    setValue
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      urgency: 'normal',
      requestType: 'material',
      items: [{ description: '', quantity: 1, unit: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const watchedItems = watch('items');
  const totalValue = watchedItems.reduce((sum, item) => sum + (item.estimatedValue || 0), 0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: RequestFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      createRequest({
        ...data,
        department: mockDepartments.find(d => d.id === data.department)!,
        items: data.items.map((item, index) => ({
          ...item,
          id: `item-${Date.now()}-${index}`,
        })),
        totalValue: totalValue > 0 ? totalValue : undefined,
        status: 'submitted',
      });

      addNotification({
        type: 'success',
        title: 'Requisição Criada',
        message: 'Sua requisição foi criada com sucesso e está aguardando aprovação.',
        read: false
      });

      navigate('/minhas-requisicoes');
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Ocorreu um erro ao criar a requisição. Tente novamente.',
        read: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    append({ description: '', quantity: 1, unit: '' });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleSearchHistory = (itemIndex: number) => {
    const currentItem = watchedItems[itemIndex];
    const searchTerm = currentItem.description || currentItem.specifications || '';
    
    setSearchHistoryModal({
      isOpen: true,
      itemIndex,
      searchTerm: searchTerm.trim()
    });
  };

  const closeSearchHistoryModal = () => {
    setSearchHistoryModal({
      isOpen: false,
      itemIndex: -1,
      searchTerm: ''
    });
  };

  const applyHistoryItem = (historyItem: any) => {
    const { itemIndex } = searchHistoryModal;
    
    // Aplicar dados do histórico ao item atual
    setValue(`items.${itemIndex}.description`, historyItem.description);
    setValue(`items.${itemIndex}.unit`, historyItem.unit);
    setValue(`items.${itemIndex}.specifications`, historyItem.specifications);
    setValue(`items.${itemIndex}.suggestedSupplier`, historyItem.suggestedSupplier);
    
    closeSearchHistoryModal();
    
    addNotification({
      type: 'success',
      title: 'Histórico Aplicado',
      message: 'Os dados do histórico foram aplicados ao item atual.',
      read: false
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ld-gray-900">Nova Requisição</h1>
        <p className="text-ld-gray-600">
          Preencha os dados abaixo para criar uma nova requisição de compra.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informações Básicas */}
        <div className="card">
          <h2 className="text-lg font-semibold text-ld-gray-900 mb-4">
            Informações Básicas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-ld-gray-700 mb-2">
                Departamento
              </label>
              <select
                {...register('department')}
                className="input-field"
              >
                <option value="">Selecione...</option>
                {mockDepartments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.department.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ld-gray-700 mb-2">
                Urgência
              </label>
              <select
                {...register('urgency')}
                className="input-field"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgente</option>
                <option value="critical">Crítica</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ld-gray-700 mb-2">
                Tipo de Requisição
              </label>
              <select
                {...register('requestType')}
                className="input-field"
              >
                <option value="material">Material</option>
                <option value="service">Serviço</option>
                <option value="equipment">Equipamento</option>
              </select>
            </div>
          </div>
        </div>

        {/* Itens da Requisição */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-ld-gray-900">
              Itens da Requisição
            </h2>
            <button
              type="button"
              onClick={addItem}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-ld-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-ld-gray-700">
                    Item {index + 1}
                  </h3>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-ld-gray-700 mb-2">
                      Descrição *
                    </label>
                    <input
                      {...register(`items.${index}.description`)}
                      className="input-field"
                      placeholder="Descreva o item ou serviço"
                    />
                    {errors.items?.[index]?.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.items[index]?.description?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ld-gray-700 mb-2">
                      Quantidade *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                      className="input-field"
                      min="0.01"
                    />
                    {errors.items?.[index]?.quantity && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.items[index]?.quantity?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ld-gray-700 mb-2">
                      Unidade *
                    </label>
                    <input
                      {...register(`items.${index}.unit`)}
                      className="input-field"
                      placeholder="un, kg, m, etc."
                    />
                    {errors.items?.[index]?.unit && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.items[index]?.unit?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ld-gray-700 mb-2">
                      Valor Estimado
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.estimatedValue`, { valueAsNumber: true })}
                      className="input-field"
                      placeholder="0,00"
                      min="0"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-ld-gray-700 mb-2">
                      Especificações Técnicas
                    </label>
                    <div className="flex gap-2">
                      <textarea
                        {...register(`items.${index}.specifications`)}
                        className="input-field flex-1"
                        rows={2}
                        placeholder="Especificações técnicas, marca, modelo, etc."
                      />
                      <button
                        type="button"
                        onClick={() => handleSearchHistory(index)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex-shrink-0 self-end"
                        title="Buscar histórico de requisições similares"
                      >
                        Buscar Histórico
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-ld-gray-700 mb-2">
                      Fornecedor Sugerido
                    </label>
                    <input
                      {...register(`items.${index}.suggestedSupplier`)}
                      className="input-field"
                      placeholder="Nome do fornecedor sugerido (opcional)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {errors.items && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.items.message}
            </p>
          )}
        </div>

        {/* Informações Complementares */}
        <div className="card">
          <h2 className="text-lg font-semibold text-ld-gray-900 mb-4">
            Informações Complementares
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ld-gray-700 mb-2">
                Justificativa/Finalidade *
              </label>
              <textarea
                {...register('justification')}
                className="input-field"
                rows={3}
                placeholder="Explique a necessidade e finalidade desta requisição"
              />
              {errors.justification && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.justification.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ld-gray-700 mb-2">
                Data Prevista de Necessidade *
              </label>
              <input
                type="date"
                {...register('expectedDate')}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.expectedDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.expectedDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ld-gray-700 mb-2">
                Local de Entrega *
              </label>
              <input
                {...register('deliveryLocation')}
                className="input-field"
                placeholder="Setor, prédio, endereço"
              />
              {errors.deliveryLocation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.deliveryLocation.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ld-gray-700 mb-2">
                Código do Projeto
              </label>
              <input
                {...register('projectCode')}
                className="input-field"
                placeholder="Código do projeto (se aplicável)"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-ld-gray-700 mb-2">
              Observações Gerais
            </label>
            <textarea
              {...register('observations')}
              className="input-field"
              rows={3}
              placeholder="Observações adicionais, restrições, etc."
            />
          </div>
        </div>

        {/* Anexos */}
        <div className="card">
          <h2 className="text-lg font-semibold text-ld-gray-900 mb-4">
            Anexos
          </h2>
          
          <div className="border-2 border-dashed border-ld-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-ld-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="btn-primary cursor-pointer">
                Selecionar Arquivos
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              />
            </div>
            <p className="mt-2 text-sm text-ld-gray-600">
              PDF, Word, Excel, imagens (máx. 10MB cada)
            </p>
          </div>

          {attachments.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-ld-gray-700 mb-2">
                Arquivos Selecionados:
              </h3>
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-ld-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-sm text-ld-gray-700">{file.name}</span>
                      <span className="ml-2 text-xs text-ld-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Resumo e Validação */}
        <div className="card bg-ld-green-50 border-ld-green-200">
          <h2 className="text-lg font-semibold text-ld-green-800 mb-4">
            Resumo da Requisição
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-ld-green-700">Total de Itens:</p>
              <p className="text-lg font-semibold text-ld-green-800">{fields.length}</p>
            </div>
            <div>
              <p className="text-sm text-ld-green-700">Valor Total Estimado:</p>
              <p className="text-lg font-semibold text-ld-green-800">
                {totalValue > 0 ? `R$ ${totalValue.toFixed(2)}` : 'Não informado'}
              </p>
            </div>
            <div>
              <p className="text-sm text-ld-green-700">Status:</p>
              <p className="text-lg font-semibold text-ld-green-800">Rascunho</p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/minhas-requisicoes')}
            className="btn-secondary"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processando...
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Salvar e Enviar
              </div>
            )}
          </button>
        </div>
      </form>

      {/* Modal de Busca de Histórico */}
      {searchHistoryModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-ld-gray-900">
                Buscar Histórico de Requisições
              </h3>
              <button
                onClick={closeSearchHistoryModal}
                className="text-ld-gray-400 hover:text-ld-gray-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-ld-gray-700 mb-2">
                Termo de Busca
              </label>
              <input
                type="text"
                value={searchHistoryModal.searchTerm}
                onChange={(e) => setSearchHistoryModal(prev => ({
                  ...prev,
                  searchTerm: e.target.value
                }))}
                className="input-field"
                placeholder="Digite para buscar no histórico..."
              />
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-ld-gray-700">Resultados do Histórico:</h4>
              
              {/* Mock de dados de histórico - em produção seria uma busca real */}
              {searchHistoryModal.searchTerm ? (
                <div className="space-y-3">
                  <div className="border border-ld-gray-200 rounded-lg p-4 hover:bg-ld-gray-50 cursor-pointer"
                       onClick={() => applyHistoryItem({
                         description: 'Papel A4 75g',
                         unit: 'resma',
                         specifications: 'Papel A4 75g, branco, 500 folhas por resma',
                         suggestedSupplier: 'Papelaria Central'
                       })}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-ld-gray-900">Papel A4 75g</p>
                        <p className="text-sm text-ld-gray-600">Unidade: resma</p>
                        <p className="text-sm text-ld-gray-600">Fornecedor: Papelaria Central</p>
                      </div>
                      <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors">
                        Aplicar
                      </button>
                    </div>
                  </div>

                  <div className="border border-ld-gray-200 rounded-lg p-4 hover:bg-ld-gray-50 cursor-pointer"
                       onClick={() => applyHistoryItem({
                         description: 'Toner HP LaserJet',
                         unit: 'unidade',
                         specifications: 'Toner HP LaserJet 26A, compatível com impressoras HP LaserJet Pro',
                         suggestedSupplier: 'TecnoSupply'
                       })}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-ld-gray-900">Toner HP LaserJet</p>
                        <p className="text-sm text-ld-gray-600">Unidade: unidade</p>
                        <p className="text-sm text-ld-gray-600">Fornecedor: TecnoSupply</p>
                      </div>
                      <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors">
                        Aplicar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-ld-gray-500">
                  <p>Digite um termo para buscar no histórico de requisições</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeSearchHistoryModal}
                className="btn-secondary"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
