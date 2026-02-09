"use client";

import { useState, useRef } from "react";
import { Membership, MembershipRecord } from "@/backend/types";
import { Loader2, Save, Download, UploadCloud, Trash2, Printer } from "lucide-react";
import { db, app } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  dateIssued: "JAN-DEC 2025",
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
  const [isPrintingAll, setIsPrintingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Create refs for Front and Back cards specifically
  const frontRefs = useRef<(HTMLDivElement | null)[]>([]);
  const backRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Pagination / Batching
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; 

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = membersList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(membersList.length / itemsPerPage);

  const nextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage(p => Math.max(p - 1, 1));

  // Update a specific field for a specific card
  const handleChange = (index: number, field: keyof Membership, value: string) => {
    const trueIndex = indexOfFirstItem + index;
    setMembersList(prev => {
      const newList = [...prev];
      const member = { ...newList[trueIndex], [field]: value };
      
      // If coopName changes, sync it with the 2025 representative
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

  // --- PDF Generation Logic ---
  const captureCardToPDF = async (index: number) => {
    const frontEl = frontRefs.current[index];
    const backEl = backRefs.current[index];
    
    if (!frontEl || !backEl) {
        throw new Error("Card elements not found");
    }

    const member = currentMembers[index];
    const nameParts = (member.name || "UNNAMED").trim().split(" ");
    const surname = nameParts[nameParts.length - 1].toUpperCase();
    const coop = (member.coopName || "GENERAL").toUpperCase().replace(/\s+/g, "");
    const fileName = `${surname}-${coop}.pdf`;

    // Advanced capture options to handle oklab/oklch issues
    const captureOptions = {
      scale: 3, 
      useCORS: true, 
      backgroundColor: "#fcf8e3",
      logging: false,
      onclone: (clonedDoc: Document) => {
        // Remove all oklch/oklab styles from the cloned document
        // html2canvas fails when parsing these modern color functions
        const allElements = clonedDoc.getElementsByTagName('*');
        for (let i = 0; i < allElements.length; i++) {
          const el = allElements[i] as HTMLElement;
          
          // Force standard colors on card parts
          if (el.classList.contains('card-container')) {
            el.style.backgroundImage = 'none';
            el.style.backgroundColor = '#fcf8e3';
          }
          if (el.classList.contains('text-maroon')) el.style.color = '#520000';
          if (el.classList.contains('text-brown')) el.style.color = '#3d1e00';
          
          // Sanitize inline styles
          const style = el.getAttribute('style') || '';
          if (style.includes('oklch') || style.includes('oklab') || style.includes('lab')) {
            el.setAttribute('style', style
              .replace(/oklch\([^)]*\)/g, '#000')
              .replace(/oklab\([^)]*\)/g, '#000')
              .replace(/lab\([^)]*\)/g, '#000')
            );
          }

          // Clean up computed styles that html2canvas might read
          // We can't easily change computed styles, but we can try to force them via inline
          const computedStyle = window.getComputedStyle(el);
          if (computedStyle.color.includes('oklab') || computedStyle.color.includes('oklch')) {
            el.style.color = '#000';
          }
          if (computedStyle.backgroundColor.includes('oklab') || computedStyle.backgroundColor.includes('oklch')) {
            el.style.backgroundColor = 'transparent';
          }
          if (computedStyle.borderColor.includes('oklab') || computedStyle.borderColor.includes('oklch')) {
            el.style.borderColor = '#000';
          }
        }
      },
      ignoreElements: (element: Element) => element.classList.contains('no-print')
    };

    const canvasFront = await html2canvas(frontEl, captureOptions);
    const canvasBack = await html2canvas(backEl, captureOptions);

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const cardWidth = 85.6;
    const cardHeight = 54;
    const x = (pdfWidth - cardWidth) / 2;
    const gap = 10;
    const totalContentHeight = (cardHeight * 2) + gap;
    const startY = (pdfHeight - totalContentHeight) / 2;

    pdf.addImage(canvasFront.toDataURL('image/png'), 'PNG', x, startY, cardWidth, cardHeight);
    pdf.addImage(canvasBack.toDataURL('image/png'), 'PNG', x, startY + cardHeight + gap, cardWidth, cardHeight);
    
    return { pdf, fileName };
  };

  const printAllAsPDF = async () => {
    setIsPrintingAll(true);
    try {
      for (let i = 0; i < currentMembers.length; i++) {
        const result = await captureCardToPDF(i);
        result.pdf.save(result.fileName);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error: any) {
      console.error("Batch Export failed:", error);
      alert(`Failed to export all PDFs: ${error.message}`);
    } finally {
      setIsPrintingAll(false);
    }
  };

  // --- Excel Import Logic ---
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

        // Map column indices based on headers with expanded keyword matching
        const lNameIdx = findCol(['family', 'surname', 'last name', 'last_name']);
        const fNameIdx = findCol(['first name', 'given name', 'first_name']);
        const mNameIdx = findCol(['middle name', 'middle initial', 'm.i.', 'middle_name']);
        const fullNameIdx = findCol(['full name', 'fullname', 'member name', 'name of member', 'complete name']);
        const gIdx = findCol(['gender', 'sex']);
        const bIdx = findCol(['birthdate', 'birth date', 'b-date', 'date of birth', 'dob', 'bday']);
        
        // Identify all potential address columns for fallback
        const primaryAddrIdx = findCol(['present address', 'current address', 'present_address', 'residential address']);
        const secondaryAddrIdx = findCol(['address', 'residence', 'location', 'addr', 'home', 'brgy', 'city', 'home address']);
        const addrIndices = [primaryAddrIdx, secondaryAddrIdx].filter(idx => idx !== -1);

        const recordsToImport = jsonData.slice(headerRowIndex + 1).filter(row => {
          // Robust check: ensure at least one name column has content and is not a skip keyword
          const lName = lNameIdx !== -1 ? String(row[lNameIdx] || '').toLowerCase().trim() : '';
          const fName = fNameIdx !== -1 ? String(row[fNameIdx] || '').toLowerCase().trim() : '';
          const fullName = fullNameIdx !== -1 ? String(row[fullNameIdx] || '').toLowerCase().trim() : '';
          
          const hasName = lName || fName || fullName;
          const isSkip = (lName && skipKeywords.includes(lName)) || (fName && skipKeywords.includes(fName)) || (fullName && skipKeywords.includes(fullName));
          
          return hasName && !isSkip;
        });

        if (fullNameIdx === -1 && fNameIdx === -1 && lNameIdx === -1) {
          console.warn(`Sheet "${sheetName}" missing name columns. Skipping.`);
          continue;
        }

        const sheetMembers = recordsToImport.map(row => {
          const getVal = (idx: number) => (idx !== -1 && row[idx] !== undefined && row[idx] !== null) ? String(row[idx]).trim() : '';
          
          let fullName = "";
          if (fullNameIdx !== -1 && getVal(fullNameIdx)) {
            fullName = getVal(fullNameIdx);
          } else {
            const firstName = getVal(fNameIdx);
            const middleName = getVal(mNameIdx);
            const familyName = getVal(lNameIdx);
            fullName = [firstName, middleName, familyName]
              .filter(part => part && part.length > 0)
              .join(' ');
          }
          fullName = fullName.toUpperCase();

          let birthdate = getVal(bIdx);
          if (bIdx !== -1 && typeof row[bIdx] === 'number') {
             const date = new Date((row[bIdx] - (25567 + 2)) * 86400 * 1000);
             birthdate = date.toLocaleDateString('en-US');
          }

          // Smart Address Picker: Try primary, then secondary if empty
          let address = "";
          for (const idx of addrIndices) {
            const val = getVal(idx);
            if (val && val.length > 1) {
              address = val;
              break;
            }
          }

          const coopName = sheetName.toUpperCase();
          const records = DEFAULT_RECORDS.map(r => 
            r.year === "2025" 
              ? { ...r, package: "DIGNITY", validity: "1 YEAR", representative: coopName, remarks: "NEW" }
              : { ...r }
          );

          return {
            ...DEFAULT_MEMBER,
            name: fullName,
            presentAddress: address.toUpperCase(),
            birthdate: birthdate,
            gender: getVal(gIdx).toUpperCase(),
            coopName: coopName,
            records: records,
          };
        });

        allNewMembers = [...allNewMembers, ...sheetMembers];
      }

      if (allNewMembers.length > 0) {
        if (membersList.length === 1 && !membersList[0].name) {
           setMembersList(allNewMembers);
        } else if(confirm(`Found ${allNewMembers.length} members. Click OK to generate all cards.`)) {
           setMembersList(allNewMembers);
        }
      } else {
        alert("No valid records found.");
      }
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
    if (membersList.length === 1) {
        setMembersList([DEFAULT_MEMBER]);
        return;
    }
    setMembersList(prev => prev.filter((_, i) => i !== trueIndex));
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

        /* --- CARD DESIGN --- */
        .card-container {
            width: 1000px;
            height: 630px;
            position: relative;
            background-color: #fcf8e3;
            border-radius: 30px;
            overflow: hidden;
            padding: 25px 35px;
            color: #000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.12'/%3E%3C/svg%3E");
        }

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
        input:focus { background: rgba(255, 255, 0, 0.1); }

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

        .content {
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .header {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            border-bottom: 3px solid #520000;
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

        .header-title { text-align: center; }
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
        .photo-box:hover { background: rgba(0,0,0,0.05); }
        .photo-preview { width: 100%; height: 100%; object-fit: cover; }
        .photo-label {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            color: #666; font-size: 14px; pointer-events: none;
        }

        .fields-box { flex: 1; display: flex; flex-direction: column; }

        .field-row {
            display: flex;
            align-items: flex-end;
            padding: 4px 8px;
            border-bottom: 1px solid #000;
            height: 42px;
        }
        .field-row:last-child { border-bottom: none; }
        .field-row.address {
            height: 84px;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            position: relative;
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

        .footer-boxes { display: flex; gap: 20px; }
        .footer-box {
            border: 3px solid #000;
            border-radius: 6px;
            height: 38px;
            display: flex;
            align-items: center;
            padding: 0 8px;
            flex: 1;
        }
        .footer-label { font-size: 16px; font-weight: bold; margin-right: 5px; white-space: nowrap; }

        .table-wrapper { width: 100%; border: 3px solid #000; margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; }
        th {
            border: 1px solid #000;
            background: #eaddb6;
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
        td:first-child { background: #fcf8e3; font-weight: bold; }
        td input { text-align: center; font-weight: bold; }

        .disclaimer {
            font-size: 15px;
            font-weight: bold;
            text-align: justify;
            line-height: 1.1;
            margin: 8px 0 15px 0;
            font-style: italic;
        }

        .back-footer { display: flex; justify-content: space-between; align-items: flex-end; }
        .left-footer { width: 45%; }
        .right-footer { width: 50%; text-align: right; }

        .auth-sig {
            text-align: center;
            border-top: 2px solid #000;
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

        /* --- EDITOR UI SCALING --- */
        .card-scale-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            width: 100%;
        }

        .print-wrapper {
            width: 1000px;
            height: 630px;
            position: relative;
            flex-shrink: 0;
            transform-origin: top center;
            transform: scale(0.7);
            margin: 0 auto;
        }

        .scaled-card-wrapper {
            width: 700px;
            height: 441px;
            flex-shrink: 0;
            display: flex;
            justify-content: center;
        }

        @media (min-width: 1280px) {
            .print-wrapper { transform: scale(0.85); }
            .scaled-card-wrapper { width: 850px; height: 535px; }
        }

        @media (min-width: 1536px) {
            .print-wrapper { transform: scale(1.0); }
            .scaled-card-wrapper { width: 1000px; height: 630px; }
        }

        @media print {
            @page {
                margin: 0;
                size: A4 portrait;
            }
            
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: #fff !important;
                height: 100% !important;
                overflow: visible !important;
            }

            .no-print { display: none !important; }
            
            aside, nav, header, footer, .sidebar-container, .editor-controls { display: none !important; }
            
            /* Reset all possible parent containers */
            #__next, .min-h-screen, main {
                height: auto !important;
                min-height: 0 !important;
                padding: 0 !important;
                margin: 0 !important;
                background: #fff !important;
            }

            .flex.flex-col.items-center.gap-8.w-full.min-h-screen.bg-\[\#444\].p-5.font-sans {
                background: #fff !important;
                padding: 0 !important;
                margin: 0 !important;
                min-height: 0 !important;
                height: auto !important;
                display: block !important;
                overflow: visible !important;
            }

            .membership-card-root {
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                display: block !important;
            }

            .print-pair-container {
                width: 210mm !important;
                height: 297mm !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                margin: 0 auto !important;
                page-break-after: always !important;
                break-after: page !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                position: relative !important;
                overflow: hidden !important;
            }

            .print-pair-container:last-child {
                page-break-after: auto !important;
                break-after: auto !important;
            }

            .scaled-card-wrapper {
                width: 85.6mm !important;
                height: 54mm !important;
                margin: 0 !important;
                display: block !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }

            .print-wrapper {
                width: 85.6mm !important;
                height: 54mm !important;
                position: relative !important;
                margin: 0 !important;
                display: block !important;
                overflow: hidden !important; 
                transform: none !important;
            }

            .card-container {
                transform: scale(0.3235) !important; 
                transform-origin: top left !important;
                border: none !important; 
                box-shadow: none !important;
            }

            .card-scale-container {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 5mm !important;
                width: 100% !important;
                height: 100% !important;
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
        
        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .btn-print, .btn-save, .btn-import, .btn-cancel, .btn-nav {
            border: none;
            padding: 10px 20px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            color: white;
            transition: opacity 0.2s;
        }
        .btn-print { background: #8b0000; }
        .btn-save { background: #006400; }
        .btn-import { background: #0056b3; }
        .btn-cancel { background: #666; }
        .btn-nav { background: #444; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div className="no-print editor-controls">
        <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
             <div className="flex flex-col items-start gap-1">
                <h3 style={{margin:0, fontWeight:'bold', fontSize:'18px', textAlign: 'left'}}>
                    Card Generator
                </h3>
                <span style={{fontSize: '13px', color: '#666'}}>
                  {membersList.length} total members. Batch {currentPage}/{totalPages}.
                </span>
             </div>
             
             <div className="action-buttons">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleExcelImport} 
                    accept=".xlsx, .xls" 
                    className="hidden" 
                />
                
                <div style={{display:'flex', gap:'5px', marginRight:'15px'}}>
                  <button className="btn-nav" onClick={prevPage} disabled={currentPage === 1}>&lt; Prev</button>
                  <span style={{display:'flex', alignItems:'center', fontWeight:'bold', padding:'0 5px'}}>{currentPage}</span>
                  <button className="btn-nav" onClick={nextPage} disabled={currentPage === totalPages}>Next &gt;</button>
                </div>

                <button className="btn-cancel" onClick={onCancel} disabled={isSubmitting}>Back</button>
                <button className="btn-import" onClick={() => fileInputRef.current?.click()} disabled={isSubmitting}>
                    {localIsSubmitting ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />} Import
                </button>
                <button 
                  className="btn-print" 
                  onClick={printAllAsPDF} 
                  disabled={isSubmitting || isPrintingAll}
                >
                    {isPrintingAll ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />} Download PDF
                </button>
                <button className="btn-save" onClick={handleSave} disabled={isSubmitting}>
                   {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save ALL
                </button>
            </div>
        </div>
      </div>

      <div className="membership-card-root">
        {currentMembers.map((formData, index) => {
            const absoluteIndex = indexOfFirstItem + index;

            return (
                <div 
                    key={index} 
                    className="print-pair-container" 
                >
                    {/* Visual Separator for Editor */}
                    <div className="no-print" style={{
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '10px 0', 
                        borderTop: index > 0 ? '2px dashed #666' : 'none',
                        margin: '20px 0',
                        color: '#fff',
                        fontWeight: 'bold',
                        width: '100%',
                        maxWidth: '1000px',
                        marginInline: 'auto'
                    }}>
                        <span>Card #{absoluteIndex + 1} - {formData.name || 'Unnamed'}</span>
                        <div className="flex gap-4">
                            <button onClick={() => removeCard(index)} style={{background: 'transparent', border: 'none', color: '#ff6666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'}}>
                                <Trash2 size={16} /> Remove
                            </button>
                        </div>
                    </div>

                    <div className="card-scale-container">
                        {/* FRONT CARD */}
                        <div className="scaled-card-wrapper">
                            <div className="print-wrapper" ref={el => { frontRefs.current[index] = el; }}>
                                <div className="card-container">
                                    <div className="watermark"><img src={logos.seal} alt="" /></div>
                                    <div className="content">
                                        <div className="header">
                                            <div className="logo-area"><img src={logos.left} alt="Left Logo" /></div>
                                            <div className="header-title font-serif">
                                                <div className="title-main text-maroon">FONUS CEBU</div>
                                                <div className="title-sub">FEDERATION OF COOPERATIVES</div>
                                            </div>
                                            <div className="logo-area"><img src={logos.right} alt="Right Logo" /></div>
                                        </div>

                                        <div className="address-text font-sans">
                                            R. Colina St., Ibabao Estancia Mandaue City 6014, Cebu, Philippines CDA Reg. #: 9520-07020096<br/>
                                            TIN No.: 411-660-058-000 Tel. #: 09669125244 Email Add: membershipofficer.fonuscebu@gmail.com
                                        </div>

                                        <div className="slogan font-script">We Value Human Dignity</div>
                                        <div className="card-name font-serif">MEMBERSHIP CERTIFICATE CARD</div>

                                        <div className="form-container">
                                            <div className="photo-box">
                                                {!formData.imageUrl && <div className="photo-label font-sans">PHOTO</div>}
                                                {formData.imageUrl && <img src={formData.imageUrl} className="photo-preview" alt="User" style={{display: 'block'}} />}
                                                <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={(e) => handlePhotoUpload(e, index)} 
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
                                                    onChange={(index: any) => handleChange(index, "name", index.target.value)}
                                                    />
                                                </div>
                                                <div className="field-row address" style={{position: 'relative'}}>
                                                    <span className="label" style={{position: 'absolute', top: '4px', left: '8px', zIndex: 1, pointerEvents: 'none'}}>Present Address:</span>
                                                    <textarea 
                                                      className="input-data" 
                                                      style={{
                                                        width: '100%', 
                                                        height: '100%', 
                                                        paddingTop: '24px', 
                                                        paddingLeft: '8px',
                                                        lineHeight: '28px',
                                                        resize: 'none',
                                                        border: 'none',
                                                        outline: 'none',
                                                        background: 'transparent',
                                                        overflow: 'hidden'
                                                      }}
                                                      value={formData.presentAddress}
                                                      onChange={(e) => handleChange(index, "presentAddress", e.target.value)}
                                                    />
                                                </div>
                                                <div className="field-row">
                                                    <span className="label">Birthdate:</span>
                                                    <input 
                                                    type="text" 
                                                    className="input-data" 
                                                    value={formData.birthdate}
                                                    onChange={(e) => handleChange(index, "birthdate", e.target.value)}
                                                    />
                                                </div>
                                                <div className="field-row">
                                                    <span className="label">Gender:</span>
                                                    <input 
                                                    type="text" 
                                                    className="input-data" 
                                                    value={formData.gender}
                                                    onChange={(e) => handleChange(index, "gender", e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="sig-box font-sans">
                                            <span className="sig-label">Member&apos;s Signature:</span>
                                        </div>

                                        <div className="footer-boxes font-sans">
                                            <div className="footer-box">
                                                <span className="footer-label">Coop Name:</span>
                                                <input 
                                                type="text" 
                                                value={formData.coopName} 
                                                onChange={(e) => handleChange(index, "coopName", e.target.value)}
                                                style={{fontWeight:'bold', fontSize:'18px'}} 
                                                />
                                            </div>
                                            <div className="footer-box" style={{flex:0.8}}>
                                                <span className="footer-label">Date Issued:</span>
                                                <input 
                                                type="text" 
                                                value={formData.dateIssued} 
                                                onChange={(e) => handleChange(index, "dateIssued", e.target.value)}
                                                style={{fontWeight:'bold', fontSize:'18px', textAlign:'right'}} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BACK CARD */}
                        <div className="scaled-card-wrapper">
                            <div className="print-wrapper" ref={el => { backRefs.current[index] = el; }}>
                                <div className="card-container">
                                    <div className="watermark"><img src={logos.seal} alt="" /></div>
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
                                                    {formData.records?.map((record, rIdx) => (
                                                    <tr key={rIdx}>
                                                        <td>{record.year}</td>
                                                        <td><input type="text" value={record.package} onChange={(e) => handleRecordChange(index, rIdx, 'package', e.target.value)} /></td>
                                                        <td><input type="text" value={record.validity} onChange={(e) => handleRecordChange(index, rIdx, 'validity', e.target.value)} /></td>
                                                        <td><input type="text" value={record.representative} onChange={(e) => handleRecordChange(index, rIdx, 'representative', e.target.value)} /></td>
                                                        <td><input type="text" value={record.remarks} onChange={(e) => handleRecordChange(index, rIdx, 'remarks', e.target.value)} /></td>
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
                                                        filter: 'drop-shadow(0.4px 0.4px 0 #000) drop-shadow(-0.4px -0.4px 0 #000) drop-shadow(0.4px 0.4px 0 #000) drop-shadow(-0.4px -0.4px 0 #000)'
                                                    }} 
                                                    />
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
                                                    onChange={(e) => handleChange(index, "emergencyContact", e.target.value)}
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
                </div>
            );
        })}
      </div>
    </div>
  );
}
