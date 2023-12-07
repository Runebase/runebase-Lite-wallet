// SeedPhraseInput.tsx (Reusable Component)
import React from 'react';
import { TextField, Grid, InputAdornment, useTheme, useMediaQuery, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import useStyles from './styles';

const SeedPhraseInput: React.FC<any> = ({
  phrase,
  setPhrase,
  error,
  setError,
  disabled
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery (theme.breakpoints.up('lg'));

  const handlePhraseChange = (index: number, value: string) => {
    const updatedPhrase = [...phrase];
    updatedPhrase[index] = value.toLowerCase(); // Force the value to lowercase
    setPhrase(updatedPhrase);
    setError(null);
  };


  const renderMnemonicTiles = () => {
    let wordsPerRow = 3;

    if (isSmallScreen) {
      wordsPerRow = 2;
    } else if (isLargeScreen) {
      wordsPerRow = 4;
    }

    return (
      <Grid container className={classes.mnemonicTilesContainer}>
        {phrase.map((
          word: string,
          index: number
        ) => (
          <Grid item xs={12 / wordsPerRow} key={index} className={classes.mnemonicTile}>
            <div className={classes.tileContainer}>
              <TextField
                value={word}
                onChange={(e) => handlePhraseChange(index, e.target.value)}
                variant="outlined"
                fullWidth
                disabled={disabled}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" className={classes.tileNumber}>
                      {index + 1}.
                    </InputAdornment>
                  ),
                  sx: {
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: theme.palette.text.primary,
                    },
                  },
                }}
              />
            </div>
          </Grid>
        ))}
      </Grid>
    );
  };


  return (<>
    {renderMnemonicTiles()}
    {error && (
      <Typography className={classes.warningText}>
        <WarningIcon className={classes.warningIcon} />
        {error}
      </Typography>
    )}
  </>);
};

export default SeedPhraseInput;