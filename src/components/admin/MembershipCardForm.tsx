"use client";

import { useState, useRef } from "react";
import { Membership, MembershipRecord } from "@/backend/types";
import { Loader2, Save, Download, Upload } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, Timestamp } from "firebase/firestore";

interface MembershipCardFormProps {
  initialData?: Membership;
  onSubmit: (data: Partial<Membership>) => Promise<void>; // Kept for prop compatibility, but we might bypass
  onCancel: () => void;
  isSubmitting: boolean;
}

const DEFAULT_RECORDS: MembershipRecord[] = [
  { year: "2022", package: "", validity: "", representative: "", remarks: "" },
  { year: "2023", package: "", validity: "", representative: "", remarks: "" },
  { year: "2024", package: "", validity: "", representative: "", remarks: "" },
  { year: "2025", package: "", validity: "", representative: "", remarks: "" },
  { year: "2026", package: "", validity: "", representative: "", remarks: "" },
  { year: "2027", package: "", validity: "", representative: "", remarks: "" },
];

const PLACEHOLDER_LOGOS = {
  left: "/flogo.png",
  right: "/slogo.png",
  seal: "/seal.png"
};

export default function MembershipCardForm({
  initialData,
  onSubmit: parentOnSubmit, // Rename to avoid confusion
  onCancel,
  isSubmitting: parentIsSubmitting,
}: MembershipCardFormProps) {
  const [formData, setFormData] = useState<Partial<Membership>>({
    name: "",
    presentAddress: "",
    birthdate: "",
    gender: "",
    coopName: "COWASCO-MPC",
    dateIssued: "JAN-DEC 2025",
    emergencyContact: "",
    records: DEFAULT_RECORDS,
    ...initialData,
  });

  const [logos, setLogos] = useState({
    left: PLACEHOLDER_LOGOS.left,
    right: PLACEHOLDER_LOGOS.right,
    seal: PLACEHOLDER_LOGOS.seal
  });

  const [userPhoto, setUserPhoto] = useState<string | null>(initialData?.imageUrl || null);
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);

  const handleChange = (field: keyof Membership, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRecordChange = (index: number, field: keyof MembershipRecord, value: string) => {
    const newRecords = [...(formData.records || [])];
    newRecords[index] = { ...newRecords[index], [field]: value };
    setFormData((prev) => ({ ...prev, records: newRecords }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'left' | 'right' | 'seal' | 'photo') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'photo') {
          setUserPhoto(result);
        } else {
          setLogos(prev => ({ ...prev, [type]: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // 1. Validation
    const requiredFields = ['name', 'presentAddress', 'birthdate', 'gender'];
    const missing = requiredFields.filter(field => !formData[field as keyof Membership]);
    
    if (missing.length > 0) {
      alert(`Please fill in the required fields: ${missing.join(', ')}`);
      return;
    }

    setLocalIsSubmitting(true);

    try {
      // 2. Prepare Data
      const dataToSave = {
        ...formData,
        imageUrl: userPhoto || null,
        updatedAt: Timestamp.now(),
        // Add createdAt only for new docs
        ...(initialData ? {} : { createdAt: Timestamp.now() })
      };

      // Clean undefined
      Object.keys(dataToSave).forEach(key => 
        (dataToSave as any)[key] === undefined && delete (dataToSave as any)[key]
      );

      // 3. Save to Firestore (Client Side)
      if (initialData?.id) {
        // Update
        const docRef = doc(db, "memberships", initialData.id);
        await updateDoc(docRef, dataToSave);
      } else {
        // Create
        await addDoc(collection(db, "memberships"), dataToSave);
      }

      // 4. Notify Parent to close/refresh
      await parentOnSubmit(dataToSave); 
      
      setLocalIsSubmitting(false);

    } catch (error: any) {
      console.error("Save failed:", error);
      alert(`Failed to save record: ${error.message}`);
      setLocalIsSubmitting(false);
    }
  };

  const isSubmitting = localIsSubmitting || parentIsSubmitting;

  return (
    <div className="flex flex-col items-center gap-8 w-full min-h-screen bg-[#444] p-5 font-sans">
      <style jsx global>{`
        /* --- General Reset --- */
        .membership-card-root * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* --- PRINT SETTINGS --- */
        @media print {
            body {
                background: none !important;
                padding: 0 !important;
                margin: 0 !important;
                display: block !important;
            }
            .no-print { display: none !important; }
            
            /* Hide the standard admin sidebar/layout if it's visible during print */
            aside, nav, header, footer, .sidebar-container { display: none !important; }
            .membership-card-root {
              background: none !important;
              padding: 0 !important;
              width: auto !important;
              min-height: 0 !important;
            }

            /* Physical ID-1 Card Size: 85.6mm x 53.98mm */
            .print-wrapper {
                width: 85.6mm;
                height: 54mm;
                position: relative;
                margin-bottom: 5mm; /* Gap between cards */
                page-break-inside: avoid;
            }

            .card-container {
                /* Scale the 1000px design down to 85.6mm (~323px) */
                /* 323 / 1000 = 0.323 */
                transform: scale(0.3235); 
                transform-origin: top left;
                border: 1px dashed #ccc; /* Cutting guide */
                box-shadow: none !important;
            }
        }

        /* --- EDITOR UI --- */
        .editor-controls {
            background: #fff;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            width: 100%;
            max-width: 800px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 20px;
        }
        .btn-upload {
            display: inline-block;
            padding: 6px 12px;
            background: #eee;
            border: 1px solid #ccc;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            margin: 0 5px;
            color: #333;
        }
        .btn-upload:hover { background: #ddd; }
        
        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .btn-print {
            background: #8b0000;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .btn-save {
            background: #006400;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .btn-cancel {
            background: #666;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 4px;
            cursor: pointer;
        }

        /* --- CARD DESIGN --- */
        .card-container {
            width: 1000px;  /* Working resolution */
            height: 630px; /* Aspect ratio of ID card */
            position: relative;
            background-color: #fcf8e3; /* Parchment base */
            border-radius: 30px;
            overflow: hidden;
            padding: 25px 35px;
            color: #000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            /* Texture */
            background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.12'/%3E%3C/svg%3E");
        }

        /* --- FONTS --- */
        .font-serif { font-family: 'Times New Roman', Times, serif; }
        .font-sans { font-family: Arial, Helvetica, sans-serif; }
        .font-script { font-family: 'Brush Script MT', 'Brush Script Std', cursive; }

        .text-maroon { color: #520000; }
        .text-brown { color: #3d1e00; }
        
        input {
            background: transparent;
            border: none;
            outline: none;
            width: 100%;
            font-family: inherit;
            font-size: inherit;
            font-weight: inherit;
            color: inherit;
        }
        input:focus {
           background: rgba(255, 255, 0, 0.1);
        }

        /* --- WATERMARK --- */
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 650px;
            height: 650px;
            opacity: 0.22;
            z-index: 0;
            pointer-events: none;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .watermark img { width: 100%; height: 100%; object-fit: contain; }

        /* --- LAYOUT LAYERS --- */
        .content {
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        /* === FRONT CARD STYLES === */
        .header {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            border-bottom: 3px solid #520000; /* Maroon Line */
            padding-bottom: 5px;
            margin-bottom: 5px;
        }
        .logo-area {
            width: 180px;
            height: 140px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .logo-area img { width: 100%; height: 100%; object-fit: contain; }

        .header-title {
            text-align: center;
        }
        .title-main {
            font-size: 58px;
            font-weight: 900;
            line-height: 0.8;
            letter-spacing: -1px;
            text-shadow: 2px 2px 0 rgba(255,255,255,0.8);
        }
        .title-sub {
            font-size: 19px;
            font-weight: bold;
            color: #222;
            letter-spacing: 0.5px;
            margin-top: 4px;
            text-shadow: 1px 1px 0 rgba(255,255,255,0.8);
        }

        .address-text {
            text-align: center;
            font-size: 12.5px;
            font-weight: bold;
            line-height: 1.15;
            margin-top: 2px;
            color: #000;
        }

        .slogan {
            text-align: center;
            font-size: 24px;
            margin: 4px 0;
            color: #000;
            text-shadow: 1px 1px 0 #fff;
        }

        .card-name {
            text-align: center;
            font-size: 34px;
            font-weight: 900;
            color: #3d1e00;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
            text-shadow: 2px 2px 0 rgba(255,255,255,1);
        }

        /* Main Form Area */
        .form-container {
            border: 3px solid #000;
            display: flex;
            margin-bottom: 5px;
        }

        .photo-box {
            width: 200px;
            border-right: 3px solid #000;
            position: relative;
            background: transparent;
            cursor: pointer;
        }
        .photo-box:hover {
            background: rgba(0,0,0,0.05);
        }
        .photo-preview {
            width: 100%; height: 100%; object-fit: cover;
        }
        .photo-label {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            color: #666; font-size: 14px; pointer-events: none;
        }

        .fields-box {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .field-row {
            display: flex;
            align-items: flex-end;
            padding: 4px 8px;
            border-bottom: 1px solid #000;
            height: 42px;
        }
        .field-row:last-child { border-bottom: none; }
        
        .field-row.address {
            height: 84px; /* Double height */
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
        }

        .label {
            font-weight: bold;
            font-size: 18px;
            margin-right: 5px;
            white-space: nowrap;
            margin-bottom: 2px;
        }
        .input-data {
            font-size: 20px;
            font-weight: bold;
            text-transform: uppercase;
        }

        /* Signature & Footer */
        .sig-box {
            border: 3px solid #000;
            width: 48%;
            height: 45px;
            padding: 2px 8px;
            display: flex;
            align-items: flex-start;
            margin-bottom: 8px;
        }
        .sig-label { font-size: 16px; font-weight: bold; }

        .footer-boxes {
            display: flex;
            gap: 20px;
        }
        .footer-box {
            border: 3px solid #000;
            border-radius: 6px; /* Slight round */
            height: 38px;
            display: flex;
            align-items: center;
            padding: 0 8px;
            flex: 1;
        }
        .footer-label { font-size: 16px; font-weight: bold; margin-right: 5px; white-space: nowrap; }

        /* === BACK CARD STYLES === */
        .table-wrapper {
            width: 100%;
            border: 3px solid #000;
            margin-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            border: 1px solid #000;
            background: #eaddb6; /* Slightly darker header */
            font-size: 14px;
            font-weight: bold;
            padding: 4px;
            text-transform: uppercase;
        }
        td {
            border: 1px solid #000;
            height: 30px;
            font-size: 14px;
            text-align: center;
        }
        /* First column styling */
        td:first-child { background: #fcf8e3; font-weight: bold; }
        
        td input { text-align: center; font-weight: bold; }

        .disclaimer {
            font-size: 15px;
            font-weight: bold; /* Looks bold in image */
            text-align: justify;
            line-height: 1.1;
            margin: 8px 0 15px 0;
            font-style: italic; /* Looks italic in image */
        }

        .back-footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        .left-footer { width: 45%; }
        .right-footer { width: 50%; text-align: right; }

        .auth-sig {
            text-align: center;
            border-top: 2px solid #000; /* Line above text */
            padding-top: 2px;
            width: 90%;
            margin-bottom: 15px;
        }
        .auth-label { font-size: 14px; font-weight: bold; }

        .emergency {
            border: 3px solid #000;
            padding: 5px 8px;
            height: 70px;
        }
        .emergency-title { font-size: 13px; font-weight: bold; margin-bottom: 4px; }
        
        .contact-title { font-size: 11px; font-weight: bold; margin-bottom: 2px; }
        .contact-sub { font-size: 10px; font-weight: bold; margin-bottom: 5px; }
        .contact-script { 
            font-size: 24px; 
            margin-bottom: 5px; 
            margin-right: 20px; 
            line-height: 0.9;
        }
        .contact-details { font-size: 13px; font-weight: bold; line-height: 1.25; }
        .contact-email { font-size: 12px; font-weight: bold; margin-top: 2px; }
      `}</style>

      <div className="no-print editor-controls">
        <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
             <h3 style={{margin:0, fontWeight:'bold', fontSize:'18px'}}>Membership Card Generator</h3>
             <div className="action-buttons">
                <button className="btn-cancel" onClick={onCancel} disabled={isSubmitting}>Cancel</button>
                <button className="btn-print" onClick={() => window.print()}><Download size={18} /> Print</button>
                <button className="btn-save" onClick={handleSave} disabled={isSubmitting}>
                   {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Record
                </button>
            </div>
        </div>
        <p style={{fontSize:'11px', color:'#666', marginTop:'5px'}}>Check "Background graphics" in print settings.</p>
      </div>

      <div className="membership-card-root">
        {/* FRONT CARD */}
        <div className="print-wrapper">
            <div className="card-container">
                {/* Watermark */}
                <div className="watermark">
                    <img src={logos.seal} alt="" />
                </div>

                <div className="content">
                    {/* Header */}
                    <div className="header">
                        <div className="logo-area">
                            <img src={logos.left} alt="Left Logo" />
                        </div>
                        <div className="header-title font-serif">
                            <div className="title-main text-maroon">FONUS CEBU</div>
                            <div className="title-sub">FEDERATION OF COOPERATIVES</div>
                        </div>
                        <div className="logo-area">
                            <img src={logos.right} alt="Right Logo" />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="address-text font-sans">
                        R. Colina St., Ibabao Estancia Mandaue City 6014, Cebu, Philippines CDA Reg. #: 9520-07020096<br/>
                        TIN No.: 411-660-058-000 Tel. #: 09669125244 Email Add: membershipofficer.fonuscebu@gmail.com
                    </div>

                    {/* Slogan */}
                    <div className="slogan font-script">We Value Human Dignity</div>

                    {/* Title */}
                    <div className="card-name font-serif">MEMBERSHIP CERTIFICATE CARD</div>

                    {/* Form */}
                    <div className="form-container">
                        <div className="photo-box">
                            {!userPhoto && <div className="photo-label font-sans">PHOTO</div>}
                            {userPhoto && <img src={userPhoto} className="photo-preview" alt="User" style={{display: 'block'}} />}
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleImageUpload(e, 'photo')} 
                              style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', opacity:0, cursor:'pointer'}} 
                            />
                        </div>
                        <div className="fields-box font-sans">
                            <div className="field-row">
                                <span className="label">Name:</span>
                                <input 
                                  type="text" 
                                  className="input-data" 
                                  value={formData.name}
                                  onChange={(e) => handleChange("name", e.target.value)}
                                />
                            </div>
                            <div className="field-row address">
                                <span className="label">Present Address:</span>
                                <input 
                                  type="text" 
                                  className="input-data" 
                                  style={{borderBottom: '1px solid #ccc', height: '50%', marginBottom: '2px'}}
                                  value={formData.presentAddress}
                                  onChange={(e) => handleChange("presentAddress", e.target.value)}
                                />
                                <input type="text" className="input-data" disabled />
                            </div>
                            <div className="field-row">
                                <span className="label">Birthdate:</span>
                                <input 
                                  type="text" 
                                  className="input-data" 
                                  value={formData.birthdate}
                                  onChange={(e) => handleChange("birthdate", e.target.value)}
                                />
                            </div>
                            <div className="field-row">
                                <span className="label">Gender:</span>
                                <input 
                                  type="text" 
                                  className="input-data" 
                                  value={formData.gender}
                                  onChange={(e) => handleChange("gender", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Signature */}
                    <div className="sig-box font-sans">
                        <span className="sig-label">Member's Signature:</span>
                    </div>

                    {/* Footer */}
                    <div className="footer-boxes font-sans">
                        <div className="footer-box">
                            <span className="footer-label">Coop Name:</span>
                            <input 
                              type="text" 
                              value={formData.coopName} 
                              onChange={(e) => handleChange("coopName", e.target.value)}
                              style={{fontWeight:'bold', fontSize:'18px'}} 
                            />
                        </div>
                        <div className="footer-box" style={{flex:0.8}}>
                            <span className="footer-label">Date Issued:</span>
                            <input 
                              type="text" 
                              value={formData.dateIssued} 
                              onChange={(e) => handleChange("dateIssued", e.target.value)}
                              style={{fontWeight:'bold', fontSize:'18px', textAlign:'right'}} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* BACK CARD */}
        <div className="print-wrapper">
            <div className="card-container">
                {/* Watermark (Back) */}
                <div className="watermark">
                    <img src={logos.seal} alt="" />
                </div>

                <div className="content">
                    <div className="table-wrapper font-sans">
                        <table>
                            <thead>
                                <tr>
                                    <th style={{width: '12%'}}>YEAR</th>
                                    <th style={{width: '20%'}}>PACKAGES</th>
                                    <th style={{width: '20%'}}>VALIDITY</th>
                                    <th style={{width: '24%'}}>COOP REPRESENTATIVE</th>
                                    <th style={{width: '24%'}}>REMARKS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.records?.map((record, idx) => (
                                  <tr key={idx}>
                                    <td>{record.year}</td>
                                    <td>
                                      <input 
                                        type="text" 
                                        value={record.package} 
                                        onChange={(e) => handleRecordChange(idx, 'package', e.target.value)} 
                                      />
                                    </td>
                                    <td>
                                      <input 
                                        type="text" 
                                        value={record.validity} 
                                        onChange={(e) => handleRecordChange(idx, 'validity', e.target.value)} 
                                      />
                                    </td>
                                    <td>
                                      <input 
                                        type="text" 
                                        value={record.representative} 
                                        onChange={(e) => handleRecordChange(idx, 'representative', e.target.value)} 
                                      />
                                    </td>
                                    <td>
                                      <input 
                                        type="text" 
                                        value={record.remarks} 
                                        onChange={(e) => handleRecordChange(idx, 'remarks', e.target.value)} 
                                      />
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="disclaimer font-serif text-maroon">
                        This Membership Certificate Card entitles the bearer to the entitled to discounts and privileges from various accredited merchants of Fonus Cebu. To enjoy the privileges at partner of membership, please present this card and tampering will invalidate this card.
                    </div>

                    <div className="back-footer">
                        <div className="left-footer">
                            <div style={{textAlign:'center', position:'relative', height: '80px', marginBottom: '2px'}}>
                                <img 
                                  src="/sign.png" 
                                  alt="Signature" 
                                  style={{
                                    position: 'absolute',
                                    bottom: '15px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    height: '60px',
                                    width: 'auto',
                                    objectFit: 'contain',
                                    pointerEvents: 'none',
                                    zIndex: 1,
                                    filter: 'drop-shadow(0.4px 0.4px 0 #000) drop-shadow(-0.4px -0.4px 0 #000) drop-shadow(0.4px -0.4px 0 #000) drop-shadow(-0.4px 0.4px 0 #000)'
                                  }} 
                                />
                                {/* Signature image placeholder or text */}
                                <input 
                                  type="text" 
                                  defaultValue="JOCELYN Q. CARDENAS" 
                                  style={{position:'absolute', bottom:0, left:0, width: '100%', textAlign:'center', fontWeight:'bold', fontSize:'18px', fontFamily:'Arial', zIndex: 2}} 
                                />
                            </div>
                            <div className="auth-sig font-sans">
                                <span className="auth-label">Authorized Signature:</span>
                            </div>

                            <div className="emergency font-sans">
                                <div className="emergency-title">IN CASE OF EMERGENCY, PLEASE NOTIFY</div>
                                <input 
                                  type="text" 
                                  value={formData.emergencyContact} 
                                  onChange={(e) => handleChange("emergencyContact", e.target.value)}
                                  style={{borderBottom: '1px dotted #000', height: '30px'}} 
                                />
                            </div>
                        </div>

                        <div className="right-footer font-sans">
                            <div className="contact-title">FONUS CEBU FEDERATION OF COOPERATIVES</div>
                            <div className="contact-sub">In case of loss, please return to the nearest Fonus Cebu Office</div>
                            
                            <div className="contact-script font-script">
                                We are here...<br/>
                                <span style={{marginLeft: '40px'}}>When you need us...</span>
                            </div>

                            <div className="contact-details">
                                Tel. #: (032) 274-2433<br/>
                                Cell #: 0943 653 0264
                            </div>
                            <div className="contact-email">
                                Email Add: membershipofficer.fonuscebu@gmail.com
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
