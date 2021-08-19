export const getPrintPageStyles = () => `
  @page {
    size: A4 landscape;
    margin: 30px;
  }

  @media print {
    html, body {
      height: auto !important;
      overflow: initial !important;
      color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
  }
`;
