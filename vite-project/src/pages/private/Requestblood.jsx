import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, MapPin, User, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { RequestSchema } from '../../schema/Request.schema.js';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const URGENCY_LEVELS = [
  { value: 'critical', label: '🔴 Critical', sub: 'Needed within hours', border: '#ef4444', bg: '#fef2f2', active: '#ef4444', textActive: 'white' },
  { value: 'moderate', label: '🟡 Moderate', sub: 'Needed within a day', border: '#f59e0b', bg: '#fffbeb', active: '#f59e0b', textActive: 'white' },
  { value: 'normal',   label: '🟢 Normal',   sub: 'Scheduled / planned', border: '#10b981', bg: '#f0fdf4', active: '#10b981', textActive: 'white' },
];

const RequestModal = ({ isOpen, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [urgency, setUrgency] = useState('critical');

  const {
    register, handleSubmit, control, watch, reset, setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RequestSchema),
    defaultValues: { patientName: '', bloodGroup: '', unitsNeeded: 1, hospitalLocation: '' },
  });

  const unitsNeeded = watch('unitsNeeded');

  useEffect(() => {
    if (isOpen) setTimeout(() => setVisible(true), 10);
    else { setVisible(false); reset(); setUrgency('critical'); }
  }, [isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post('http://localhost:5000/api/requests', { ...data, urgency }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 201 || response.status === 200) {
        toast.success('Emergency request posted! 🩸');
        reset();
        if (onRefresh) onRefresh();
        onClose();
      }
    } catch (err) {
      if (err.response?.status === 401) toast.error('Session expired. Please login again.');
      else toast.error('Failed to post request. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
      transition: 'opacity 0.25s ease',
      opacity: visible ? 1 : 0,
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '520px',
        background: 'white', borderRadius: '24px', padding: '28px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: '1px solid #f3f4f6',
        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
        maxHeight: '90vh', overflowY: 'auto',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={20} color="#ef4444" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: 0 }}>Request Blood</h2>
              <p style={{ fontSize: '13px', color: '#9ca3af', margin: '3px 0 0' }}>Fill in the patient details</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1px solid #f3f4f6', background: '#f9fafb', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Urgency Level */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Urgency Level *
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {URGENCY_LEVELS.map(u => (
                <button key={u.value} type="button" onClick={() => setUrgency(u.value)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: '12px', cursor: 'pointer',
                    border: `2px solid ${urgency === u.value ? u.active : '#e5e7eb'}`,
                    background: urgency === u.value ? u.active : 'white',
                    transition: 'all 0.15s',
                  }}>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: urgency === u.value ? u.textActive : '#374151' }}>{u.label}</span>
                    <p style={{ fontSize: '11px', margin: '1px 0 0', color: urgency === u.value ? 'rgba(255,255,255,0.8)' : '#9ca3af' }}>{u.sub}</p>
                  </div>
                  {urgency === u.value && (
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '10px', color: 'white', fontWeight: 900 }}>✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: '1px', background: '#f3f4f6' }} />

          {/* Patient Name */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Patient Name *</label>
            <div style={{ position: 'relative' }}>
              <User size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#d1d5db' }} />
              <input {...register('patientName')} type="text" placeholder="Patient's full name"
                style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '36px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', fontSize: '14px', border: `1px solid ${errors.patientName ? '#fca5a5' : '#e5e7eb'}`, borderRadius: '12px', outline: 'none', background: errors.patientName ? '#fef2f2' : 'white' }} />
            </div>
            {errors.patientName && <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{errors.patientName.message}</p>}
          </div>

          {/* Blood Group */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Blood Group *</label>
            <Controller name="bloodGroup" control={control} render={({ field }) => (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {BLOOD_GROUPS.map(bg => (
                  <button key={bg} type="button" onClick={() => field.onChange(bg)}
                    style={{ padding: '10px 6px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', border: field.value === bg ? '1px solid #ef4444' : '1px solid #e5e7eb', background: field.value === bg ? '#ef4444' : 'white', color: field.value === bg ? 'white' : '#6b7280', boxShadow: field.value === bg ? '0 2px 8px rgba(239,68,68,0.25)' : 'none' }}>
                    {bg}
                  </button>
                ))}
              </div>
            )} />
            {errors.bloodGroup && <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{errors.bloodGroup.message}</p>}
          </div>

          {/* Units */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Units Needed *</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '8px 16px' }}>
              <button type="button" onClick={() => setValue('unitsNeeded', Math.max(1, (unitsNeeded || 1) - 1))}
                style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', color: '#374151', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#111827' }}>{unitsNeeded || 1}</span>
                <span style={{ fontSize: '12px', color: '#9ca3af', marginLeft: '6px' }}>unit{(unitsNeeded || 1) !== 1 ? 's' : ''}</span>
              </div>
              <button type="button" onClick={() => setValue('unitsNeeded', Math.min(20, (unitsNeeded || 1) + 1))}
                style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', color: '#374151', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
            {errors.unitsNeeded && <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{errors.unitsNeeded.message}</p>}
          </div>

          {/* Hospital */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Hospital / Location *</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#d1d5db' }} />
              <input {...register('hospitalLocation')} type="text" placeholder="e.g. Patan Hospital, Kathmandu"
                style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '36px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', fontSize: '14px', border: `1px solid ${errors.hospitalLocation ? '#fca5a5' : '#e5e7eb'}`, borderRadius: '12px', outline: 'none', background: errors.hospitalLocation ? '#fef2f2' : 'white' }} />
            </div>
            {errors.hospitalLocation && <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{errors.hospitalLocation.message}</p>}
          </div>

          <div style={{ height: '1px', background: '#f3f4f6' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', borderRadius: '14px', border: 'none', background: loading ? '#d1d5db' : '#ef4444', color: 'white', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 14px rgba(239,68,68,0.3)' }}>
              {loading ? 'Posting...' : '🩸 Post Emergency Request'}
            </button>
            <button type="button" onClick={onClose}
              style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid #e5e7eb', background: 'white', color: '#9ca3af', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;