'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PlusIcon, SearchIcon, DownloadIcon } from '@/components/icons/Icons';
import { formatCurrency } from '@/lib/utils/helpers';

// Material type definition
type Material = {
  id: string;
  name: string;
  type: string;
  unit: string;
  unitPrice: number;
  totalQuantity: number;
  allocated: number;
  available: number;
};

export default function MaterialsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be:
        // const response = await materialsAPI.getAll();
        // setMaterials(response.data);
        
        // Mock data for demonstration
        const mockMaterials = [
          {
            id: '1',
            name: 'Portland Cement',
            type: 'cement',
            unit: 'bag',
            unitPrice: 800,
            totalQuantity: 2500,
            allocated: 1800,
            available: 700
          },
          {
            id: '2',
            name: 'River Sand',
            type: 'aggregates',
            unit: 'cubic meter',
            unitPrice: 3500,
            totalQuantity: 350,
            allocated: 280,
            available: 70
          },
          {
            id: '3',
            name: 'Crushed Stone',
            type: 'aggregates',
            unit: 'ton',
            unitPrice: 2200,
            totalQuantity: 450,
            allocated: 300,
            available: 150
          },
          {
            id: '4',
            name: 'Steel Reinforcement (12mm)',
            type: 'steel',
            unit: 'ton',
            unitPrice: 120000,
            totalQuantity: 45,
            allocated: 35,
            available: 10
          },
          {
            id: '5',
            name: 'Timber (2x4)',
            type: 'wood',
            unit: 'piece',
            unitPrice: 400,
            totalQuantity: 3000,
            allocated: 2100,
            available: 900
          },
          {
            id: '6',
            name: 'Bricks',
            type: 'masonry',
            unit: 'piece',
            unitPrice: 15,
            totalQuantity: 85000,
            allocated: 65000,
            available: 20000
          },
          {
            id: '7',
            name: 'PVC Pipes (100mm)',
            type: 'plumbing',
            unit: 'meter',
            unitPrice: 350,
            totalQuantity: 1200,
            allocated: 900,
            available: 300
          },
          {
            id: '8',
            name: 'Electric Cable (2.5mm²)',
            type: 'electrical',
            unit: 'meter',
            unitPrice: 75,
            totalQuantity: 4500,
            allocated: 3200,
            available: 1300
          },
        ];
        
        setMaterials(mockMaterials);
      } catch (error) {
        console.error('Error fetching materials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  // Get unique material types for filter
  const materialTypes = [...new Set(materials.map(material => material.type))];

  // Filter materials based on search query and type filter
  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = 
      material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.type.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = typeFilter === 'all' || material.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Calculate totals for the summary
  const totalMaterialValue = materials.reduce((sum, material) => sum + (material.totalQuantity * material.unitPrice), 0);
  const allocatedMaterialValue = materials.reduce((sum, material) => sum + (material.allocated * material.unitPrice), 0);

  const AddMaterialButton = (
    <div className="flex space-x-2">
      <Link
        href="/dashboard/materials/new"
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
        Add Material
      </Link>
      
      <button
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <DownloadIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
        Export
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Materials" 
        description="Track and manage construction materials" 
        actions={AddMaterialButton}
      />
      
      {/* Material Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Inventory Value</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{formatCurrency(totalMaterialValue)}</p>
          <p className="mt-1 text-sm text-gray-500">{materials.length} different materials</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Allocated to Projects</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{formatCurrency(allocatedMaterialValue)}</p>
          <p className="mt-1 text-sm text-gray-500">{((allocatedMaterialValue / totalMaterialValue) * 100).toFixed(1)}% of inventory</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Available For Allocation</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{formatCurrency(totalMaterialValue - allocatedMaterialValue)}</p>
          <p className="mt-1 text-sm text-gray-500">{((1 - allocatedMaterialValue / totalMaterialValue) * 100).toFixed(1)}% of inventory</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 sr-only">
            Material Type
          </label>
          <select
            id="type"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Material Types</option>
            {materialTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Materials Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No materials found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || typeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add materials to start tracking your inventory'}
            </p>
            <Link
              href="/dashboard/materials/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Material
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allocated
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Value
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        <Link href={`/dashboard/materials/${material.id}`}>
                          {material.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{material.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(material.unitPrice)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{material.totalQuantity.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{material.allocated.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${material.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {material.available.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(material.totalQuantity * material.unitPrice)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/dashboard/materials/${material.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </Link>
                      <Link 
                        href={`/dashboard/materials/${material.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
