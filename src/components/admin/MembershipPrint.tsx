"use client";

import { Membership } from "@/backend/types";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Loader2, Download, Printer, X, ZoomIn, ZoomOut } from "lucide-react";

interface MembershipPrintProps {
  memberships: Membership[];
  onClose: () => void;
}

/**
 * Philippine Short Bond Paper: 8.5 x 11 inches
 */
const PAGE_WIDTH_MM = 215.9;
const PAGE_HEIGHT_MM = 279.4;

/**
 * Recommended Card Size: 100mm x 80mm
 */
const CARD_WIDTH_MM = 100;
const CARD_HEIGHT_MM = 80;

export default function MembershipPrint({ memberships, onClose }: MembershipPrintProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [zoom, setZoom] = useState(0.5); 
  const printRef = useRef<HTMLDivElement>(null);

  // Group ALL memberships into batches of 4
  const batches: Membership[][] = [];
  for (let i = 0; i < memberships.length; i += 4) {
    batches.push(memberships.slice(i, i + 4));
  }

  const downloadPDF = async () => {
    if (!printRef.current) return;
    setIsGeneratingPDF(true);

    try {
      // Create a hidden container for PDF capture to avoid transform/zoom issues
      const captureContainer = document.createElement("div");
      captureContainer.style.position = "absolute";
      captureContainer.style.left = "-9999px";
      captureContainer.style.top = "0";
      captureContainer.style.width = `${PAGE_WIDTH_MM}mm`;
      document.body.appendChild(captureContainer);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [PAGE_WIDTH_MM, PAGE_HEIGHT_MM],
      });

      // Select all print pages from the actual ref
      const pages = printRef.current.querySelectorAll(".print-page");
      
      for (let i = 0; i < pages.length; i++) {
        const originalPage = pages[i] as HTMLElement;
        
        // Clone the page into our hidden container for clean capture
        const clonedPage = originalPage.cloneNode(true) as HTMLElement;
        clonedPage.style.boxShadow = "none";
        clonedPage.style.margin = "0";
        clonedPage.style.border = "none";
        captureContainer.appendChild(clonedPage);

        const canvas = await html2canvas(clonedPage, {
          scale: 2, // 2x scale for clear printing
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          width: PAGE_WIDTH_MM * 3.7795, // mm to px conversion approx
          height: PAGE_HEIGHT_MM * 3.7795
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, PAGE_WIDTH_MM, PAGE_HEIGHT_MM);
        
        // Clean up clone
        captureContainer.removeChild(clonedPage);
      }

      document.body.removeChild(captureContainer);
      pdf.save(`Membership_Batch_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Error generating PDF. Please use the 'Print Now' button instead.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="print-preview-root">
      {/* TOOLBAR */}
      <div className="no-print toolbar">
        <div className="toolbar-left">
          <button onClick={onClose} className="btn-close"><X size={20} /> Exit</button>
          <div className="divider"></div>
          <span className="status-text">{memberships.length} Cards • {batches.length * 2} Pages (8.5&quot;x11&quot;)</span>
        </div>

        <div className="toolbar-center">
          <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))}><ZoomOut size={18} /></button>
          <span className="zoom-val">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}><ZoomIn size={18} /></button>
        </div>

        <div className="toolbar-right">
          <button onClick={downloadPDF} className="btn-secondary" disabled={isGeneratingPDF}>
            {isGeneratingPDF ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />} PDF
          </button>
          <button onClick={() => window.print()} className="btn-primary">
            <Printer size={18} /> Print Now
          </button>
        </div>
      </div>

      {/* PAPER CANVAS */}
      <div className="workspace">
        <div 
          className="canvas" 
          ref={printRef}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        >
          {batches.map((batch, bIdx) => (
            <div key={bIdx} className="batch-container">
              {/* PAGE FRONT */}
              <div className="print-page fronts-page">
                <div className="grid-2x2">
                  {batch.map((m, i) => (
                    <div key={m.id || i} className="card-box">
                      <OriginalDesignCard member={m} isFront={true} />
                    </div>
                  ))}
                </div>
              </div>

              {/* PAGE BACK (MIRRORED) */}
              <div className="print-page backs-page">
                <div className="grid-2x2">
                  {/* Mirror columns for horizontal flip: [1, 0, 3, 2] */}
                  {[batch[1], batch[0], batch[3], batch[2]].map((m, i) => (
                    <div key={i} className="card-box">
                      {m ? <OriginalDesignCard member={m} isFront={false} /> : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .print-preview-root {
          position: fixed;
          inset: 0;
          background: #0a0a0a; /* EXTREMELY DARK WORKSPACE */
          z-index: 999999;
          display: flex;
          flex-direction: column;
          color: white;
        }

        .toolbar {
          height: 60px;
          background: #1a1a1a;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          border-bottom: 1px solid #333;
          z-index: 1000;
        }

        .toolbar-left, .toolbar-right { display: flex; align-items: center; gap: 15px; }
        .toolbar-center { display: flex; align-items: center; gap: 12px; background: #333; padding: 6px 16px; border-radius: 20px; }
        
        .btn-close { background: #444; border: none; color: white; padding: 8px 16px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; }
        .btn-primary { background: #dc2626; border: none; color: white; padding: 8px 24px; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .btn-secondary { background: #2563eb; border: none; color: white; padding: 8px 24px; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        
        .divider { width: 1px; height: 24px; background: #444; }
        .status-text { font-size: 13px; color: #aaa; }
        .zoom-val { font-size: 13px; font-weight: bold; min-width: 45px; text-align: center; }

        .workspace {
          flex: 1;
          overflow: auto;
          padding: 60px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #0a0a0a;
        }

        .canvas {
          display: flex;
          flex-direction: column;
          gap: 100px;
        }

        .batch-container { display: flex; flex-direction: column; gap: 60px; }

        /* PHYSICAL BOND PAPER STYLING */
        .print-page {
          width: ${PAGE_WIDTH_MM}mm;
          height: ${PAGE_HEIGHT_MM}mm;
          background: #ffffff !important;
          box-shadow: 0 0 60px rgba(0,0,0,0.9); /* STRONG SHADOW FOR LAPSE OF WHITE */
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          position: relative;
          border: 1px solid #000; /* THIN BORDER TO DEFINE PAPER EDGE */
        }

        /* 2x2 GRID */
        .grid-2x2 {
          display: grid;
          grid-template-columns: repeat(2, ${CARD_WIDTH_MM}mm);
          grid-template-rows: repeat(2, ${CARD_HEIGHT_MM}mm);
          gap: 10mm; 
        }

        .card-box {
          width: ${CARD_WIDTH_MM}mm;
          height: ${CARD_HEIGHT_MM}mm;
          outline: 0.1mm dashed #ddd;
          background: #fff;
        }

        @media print {
          .no-print { display: none !important; }
          .print-preview-root { position: static; background: white; }
          .workspace { padding: 0; overflow: visible; background: white; }
          .canvas { transform: none !important; gap: 0; }
          .batch-container { gap: 0; }
          .print-page { 
            box-shadow: none !important; 
            margin: 0 !important; 
            border: none !important;
            page-break-after: always !important; 
          }
          @page { size: 8.5in 11in; margin: 0; }
        }
      `}</style>

      {/* ORIGINAL DESIGN STYLES (Scaled for Print) */}
      <style jsx global>{`
        .orig-card {
          width: ${CARD_WIDTH_MM}mm;
          height: ${CARD_HEIGHT_MM}mm;
          background-color: #ffffff;
          position: relative;
          color: #000;
          padding: 2.5mm 4mm;
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          overflow: hidden;
        }

        .orig-watermark {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0.12;
          z-index: 0;
          pointer-events: none;
        }
        .orig-watermark img { width: 55mm; height: 55mm; object-fit: contain; }

        .orig-content { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; }

        /* HEADER */
        .orig-header {
          display: flex;
          align-items: center;
          gap: 2mm;
          border-bottom: 0.4mm solid #520000;
          padding-bottom: 0.8mm;
          margin-bottom: 0.8mm;
          justify-content: center;
        }
        .orig-logo { width: 14mm; height: 11mm; object-fit: contain; }
        .orig-title-group { text-align: center; }
        .orig-title-main { font-size: 5mm; font-weight: 900; color: #520000; line-height: 0.8; font-family: 'Times New Roman', serif; }
        .orig-title-sub { font-size: 1.8mm; font-weight: bold; color: #000; margin-top: 0.4mm; }

        .orig-address { font-size: 1.2mm; text-align: center; line-height: 1.1; margin-bottom: 0.8mm; font-weight: bold; }
        .orig-slogan { font-size: 2.8mm; text-align: center; margin: 0.4mm 0; font-family: 'Brush Script MT', cursive; color: #3d1e00; }
        .orig-cert-title { font-size: 3.5mm; font-weight: 900; text-align: center; margin-bottom: 1.2mm; font-family: 'Times New Roman', serif; color: #3d1e00; }

        /* FORM BOX */
        .orig-form { border: 0.4mm solid #000; display: flex; margin-bottom: 1.2mm; height: 28mm; }
        .orig-photo { width: 20mm; border-right: 0.4mm solid #000; background: #f0f0f0; }
        .orig-fields { flex: 1; display: flex; flex-direction: column; }
        .orig-field { display: flex; align-items: center; padding: 0 2mm; border-bottom: 0.2mm solid #000; height: 7mm; font-size: 2.5mm; }
        .orig-field:last-child { border-bottom: none; }
        .orig-field.long { height: 10mm; align-items: flex-start; flex-direction: column; padding-top: 1mm; }
        .orig-label { font-weight: bold; margin-right: 2mm; white-space: nowrap; font-size: 2.2mm; line-height: 1; }
        .orig-value { font-weight: 900; text-transform: uppercase; font-size: 2.6mm; flex: 1; overflow: hidden; line-height: 1; display: flex; align-items: center; }

        .orig-sig-line { border: 0.4mm solid #000; width: 48%; height: 6mm; padding: 0 2mm; font-size: 2mm; font-weight: bold; margin-bottom: 1.5mm; display: flex; align-items: center; }

        /* FOOTER ALIGNMENT */
        .orig-footer-row { display: flex; gap: 2.5mm; }
        .orig-footer-box { 
          border: 0.4mm solid #000; 
          border-radius: 1mm; 
          flex: 1; 
          height: 6mm; 
          display: flex; 
          align-items: center; 
          padding: 0 2.5mm; 
          font-weight: 900; 
        }
        .orig-footer-label { font-size: 2.2mm; white-space: nowrap; margin-right: 2mm; line-height: 1; }
        .orig-footer-val { font-size: 2.6mm; text-transform: uppercase; flex: 1; overflow: hidden; line-height: 1; display: flex; align-items: center; }

        /* BACK SIDE */
        .orig-table { width: 100%; border: 0.5mm solid #000; border-collapse: collapse; margin-bottom: 1.5mm; }
        .orig-table th, .orig-table td { border: 0.2mm solid #000; text-align: center; height: 4mm; padding: 0.2mm; font-size: 1.6mm; }
        .orig-table th { background: #eaddb6; font-weight: bold; }
        .orig-table td { font-weight: 900; }

        .orig-disclaimer { font-size: 1.6mm; font-style: italic; text-align: justify; line-height: 1.1; margin-bottom: 2mm; font-weight: bold; color: #520000; font-family: 'Times New Roman', serif; }
        
        .orig-back-footer { display: flex; justify-content: space-between; align-items: flex-end; flex: 1; }
        .orig-auth-sig { width: 42%; display: flex; flex-direction: column; align-items: center; }
        .orig-sign-img { height: 9mm; margin-bottom: -1mm; }
        .orig-sign-name { font-size: 2.8mm; font-weight: 900; border-bottom: 0.3mm solid #000; width: 100%; text-align: center; }
        .orig-sign-label { font-size: 2mm; font-weight: bold; margin-top: 0.5mm; }

        .orig-emergency-area { width: 55%; display: flex; flex-direction: column; gap: 1.5mm; }
        .orig-emergency-box { border: 0.4mm solid #000; padding: 1.5mm; height: 11mm; }
        .orig-emergency-title { font-size: 1.5mm; font-weight: 900; margin-bottom: 1mm; }
        .orig-emergency-val { border-bottom: 0.2mm dotted #000; height: 5mm; font-size: 2mm; font-weight: bold; }
        
        .orig-contact-info { font-size: 1.5mm; font-weight: bold; text-align: right; line-height: 1.2; }
      `}</style>
    </div>
  );
}

