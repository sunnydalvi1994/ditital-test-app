import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Grid, Button, TextField } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import handleVAPT from '../../utils/globalValidation';
import '../../styles/components/formAndButtons.css';
import OtpVerificationModal from '../../components/OtpVerificationModal';
import LoaderWrapper from '../../components/LoaderWrapper';

export default function BasicDetailsFormTwo() {
  const { control, trigger, setValue, formState, getValues } = useFormContext();

  const [emailOtpModalOpen, setEmailOtpModalOpen] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailForOTP, setEmailForOTP] = useState('');
  const [selectedDoc, setSelectedDoc] = useState('aadhar');
  const [kycVerified, setKycVerified] = useState(false);
  const [kycOtpModalOpen, setKycOtpModalOpen] = useState(false);
  const [kycNumberValue, setKycNumberValue] = useState('');
  const [loading, setLoading] = useState(true);

  const mobileForOTP = sessionStorage.getItem('mobileForOTP');

  // ---------------------------
  // Debounce logic for KYC validation
  // ---------------------------
  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const debouncedTrigger = useRef(
    debounce((value) => {
      setKycNumberValue(value);
      trigger('kycNumber');
    }, 300)
  ).current;

  // ---------------------------
  // Memoized validity check
  // ---------------------------
  const isValid = useMemo(() => {
    if (!kycNumberValue || kycNumberValue.trim() === '') return false;

    return !handleVAPT(
      { target: { value: kycNumberValue } },
      selectedDoc.toUpperCase(),
      '',
      selectedDoc === 'aadhar'
        ? 'AADHAR'
        : selectedDoc === 'pan_card'
          ? 'PAN'
          : selectedDoc.toUpperCase()
    );
  }, [kycNumberValue, selectedDoc]);

  // ---------------------------
  // Store fullName in sessionStorage without causing rerenders
  // ---------------------------
  useEffect(() => {
    const fullName = getValues('fullName');
    if (fullName) sessionStorage.setItem('fullName', fullName);
  }, []);

  // ---------------------------
  // Handlers
  // ---------------------------
  const handleEmailVerify = useCallback(
    (otp) => {
      console.log('Entered Email OTP:', otp);
      setEmailVerified(true);
      setEmailOtpModalOpen(false);

      setValue('kycVerified', true, { shouldValidate: true });
      trigger('kycNumber');
    },
    [setValue, trigger]
  );

  const handleKycVerify = useCallback(() => {
    setKycVerified(true);
    setKycOtpModalOpen(false);
    setValue('kycVerified', true, { shouldValidate: true });
    trigger('kycNumber');
  }, [setValue, trigger]);

  const handleKycChange = useCallback(
    (e, fieldOnChange) => {
      fieldOnChange(e);
      setKycVerified(false);
      debouncedTrigger(e.target.value);
    },
    [debouncedTrigger]
  );

  const handleDocChange = useCallback(
    (e, fieldOnChange) => {
      fieldOnChange(e);
      setSelectedDoc(e.target.value);
      setKycVerified(false);
      setValue('kycNumber', '');
    },
    [setValue]
  );

  // ---------------------------
  // Render
  // ---------------------------
  // useEffect(() => {
  //   console.log('useeffect.......');
  // });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoaderWrapper loading={loading}>
      <div className="form-container">
        <Grid container spacing={2} direction="column">
          <div className="section-title">About You</div>
          <br />

          {/* Full Name */}
          <Grid item size={{ xs: 12, sm: 8, md: 6 }}>
            <Controller
              name="fullName"
              control={control}
              rules={{
                required: 'Full Name is required',
                validate: (value) => {
                  if (!value) return true;
                  const fakeEvent = { target: { value } };
                  const message = handleVAPT(fakeEvent, 'NAME', '', 'ALPHABET');
                  return message === '' || message;
                }
              }}
              render={({ field, fieldState }) => (
                <div className="form-group">
                  <label>Full Name</label>
                  {/* <input type="text" {...field} placeholder="Enter your full name" /> */}
                  <TextField
                    variant="standard" // ✅ works here
                    fullWidth
                    {...field}
                    placeholder="Enter your full name"
                    className="custom-textfield"
                  />
                  {fieldState.error && formState.touchedFields[field.name] && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </Grid>

          {/* PAN Number */}
          <Grid item size={{ xs: 12, sm: 8, md: 6 }}>
            <Controller
              name="panNumber"
              control={control}
              rules={{
                required: 'PAN is required',
                validate: (value) => {
                  if (!value) return true;
                  const fakeEvent = { target: { value } };
                  const message = handleVAPT(fakeEvent, 'PAN', '', 'TEXT_FIELD');
                  return message === '' || message;
                }
              }}
              render={({ field, fieldState }) => (
                <div className="form-group">
                  <label>PAN Number</label>
                  <TextField
                    variant="standard" // ✅ works here
                    fullWidth
                    {...field}
                    placeholder="Enter your PAN number"
                    className="custom-textfield"
                  />
                  {fieldState.error && formState.touchedFields[field.name] && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </Grid>

          {/* DOB */}
          <Grid item size={{ xs: 12, sm: 8, md: 6 }}>
            <Controller
              name="dob"
              control={control}
              rules={{
                required: 'Date of Birth is required',
                validate: (value) => {
                  if (!value) return true;
                  const fakeEvent = { target: { value } };
                  const message = handleVAPT(fakeEvent, 'DOB', '', 'DATE_FIELD');
                  return message === '' || message;
                }
              }}
              render={({ field, fieldState }) => (
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    {...field}
                    max={new Date().toISOString().split('T')[0]}
                    className="plain-date-input"
                  />
                  {fieldState.error && formState.touchedFields[field.name] && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </Grid>

          {/* Email */}
          <Grid item size={{ xs: 12, sm: 8, md: 6 }}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                validate: (value) => {
                  if (!value) return true;
                  const fakeEvent = { target: { value } };
                  const message = handleVAPT(fakeEvent, 'EMAIL', '', 'EMAIL_FIELD');
                  return message === '' || message;
                }
              }}
              render={({ field, fieldState }) => (
                <div className="form-group mobile-group">
                  <label>Email</label>
                  <div className="mobile-input-container">
                    {/* <input
                    type="email"
                    {...field}
                    placeholder="Enter your email"
                    disabled={emailVerified}
                  /> */}
                    <TextField
                      type="email"
                      variant="standard" // ✅ works here
                      fullWidth
                      {...field}
                      placeholder="Enter your email"
                      disabled={emailVerified}
                      className="custom-textfield"
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setEmailOtpModalOpen(true);
                        setEmailForOTP(field.value);
                      }}
                      disabled={emailVerified}
                      className="verify-btn"
                    >
                      {emailVerified ? '✓ Verified' : 'Verify'}
                    </Button>
                  </div>
                  {fieldState.error && formState.touchedFields[field.name] && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />

            <OtpVerificationModal
              open={emailOtpModalOpen}
              mobileNumber={emailForOTP}
              onClose={() => setEmailOtpModalOpen(false)}
              onVerify={handleEmailVerify}
              onResend={() => console.log('Email OTP Resent to', emailForOTP)}
            />
          </Grid>

          {/* KYC Select + Verify */}
          <Grid item size={{ xs: 12, sm: 8, md: 6 }}>
            <Controller
              name="kycDocument"
              control={control}
              defaultValue="aadhar"
              rules={{ required: 'KYC Document is required' }}
              render={({ field, fieldState }) => (
                <div className="form-group plain-input-group">
                  <label>Select KYC Document</label>
                  <select
                    {...field}
                    onChange={(e) => handleDocChange(e, field.onChange)}
                    className="plain-select"
                  >
                    <option value="aadhar">Aadhar Card</option>
                    <option value="passport">Passport</option>
                    <option value="driving_license">Driving License</option>
                    <option value="voter_id">Voter ID Card</option>
                    <option value="pan_card">PAN Card</option>
                  </select>
                  {fieldState.error && formState.touchedFields[field.name] && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />

            {selectedDoc && (
              <Controller
                name="kycNumber"
                control={control}
                rules={{
                  required: `${selectedDoc.replace('_', ' ')} Number is required`,
                  validate: (value) => {
                    if (!value || value.trim() === '') {
                      return `${selectedDoc.replace('_', ' ')} Number is required`;
                    }
                    const fakeEvent = { target: { value } };
                    return (
                      handleVAPT(
                        fakeEvent,
                        selectedDoc.toUpperCase(),
                        '',
                        selectedDoc === 'aadhar'
                          ? 'AADHAR'
                          : selectedDoc === 'pan_card'
                            ? 'PAN'
                            : selectedDoc.toUpperCase()
                      ) || true
                    );
                  }
                }}
                render={({ field, fieldState }) => (
                  <div className="form-group plain-input-group" style={{ marginTop: '10px' }}>
                    <label>Enter {selectedDoc.replace('_', ' ').toUpperCase()} Number</label>
                    <div className="mobile-input-container">
                      <input
                        type="text"
                        {...field}
                        placeholder={`Enter your ${selectedDoc}`}
                        disabled={kycVerified}
                        onChange={(e) => handleKycChange(e, field.onChange)}
                        className="plain-input"
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => setKycOtpModalOpen(true)}
                        disabled={!isValid || kycVerified}
                        style={{ backgroundColor: kycVerified ? 'green' : undefined }}
                        className={`verify-btn ${!isValid && !kycVerified ? 'disabled-initial' : ''}`}
                      >
                        {kycVerified ? '✓ Verified' : 'Verify'}
                      </Button>
                    </div>
                    {fieldState.error && formState.touchedFields[field.name] && (
                      <span className="error">{fieldState.error.message}</span>
                    )}
                  </div>
                )}
              />
            )}

            <OtpVerificationModal
              open={kycOtpModalOpen}
              mobileNumber={mobileForOTP}
              onClose={() => setKycOtpModalOpen(false)}
              onVerify={handleKycVerify}
              onResend={() => console.log('OTP Resent to', mobileForOTP)}
            />
          </Grid>
        </Grid>
      </div>
    </LoaderWrapper>
  );
}
