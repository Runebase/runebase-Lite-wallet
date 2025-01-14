// import { utils } from 'ethers';
import { RunebaseInfo } from 'runebasejs-wallet';
import { ISendTxOptions } from 'runebasejs-wallet/lib/tx';
import {
  API_TYPE,
  TARGET_NAME,
  // INTERNAL_API_TYPE,
  RUNEBASECHROME_ACCOUNT_CHANGE
} from './constants';
import {
  // Transaction,
  InpageAccount
} from './models';

export interface PodReturnResult {
  podMessage: string;
  superStakerAddress: string;
  delegatorAddress: string;
}

export interface SuperStaker {
  address: string;
  lastProducedBlock: string;
  score: number;
  cycles: number;
  firstRegisteredOn: string;
  totalBlocksProduced: number;
  note: string;
  createdAt: string;
  updatedAt: string;
  user: {
    username: string;
    user_id: string;
    exp: number;
    banned: boolean;
  };
}

export type SuperStakerArray = SuperStaker[];

export interface IExtensionMessageData<T> {
  target: TARGET_NAME;
  message: T;
}

export interface IExtensionAPIMessage<T> {
  type: API_TYPE;
  payload: T;
}

export interface IRPCCallPendingRequest {
  resolve: (result?: any) => void;
  reject: (reason?: any) => void;
}
export interface PodSignRequest {
  id: string;
  superStakerAddress: string;
}
export interface PodSignPendingRequest {
  resolve: (result?: any) => void;
  reject: (reason?: any) => void;
}
export interface PodSignResponse {
  id: string;
  result?: PodSignResult;
  error?: string;
}
export interface PodSignResult {
  superStakerAddress: string;
  delegatorAddress: string;
  podMessage: string;
}

export interface IRPCCallRequest {
  id: string;
  method: string;
  args: any[];
  account?: ICurrentAccount;
}

export interface IRPCCallResponse {
  id: string;
  result?: RunebaseInfo.IContractCall | RunebaseInfo.ISendRawTxResult;
  error?: string;
}

export interface ICurrentAccount {
  name: string;
  address: string;
}

export interface ISignExternalTxRequest {
  url: string;
  request: IRPCCallRequest;
}

export interface ISigner {
  send(to: string, amount: number, options: ISendTxOptions): Promise<RunebaseInfo.ISendRawTxResult>;
  sendTransaction(args: any[]): any;
}

export interface IInpageAccountWrapper {
  account: InpageAccount;
  error: Error;
  statusChangeReason: RUNEBASECHROME_ACCOUNT_CHANGE;
}

declare module '@mui/material/styles/createTypography' {
  interface Typography {
    fontSizeMedium?: React.CSSProperties['fontSize'];
    fontSizeSmall?: React.CSSProperties['fontSize'];
    fontSizeLarge?: React.CSSProperties['fontSize'];
    fontSizeExtraSmall?: React.CSSProperties['fontSize'];
    lineHeight?: React.CSSProperties['lineHeight'];
    lineHeightSmall?: React.CSSProperties['lineHeight'];
    lineHeightMedium?: React.CSSProperties['lineHeight'];
    lineHeightLarge?: React.CSSProperties['lineHeight'];
    fontWeight?: React.CSSProperties['fontWeight'];
    // Add other properties as needed
  }
}


declare module '@mui/material/styles/createPalette' {
  interface Palette {
    gradientPurple: {
      main: string,
    },
    gray: {
      main: string,
    },
    orange: {
      main: string,
    },
    // Add other custom color properties
  }
}

declare module '@mui/material/styles/createMuiTheme' {
  interface DeprecatedThemeOptions {
    color: {
      gray: string;
      orange: string;
      red: string;
      gradientPurple: string;
    };
    padding?: {
      halfUnit: string;
      unit: string;
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      custom: (multiplier: number) => string;
    };
    font?: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    fontWeight?: {
      bold: string;
    };
    lineHeight?: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    border?: {
      root: string;
      radius: string;
    };
    icon?: {
      size: string;
    };
    button?: {
      sm: {
        height: string;
        radius: string;
      };
      lg: {
        height: string;
        radius: string;
      };
    };
  }
}

