import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { User, Mail, Phone, MapPin, Building2, Calendar, Shield, Camera, Save, Edit3, Briefcase, Heart, CreditCard, FileText, AlertTriangle } from 'lucide-react';

const TABS = ['Personal', 'Contact', 'Emergency', 'Bank', 'Documents', 'Employment'];

export default function ProfilePage() {
  const { user } = useAuth();
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState('Personal');
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    firstName: user?.firstName || 'Ananya',
    lastName: user?.lastName || 'Patel',
    email: user?.email || 'ananya@tia.com',
    phone: user?.phone || '+91 98765 43213',
    dateOfBirth: '1998-05-15',
    gender: 'Female',
    maritalStatus: 'Single',
    nationality: 'Indian',
    bloodGroup: 'O+',
    address: '42 Baker Street, Whitefield, Bangalore 560066',
    city: 'Bangalore',
    state: 'Karnataka',
    zipCode: '560066',
    country: 'India',
    emergencyName: 'Ramesh Patel',
    emergencyRelation: 'Father',
    emergencyPhone: '+91 98765 00001',
    emergencyAddress: '15 MG Road, Ahmedabad, Gujarat',
    bankName: 'HDFC Bank',
    accountNumber: 'XXXX XXXX 4521',
    ifscCode: 'HDFC0001234',
    panNumber: 'ABCDE1234F',
    uanNumber: '100123456789',
  });

  const handleSave = () => {
    setEditing(false);
    addToast('Profile updated successfully!', 'success');
  };

  const renderField = (label, value, field) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>{label}</label>
      {editing ? (
        <input
          className="form-input"
          value={value}
          onChange={(e) => setProfile(p => ({ ...p, [field]: e.target.value }))}
          style={{ padding: '8px 12px', fontSize: '13px' }}
        />
      ) : (
        <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>{value || '—'}</span>
      )}
    </div>
  );

  return (
    <div className="page animate-fadeIn">
      {/* Header Card */}
      <div className="glass-card-static" style={{
        padding: '0', marginBottom: '24px', overflow: 'hidden',
      }}>
        {/* Cover */}
        <div style={{
          height: '140px',
          background: 'var(--gradient-primary)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: '-30%', right: '10%',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }} />
        </div>
        {/* Profile Info */}
        <div style={{ padding: '0 32px 24px', display: 'flex', gap: '20px', alignItems: 'flex-end', marginTop: '-40px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <div className="avatar avatar-2xl" style={{
              border: '4px solid var(--bg-primary)',
              fontSize: '32px',
              boxShadow: 'var(--shadow-lg)',
            }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <button style={{
              position: 'absolute', bottom: '2px', right: '2px',
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'var(--gradient-primary)', border: '2px solid var(--bg-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white',
            }}>
              <Camera size={12} />
            </button>
          </div>
          <div style={{ flex: 1, paddingBottom: '4px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              {user?.name || 'Ananya Patel'}
            </h1>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '4px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Briefcase size={14} /> {user?.designation || 'Software Engineer'}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Building2 size={14} /> {user?.department || 'Engineering'}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={14} /> {user?.employeeId || 'TIA-004'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', paddingBottom: '4px' }}>
            {editing ? (
              <>
                <button className="btn btn-primary btn-sm" onClick={handleSave}>
                  <Save size={14} /> Save Changes
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>Cancel</button>
              </>
            ) : (
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
                <Edit3 size={14} /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: '24px' }}>
        {TABS.map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="card animate-fadeIn" key={activeTab}>
        {activeTab === 'Personal' && (
          <div className="form-row" style={{ gap: '20px' }}>
            {renderField('First Name', profile.firstName, 'firstName')}
            {renderField('Last Name', profile.lastName, 'lastName')}
            {renderField('Date of Birth', profile.dateOfBirth, 'dateOfBirth')}
            {renderField('Gender', profile.gender, 'gender')}
            {renderField('Marital Status', profile.maritalStatus, 'maritalStatus')}
            {renderField('Nationality', profile.nationality, 'nationality')}
            {renderField('Blood Group', profile.bloodGroup, 'bloodGroup')}
          </div>
        )}
        {activeTab === 'Contact' && (
          <div className="form-row" style={{ gap: '20px' }}>
            {renderField('Email', profile.email, 'email')}
            {renderField('Phone', profile.phone, 'phone')}
            {renderField('Address', profile.address, 'address')}
            {renderField('City', profile.city, 'city')}
            {renderField('State', profile.state, 'state')}
            {renderField('Zip Code', profile.zipCode, 'zipCode')}
            {renderField('Country', profile.country, 'country')}
          </div>
        )}
        {activeTab === 'Emergency' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <AlertTriangle size={18} style={{ color: 'var(--color-warning)' }} />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Emergency Contact</span>
            </div>
            <div className="form-row" style={{ gap: '20px' }}>
              {renderField('Contact Name', profile.emergencyName, 'emergencyName')}
              {renderField('Relationship', profile.emergencyRelation, 'emergencyRelation')}
              {renderField('Phone Number', profile.emergencyPhone, 'emergencyPhone')}
              {renderField('Address', profile.emergencyAddress, 'emergencyAddress')}
            </div>
          </div>
        )}
        {activeTab === 'Bank' && (
          <div className="form-row" style={{ gap: '20px' }}>
            {renderField('Bank Name', profile.bankName, 'bankName')}
            {renderField('Account Number', profile.accountNumber, 'accountNumber')}
            {renderField('IFSC Code', profile.ifscCode, 'ifscCode')}
            {renderField('PAN Number', profile.panNumber, 'panNumber')}
            {renderField('UAN Number', profile.uanNumber, 'uanNumber')}
          </div>
        )}
        {activeTab === 'Documents' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Offer Letter', 'Appraisal Letter - H2 2025', 'ID Proof', 'Address Proof', 'PAN Card'].map((doc, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={18} style={{ color: 'var(--color-primary-light)' }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>{doc}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>PDF · Uploaded Jan 2026</div>
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-sm" style={{ fontSize: '11px' }}>Download</button>
                </div>
              ))}
            </div>
            <button className="btn btn-secondary" style={{ marginTop: '16px' }}>
              <FileText size={14} /> Upload Document
            </button>
          </div>
        )}
        {activeTab === 'Employment' && (
          <div>
            <div className="form-row" style={{ gap: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Employee ID</label>
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>{user?.employeeId || 'TIA-004'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Department</label>
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>{user?.department || 'Engineering'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Designation</label>
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>{user?.designation || 'Software Engineer'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Joining Date</label>
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>{user?.joinDate || '2022-08-01'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Reporting Manager</label>
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>Arjun Mehta</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Employment Type</label>
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>Full-time</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
