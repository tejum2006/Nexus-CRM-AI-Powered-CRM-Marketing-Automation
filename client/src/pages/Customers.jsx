import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Users, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomerTable from '../components/customers/CustomerTable';
import CustomerForm from '../components/customers/CustomerForm';
import ImportModal from '../components/customers/ImportModal';
import SearchBar from '../components/ui/SearchBar';
import FilterPanel from '../components/customers/FilterPanel';
import Pagination from '../components/ui/Pagination';
import * as customerService from '../services/customerService';
import * as segmentService from '../services/segmentService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../hooks/useAuth';

const Customers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [availableSegments, setAvailableSegments] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const limit = 10;

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [segRes, tagsRes] = await Promise.all([
          segmentService.getSegments(),
          customerService.getAllTags()
        ]);
        if (segRes.success) setAvailableSegments(segRes.data);
        if (tagsRes.success) setAvailableTags(tagsRes.data);
      } catch (err) {
        console.error('Failed to fetch metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const sortStr = sortConfig.direction === 'desc' ? `-${sortConfig.key}` : sortConfig.key;
      const data = await customerService.getCustomers({ page, limit, search, sort: sortStr, ...filters });
      if (data.success) {
        setCustomers(data.data.customers);
        setTotalPages(data.data.pagination.pages);
        setTotalItems(data.data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, filters, sortConfig]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const handleSearch = (term) => { setSearch(term); setPage(1); };
  const handleFilterChange = (newFilters) => { setFilters(newFilters); setPage(1); };
  const handleClearFilters = () => { setFilters({}); setPage(1); };
  const handleSort = (key) => {
    setSortConfig(cur => ({ key, direction: cur.key === key && cur.direction === 'asc' ? 'desc' : 'asc' }));
  };

  const handleCreateCustomer = async (data) => {
    try {
      setIsSubmitting(true);
      await customerService.createCustomer(data);
      setIsFormOpen(false);
      fetchCustomers();
      toast.success('Customer added!');
    } catch {
      toast.error('Failed to add customer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCustomer = async (data) => {
    try {
      setIsSubmitting(true);
      await customerService.updateCustomer(editingCustomer._id, data);
      setIsFormOpen(false);
      setEditingCustomer(null);
      fetchCustomers();
      toast.success('Customer updated!');
    } catch {
      toast.error('Failed to update customer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        await customerService.deleteCustomer(id);
        toast.success('Customer deleted successfully!');
        fetchCustomers();
      } catch {
        toast.error('Failed to delete customer.');
      }
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      toast.info('Exporting customers...');
      await customerService.exportCustomers({ search, ...filters });
    } catch {
      toast.error('Failed to export.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="page-scroll flex flex-col h-[calc(100vh-var(--header-height))]">
      {/* Header */}
      <div className="page-header shrink-0">
        <div>
          <h1 className="heading-1 mb-1">Customers</h1>
          <p className="text-body">Manage your contacts, segments, and relationships.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary" onClick={() => setIsImportOpen(true)}>
            <Upload size={16} />
            <span className="hidden sm:inline">Import</span>
          </button>
          {user?.role === 'Admin' && (
            <button className="btn btn-secondary" onClick={handleExport} disabled={isExporting}>
              <Download size={16} />
              <span className="hidden sm:inline">{isExporting ? 'Exporting…' : 'Export'}</span>
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
            <Plus size={16} />
            <span className="hidden sm:inline">Add Customer</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="card flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 shrink-0 border-b border-[var(--border-subtle)]">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search customers…"
            className="flex-1 sm:max-w-xs"
          />
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            availableSegments={availableSegments}
            availableTags={availableTags}
          />
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto bg-[var(--bg-app)]">
          <CustomerTable
            customers={customers}
            loading={loading}
            onSort={handleSort}
            sortConfig={sortConfig}
            onRowClick={(id) => navigate(`/customers/${id}`)}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
            availableSegments={availableSegments}
          />
        </div>

        {/* Pagination */}
        <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={limit}
            onPageChange={setPage}
          />
        </div>
      </div>

      <CustomerForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCustomer(null);
        }}
        onSubmit={editingCustomer ? handleUpdateCustomer : handleCreateCustomer}
        initialData={editingCustomer}
        isSubmitting={isSubmitting}
      />
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={() => { setIsImportOpen(false); fetchCustomers(); }}
      />
    </div>
  );
};

export default Customers;
