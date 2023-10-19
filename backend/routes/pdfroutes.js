const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PDFDocument ,rgb} = require('pdf-lib');
const fs = require("fs")
const path = require("path")
const upload = multer({ dest: 'uploads/' });

router.post("/upload", upload.single("pdfFile"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send("Please upload a file.");
  }
  return res.send(file);
});
router.post("/extractpages", async (req, res) => {
  const selectedPages = req.body.selectedPages;
  const pdfBytes = req.body.pdfBytes;
  // console.log(selectedPages,"selpag")
  // console.log(pdfBytes,"pdfByt")

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const newPdfDoc = await PDFDocument.create();

  for (const pageNum of selectedPages) {
    const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1]);
    newPdfDoc.addPage(copiedPage);
  }

  const newPdfBytes = await newPdfDoc.save();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename=extracted.pdf');
  res.send(newPdfBytes);
});

// ---------------------Commented-------------------//
// async function extractAndCreatePDF(inputPDFName, outputPDFName, pageNumbers) {
//   // Construct the full paths to the input and output PDFs in the current directory
//   const inputPDFPath = path.join(__dirname, inputPDFName);
//   const outputPDFPath = path.join(__dirname, outputPDFName);

//   const inputPDFBuffer = fs.readFileSync(inputPDFPath);
//   const pdfDoc = await PDFDocument.load(inputPDFBuffer);
//   const newDoc = await PDFDocument.create();

//   for (const pageNumber of pageNumbers) {
//     if (pageNumber >= 1 && pageNumber <= pdfDoc.getPageCount()) {
//       const [copiedPage] = await newDoc.copyPages(pdfDoc, [pageNumber - 1]);
//       newDoc.addPage(copiedPage);
//     }
//   }

//   const pdfBytes = await newDoc.save();

//   fs.writeFileSync(outputPDFPath, pdfBytes);
// }
// extractAndCreatePDF("/uploads/constitution.pdf", "newconstitution.pdf", [1,2])
//   .then(() => {
//     console.log('New PDF created with selected pages.');
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });
//--------------Commented--------------- //


module.exports = router;
