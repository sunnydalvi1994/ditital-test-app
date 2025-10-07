import React, { useState, useEffect, useRef } from 'react';
import { Box, Grid, Typography, Button, Select, MenuItem, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/components/uploadDoc.css';
import '../styles/components/formAndButtons.css';
import '../styles/global.css';
import PageWrapper from '../components/PageWrapper';
import { toast } from 'react-toastify';
import LoaderWrapper from '../components/LoaderWrapper';

export default function DocumentVerification() {
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [allUploaded, setAllUploaded] = useState(false);
  const [loading, setLoading] = useState(true);

  const fileInputRefs = useRef({});

  // Required document IDs
  const requiredDocs = [
    'bankStatement',
    'itr2024',
    'itr2023',
    'itr2022',
    'salaryJan24',
    'salaryFeb24',
    'salaryMar24',
    'latestPhoto'
  ];

  useEffect(() => {
    const allDone = requiredDocs.every((docId) => uploadedDocs[docId]?.file);
    setAllUploaded(allDone);
  }, [uploadedDocs]);

  const handleFileChange = (docId, file, name, year) => {
    if (file) {
      setUploadedDocs((prev) => ({
        ...prev,
        [docId]: {
          ...prev[docId], // ✅ keep year/month selection
          file
        }
      }));
      const displayYear = year ? ` (${year})` : ''; // format nicely
      toast.success(`${name}${displayYear} uploaded successfully! 🎉`, {
        autoClose: 2000,
        position: 'bottom-right'
      });
    }
  };
  const handleRemoveFile = (docId) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [docId]: { ...prev[docId], file: null }
    }));
    if (fileInputRefs.current[docId]) {
      fileInputRefs.current[docId].value = ''; // reset input
    }
  };

  const handleYearChange = (docId, year) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        year
      }
    }));
  };

  const handleMonthYearChange = (docId, monthYear) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        monthYear
      }
    }));
  };

  const renderUploadBox = (doc) => (
    <Grid item xs={12} sm={6} md={3} key={doc.id}>
      <Box className={`upload-box ${uploadedDocs[doc.id]?.file ? 'uploaded' : ''}`}>
        <Box className="upload-icon">{doc.icon}</Box>
        <Typography variant="h6" className="upload-title">
          {doc.name}
        </Typography>

        {/* Year selection */}
        {doc.year && (
          <Box className="year-select-box">
            <Select
              fullWidth
              displayEmpty
              value={uploadedDocs[doc.id]?.year ?? ''}
              onChange={(e) => handleYearChange(doc.id, e.target.value)}
              variant="standard"
              className="year-select"
            >
              <MenuItem value="">
                <em>Select Year</em>
              </MenuItem>
              {[2022, 2023, 2024, 2025].map((yr) => (
                <MenuItem key={yr} value={yr}>
                  {yr}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}

        {/* Month & Year selection */}
        {doc.monthYear && (
          <Box className="month-select-box">
            <Select
              fullWidth
              displayEmpty
              value={uploadedDocs[doc.id]?.monthYear ?? ''}
              onChange={(e) => handleMonthYearChange(doc.id, e.target.value)}
              variant="standard"
              className="month-select"
            >
              <MenuItem value="">
                <em>Select Month & Year</em>
              </MenuItem>
              {[
                'JAN 24',
                'FEB 24',
                'MAR 24',
                'APR 24',
                'MAY 24',
                'JUN 24',
                'JUL 24',
                'AUG 24',
                'SEP 24',
                'OCT 24',
                'NOV 24',
                'DEC 24'
              ].map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}

        {/* Notes */}
        {doc.note && (
          <Typography variant="body2" className="doc-note">
            {doc.note}
          </Typography>
        )}

        {/* File input */}
        <input
          ref={(el) => (fileInputRefs.current[doc.id] = el)} // ✅ assign ref
          type="file"
          id={`file-input-${doc.id}`}
          className="hidden-file-input"
          onChange={(e) =>
            handleFileChange(doc.id, e.target.files[0], doc.name, doc.year || doc.monthYear || '')
          }
          accept=".pdf,.jpg,.png"
          disabled={!!uploadedDocs[doc.id]?.file} // disable if file selected
        />
        <label htmlFor={`file-input-${doc.id}`}>
          <Button
            className={`verify-btn doc-btn ${uploadedDocs[doc.id]?.file ? 'verified' : ''}`}
            component="span"
            disabled={!!uploadedDocs[doc.id]?.file}
          >
            {uploadedDocs[doc.id]?.file ? 'File Selected' : 'Choose File'}
          </Button>
        </label>

        {uploadedDocs[doc.id]?.file && (
          <Box className="upload-status-box">
            <Typography className="upload-status" sx={{ display: 'flex' }}>
              {uploadedDocs[doc.id].file.name} uploaded
            </Typography>
            <IconButton
              size="small"
              onClick={() => handleRemoveFile(doc.id)}
              className="close-icon-button"
            >
              <CloseIcon fontSize="inherit" sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        )}
      </Box>
    </Grid>
  );

  const getProceedButtonStyle = () => {
    return allUploaded
      ? {
          background: 'linear-gradient(135deg, #28a745, #20c997)',
          color: 'white',
          boxShadow: '0 4px 12px rgba(40,167,69,0.3)'
        }
      : {
          background: 'linear-gradient(135deg, #f44336, #d32f2f)',
          color: 'white',
          boxShadow: '0 4px 12px rgba(244,67,54,0.3)'
        };
  };

  const proceedButtonText = allUploaded
    ? '✓ All Documents Verified - Proceed'
    : `Verify ${requiredDocs.filter((docId) => !uploadedDocs[docId]?.file).length} more documents`;

  const bankDocs = [
    {
      id: 'bankStatement',
      name: 'Bank Statement',
      note: 'You can upload multiple bank statements.'
    }
  ];
  const itrDocs = [
    { id: 'itr2024', name: 'Form 16 / ITR', year: '2024' },
    { id: 'itr2023', name: 'Form 16 / ITR', year: '2023' },
    { id: 'itr2022', name: 'Form 16 / ITR', year: '2022' }
  ];
  const salaryDocs = [
    { id: 'salaryJan24', name: 'Salary Slip', monthYear: 'JAN 24' },
    { id: 'salaryFeb24', name: 'Salary Slip', monthYear: 'FEB 24' },
    { id: 'salaryMar24', name: 'Salary Slip', monthYear: 'MAR 24' }
  ];
  const photoDoc = [{ id: 'latestPhoto', name: 'Latest Photo' }];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoaderWrapper loading={loading}>
      <PageWrapper>
        <Box className="step-content">
          {/* Header */}
          <Box className="upload-header">
            <Typography variant="h4" sx={{ color: '#333' }}>
              Document Upload
            </Typography>
            <Typography variant="body1">
              Upload your documents as PDF files for quick verification
            </Typography>
          </Box>

          {/* Bank Statement */}
          <Grid container spacing={2} className="upload-grid" sx={{ mb: 4 }}>
            {bankDocs.map(renderUploadBox)}
          </Grid>

          {/* ITR */}
          <Box className="upload-header">
            <Typography variant="h6" sx={{ color: '#333' }}>
              Upload/Fetch Form 16 OR Upload ITR
            </Typography>
          </Box>
          <Grid container spacing={2} className="upload-grid" sx={{ mb: 4 }}>
            {itrDocs.map(renderUploadBox)}
          </Grid>

          {/* Salary Slips */}
          <Box className="upload-header">
            <Typography variant="h6" sx={{ color: '#333' }}>
              Upload Salary Slip
            </Typography>
          </Box>
          <Grid container spacing={2} className="upload-grid" sx={{ mb: 4 }}>
            {salaryDocs.map(renderUploadBox)}
          </Grid>

          {/* Latest Photo */}
          <Grid container spacing={2} className="upload-grid" sx={{ mb: 4 }}>
            {photoDoc.map(renderUploadBox)}
          </Grid>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button className="prev-btn" variant="contained" color="secondary">
              Previous
            </Button>
            <Button
              className="next-btn"
              variant="contained"
              sx={getProceedButtonStyle()}
              disabled={!allUploaded}
            >
              {proceedButtonText}
            </Button>
          </Box>
        </Box>
      </PageWrapper>
    </LoaderWrapper>
  );
}
