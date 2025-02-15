import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { observer, inject } from 'mobx-react';
import { handleEnterPress } from '../../../utils';
import useStyles from './styles';
import NavBar from '../../components/NavBar';
import AppStore from '../../stores/AppStore';
import GasLimitField from '../../components/GasLimitField';
import GasPriceField from '../../components/GasPriceField';
import AmountField from '../../components/AmountField';
import FromField from '../../components/FromField';
import ToField from '../../components/ToField';
import TokenField from '../../components/TokenField';
import TransactionSpeedField from '../../components/TransactionSpeedField';

interface IProps {
  store: AppStore;
}

const Send: React.FC<IProps> = inject('store')(
  observer(({ store }) => {
    const { sendStore, sessionStore } = store;
    const classes = useStyles();
    const [scanning, setScanning] = useState(false);

    useEffect(() => {
      if (sendStore) {
        sendStore.init();
      }
    }, [sendStore]);

    const startScan = () => {
      window.QRScanner.prepare((err: any, status: any) => {
        if (err) {
          console.error(err);
        } else if (status.authorized) {
          window.QRScanner.scan(displayContents);
          setScanning(true);
        } else if (status.denied) {
          console.error('Camera access denied. Please enable camera access in settings.');
        } else {
          console.error('Camera access not granted.');
        }
      });
    };

    const displayContents = (err: any, text: string) => {
      if (err) {
        console.error(err);
      } else {
        sendStore.setReceiverAddress(text);
      }
      stopScan();
    };

    const stopScan = () => {
      window.QRScanner.destroy(() => {
        setScanning(false);
      });
    };

    const onEnterPress = (event: React.KeyboardEvent) => {
      handleEnterPress(event, () => {
        if (!sendStore.buttonDisabled) {
          sendStore.routeToSendConfirm();
        }
      });
    };

    if (!sessionStore || !sessionStore.loggedInAccountName) {
      return null;
    }

    return (
      <div className={classes.root}>
        <NavBar hasBackButton title="Send" />
        <div className={classes.contentContainer}>
          {
            !scanning && (
              <FromField sendStore={sendStore} sessionStore={sessionStore} />
            )
          }
          <ToField
            onEnterPress={onEnterPress}
            sendStore={sendStore}
            scanning={scanning}
            startScan={startScan}
            stopScan={stopScan}
          />
          {
            !scanning && (
              <>
                <TokenField sendStore={sendStore} />
                <AmountField onEnterPress={onEnterPress} sendStore={sendStore} />
                {sendStore.token && sendStore.token.symbol === 'RUNES' ? (
                  <TransactionSpeedField sendStore={sendStore} />
                ) : (
                  <div>
                    <GasLimitField onEnterPress={onEnterPress} sendStore={sendStore} />
                    <GasPriceField onEnterPress={onEnterPress} sendStore={sendStore} />
                  </div>
                )}
                <SendButton sendStore={sendStore} classes={classes} />
              </>
            )
          }
        </div>
      </div>
    );
  })
);

const SendButton = observer(({  sendStore }: any) => (
  <Button
    fullWidth
    variant="contained"
    color="primary"
    size="large"
    disabled={sendStore.buttonDisabled}
    onClick={sendStore.routeToSendConfirm}
    endIcon={<SendIcon />}
  >
    Send
  </Button>
));

export default Send;
