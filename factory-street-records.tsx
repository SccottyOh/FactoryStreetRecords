import React, { useState, useMemo, useEffect } from 'react';
import { Search, ShoppingCart, X, Mail, Play, Pause, Lock, Upload, LogOut, AlertCircle, CheckCircle, ChevronDown, Heart, DollarSign } from 'lucide-react';
import * as XLSX from 'xlsx';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'vinyl2025';

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? <CheckCircle size={20} /> : type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />;

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-[100] animate-slide-in`}>
      {icon}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <X size={18} />
      </button>
    </div>
  );
};

const INITIAL_RECORDS_DATABASE = [
  { id: 1, title: "Blue Train", artist: "John Coltrane", price: 34.99, image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop", label: "Blue Note Records", format: "12 inch Album", country: "USA", year: 1957, style: "Jazz, Hard Bop", shipping: "Ships within 2-3 business days", conditionMedia: "Near Mint (NM)", conditionCover: "Very Good Plus (VG+)", description: "A landmark recording in jazz history.", catalogNumber: "BLP-1577", matrixNumber: "VAN GELDER", audioSample1: "sample1.mp3", audioSample2: "sample2.mp3", audioSample3: null, audioSample4: null },
  { id: 2, title: "Kind of Blue", artist: "Miles Davis", price: 42.99, image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop", label: "Columbia Records", format: "12 inch Album", country: "USA", year: 1959, style: "Jazz, Modal Jazz", shipping: "Ships within 2-3 business days", conditionMedia: "Mint (M)", conditionCover: "Near Mint (NM)", description: "The best-selling jazz record of all time.", catalogNumber: "CL-1355", matrixNumber: "XSM 47327", audioSample1: "sample.mp3", audioSample2: null, audioSample3: null, audioSample4: null },
  { id: 3, title: "Abbey Road", artist: "The Beatles", price: 38.99, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", label: "Apple Records", format: "12 inch Album", country: "UK", year: 1969, style: "Rock, Pop Rock", shipping: "Ships within 2-3 business days", conditionMedia: "Very Good Plus (VG+)", conditionCover: "Very Good Plus (VG+)", description: "The Beatles penultimate album.", catalogNumber: "PCS 7088", matrixNumber: "YEX 749", audioSample1: "sample.mp3", audioSample2: "sample2.mp3", audioSample3: "sample3.mp3", audioSample4: null },
  { id: 4, title: "Rumours", artist: "Fleetwood Mac", price: 36.99, image: "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=400&h=400&fit=crop", label: "Warner Bros. Records", format: "12 inch Album", country: "USA", year: 1977, style: "Rock, Pop Rock", shipping: "Ships within 2-3 business days", conditionMedia: "Near Mint (NM)", conditionCover: "Very Good Plus (VG+)", description: "One of the best-selling albums.", catalogNumber: "BSK 3010", matrixNumber: "BSK-3010-A", audioSample1: "sample.mp3", audioSample2: null, audioSample3: null, audioSample4: null },
  { id: 5, title: "The Dark Side of the Moon", artist: "Pink Floyd", price: 44.99, image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop", label: "Harvest Records", format: "12 inch Album", country: "UK", year: 1973, style: "Progressive Rock", shipping: "Ships within 2-3 business days", conditionMedia: "Mint (M)", conditionCover: "Near Mint (NM)", description: "A concept album exploring themes of conflict.", catalogNumber: "SHVL 804", matrixNumber: "SHVL-804-A1", audioSample1: "sample1.mp3", audioSample2: "sample2.mp3", audioSample3: "sample3.mp3", audioSample4: "sample4.mp3" }
];

const AdminPanel = ({ onLogout, records, onUpdateRecords }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const validateRecord = (record) => {
    const errors = [];
    if (!record.id || isNaN(record.id)) errors.push('Invalid ID');
    if (!record.title) errors.push('Invalid title');
    if (!record.artist) errors.push('Invalid artist');
    if (!record.price || isNaN(record.price) || record.price < 0) errors.push('Invalid price');
    if (!record.year || isNaN(record.year) || record.year < 1900 || record.year > 2025) errors.push('Invalid year');
    return errors;
  };

  const processExcel = async () => {
    if (!file) return setMessage({ type: 'error', text: 'Please select a file first' });
    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const newRecords = [];
      const errors = [];

      jsonData.forEach((row, index) => {
        const record = {
          id: Number(row.id), title: String(row.title || ''), artist: String(row.artist || ''), price: Number(row.price),
          image: String(row.image || 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop'),
          label: String(row.label || ''), format: String(row.format || '12 inch Album'), country: String(row.country || 'USA'),
          year: Number(row.year), style: String(row.style || ''), shipping: String(row.shipping || 'Ships within 2-3 business days'),
          conditionMedia: String(row.conditionMedia || 'Near Mint (NM)'), conditionCover: String(row.conditionCover || 'Near Mint (NM)'),
          description: String(row.description || ''),
          catalogNumber: String(row.catalogNumber || ''),
          matrixNumber: String(row.matrixNumber || ''),
          audioSample1: row.audioSample1 || null,
          audioSample2: row.audioSample2 || null,
          audioSample3: row.audioSample3 || null,
          audioSample4: row.audioSample4 || null
        };
        const validationErrors = validateRecord(record);
        if (validationErrors.length > 0) errors.push(`Row ${index + 2}: ${validationErrors.join(', ')}`);
        else newRecords.push(record);
      });

      if (errors.length > 0) setMessage({ type: 'error', text: `Found ${errors.length} error(s)` });
      else if (newRecords.length === 0) setMessage({ type: 'error', text: 'No valid records found' });
      else { onUpdateRecords(newRecords); setMessage({ type: 'success', text: `Successfully uploaded ${newRecords.length} records!` }); setFile(null); }
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    }
    setUploading(false);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{ id: 1, title: 'Sample', artist: 'Artist', price: 29.99, image: 'https://example.com/image.jpg', label: 'Label', format: '12 inch Album', country: 'USA', year: 2020, style: 'Rock', shipping: 'Ships within 2-3 business days', conditionMedia: 'Near Mint (NM)', conditionCover: 'Near Mint (NM)', description: 'Sample', catalogNumber: 'CAT-001', matrixNumber: 'MTX-A1', audioSample1: '', audioSample2: '', audioSample3: '', audioSample4: '' }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Records');
    XLSX.writeFile(wb, 'records_template.xlsx');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium">
              <LogOut size={16} />Exit Admin
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="text-3xl font-bold mb-1 text-slate-800">{records.length}</div>
            <div className="text-sm text-slate-600 font-medium">Total Records</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="text-3xl font-bold mb-1 text-slate-800">${records.reduce((s, r) => s + r.price, 0).toFixed(2)}</div>
            <div className="text-sm text-slate-600 font-medium">Total Value</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="text-3xl font-bold mb-1 text-slate-800">${(records.reduce((s, r) => s + r.price, 0) / records.length).toFixed(2)}</div>
            <div className="text-sm text-slate-600 font-medium">Average Price</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Upload className="text-slate-600" size={20} />Upload Records Database
          </h2>
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-800 mb-2 text-sm">Download Template</h3>
              <p className="text-slate-600 mb-4 text-sm">Download the Excel template with required format.</p>
              <button onClick={downloadTemplate} className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors">
                Download Template
              </button>
            </div>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
              <input type="file" accept=".xlsx,.xls" onChange={(e) => { if (e.target.files[0]) { setFile(e.target.files[0]); setMessage({ type: '', text: '' }); } }} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                <p className="text-base font-medium text-slate-700 mb-1">{file ? file.name : 'Click to upload Excel file'}</p>
                <p className="text-sm text-slate-500">XLSX or XLS format</p>
              </label>
            </div>
            {file && <button onClick={processExcel} disabled={uploading} className="w-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-400 text-white py-3 rounded-lg font-medium text-sm disabled:opacity-50 transition-colors">{uploading ? 'Processing...' : 'Upload and Update Database'}</button>}
            {message.text && (
              <div className={`rounded-lg p-4 flex items-start gap-3 ${message.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                {message.type === 'error' ? <AlertCircle className="text-red-600" size={18} /> : <CheckCircle className="text-green-600" size={18} />}
                <pre className={`text-sm whitespace-pre-wrap ${message.type === 'error' ? 'text-red-800' : 'text-green-800'}`}>{message.text}</pre>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-slate-800">Required Excel Columns</h3>
          <div className="text-xs font-mono bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200">
            <p className="text-slate-700">id, title, artist, price, image, label, format, country, year, style, shipping, conditionMedia, conditionCover, description, catalogNumber, matrixNumber, audioSample1, audioSample2, audioSample3, audioSample4</p>
          </div>
          <div className="text-sm text-slate-600">
            <p className="font-semibold mb-2 text-slate-800">Validation Rules:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>IDs must be unique numbers</li>
              <li>Prices must be positive numbers</li>
              <li>Years between 1900-2025</li>
              <li>Audio samples are optional URL paths</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

const LoginScreen = ({ onLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) onLogin();
    else { setError('Invalid credentials'); setTimeout(() => setError(''), 3000); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
        <button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-4">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Login</h1>
          <p className="text-slate-600">Factory Street Records</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSubmit()} className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-amber-500" />
          </div>
          {error && <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2"><AlertCircle size={18} />{error}</div>}
          <button onClick={handleSubmit} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-lg font-bold">Login</button>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">Credentials: admin / vinyl2025</p>
      </div>
    </div>
  );
};

const RecordDetail = ({ record, onBack, onAddToCart, wishlist, setWishlist, setToast }) => {
  const [currentSample, setCurrentSample] = useState(0);
  const [playing, setPlaying] = useState(false);

  const audioSamples = [
    record.audioSample1,
    record.audioSample2,
    record.audioSample3,
    record.audioSample4
  ].filter(sample => sample);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-50">
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white sticky top-0 z-50 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <button onClick={onBack} className="text-2xl font-bold hover:text-amber-400">Factory Street Records</button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={onBack} className="mb-6 text-slate-600 hover:text-slate-900 font-semibold">← Back to Store</button>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <img src={record.image} alt={record.title} className="w-full rounded-xl shadow-lg mb-6" />
              
              {audioSamples.length > 0 && (
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">Audio Samples</h3>
                    <span className="text-xs text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">
                      {currentSample + 1} of {audioSamples.length}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <button 
                      onClick={() => setPlaying(!playing)} 
                      className="flex-shrink-0 w-12 h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center transition-all transform hover:scale-105"
                    >
                      {playing ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    
                    <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-500 h-full w-1/3 transition-all"></div>
                    </div>
                    
                    <span className="text-sm text-slate-600 font-mono">0:30</span>
                  </div>
                  
                  {audioSamples.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {audioSamples.map((sample, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSample(idx)}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            currentSample === idx 
                              ? 'bg-amber-500 text-white' 
                              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          Track {idx + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-4xl font-bold mb-2 text-slate-900">{record.title}</h1>
              <h2 className="text-2xl text-slate-600 mb-6 font-medium">{record.artist}</h2>
              
              <div className="text-4xl font-bold text-amber-600 mb-6">${record.price}</div>

              <button 
                onClick={() => onAddToCart(record)} 
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-4 rounded-xl font-bold text-lg mb-8 transition-all transform hover:scale-105 shadow-lg"
              >
                Add to Cart
              </button>

              <div className="mb-6 pb-6 border-b-2 border-amber-100">
                <h3 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-amber-500 rounded"></span>
                  Description
                </h3>
                <p className="text-slate-700 leading-relaxed">{record.description}</p>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-amber-500 rounded"></span>
                  Product Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Label</div>
                    <div className="text-sm text-slate-900 font-medium">{record.label}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Format</div>
                    <div className="text-sm text-slate-900 font-medium">{record.format}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Country</div>
                    <div className="text-sm text-slate-900 font-medium">{record.country}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Year</div>
                    <div className="text-sm text-slate-900 font-medium">{record.year}</div>
                  </div>
                  {record.catalogNumber && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Catalog Number</div>
                      <div className="text-sm text-slate-900 font-medium">{record.catalogNumber}</div>
                    </div>
                  )}
                  {record.matrixNumber && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Matrix Number</div>
                      <div className="text-sm text-slate-900 font-medium">{record.matrixNumber}</div>
                    </div>
                  )}
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Style / Genre</div>
                  <div className="text-sm text-slate-900 font-medium">{record.style}</div>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b-2 border-amber-100">
                <h3 className="font-bold text-lg mb-4 text-slate-900 flex items-center gap-2">
                  <span className="w-1 h-6 bg-amber-500 rounded"></span>
                  Condition
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                    <div className="text-xs font-semibold text-green-700 uppercase mb-1">Media Condition</div>
                    <div className="text-base text-slate-900 font-bold">{record.conditionMedia}</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-4 rounded-xl border-2 border-blue-200">
                    <div className="text-xs font-semibold text-blue-700 uppercase mb-1">Cover Condition</div>
                    <div className="text-base text-slate-900 font-bold">{record.conditionCover}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-5 rounded-xl mb-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Shipping Information</h3>
                    <p className="text-sm text-slate-700">{record.shipping}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  const existing = wishlist.find(w => w.id === record.id);
                  if (existing) {
                    setWishlist(wishlist.filter(w => w.id !== record.id));
                    setToast({ message: 'Removed from wishlist', type: 'info' });
                  } else {
                    setWishlist([...wishlist, record]);
                    setToast({ message: `${record.title} added to wishlist!`, type: 'success' });
                  }
                }}
                className="w-full border-2 border-amber-500 text-amber-600 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 hover:bg-amber-50"
              >
                <Heart className={wishlist.find(w => w.id === record.id) ? 'fill-amber-600' : ''} size={20} />
                {wishlist.find(w => w.id === record.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>

              <div className="mb-6 pb-6 border-b border-slate-200">
                <h3 className="font-bold text-lg mb-3 text-slate-900">Description</h3>
                <p className="text-slate-700 leading-relaxed">{record.description}</p>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="font-bold text-lg text-slate-900 mb-3">Product Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Label</div>
                    <div className="text-sm text-slate-900 font-medium">{record.label}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Format</div>
                    <div className="text-sm text-slate-900 font-medium">{record.format}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Country</div>
                    <div className="text-sm text-slate-900 font-medium">{record.country}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Year</div>
                    <div className="text-sm text-slate-900 font-medium">{record.year}</div>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Style</div>
                  <div className="text-sm text-slate-900 font-medium">{record.style}</div>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-slate-200">
                <h3 className="font-bold text-lg mb-3 text-slate-900">Condition</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <div className="text-xs font-semibold text-green-700 uppercase mb-1">Media Condition</div>
                    <div className="text-sm text-slate-900 font-bold">{record.conditionMedia}</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-xs font-semibold text-blue-700 uppercase mb-1">Cover Condition</div>
                    <div className="text-sm text-slate-900 font-bold">{record.conditionCover}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-5 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Shipping Information</h3>
                    <p className="text-sm text-slate-700">{record.shipping}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="font-bold text-lg mb-4 text-slate-900">Condition Grading Guide</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <span className="font-bold text-slate-900 min-w-[80px]">Mint (M):</span>
              <span className="text-slate-700">Perfect condition, appears unplayed</span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <span className="font-bold text-slate-900 min-w-[80px]">Near Mint (NM):</span>
              <span className="text-slate-700">Almost perfect, minimal signs of use</span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <span className="font-bold text-slate-900 min-w-[80px]">VG+:</span>
              <span className="text-slate-700">Light wear, plays excellently</span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <span className="font-bold text-slate-900 min-w-[80px]">VG:</span>
              <span className="text-slate-700">Shows wear but still plays well</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const [records, setRecords] = useState(INITIAL_RECORDS_DATABASE);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFormat, setFilterFormat] = useState('all');
  const [filterConditionMedia, setFilterConditionMedia] = useState('all');
  const [filterConditionCover, setFilterConditionCover] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('title');
  const [toast, setToast] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 100]);

  const formats = useMemo(() => ['all', ...[...new Set(records.map(r => r.format))]], [records]);
  
  const conditionsMedia = useMemo(() => ['all', ...[...new Set(records.map(r => r.conditionMedia))].sort()], [records]);
  
  const conditionsCover = useMemo(() => ['all', ...[...new Set(records.map(r => r.conditionCover))].sort()], [records]);

  const priceMin = useMemo(() => Math.floor(Math.min(...records.map(r => r.price))), [records]);
  const priceMax = useMemo(() => Math.ceil(Math.max(...records.map(r => r.price))), [records]);

  useEffect(() => {
    setPriceRange([priceMin, priceMax]);
  }, [priceMin, priceMax]);

  const filteredRecords = useMemo(() => {
    let filtered = records.filter(r => !cart.find(c => c.id === r.id));
    if (filterFormat !== 'all') filtered = filtered.filter(r => r.format === filterFormat);
    if (filterConditionMedia !== 'all') filtered = filtered.filter(r => r.conditionMedia === filterConditionMedia);
    if (filterConditionCover !== 'all') filtered = filtered.filter(r => r.conditionCover === filterConditionCover);
    filtered = filtered.filter(r => r.price >= priceRange[0] && r.price <= priceRange[1]);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(r => r.title.toLowerCase().includes(q) || r.artist.toLowerCase().includes(q));
    }
    return [...filtered].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return a.title.localeCompare(b.title);
    });
  }, [records, cart, filterFormat, filterConditionMedia, filterConditionCover, priceRange, searchQuery, sortBy]);

  const addToCart = (record) => {
    const existing = cart.find(i => i.id === record.id);
    if (!existing) {
      setCart([...cart, {...record, quantity: 1}]);
      setToast({ message: `${record.title} added to cart!`, type: 'success' });
    }
  };

  const toggleWishlist = (record) => {
    const existing = wishlist.find(i => i.id === record.id);
    if (existing) {
      setWishlist(wishlist.filter(i => i.id !== record.id));
      setToast({ message: `Removed from wishlist`, type: 'info' });
    } else {
      setWishlist([...wishlist, record]);
      setToast({ message: `${record.title} added to wishlist!`, type: 'success' });
    }
  };

  const moveToCart = (record) => {
    addToCart(record);
    setWishlist(wishlist.filter(i => i.id !== record.id));
  };

  const cartTotal = cart.reduce((s, i) => s + i.price, 0);
  const cartCount = cart.length;

  if (isLoggedIn && isAdmin) return <AdminPanel onLogout={() => { setIsLoggedIn(false); setIsAdmin(false); }} records={records} onUpdateRecords={setRecords} />;
  if (showAdminLogin) return <LoginScreen onLogin={() => { setIsLoggedIn(true); setIsAdmin(true); setShowAdminLogin(false); }} onCancel={() => setShowAdminLogin(false)} />;
  if (selectedRecord) {
    return <RecordDetail 
      record={selectedRecord} 
      onBack={() => setSelectedRecord(null)} 
      onAddToCart={(record) => {
        addToCart(record);
        setSelectedRecord(null);
      }}
      wishlist={wishlist}
      setWishlist={setWishlist}
      setToast={setToast}
    />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white sticky top-0 z-50 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-3xl font-bold">Factory Street Records</h1>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowAdminLogin(true)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-2 transition-colors">
                <Lock size={18} />Admin
              </button>
              <button onClick={() => setShowWishlist(true)} className="relative p-3 hover:bg-slate-800 rounded-xl transition-colors">
                <Heart size={24} className={wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''} />
                {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">{wishlist.length}</span>}
              </button>
              <button onClick={() => setShowCart(true)} className="relative p-3 hover:bg-slate-800 rounded-xl transition-colors">
                <ShoppingCart size={24} />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">{cartCount}</span>}
              </button>
            </div>
          </div>
          <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl mb-4" />
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl flex items-center gap-2 hover:bg-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
                {(filterFormat !== 'all' || filterConditionMedia !== 'all' || filterConditionCover !== 'all') && (
                  <span className="bg-amber-500 text-slate-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {(filterFormat !== 'all' ? 1 : 0) + (filterConditionMedia !== 'all' ? 1 : 0) + (filterConditionCover !== 'all' ? 1 : 0)}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} size={16} />
              </button>
              
              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-4 min-w-[280px] z-50">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 text-sm">Format</h3>
                      {filterFormat !== 'all' && (
                        <button onClick={() => setFilterFormat('all')} className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {formats.map(f => (
                        <label key={f} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded">
                          <input 
                            type="radio" 
                            name="format"
                            checked={filterFormat === f}
                            onChange={() => setFilterFormat(f)}
                            className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                          />
                          <span className="text-sm text-slate-700">{f === 'all' ? 'All Formats' : f}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 text-sm">Media Condition</h3>
                      {filterConditionMedia !== 'all' && (
                        <button onClick={() => setFilterConditionMedia('all')} className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {conditionsMedia.map(c => (
                        <label key={c} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded">
                          <input 
                            type="radio"
                            name="conditionMedia"
                            checked={filterConditionMedia === c}
                            onChange={() => setFilterConditionMedia(c)}
                            className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                          />
                          <span className="text-sm text-slate-700">{c === 'all' ? 'All Conditions' : c}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 text-sm">Cover Condition</h3>
                      {filterConditionCover !== 'all' && (
                        <button onClick={() => setFilterConditionCover('all')} className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {conditionsCover.map(c => (
                        <label key={c} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded">
                          <input 
                            type="radio"
                            name="conditionCover"
                            checked={filterConditionCover === c}
                            onChange={() => setFilterConditionCover(c)}
                            className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                          />
                          <span className="text-sm text-slate-700">{c === 'all' ? 'All Conditions' : c}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-900 text-sm">Price Range</h3>
                      <span className="text-xs text-slate-600">${priceRange[0]} - ${priceRange[1]}</span>
                    </div>
                    <div className="px-2">
                      <input
                        type="range"
                        min={priceMin}
                        max={priceMax}
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #f59e0b ${((priceRange[0] - priceMin) / (priceMax - priceMin)) * 100}%, #e2e8f0 ${((priceRange[0] - priceMin) / (priceMax - priceMin)) * 100}%)`
                        }}
                      />
                      <input
                        type="range"
                        min={priceMin}
                        max={priceMax}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2"
                        style={{
                          background: `linear-gradient(to right, #e2e8f0 ${((priceRange[1] - priceMin) / (priceMax - priceMin)) * 100}%, #f59e0b ${((priceRange[1] - priceMin) / (priceMax - priceMin)) * 100}%)`
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 mt-4">
                    <button 
                      onClick={() => {
                        setFilterFormat('all');
                        setFilterConditionMedia('all');
                        setFilterConditionCover('all');
                        setPriceRange([priceMin, priceMax]);
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label className="text-white text-sm font-medium">Sort By:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 bg-slate-800 text-white rounded-xl">
                <option value="title">Title</option>
                <option value="price-low">Price Low</option>
                <option value="price-high">Price High</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRecords.map(record => (
            <div key={record.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all relative group">
              <button
                onClick={() => toggleWishlist(record)}
                className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <Heart 
                  size={20} 
                  className={wishlist.find(w => w.id === record.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'} 
                />
              </button>
              <img src={record.image} alt={record.title} className="w-full h-64 object-cover cursor-pointer" onClick={() => setSelectedRecord(record)} />
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">{record.title}</h3>
                <p className="text-slate-600 text-sm mb-3">{record.artist}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-amber-600">${record.price}</span>
                  <button onClick={() => addToCart(record)} className="bg-amber-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors">Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showCart && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between bg-slate-800 text-white">
              <h2 className="text-2xl font-bold">Cart</h2>
              <button onClick={() => setShowCart(false)}><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {cart.length === 0 ? <p className="text-center py-8">Cart is empty</p> : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 bg-slate-50 p-4 rounded-lg">
                      <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-bold">{item.title}</h3>
                        <p className="text-sm text-slate-600">{item.artist}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-lg font-bold text-amber-600">${item.price.toFixed(2)}</span>
                          <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-red-500 hover:text-red-700 font-medium text-sm">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-6 border-t bg-slate-800 text-white">
                <div className="flex justify-between mb-4">
                  <span className="text-xl font-bold">Total:</span>
                  <span className="text-2xl font-bold text-amber-400">${cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full bg-amber-500 text-white py-3 rounded-lg font-bold">Checkout</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}