"use client";

import { useState, useRef } from "react";
import { Membership, MembershipRecord } from "@/backend/types";
import { Loader2, Save, UploadCloud, Trash2, Printer } from "lucide-react";
import { db, app } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import * as XLSX from 'xlsx';
import MembershipPrint from "./MembershipPrint";

interface MembershipCardFormProps {
  initialData?: Membership;
  onSuccess: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const DEFAULT_RECORDS: MembershipRecord[] = [
  { year: "2022", package: "", validity: "", representative: "", remarks: "" },
  { year: "2023", package: "", validity: "", representative: "", remarks: "" },
  { year: "2024", package: "", validity: "", representative: "", remarks: "" },
  { year: "2025", package: "DIGNITY", validity: "1 YEAR", representative: "", remarks: "NEW" },
  { year: "2026", package: "", validity: "", representative: "", remarks: "" },
  { year: "2027", package: "", validity: "", representative: "", remarks: "" },
];

const DEFAULT_MEMBER: Partial<Membership> = {
  name: "",
  presentAddress: "",
  birthdate: "",
  gender: "",
  coopName: "",
  dateIssued: "JAN-DEC",
  emergencyContact: "",
  records: DEFAULT_RECORDS,
};

const PLACEHOLDER_LOGOS = {
  left: "/flogo.png",
  right: "/slogo.png",
  seal: "/seal.png"
};

export default function MembershipCardForm({
  initialData,
  onSuccess,
  onCancel,
  isSubmitting: parentIsSubmitting,
}: MembershipCardFormProps) {
  const [membersList, setMembersList] = useState<Partial<Membership>[]>(
    initialData ? [initialData] : [DEFAULT_MEMBER]
  );

  const [logos] = useState({
    left: PLACEHOLDER_LOGOS.left,
    right: PLACEHOLDER_LOGOS.right,
    seal: PLACEHOLDER_LOGOS.seal
  });

  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [printMembers, setPrintMembers] = useState<Membership[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Pagination / Batching
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; 

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = membersList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(membersList.length / itemsPerPage);

  const nextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage(p => Math.max(p - 1, 1));

  const handleChange = (index: number, field: keyof Membership, value: string) => {
    const trueIndex = indexOfFirstItem + index;
    setMembersList(prev => {
      const newList = [...prev];
      const member = { ...newList[trueIndex], [field]: value };
      
      if (field === 'coopName') {
        const newRecords = [...(member.records || DEFAULT_RECORDS)];
        const record2025Index = newRecords.findIndex(r => r.year === "2025");
        if (record2025Index !== -1) {
          newRecords[record2025Index] = { ...newRecords[record2025Index], representative: value };
          member.records = newRecords;
        }
      }
      
      newList[trueIndex] = member;
      return newList;
    });
  };

  const handleRecordChange = (memberIndex: number, recordIndex: number, field: keyof MembershipRecord, value: string) => {
    const trueIndex = indexOfFirstItem + memberIndex;
    setMembersList(prev => {
      const newList = [...prev];
      const member = { ...newList[trueIndex] };
      const newRecords = [...(member.records || DEFAULT_RECORDS)];
      newRecords[recordIndex] = { ...newRecords[recordIndex], [field]: value };
      member.records = newRecords;
      newList[trueIndex] = member;
      return newList;
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const trueIndex = indexOfFirstItem + index;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setMembersList(prev => {
          const newList = [...prev];
          newList[trueIndex] = { ...newList[trueIndex], imageUrl: result };
          return newList;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrintCurrent = (index: number) => {
    const trueIndex = indexOfFirstItem + index;
    const member = membersList[trueIndex];
    if (!member.name) {
      alert("Please enter a name before printing.");
      return;
    }
    setPrintMembers([member as Membership]);
    setShowPrintPreview(true);
  };

  const handlePrintAll = () => {
    // Strictly print only the first batch of 20 cards
    const firstBatch = membersList.slice(0, 20).filter(m => m.name) as Membership[];
    if (firstBatch.length === 0) {
      alert("No valid members in the first 20 to print.");
      return;
    }
    setPrintMembers(firstBatch);
    setShowPrintPreview(true);
  };

  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalIsSubmitting(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      
      let allNewMembers: Partial<Membership>[] = [];

      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        const headerRowIndex = jsonData.findIndex(row => 
          row.some(cell => String(cell).toLowerCase().includes('family') || String(cell).toLowerCase().includes('first name'))
        );
        
        if (headerRowIndex === -1) continue;

        const skipKeywords = ['billing', 'rate', 'total', 'grand total', 'count'];
        const headerRow = jsonData[headerRowIndex] as any[];
        const findCol = (keywords: string[]) => 
          headerRow.findIndex(cell => 
            keywords.some(kw => String(cell || '').toLowerCase().includes(kw))
          );

        const lNameIdx = findCol(['family', 'surname', 'last name', 'last_name']);
        const fNameIdx = findCol(['first name', 'given name', 'first_name']);
        const mNameIdx = findCol(['middle name', 'middle initial', 'm.i.', 'middle_name']);
        const fullNameIdx = findCol(['full name', 'fullname', 'member name', 'name of member', 'complete name']);
        const gIdx = findCol(['gender', 'sex']);
        const bIdx = findCol(['birthdate', 'birth date', 'b-date', 'date of birth', 'dob', 'bday']);
        const primaryAddrIdx = findCol(['present address', 'current address', 'present_address', 'residential address']);
        const secondaryAddrIdx = findCol(['address', 'residence', 'location', 'addr', 'home', 'brgy', 'city', 'home address']);
        const addrIndices = [primaryAddrIdx, secondaryAddrIdx].filter(idx => idx !== -1);

        const recordsToImport = jsonData.slice(headerRowIndex + 1).filter(row => {
          const lName = lNameIdx !== -1 ? String(row[lNameIdx] || '').toLowerCase().trim() : '';
          const fName = fNameIdx !== -1 ? String(row[fNameIdx] || '').toLowerCase().trim() : '';
          const fullName = fullNameIdx !== -1 ? String(row[fullNameIdx] || '').toLowerCase().trim() : '';
          return (lName || fName || fullName) && !skipKeywords.includes(lName) && !skipKeywords.includes(fName) && !skipKeywords.includes(fullName);
        });

        const sheetMembers = recordsToImport.map(row => {
          const getVal = (idx: number) => (idx !== -1 && row[idx] !== undefined && row[idx] !== null) ? String(row[idx]).trim() : '';
          let fullName = fullNameIdx !== -1 && getVal(fullNameIdx) ? getVal(fullNameIdx) : [getVal(fNameIdx), getVal(mNameIdx), getVal(lNameIdx)].filter(p => p).join(' ');
          fullName = fullName.toUpperCase();

          let birthdate = getVal(bIdx);
          if (bIdx !== -1 && typeof row[bIdx] === 'number') {
             const date = new Date((row[bIdx] - (25567 + 2)) * 86400 * 1000);
             birthdate = date.toLocaleDateString('en-US');
          }

          let address = "";
          for (const idx of addrIndices) {
            const val = getVal(idx);
            if (val && val.length > 1) { address = val; break; }
          }

          const coopName = sheetName.toUpperCase();
          const records = DEFAULT_RECORDS.map(r => r.year === "2025" ? { ...r, package: "DIGNITY", validity: "1 YEAR", representative: coopName, remarks: "NEW" } : { ...r });

          return { ...DEFAULT_MEMBER, name: fullName, presentAddress: address.toUpperCase(), birthdate: birthdate, gender: getVal(gIdx).toUpperCase(), coopName: coopName, records: records };
        });

        allNewMembers = [...allNewMembers, ...sheetMembers];
      }

      if (allNewMembers.length > 0) {
        if (membersList.length === 1 && !membersList[0].name) setMembersList(allNewMembers);
        else if(confirm(`Found ${allNewMembers.length} members. Click OK to generate all cards.`)) setMembersList(allNewMembers);
      } else alert("No valid records found.");
    } catch (error: any) {
      alert("Failed to parse Excel file.");
    } finally {
      setLocalIsSubmitting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    const requiredFields = ['name', 'presentAddress', 'birthdate', 'gender'];
    for (let i = 0; i < membersList.length; i++) {
        const member = membersList[i];
        const missing = requiredFields.filter(field => !member[field as keyof Membership]);
        if (missing.length > 0) {
            alert(`Card #${i + 1} (${member.name || 'Unnamed'}) is missing: ${missing.join(', ')}`);
            return;
        }
    }

    setLocalIsSubmitting(true);
    try {
      const auth = getAuth(app);
      if (!auth.currentUser) await signInAnonymously(auth);

      const batchPromises = membersList.map(async (member) => {
          const dataToSave = {
            name: member.name || "",
            presentAddress: member.presentAddress || "",
            birthdate: member.birthdate || "",
            gender: member.gender || "",
            coopName: member.coopName || "",
            dateIssued: member.dateIssued || "JAN-DEC 2025",
            emergencyContact: member.emergencyContact || "",
            imageUrl: member.imageUrl || null,
            records: (member.records || DEFAULT_RECORDS).map(r => ({ ...r })),
            updatedAt: Timestamp.now(),
            ...(member.id ? {} : { createdAt: Timestamp.now() })
          };

          if (member.id) await updateDoc(doc(db, "memberships", member.id), dataToSave);
          else await addDoc(collection(db, "memberships"), dataToSave);
      });

      await Promise.all(batchPromises);
      alert(`Successfully saved ${membersList.length} records!`);
      onSuccess(); 
    } catch (error: any) {
      alert(`Failed to save: ${error.message}`);
    } finally {
      setLocalIsSubmitting(false);
    }
  };

  const removeCard = (index: number) => {
    const trueIndex = indexOfFirstItem + index;
    if (membersList.length === 1) { setMembersList([DEFAULT_MEMBER]); return; }
    setMembersList(prev => prev.filter((_, i) => i !== trueIndex));
  };

  const isSubmitting = localIsSubmitting || parentIsSubmitting;

  if (showPrintPreview) {
    return <MembershipPrint memberships={printMembers} onClose={() => setShowPrintPreview(false)} />;
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full min-h-screen bg-[#444] p-5 font-sans overflow-y-auto">
      <style jsx global>{`
        .membership-card-root * { box-sizing: border-box; }

        /* --- EDITOR SIZE: 1000x630 (Original) --- */
        .card-container {
            width: 1000px;
            height: 630px;
            position: relative;
            background-color: #ffffff; 
            border-radius: 30px;
            overflow: hidden;
            padding: 25px 35px;
            color: #000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.12'/%3E%3C/svg%3E");
            border: 1px solid #ddd;
        }

        .font-serif { font-family: 'Times New Roman', Times, serif; }
        .font-sans { font-family: Arial, Helvetica, sans-serif; }
        .font-script { font-family: 'Brush Script MT', cursive; }

        .text-maroon { color: #520000; }
        .text-brown { color: #3d1e00; }
        
        input { background: transparent; border: none; outline: none; width: 100%; font-family: inherit; font-size: inherit; font-weight: inherit; color: inherit; }
        input:focus { background: rgba(255, 255, 0, 0.1); }

        .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 650px; height: 650px; opacity: 0.22; z-index: 0; pointer-events: none; display: flex; justify-content: center; align-items: center; }
        .watermark img { width: 100%; height: 100%; object-fit: contain; }

        .content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; }

        .header { display: flex; justify-content: center; align-items: center; gap: 15px; border-bottom: 3px solid #520000; padding-bottom: 5px; margin-bottom: 5px; }
        .logo-area { width: 180px; height: 140px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .logo-area img { width: 100%; height: 100%; object-fit: contain; }

        .title-main { font-size: 58px; font-weight: 900; line-height: 0.8; text-align: center; }
        .title-sub { font-size: 19px; font-weight: bold; text-align: center; margin-top: 4px; }

        .address-text { text-align: center; font-size: 12.5px; font-weight: bold; line-height: 1.15; margin-top: 2px; }
        .slogan { text-align: center; font-size: 24px; margin: 4px 0; }
        .card-name { text-align: center; font-size: 34px; font-weight: 900; text-transform: uppercase; margin-bottom: 10px; }

        .form-container { border: 3px solid #000; display: flex; margin-bottom: 5px; }
        .photo-box { width: 200px; border-right: 3px solid #000; position: relative; background: transparent; cursor: pointer; }
        .photo-preview { width: 100%; height: 100%; object-fit: cover; }
        .photo-label { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #666; font-size: 14px; pointer-events: none; }

        .fields-box { flex: 1; display: flex; flex-direction: column; }
        .field-row { display: flex; align-items: flex-end; padding: 4px 8px; border-bottom: 1px solid #000; height: 42px; }
        .field-row:last-child { border-bottom: none; }
        .field-row.address { height: 84px; flex-direction: column; align-items: flex-start; justify-content: flex-start; }

        .label { font-weight: bold; font-size: 18px; margin-right: 5px; white-space: nowrap; }
        .input-data { font-size: 20px; font-weight: bold; text-transform: uppercase; }

        .sig-box { border: 3px solid #000; width: 48%; height: 45px; padding: 2px 8px; display: flex; align-items: flex-start; margin-bottom: 8px; font-size: 16px; font-weight: bold; }
        .footer-boxes { display: flex; gap: 20px; }
        .footer-box { border: 3px solid #000; border-radius: 6px; height: 38px; display: flex; align-items: center; padding: 0 8px; flex: 1; font-size: 16px; font-weight: bold; }

        .table-wrapper { width: 100%; border: 3px solid #000; margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; }
        th { border: 1px solid #000; background: #eaddb6; font-size: 14px; font-weight: bold; padding: 4px; text-transform: uppercase; }
        td { border: 1px solid #000; height: 30px; font-size: 14px; text-align: center; font-weight: bold; }

        .disclaimer { font-size: 15px; font-weight: bold; text-align: justify; line-height: 1.1; margin: 8px 0 15px 0; font-style: italic; }
        .back-footer { display: flex; justify-content: space-between; align-items: flex-end; }
        .auth-sig { text-align: center; border-top: 2px solid #000; padding-top: 2px; width: 90%; font-size: 14px; font-weight: bold; }
        .emergency { border: 3px solid #000; padding: 5px 8px; height: 70px; }

        /* --- EDITOR UI SCALING --- */
        .card-scale-container { display: flex; flex-direction: column; align-items: center; gap: 20px; width: 100%; }
        .print-wrapper { width: 1000px; height: 630px; position: relative; flex-shrink: 0; transform-origin: top center; transform: scale(0.7); margin: 0 auto; }
        .scaled-card-wrapper { width: 700px; height: 441px; flex-shrink: 0; display: flex; justify-content: center; }

        @media (min-width: 1280px) {
            .print-wrapper { transform: scale(0.85); }
            .scaled-card-wrapper { width: 850px; height: 535px; }
        }
        @media (min-width: 1536px) {
            .print-wrapper { transform: scale(1.0); }
            .scaled-card-wrapper { width: 1000px; height: 630px; }
        }

        .editor-controls { background: #fff; padding: 15px; border-radius: 8px; width: 100%; max-width: 900px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px; }
        .action-buttons { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
        .btn-generic { padding: 10px 20px; font-size: 14px; font-weight: bold; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 8px; color: white; border: none; transition: all 0.2s; }
        .btn-generic:hover { opacity: 0.9; }
        .btn-generic:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-print { background: #8b0000; }
        .btn-save { background: #006400; }
        .btn-import { background: #0056b3; }
        .btn-cancel { background: #666; }
        .btn-nav { background: #444; }
      `}</style>

      <div className="editor-controls sticky top-0 z-50">
        <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px'}}>
             <div className="flex flex-col items-start gap-1">
                <h3 className="font-bold text-xl text-gray-800">Membership Editor</h3>
                <span className="text-sm text-gray-500">{membersList.length} total members. Batch {currentPage}/{totalPages}.</span>
             </div>
             
             <div className="action-buttons">
                <input type="file" ref={fileInputRef} onChange={handleExcelImport} accept=".xlsx, .xls" className="hidden" />
                
                <div style={{display:'flex', gap:'5px', marginRight:'10px'}}>
                  <button className="btn-generic btn-nav" onClick={prevPage} disabled={currentPage === 1}>&lt;</button>
                  <span className="flex items-center font-bold px-2">{currentPage}</span>
                  <button className="btn-generic btn-nav" onClick={nextPage} disabled={currentPage === totalPages}>&gt;</button>
                </div>

                <button className="btn-generic btn-cancel" onClick={onCancel} disabled={isSubmitting}>Back</button>
                <button className="btn-generic btn-import" onClick={() => fileInputRef.current?.click()} disabled={isSubmitting}>
                    {localIsSubmitting ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />} Import
                </button>
                <button className="btn-generic btn-print" onClick={handlePrintAll} disabled={isSubmitting}>
                    <Printer size={18} /> Print All ({membersList.length})
                </button>
                <button className="btn-generic btn-save" onClick={handleSave} disabled={isSubmitting}>
                   {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save All
                </button>
            </div>
        </div>
      </div>

      <div className="membership-card-root w-full flex flex-col items-center gap-12">
        {currentMembers.map((formData, index) => (
            <div key={index} className="flex flex-col items-center w-full max-w-[1100px] border-b border-gray-600 pb-12 last:border-none">
                <div className="flex justify-between items-center w-full px-4 mb-4 text-white font-bold">
                    <span>Card #{indexOfFirstItem + index + 1} - {formData.name || 'UNNAMED'}</span>
                    <div className="flex gap-4">
                        <button onClick={() => handlePrintCurrent(index)} className="flex items-center gap-2 text-green-400 hover:text-green-300">
                            <Printer size={18} /> Print This
                        </button>
                        <button onClick={() => removeCard(index)} className="flex items-center gap-2 text-red-400 hover:text-red-300">
                            <Trash2 size={18} /> Remove
                        </button>
                    </div>
                </div>

                <div className="card-scale-container">
                    {/* FRONT */}
                    <div className="scaled-card-wrapper">
                        <div className="print-wrapper">
                            <div className="card-container">
                                <div className="watermark"><img src={logos.seal} alt="" /></div>
                                <div className="content">
                                    <div className="header">
                                        <div className="logo-area"><img src={logos.left} alt="" /></div>
                                        <div className="font-serif">
                                            <div className="title-main text-maroon">FONUS CEBU</div>
                                            <div className="title-sub text-black">FEDERATION OF COOPERATIVES</div>
                                        </div>
                                        <div className="logo-area"><img src={logos.right} alt="" /></div>
                                    </div>
                                    <div className="address-text font-sans text-black">
                                        R. Colina St., Ibabao Estancia Mandaue City 6014, Cebu, Philippines CDA Reg. #: 9520-07020096<br/>
                                        TIN No.: 411-660-058-000 Tel. #: 09669125244 Email Add: membershipofficer.fonuscebu@gmail.com
                                    </div>
                                    <div className="slogan font-script text-brown">We Value Human Dignity</div>
                                    <div className="card-name font-serif text-brown">MEMBERSHIP CERTIFICATE CARD</div>
                                    <div className="form-container border-black">
                                        <div className="photo-box border-black">
                                            {!formData.imageUrl && <div className="photo-label font-sans">PHOTO</div>}
                                            {formData.imageUrl && <img src={formData.imageUrl} className="photo-preview" alt="" />}
                                            <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, index)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                        <div className="fields-box font-sans text-black">
                                            <div className="field-row border-black">
                                                <span className="label">Name:</span>
                                                <input type="text" className="input-data" value={formData.name} onChange={(e) => handleChange(index, "name", e.target.value)} />
                                            </div>
                                            <div className="field-row address border-black">
                                                <span className="label">Present Address:</span>
                                                <textarea className="input-data w-full flex-1 resize-none bg-transparent border-none outline-none leading-tight" value={formData.presentAddress} onChange={(e) => handleChange(index, "presentAddress", e.target.value)} />
                                            </div>
                                            <div className="field-row border-black">
                                                <span className="label">Birthdate:</span>
                                                <input type="text" className="input-data" value={formData.birthdate} onChange={(e) => handleChange(index, "birthdate", e.target.value)} />
                                            </div>
                                            <div className="field-row border-black">
                                                <span className="label">Gender:</span>
                                                <input type="text" className="input-data" value={formData.gender} onChange={(e) => handleChange(index, "gender", e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="sig-box font-sans">
                                        <span className="sig-label">Member&apos;s Signature:</span>
                                    </div>

                                    <div className="footer-boxes font-sans">
                                        <div className="footer-box" style={{display: 'flex', alignItems: 'center', height: '45px', border: '3px solid #000', padding: '0 10px'}}>
                                            <label style={{fontSize: '18px', fontWeight: '900', whiteSpace: 'nowrap', marginRight: '10px', display: 'block', lineHeight: '1'}}>COOP NAME:</label>
                                            <input 
                                            type="text" 
                                            value={formData.coopName} 
                                            onChange={(e) => handleChange(index, "coopName", e.target.value)}
                                            style={{fontWeight:'900', fontSize:'18px', textTransform: 'uppercase', height: '100%', flex: 1, padding: 0, margin: 0, border: 'none', outline: 'none'}} 
                                            />
                                        </div>
                                        <div className="footer-box" style={{display: 'flex', alignItems: 'center', height: '45px', border: '3px solid #000', flex: 0.8, padding: '0 10px'}}>
                                            <label style={{fontSize: '18px', fontWeight: '900', whiteSpace: 'nowrap', marginRight: '10px', display: 'block', lineHeight: '1'}}>DATE ISSUED:</label>
                                            <input 
                                            type="text" 
                                            value={formData.dateIssued} 
                                            onChange={(e) => handleChange(index, "dateIssued", e.target.value)}
                                            style={{fontWeight:'900', fontSize:'18px', textAlign:'right', textTransform: 'uppercase', height: '100%', flex: 1, padding: 0, margin: 0, border: 'none', outline: 'none'}} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BACK */}
                    <div className="scaled-card-wrapper">
                        <div className="print-wrapper">
                            <div className="card-container">
                                <div className="watermark"><img src={logos.seal} alt="" /></div>
                                <div className="content">
                                    <div className="table-wrapper border-black">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th className="border-black" style={{width: '12%'}}>YEAR</th>
                                                    <th className="border-black" style={{width: '20%'}}>PACKAGES</th>
                                                    <th className="border-black" style={{width: '20%'}}>VALIDITY</th>
                                                    <th className="border-black" style={{width: '24%'}}>COOP REPRESENTATIVE</th>
                                                    <th className="border-black" style={{width: '24%'}}>REMARKS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(formData.records || []).map((record, rIdx) => (
                                                <tr key={rIdx}>
                                                    <td className="border-black">{record.year}</td>
                                                    <td className="border-black"><input type="text" value={record.package} onChange={(e) => handleRecordChange(index, rIdx, 'package', e.target.value)} /></td>
                                                    <td className="border-black"><input type="text" value={record.validity} onChange={(e) => handleRecordChange(index, rIdx, 'validity', e.target.value)} /></td>
                                                    <td className="border-black"><input type="text" value={record.representative} onChange={(e) => handleRecordChange(index, rIdx, 'representative', e.target.value)} /></td>
                                                    <td className="border-black"><input type="text" value={record.remarks} onChange={(e) => handleRecordChange(index, rIdx, 'remarks', e.target.value)} /></td>
                                                </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="disclaimer font-serif text-maroon">This Membership Certificate Card entitles the bearer to the entitled to discounts and privileges from various accredited merchants of Fonus Cebu. To enjoy the privileges at partner of membership, please present this card and tampering will invalidate this card.</div>
                                    <div className="back-footer text-black">
                                        <div style={{width: '45%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                           <div style={{height: '80px', position: 'relative', width: '100%'}}>
                                              <img src="/sign.png" style={{height: '75px', position: 'absolute', bottom: '5px', left: '50%', transform: 'translateX(-50%)', objectFit: 'contain'}} alt="" />
                                           </div>
                                           <div style={{fontSize: '20px', fontWeight: '900', marginBottom: '2px'}}>JOCELYN Q. CARDENAS</div>
                                           <div className="auth-sig border-black">Authorized Signature</div>
                                        </div>
                                        <div style={{width: '50%', display: 'flex', flexDirection: 'column', gap: '8px'}}>
                                          <div className="emergency border-black">
                                              <div style={{fontSize: '13px', fontWeight: '900', marginBottom: '4px'}}>IN CASE OF EMERGENCY, PLEASE NOTIFY</div>
                                              <input type="text" className="font-bold border-b border-black" value={formData.emergencyContact} onChange={(e) => handleChange(index, "emergencyContact", e.target.value)} />
                                          </div>
                                          <div className="font-bold text-right leading-tight" style={{fontSize: '12px'}}>
                                              FONUS CEBU FEDERATION OF COOPERATIVES<br/>
                                              Tel. #: (032) 274-2433 | Cell #: 0943 653 0264<br/>
                                              Email: membershipofficer.fonuscebu@gmail.com
                                          </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}