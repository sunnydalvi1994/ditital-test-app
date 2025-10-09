import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import '../styles/global.css';

const ButtonGroup = ({ title, items, selectedValue, onSelect }) => {
  if (!items || !items.length) return null;
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Grid container spacing={1}>
        {items.map((item) => (
          <Grid item key={item.value} xs="auto">
            <Button
              className={selectedValue === item.value ? 'btn-group-item active' : 'btn-group-item'}
              variant={selectedValue === item.value ? 'contained' : 'outlined'}
              onClick={() => onSelect(item.value)}
              startIcon={<span>{item.icon}</span>}
            >
              {item.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default ButtonGroup;
