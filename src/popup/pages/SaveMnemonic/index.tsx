import React, { useEffect } from 'react';
import { Typography, Button, Grid, useMediaQuery, useTheme, TextField, InputAdornment } from '@mui/material';
import { inject, observer } from 'mobx-react';
import cx from 'classnames';
import NavBar from '../../components/NavBar';
import AppStore from '../../stores/AppStore';
import useStyles from './styles';
import WarningIcon from '@mui/icons-material/Warning';
const strings = require('../../localization/locales/en_US.json');

interface IProps {
  store: AppStore;
}

const SaveMnemonic: React.FC<IProps> = ({ store }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  useEffect(() => {
    console.log('SaveMnemonic');
    // console.log(store);
    store.saveMnemonicStore.generateMnemonic();

    return () => {
      // Cleanup code (if needed) when the component unmounts
    };
  }, [store.saveMnemonicStore]);

  const renderMnemonicTiles = () => {
    const { mnemonic } = store.saveMnemonicStore;
    let wordsPerRow = 4;

    if (isSmallScreen) {
      wordsPerRow = 3;
    } else if (isLargeScreen) {
      wordsPerRow = 6;
    }

    return (
      <Grid container className={classes.mnemonicTilesContainer}>
        {mnemonic.map((word, index) => (
          <Grid item xs={12 / wordsPerRow} key={index} className={classes.mnemonicTile}>
            <div className={classes.tileContainer}>
              <TextField
                className={classes.disabledInput}
                value={word}
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" className={classes.tileNumber}>
                      {index + 1}.
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: theme.palette.text.primary, // Adjust color as needed
                  },
                }}
              />
            </div>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <div className={classes.root}>
      <NavBar hasBackButton title={''} />
      <div className={classes.contentContainer}>
        <div className={classes.topContainer}>
          <Typography className={classes.walletCreatedHeader}>
            Creating Wallet
          </Typography>
          {renderMnemonicTiles()}
          <Typography className={classes.warningText}>
            <WarningIcon className={classes.warningIcon} />
            {strings['saveMnemonic.warningText']}
          </Typography>
        </div>
        <Button
          className={cx(classes.actionButton, 'marginBottom')}
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => store.saveMnemonicStore.createWallet(false)}
        >
          I Copied It Somewhere Safe
        </Button>
        {/*
          Developer Note: Download functionality is disabled for Cordova
          since i encountered issues in making it work.
        */}
        {typeof window.cordova === 'undefined' || window.cordova === null ? null : (
          <Button
            className={classes.actionButton}
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => store.saveMnemonicStore.createWallet(true)}
          >
            Save To File
          </Button>
        )}
      </div>
    </div>
  );
};

export default inject('store')(observer(SaveMnemonic));
