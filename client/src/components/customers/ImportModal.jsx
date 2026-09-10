import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle, Info } from 'lucide-react';
import * as customerService from '../../services/customerService';
import { useToast } from '../../context/ToastContext';

const ImportModal = ({ isOpen, onClose, onImportSuccess }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setResult(null);
      } else {
        toast.error('Please upload a valid CSV file.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      const response = await customerService.importCustomers(file);
      
      setResult(response.data);
      if (response.data.failed === 0) {
        toast.success(`Successfully imported ${response.data.inserted + response.data.updated} customers!`);
        setTimeout(() => {
          onImportSuccess();
        }, 1500);
      } else {
        toast.warning(`Imported with some errors. See summary.`);
      }
    } catch (error) {
      console.error('Import failed:', error);
      toast.error(error.response?.data?.error || 'Failed to import customers.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setResult(null);
    onClose();
  };

  const downloadTemplate = () => {
    const headers = "name,email,phone,company,industry,location,status,segments,tags\n";
    const example = "Steve Rogers,steve@example.com,+91-9876543210,Acme Corp,Tech,Mumbai,Lead,Lead;Premium,vip;q1\n";
    const blob = new Blob([headers + example], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content sm:max-w-2xl mx-auto">
        
        <div className="modal-header">
          <h2 className="text-section text-[var(--text-primary)]">Import Customers</h2>
          <button 
            onClick={resetModal}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          {!result ? (
            <>
              <div 
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                  isDragging 
                    ? 'border-[var(--gold)] bg-[var(--gold-dim)]' 
                    : 'border-[var(--border)] hover:border-[var(--text-muted)] hover:bg-[var(--bg-input)]'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".csv"
                  onChange={handleFileChange}
                />
                
                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--gold-dim)] flex items-center justify-center text-[var(--gold-light)] mb-3">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-[var(--text-primary)] font-medium">{file.name}</p>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <button 
                      className="mt-4 text-sm text-[var(--text-muted)] hover:text-red-400 hover:underline transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-[var(--bg-input)] flex items-center justify-center text-[var(--text-muted)] mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-[var(--text-primary)] font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                      CSV files only (max 5MB)
                    </p>
                  </>
                )}
              </div>

              <div className="mt-6 bg-[var(--bg-input)] rounded-lg p-4 flex items-start space-x-3">
                <Info className="w-5 h-5 text-[var(--gold-light)] flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-[var(--text-primary)] font-medium mb-1">Import Requirements</p>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    The CSV must contain <strong>name</strong> and <strong>email</strong> columns. If a customer with the same email already exists, their profile will be updated instead of duplicated.
                  </p>
                  <button 
                    onClick={downloadTemplate}
                    className="mt-2 text-[var(--gold-light)] hover:underline font-medium"
                  >
                    Download CSV Template
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-[var(--bg-input)] rounded-lg p-6 text-center">
                <div className="flex justify-center space-x-8">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-green-400">{result.inserted}</span>
                    <span className="text-[var(--text-muted)] text-sm mt-1">Inserted</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-blue-400">{result.updated}</span>
                    <span className="text-[var(--text-muted)] text-sm mt-1">Updated</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className={`text-3xl font-bold ${result.failed > 0 ? 'text-red-400' : 'text-[var(--text-muted)]'}`}>
                      {result.failed}
                    </span>
                    <span className="text-[var(--text-muted)] text-sm mt-1">Failed</span>
                  </div>
                </div>
              </div>
              
              {result.errors && result.errors.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-[var(--text-primary)] font-medium mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-red-400" />
                    Errors ({result.errors.length})
                  </h3>
                  <div className="bg-[var(--bg-input)] rounded-lg p-3 max-h-40 overflow-y-auto text-sm text-[var(--text-muted)] space-y-1 font-mono">
                    {result.errors.map((err, idx) => (
                      <div key={idx}>{err}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          {result ? (
            <button
              onClick={() => {
                onImportSuccess();
                resetModal();
              }}
              className="btn btn-primary"
            >
              Done
            </button>
          ) : (
            <>
              <button
                onClick={resetModal}
                className="btn btn-secondary"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!file || isUploading}
                className="btn btn-primary"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Importing...
                  </>
                ) : (
                  'Import Data'
                )}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default ImportModal;
