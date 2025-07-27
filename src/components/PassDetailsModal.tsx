import React, { useState } from 'react';

const PassDetailsModal = ({ initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Convert number inputs from string back to number
    const finalValue = type === 'number' ? parseFloat(value) || 0 :
                       type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // --- Styling constants ---
  const inputStyle = "w-full p-2 bg-surface-2 border border-border rounded-md text-foreground";
  const labelStyle = "block text-sm font-medium text-muted-foreground mb-1";
  const checkboxLabelStyle = "ml-2 text-sm font-medium text-foreground";
  const checkboxContainerStyle = "flex items-center h-full bg-surface-2 border border-border rounded-md px-3";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-lg animate-fade-in flex flex-col">
        <h2 className="text-xl font-bold mb-4">Verify Pass Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2">
          {/* --- Main Details --- */}
          <div>
            <label className={labelStyle}>Merchant Name</label>
            <input type="text" name="merchantName" value={formData.merchantName} onChange={handleChange} className={inputStyle} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Category</label>
              <input type="text" name="category" value={formData.category || ''} onChange={handleChange} className={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Total Amount</label>
              <input type="number" step="0.01" name="totalAmount" value={formData.totalAmount} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Tax Amount</label>
              <input type="number" step="0.01" name="taxAmount" value={formData.taxAmount} onChange={handleChange} className={inputStyle} />
            </div>
          </div>

          {/* --- Boolean Toggles --- */}
          <div className="grid grid-cols-2 gap-4">
             <div className={checkboxContainerStyle}>
                <input id="priority" type="checkbox" name="priority" checked={formData.priority} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <label htmlFor="priority" className={checkboxLabelStyle}>Priority Pass</label>
              </div>
              <div className={checkboxContainerStyle}>
                <input id="isAWarrantyCard" type="checkbox" name="isAWarrantyCard" checked={formData.isAWarrantyCard} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <label htmlFor="isAWarrantyCard" className={checkboxLabelStyle}>Is a Warranty</label>
              </div>
          </div>
          
          {/* --- Items List (Display Only) --- */}
          <div>
            <label className={labelStyle}>Items ({formData.items.length})</label>
            <div className="max-h-32 overflow-y-auto bg-surface-2 border border-border rounded-md p-2 space-y-1">
              {formData.items.length > 0 ? formData.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm p-1 bg-background rounded">
                  <span>{item.quantity} x {item.itemName}</span>
                  <span>${item.itemPrice.toFixed(2)}</span>
                </div>
              )) : <p className="text-muted-foreground text-center text-sm p-2">No items found.</p>}
            </div>
          </div>
        </form>

        {/* --- Action Buttons --- */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-secondary rounded-md">
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Save Pass
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassDetailsModal;