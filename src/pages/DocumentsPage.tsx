import { useState } from 'react';
import {
  FolderOpen,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  Eye,
  ArrowRight,
  X,
  Loader2,
  Pencil,
  Save,
  FileCheck2,
} from 'lucide-react';
import { documents as allDocuments, type DocumentItem } from '@/data/mockData';

const statusConfig = {
  verified: { label: 'Verified', icon: CheckCircle2, class: 'text-success-600 bg-success-50' },
  extracted: { label: 'Extracted', icon: Sparkles, class: 'text-brand-600 bg-brand-50' },
  pending: { label: 'Pending Verification', icon: Clock, class: 'text-warning-600 bg-warning-50' },
};

const typeColors: Record<string, string> = {
  PDF: 'bg-error-100 text-error-700',
  JPG: 'bg-accent-100 text-accent-700',
  PNG: 'bg-accent-100 text-accent-700',
  DOCX: 'bg-brand-100 text-brand-700',
};

export function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>(allDocuments);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrComplete, setOcrComplete] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleDocClick = (doc: DocumentItem) => {
    setSelectedDoc(doc);
    setOcrComplete(false);
    if (doc.status === 'extracted' || doc.status === 'verified') {
      setOcrProcessing(false);
      setOcrComplete(true);
    } else {
      setOcrProcessing(true);
      setTimeout(() => {
        setOcrProcessing(false);
        setOcrComplete(true);
      }, 2500);
    }
  };

  const handleUploadSim = (fileName: string) => {
    const newDoc: DocumentItem = {
      id: `DOC-${Date.now()}`,
      name: fileName,
      type: 'PDF',
      status: 'pending',
      size: '420 KB',
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setDocuments([...documents, newDoc]);
    setUploadedFiles([...uploadedFiles, fileName]);
  };

  const closeOcr = () => {
    setSelectedDoc(null);
    setOcrProcessing(false);
    setOcrComplete(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
            <FolderOpen size={22} className="text-accent-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Smart Document Center</h1>
            <p className="text-gray-600">Upload once. Organize everything.</p>
          </div>
        </div>
      </div>

      {/* Upload area */}
      <div
        className={`card p-8 border-2 border-dashed transition-all ${
          dragActive ? 'border-brand-500 bg-brand-50' : 'border-gray-300'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const files = Array.from(e.dataTransfer.files);
          files.forEach((f) => handleUploadSim(f.name));
        }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
            <Upload size={28} className="text-brand-600" />
          </div>
          <p className="text-lg font-medium text-gray-900">Drag & drop documents here or Browse Files</p>
          <p className="text-sm text-gray-500 mt-1">Supported formats: PDF, JPG, PNG, DOCX</p>
          <label className="btn-primary mt-4 cursor-pointer">
            <Upload size={16} /> Browse Files
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  Array.from(e.target.files).forEach((f) => handleUploadSim(f.name));
                }
              }}
            />
          </label>
          {uploadedFiles.length > 0 && (
            <p className="text-xs text-success-600 mt-3">
              {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} uploaded successfully
            </p>
          )}
        </div>
      </div>

      {/* Document list */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-3">Uploaded Documents</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => {
            const config = statusConfig[doc.status];
            const StatusIcon = config.icon;
            return (
              <div
                key={doc.id}
                className="card card-hover p-5 cursor-pointer"
                onClick={() => handleDocClick(doc)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <FileText size={20} className="text-gray-500" />
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${typeColors[doc.type]}`}>
                      {doc.type}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-brand-600 transition-colors">
                    <Eye size={16} />
                  </button>
                </div>
                <p className="text-sm font-semibold text-gray-900">{doc.name}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-400">{doc.size} • {doc.uploadDate}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.class}`}>
                    <StatusIcon size={10} className="inline mr-1" />{config.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* OCR Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={closeOcr} />
          <div className="relative card w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-brand-600" />
                <h3 className="font-semibold text-gray-900">Smart OCR</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">AI-powered extraction</span>
              </div>
              <button onClick={closeOcr} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Document name */}
              <div className="card p-3 bg-gray-50 mb-4">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">{selectedDoc.name}</span>
                </div>
              </div>

              {/* Processing pipeline */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${ocrProcessing || ocrComplete ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {ocrProcessing || ocrComplete ? <CheckCircle2 size={16} /> : <Upload size={14} />}
                  </div>
                  <span className="text-xs text-gray-600">Uploaded</span>
                </div>
                <div className={`h-0.5 flex-1 mx-2 ${ocrProcessing || ocrComplete ? 'bg-brand-500' : 'bg-gray-200'}`} />
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${ocrProcessing ? 'bg-brand-600 text-white' : ocrComplete ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {ocrProcessing ? <Loader2 size={14} className="animate-spin" /> : ocrComplete ? <CheckCircle2 size={16} /> : <Sparkles size={14} />}
                  </div>
                  <span className="text-xs text-gray-600">Processing</span>
                </div>
                <div className={`h-0.5 flex-1 mx-2 ${ocrComplete ? 'bg-brand-500' : 'bg-gray-200'}`} />
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${ocrComplete ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {ocrComplete ? <CheckCircle2 size={16} /> : <FileCheck2 size={14} />}
                  </div>
                  <span className="text-xs text-gray-600">Extracted</span>
                </div>
              </div>

              {/* Processing animation */}
              {ocrProcessing && (
                <div className="text-center py-8">
                  <Loader2 size={32} className="mx-auto text-brand-600 animate-spin mb-3" />
                  <p className="text-sm text-gray-600">Extracting information from document…</p>
                  <p className="text-xs text-gray-400 mt-1">Simulated OCR — prototype demo</p>
                </div>
              )}

              {/* Extracted data */}
              {ocrComplete && (
                <div className="animate-slide-up">
                  <div className="flex items-center gap-2 mb-3">
                    <FileCheck2 size={16} className="text-success-600" />
                    <p className="text-sm font-semibold text-gray-900">Information Extracted</p>
                  </div>
                  <div className="card border-gray-200 divide-y divide-gray-100">
                    {(selectedDoc.extractedData || [
                      { label: 'Company Name', value: 'Shree Industries Pvt. Ltd.' },
                      { label: 'Applicant Name', value: 'Rajesh Sharma' },
                      { label: 'Registration Number', value: 'IND-2026-10482' },
                      { label: 'Project Location', value: 'Pune, Maharashtra' },
                      { label: 'Investment', value: '₹8.5 Crore' },
                    ]).map((field) => (
                      <div key={field.label} className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm text-gray-500">{field.label}</span>
                        <span className="text-sm font-medium text-gray-900">{field.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button className="btn-secondary text-sm">
                      <Pencil size={14} /> Edit Information
                    </button>
                    <button className="btn-primary text-sm">
                      <Save size={14} /> Save
                    </button>
                    <button className="btn-secondary text-sm">
                      Use for Application <ArrowRight size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-4 text-center">
                    This is a simulated OCR demo. No real text extraction is being performed.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
