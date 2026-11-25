/* ==========================================
 PORTFOLIOPRO 2.0
 FEATURE 3 - RESUME PDF EXPORT
 File: features/resumePDF.js
 ========================================== */

(function() {
  "use strict";

  // ======================================
  // 1. CONFIGURATION
  // ======================================

  const PRINT_AREA_ID = "resumePrintArea";

  const DEFAULT_FILE_NAME = "PortfolioPro_Resume";

  // ======================================
  // 2. GET RESUME PRINT AREA
  // ======================================

  function getPrintArea() {
    return document.getElementById(
      PRINT_AREA_ID
    );
  }

  // ======================================
  // 3. CHECK PRINT AREA
  // ======================================

  function validatePrintArea() {
    const printArea = getPrintArea();

    if (!printArea) {
      throw new Error(
        "Resume preview not found. Please reload the page."
      );
    }

    return printArea;
  }

  // ======================================
  // 4. CREATE SAFE FILE NAME
  // ======================================

  function sanitizeFileName(value) {
    return String(value || "")
      .trim()
      .replace(/[^a-zA-Z0-9_-]+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 80);
  }

  function getSuggestedFileName(resume) {
    const name = sanitizeFileName(
      resume && resume.fullName
    );

    return name ?
      name + "_Resume" :
      DEFAULT_FILE_NAME;
  }

  // ======================================
  // 5. PREPARE DOCUMENT FOR PRINTING
  // ======================================

  function preparePrint(resume) {
    validatePrintArea();

    const originalTitle = document.title;

    const fileName = getSuggestedFileName(
      resume
    );

    // Browser PDF printing may use
    // document title as suggested file name.
    document.title = fileName;

    return function restoreTitle() {
      document.title = originalTitle;
    };
  }

  // ======================================
  // 6. OPEN BROWSER PRINT DIALOG
  // ======================================

  function exportToPDF(resume) {
    const restoreTitle = preparePrint(
      resume
    );

    let restored = false;

    function cleanup() {
      if (restored) {
        return;
      }

      restored = true;

      restoreTitle();

      window.removeEventListener(
        "afterprint",
        cleanup
      );
    }

    window.addEventListener(
      "afterprint",
      cleanup
    );

    try {
      window.print();

      // Some browsers do not fire
      // afterprint consistently.
      // Restore title after printing
      // has been initiated.
      setTimeout(cleanup, 1000);

      return {
        success: true,
        message: "Print dialog opened. Select Save as PDF to download your resume."
      };

    } catch (error) {
      cleanup();

      console.error(
        "Resume PDF export failed:",
        error
      );

      throw new Error(
        "Unable to open the print dialog."
      );
    }
  }

  // ======================================
  // 7. PDF EXPORT SUPPORT CHECK
  // ======================================

  function isPDFSupported() {
    return (
      typeof window.print === "function" &&
      Boolean(getPrintArea())
    );
  }

  // ======================================
  // 8. PRINT INSTRUCTIONS
  // ======================================

  function getPrintInstructions() {
    return [
      "1. Click Download PDF.",
      "2. Select Save as PDF as destination.",
      "3. Choose A4 paper size.",
      "4. Set scale to Default or 100%.",
      "5. Disable headers and footers.",
      "6. Enable background graphics if needed.",
      "7. Click Save."
    ];
  }

  // ======================================
  // 9. PUBLIC MODULE API
  // ======================================

  window.PortfolioResumePDF = {
    getPrintArea,
    validatePrintArea,
    sanitizeFileName,
    getSuggestedFileName,
    preparePrint,
    exportToPDF,
    isPDFSupported,
    getPrintInstructions
  };

  console.log(
    "PortfolioPro Resume PDF Module Loaded"
  );

})();