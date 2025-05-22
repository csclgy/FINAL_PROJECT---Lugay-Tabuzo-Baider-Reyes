import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [severityLevels, setSeverityLevels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSeverityModal, setShowSeverityModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    value: 1,
  });

  // Mock API functions for demonstration
  const mockFetch = (endpoint, options = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (endpoint.includes('/departments')) {
          if (options.method === 'DELETE') {
            resolve({ ok: true });
          } else if (options.method === 'PUT' || options.method === 'POST') {
            resolve({ ok: true });
          } else {
            resolve({
              ok: true,
              json: () => Promise.resolve([
                { id: 1, name: 'IT Support', description: 'Information Technology support and maintenance' },
                { id: 2, name: 'Human Resources', description: 'Employee relations and administrative support' },
                { id: 3, name: 'Finance', description: 'Financial planning and accounting services' }
              ])
            });
          }
        } else if (endpoint.includes('/categories')) {
          if (options.method === 'DELETE') {
            resolve({ ok: true });
          } else if (options.method === 'PUT' || options.method === 'POST') {
            resolve({ ok: true });
          } else {
            resolve({
              ok: true,
              json: () => Promise.resolve([
                { id: 1, name: 'Bug Report', description: 'Software bugs and technical issues' },
                { id: 2, name: 'Feature Request', description: 'New feature suggestions and improvements' },
                { id: 3, name: 'General Inquiry', description: 'General questions and information requests' }
              ])
            });
          }
        } else if (endpoint.includes('/severities')) {
          if (options.method === 'DELETE') {
            resolve({ ok: true });
          } else if (options.method === 'PUT' || options.method === 'POST') {
            resolve({ ok: true });
          } else {
            resolve({
              ok: true,
              json: () => Promise.resolve([
                { id: 1, name: 'Low', description: 'Minor issues, low priority', color: '#10B981', value: 1 },
                { id: 2, name: 'Medium', description: 'Moderate priority issues', color: '#F59E0B', value: 2 },
                { id: 3, name: 'High', description: 'Important issues requiring quick attention', color: '#EF4444', value: 3 },
                { id: 4, name: 'Critical', description: 'Urgent issues requiring immediate attention', color: '#DC2626', value: 4 }
              ])
            });
          }
        }
      }, 500);
    });
  };

  useEffect(() => {
    if (activeTab === 'departments') {
      fetchDepartments();
    } else if (activeTab === 'severities') {
      fetchSeverityLevels();
    } else if (activeTab === 'categories') {
      fetchCategories();
    }
  }, [activeTab]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      //TODO: CHANGE MOCKFETCH TO AXIOS FOR BETTER FETCHING
      const response = await mockFetch('/api/departments');
      
      if (response.ok) {
        const data = await response.json();
        setDepartments(Array.isArray(data) ? data : []);
      } else {
        throw new Error('Failed to fetch departments');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('Failed to load departments');
      setDepartments([]);
      setLoading(false);
    }
  };

  const fetchSeverityLevels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mockFetch('/api/severities');
      
      if (response.ok) {
        const data = await response.json();
        setSeverityLevels(Array.isArray(data) ? data : []);
      } else {
        throw new Error('Failed to fetch severity levels');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching severity levels:', error);
      setError('Failed to load severity levels');
      setSeverityLevels([]);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mockFetch('/api/categories');
      
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } else {
        throw new Error('Failed to fetch categories');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
      setCategories([]);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const openDepartmentModal = (department = null) => {
    if (department) {
      setEditingItem(department);
      setFormData({
        name: department.name,
        description: department.description || '',
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
      });
    }
    setShowDepartmentModal(true);
  };

  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await mockFetch(`/api/departments/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await mockFetch('/api/departments', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      
      setShowDepartmentModal(false);
      fetchDepartments();
    } catch (error) {
      console.error('Error saving department:', error);
      alert('Failed to save department');
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm('Are you sure? This may affect existing tickets and users.')) return;
    
    try {
      await mockFetch(`/api/departments/${id}`, { method: 'DELETE' });
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      alert('Failed to delete department');
    }
  };

  const openCategoryModal = (category = null) => {
    if (category) {
      setEditingItem(category);
      setFormData({
        name: category.name,
        description: category.description || '',
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
      });
    }
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await mockFetch(`/api/categories/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await mockFetch('/api/categories', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      
      setShowCategoryModal(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure? This may affect existing tickets.')) return;
    
    try {
      await mockFetch(`/api/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const openSeverityModal = (severity = null) => {
    if (severity) {
      setEditingItem(severity);
      setFormData({
        name: severity.name,
        description: severity.description || '',
        color: severity.color || '#3B82F6',
        value: severity.value || 1
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        color: '#3B82F6',
        value: severityLevels.length + 1
      });
    }
    setShowSeverityModal(true);
  };

  const handleSeveritySubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await mockFetch(`/api/severities/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await mockFetch('/api/severities', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      
      setShowSeverityModal(false);
      fetchSeverityLevels();
    } catch (error) {
      console.error('Error saving severity level:', error);
      alert('Failed to save severity level');
    }
  };

  const handleDeleteSeverity = async (id) => {
    if (!window.confirm('Are you sure? This may affect existing tickets.')) return;
    
    try {
      await mockFetch(`/api/severities/${id}`, { method: 'DELETE' });
      fetchSeverityLevels();
    } catch (error) {
      console.error('Error deleting severity level:', error);
      alert('Failed to delete severity level');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">System Settings</h1>
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'departments'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Departments
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'categories'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Ticket Categories
          </button>
          <button
            onClick={() => setActiveTab('severities')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'severities'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Severity Levels
          </button>
        </div>
        
        <div className="p-4">
          {activeTab === 'departments' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Departments</h2>
                <button
                  onClick={() => openDepartmentModal()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Department
                </button>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {departments.map((dept) => (
                        <tr key={dept.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{dept.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openDepartmentModal(dept)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDepartment(dept.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {departments.length === 0 && (
                        <tr>
                          <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                            No departments found. Add one to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Ticket Categories</h2>
                <button
                  onClick={() => openCategoryModal()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Category
                </button>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categories.map((category) => (
                        <tr key={category.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{category.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openCategoryModal(category)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {categories.length === 0 && (
                        <tr>
                          <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                            No categories found. Add one to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'severities' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Severity Levels</h2>
                <button
                  onClick={() => openSeverityModal()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Severity Level
                </button>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {severityLevels.map((severity) => (
                        <tr key={severity.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{severity.value}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{severity.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center">
                              <div 
                                className="w-6 h-6 rounded-full mr-2" 
                                style={{ backgroundColor: severity.color }}
                              ></div>
                              <span className="text-gray-500">{severity.color}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{severity.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openSeverityModal(severity)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSeverity(severity.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {severityLevels.length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                            No severity levels found. Add one to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {showDepartmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? 'Edit Department' : 'Add Department'}
            </h2>
            <form onSubmit={handleDepartmentSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Department Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowDepartmentModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingItem ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? 'Edit Category' : 'Add Category'}
            </h2>
            <form onSubmit={handleCategorySubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Category Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingItem ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSeverityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? 'Edit Severity Level' : 'Add Severity Level'}
            </h2>
            <form onSubmit={handleSeveritySubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Level Value</label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Color</label>
                <div className="flex items-center">
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-12 h-10 border border-gray-300 rounded-md mr-2"
                  />
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowSeverityModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingItem ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;