function OriginalDesignCard({ member, isFront }: { member: Membership, isFront: boolean }) {
  if (isFront) {
    return (
      <div className="orig-card">
        <div className="orig-watermark"><img src="/seal.png" alt="" /></div>
        <div className="orig-content">
          <div className="orig-header">
            <img src="/flogo.png" className="orig-logo" alt="" />
            <div className="orig-title-group">
              <div className="orig-title-main">FONUS CEBU</div>
              <div className="orig-title-sub">FEDERATION OF COOPERATIVES</div>
            </div>
            <img src="/slogo.png" className="orig-logo" alt="" />
          </div>

          <div className="orig-address">
            R. Colina St., Ibabao Estancia Mandaue City 6014, Cebu, Philippines CDA Reg. #: 9520-07020096<br/>
            TIN No.: 411-660-058-000 Tel. #: 09669125244 Email Add: membershipofficer.fonuscebu@gmail.com
          </div>

          <div className="orig-slogan">We Value Human Dignity</div>
          <div className="orig-cert-title">MEMBERSHIP CERTIFICATE CARD</div>

          <div className="orig-form">
            <div className="orig-photo">
              {member.imageUrl && <img src={member.imageUrl} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="" />}
            </div>
            <div className="orig-fields">
              <div className="orig-field"><span className="orig-label">Name:</span><span className="orig-value">{member.name}</span></div>
              <div className="orig-field long">
                <span className="orig-label">Present Address:</span>
                <span className="orig-value" style={{fontSize:'2.2mm', lineHeight:'1.1', whiteSpace:'normal'}}>{member.presentAddress}</span>
              </div>
              <div className="orig-field"><span className="orig-label">Birthdate:</span><span className="orig-value">{member.birthdate}</span></div>
              <div className="orig-field"><span className="orig-label">Gender:</span><span className="orig-value">{member.gender}</span></div>
            </div>
          </div>

          <div className="orig-sig-line">Member&apos;s Signature:</div>

          <div className="orig-footer-row">
            <div className="orig-footer-box">
              <span className="orig-footer-label">COOP NAME:</span>
              <span className="orig-footer-val">{member.coopName}</span>
            </div>
            <div className="orig-footer-box" style={{flex:0.7}}>
              <span className="orig-footer-label">DATE ISSUED:</span>
              <span className="orig-footer-val" style={{textAlign:'right'}}>{member.dateIssued}</span>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="orig-card">
        <div className="orig-watermark"><img src="/seal.png" alt="" /></div>
        <div className="orig-content">
          <table className="orig-table">
            <thead>
              <tr>
                <th style={{width:'12%'}}>YEAR</th>
                <th style={{width:'20%'}}>PACKAGES</th>
                <th style={{width:'20%'}}>VALIDITY</th>
                <th style={{width:'24%'}}>COOP REP</th>
                <th style={{width:'24%'}}>REMARKS</th>
              </tr>
            </thead>
            <tbody>
              {(member.records || []).slice(0, 6).map((r, i) => (
                <tr key={i}>
                  <td>{r.year}</td>
                  <td>{r.package}</td>
                  <td>{r.validity}</td>
                  <td>{r.representative}</td>
                  <td>{r.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="orig-disclaimer">
            This Membership Certificate Card entitles the bearer to the entitled to discounts and privileges from various accredited merchants of Fonus Cebu. To enjoy the privileges at partner of membership, please present this card and tampering will invalidate this card.
          </div>

          <div className="orig-back-footer">
            <div className="orig-auth-sig">
              <img src="/sign.png" className="orig-sign-img" alt="" />
              <div className="orig-sign-name">JOCELYN Q. CARDENAS</div>
              <div className="orig-sign-label">Authorized Signature</div>
            </div>

            <div className="orig-emergency-area">
              <div className="orig-emergency-box">
                <div className="orig-emergency-title">IN CASE OF EMERGENCY, PLEASE NOTIFY</div>
                <div className="orig-emergency-val">{member.emergencyContact}</div>
              </div>
              <div className="orig-contact-info">
                FONUS CEBU FEDERATION OF COOPERATIVES<br/>
                Tel. #: (032) 274-2433 | Cell #: 0943 653 0264
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
