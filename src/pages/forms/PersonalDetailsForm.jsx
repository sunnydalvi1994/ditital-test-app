import React, { useEffect, useState } from 'react';
import {
  Grid,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Button,
  Box,
  Typography,
  Tooltip,
  IconButton,
  TextField
} from '@mui/material';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import '../../styles/components/formAndButtons.css';
import handleVAPT from '../../utils/globalValidation';
import LoaderWrapper from '../../components/LoaderWrapper';

export default function PersonalDetailsForm() {
  const { control, watch, formState } = useFormContext();
  const [loading, setLoading] = useState(true);

  const [addresses, setAddresses] = useState([
    {
      address: '1405 Glendale CHSL Off M G Road Hariniwas Circle Near Majiwada Thane 400604',
      source: 'Aadhar Card',
      isEditing: false,
      tempValue: ''
    },
    {
      address: '306 GlenEagle Towers Off M G Road Hariniwas Circle Near Majiwada Thane 400604',
      source: 'Pan Card',
      isEditing: false,
      tempValue: ''
    },
    {
      address: '1800 CrossRoad Heights Off M G Road Hariniwas Circle Near Majiwada Thane 400604',
      source: 'Passport',
      isEditing: false,
      tempValue: ''
    }
  ]);

  const handleEditClick = (index) => {
    setAddresses((prev) =>
      prev.map((addr, i) =>
        i === index ? { ...addr, isEditing: true, tempValue: addr.address } : addr
      )
    );
  };

  // Handle typing
  const handleInputChange = (index, value) => {
    setAddresses((prev) =>
      prev.map((addr, i) => (i === index ? { ...addr, tempValue: value } : addr))
    );
  };

  // Save changes
  const handleSaveClick = (index) => {
    setAddresses((prev) =>
      prev.map((addr, i) =>
        i === index ? { ...addr, address: addr.tempValue, isEditing: false } : addr
      )
    );
  };
  const customer_id = sessionStorage.getItem('customerId');
  const fullName = useWatch({ control, name: 'fullName' });

  useEffect(() => {
    if (fullName) {
      sessionStorage.setItem('fullName', fullName);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoaderWrapper loading={loading}>
      <div className="form-container more-about-you">
        <div className="section-title">More About You</div>

        <Grid container spacing={2} direction="column">
          {/* Full Name */}
          <Box
            className="account-section"
            sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
          >
            <Typography
              variant="h3"
              className="account-question"
              sx={{ marginBottom: '0 !important' }}
            >
              {sessionStorage.getItem('fullName') || ''}
            </Typography>
            {customer_id && (
              <Typography variant="body1">
                Customer No: {customer_id} | Wagle Estate Branch
              </Typography>
            )}
          </Box>
          <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
            <Controller
              name="gender"
              control={control}
              rules={{ required: 'Gender is required' }}
              render={({ field, fieldState }) => (
                <div className="form-group plain-input-group">
                  <label>Gender</label>
                  <select {...field} className="plain-select">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {fieldState.error && formState.touchedFields[field.name] && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </Grid>

          {/* Present Address Selection */}
          <Grid container spacing={2} direction="column">
            {/* Label */}
            <div className="form-group" style={{ marginBottom: '8px' }}>
              <label>Present Address</label>
            </div>

            {/* Address Options in Horizontal Row */}
            <Grid item size={{ xs: 12, sm: 12, md: 12 }}>
              <Grid container spacing={2} sx={{ mt: 2 }} className="address-grid">
                {addresses.map((addrObj, idx) => (
                  <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Controller
                      name="presentAddress"
                      control={control}
                      rules={{ required: 'Please select a present address' }}
                      render={({ field }) => (
                        <Box
                          className={`address-card ${field.value === addrObj.address ? 'selected' : ''}`} // ✅ updated
                        >
                          {/* Pencil icon */}
                          {!addrObj.isEditing && (
                            <IconButton
                              size="small"
                              className="address-edit-btn" // ✅ updated
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(idx);
                              }}
                            >
                              <EditOutlinedIcon className="edit-icon" />
                            </IconButton>
                          )}

                          {/* Source Label */}
                          <Typography className="source-label">Source: {addrObj.source}</Typography>

                          {/* Editable Address */}
                          {addrObj.isEditing ? (
                            <Box className="address-edit-container">
                              <TextField
                                fullWidth
                                size="small"
                                value={addrObj.tempValue}
                                onChange={(e) => handleInputChange(idx, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveClick(idx);
                                  }
                                }}
                              />
                              <Button
                                variant="contained"
                                size="small"
                                className="next-btn small"
                                sx={{ mt: 1 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveClick(idx);
                                }}
                              >
                                Save
                              </Button>
                            </Box>
                          ) : (
                            <Box
                              className="address-option" // ✅ updated
                              onClick={() => field.onChange(addrObj.address)}
                            >
                              <Checkbox checked={field.value === addrObj.address} />
                              <Typography className="address-text">
                                {addrObj.address}
                              </Typography>{' '}
                              {/* ✅ updated */}
                            </Box>
                          )}
                        </Box>
                      )}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Error Message */}
              {formState.touchedFields.presentAddress && formState.errors.presentAddress && (
                <Typography className="error-message">
                  {formState.errors.presentAddress.message}
                </Typography>
              )}
            </Grid>

            {/* Same as Permanent checkbox */}
            <Grid item size={{ xs: 12, sm: 12, md: 12 }}>
              <Controller
                name="sameAsPermanent"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value || false} />}
                    label="My present address is different from my permanent address"
                  />
                )}
              />
            </Grid>

            {/* Conditional Address Inputs */}
            {watch('sameAsPermanent') && (
              <>
                <Grid item size={{ xs: 12, sm: 12, md: 12 }}>
                  <Grid container spacing={2} direction="column">
                    {/* Address 1 */}
                    <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
                      <Controller
                        name="address1"
                        control={control}
                        rules={{
                          required: 'Address 1 is required',
                          validate: (value) => {
                            if (!value) return true;
                            const err = handleVAPT(
                              { target: { value } },
                              'ADDRESS1',
                              '',
                              'TEXT_AREA'
                            );
                            return err === '' ? true : err;
                          }
                        }}
                        render={({ field, fieldState }) => (
                          <div className="form-group">
                            <label>Address Line 1</label>
                            <TextField
                              variant="standard"
                              fullWidth
                              {...field}
                              placeholder="House No / Building / Street"
                              className="custom-textfield"
                            />
                            {formState.touchedFields[field.name] && fieldState.error && (
                              <span className="error">{fieldState.error.message}</span>
                            )}
                          </div>
                        )}
                      />
                    </Grid>

                    {/* Address 2 */}
                    <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
                      <Controller
                        name="address2"
                        control={control}
                        rules={{
                          validate: (value) => {
                            if (!value) return true;
                            const err = handleVAPT(
                              { target: { value } },
                              'ADDRESS2',
                              '',
                              'TEXT_AREA'
                            );
                            return err || true;
                          }
                        }}
                        render={({ field, fieldState }) => (
                          <div className="form-group">
                            <label>Address Line 2 (Optional)</label>
                            <TextField
                              variant="standard"
                              fullWidth
                              {...field}
                              placeholder="Landmark / Area"
                              className="custom-textfield"
                            />
                            {formState.touchedFields[field.name] && fieldState.error && (
                              <span className="error">{fieldState.error.message}</span>
                            )}
                          </div>
                        )}
                      />
                    </Grid>

                    {/* City */}
                    <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
                      <Controller
                        name="city"
                        control={control}
                        rules={{
                          required: 'City is required',
                          validate: (value) => {
                            if (!value) return true;
                            const err = handleVAPT({ target: { value } }, 'CITY', '', 'ALPHABET');
                            return err !== '' ? err : true;
                          }
                        }}
                        render={({ field, fieldState }) => (
                          <div className="form-group">
                            <label>City</label>
                            <TextField
                              variant="standard"
                              fullWidth
                              {...field}
                              placeholder="Enter City"
                              className="custom-textfield"
                            />
                            {formState.touchedFields[field.name] && fieldState.error && (
                              <span className="error">{fieldState.error.message}</span>
                            )}
                          </div>
                        )}
                      />
                    </Grid>

                    {/* State */}
                    <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
                      <Controller
                        name="state"
                        control={control}
                        rules={{
                          required: 'State is required',
                          validate: (value) => {
                            if (!value) return true;
                            const err = handleVAPT({ target: { value } }, 'STATE', '', 'ALPHABET');
                            return err !== '' ? err : true;
                          }
                        }}
                        render={({ field, fieldState }) => (
                          <div className="form-group">
                            <label>State</label>
                            <TextField
                              variant="standard"
                              fullWidth
                              {...field}
                              placeholder="Enter State"
                              className="custom-textfield"
                            />
                            {formState.touchedFields[field.name] && fieldState.error && (
                              <span className="error">{fieldState.error.message}</span>
                            )}
                          </div>
                        )}
                      />
                    </Grid>

                    {/* Pincode */}
                    <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
                      <Controller
                        name="pincode"
                        control={control}
                        rules={{
                          required: 'Pincode is required',
                          validate: (value) => {
                            if (!value) return true;
                            const err = handleVAPT({ target: { value } }, 'PINCODE', '', 'PINCODE');
                            return err !== '' ? err : true;
                          }
                        }}
                        render={({ field, fieldState }) => (
                          <div className="form-group">
                            <label>Pincode</label>
                            <TextField
                              variant="standard"
                              fullWidth
                              {...field}
                              placeholder="Enter Pincode"
                              className="custom-textfield"
                            />
                            {formState.touchedFields[field.name] && fieldState.error && (
                              <span className="error">{fieldState.error.message}</span>
                            )}
                          </div>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
          {/* House Ownership */}
          <Grid item size={{ xs: 12, sm: 10, md: 12 }}>
            <div className="form-group">
              <label>House Ownership</label>
              <Controller
                name="houseOwnership"
                control={control}
                rules={{ required: 'Please select house ownership' }}
                render={({ field, fieldState }) => (
                  <>
                    <RadioGroup row {...field}>
                      <FormControlLabel value="ownedByMe" control={<Radio />} label="Owned by Me" />

                      <div className="family-owned-wrapper">
                        <FormControlLabel
                          value="familyOwned"
                          control={<Radio />}
                          label="Family Owned"
                        />
                        <Tooltip
                          title="Spouse, Children, Parents, Parent-in-laws, etc."
                          arrow
                          placement="top" // ensures tooltip appears above
                          className="tooltip-wrapper"
                        >
                          <IconButton size="small" className="info-btn">
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </div>

                      <FormControlLabel
                        value="notOwned"
                        control={<Radio />}
                        label="Not Owned by me"
                      />
                    </RadioGroup>

                    {fieldState.error && formState.touchedFields[field.name] && (
                      <span className="error">{fieldState.error.message}</span>
                    )}
                  </>
                )}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    </LoaderWrapper>
  );
}
