export enum TARGET_NAME {
  INPAGE = 'qrypto-inpage',
  CONTENTSCRIPT = 'qrypto-contentscript',
  BACKGROUND = 'qrypto-background',
}

export enum PORT_NAME {
  POPUP = 'qrypto-popup',
  CONTENTSCRIPT = 'qrypto-contentscript',
}

export enum RPC_METHOD {
  SEND_TO_CONTRACT = 'sendtocontract',
  CALL_CONTRACT = 'callcontract',
}

export enum API_TYPE {
  SIGN_TX_URL_RESOLVED = 'SIGN_TX_URL_RESOLVED',
  RPC_REQUEST = 'RPC_REQUEST',
  RPC_RESPONSE = 'RPC_RESPONSE',
  RPC_SEND_TO_CONTRACT = 'RPC_SEND_TO_CONTRACT',
  GET_INPAGE_RUNEBASECHROME_ACCOUNT_VALUES = 'GET_INPAGE_RUNEBASECHROME_ACCOUNT_VALUES',
  SEND_INPAGE_RUNEBASECHROME_ACCOUNT_VALUES = 'RUNEBASECHROME_ACCOUNT_CHANGED',
  CONNECT_INPAGE_RUNEBASECHROME = 'CONNECT_RUNEBASECHROME',
  PORT_DISCONNECTED = 'PORT_DISCONNECTED',
}

export enum MESSAGE_TYPE {
  ROUTE_LOGIN = 'ROUTE_LOGIN',
  RESTORE_SESSION = 'RESTORE_SESSION',
  LOGIN = 'LOGIN',
  LOGIN_SUCCESS_WITH_ACCOUNTS = 'LOGIN_SUCCESS_WITH_ACCOUNTS',
  LOGIN_SUCCESS_NO_ACCOUNTS = 'LOGIN_SUCCESS_NO_ACCOUNTS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  CREATE_WALLET = 'CREATE_WALLET',
  SAVE_TO_FILE = 'SAVE_TO_FILE',
  IMPORT_MNEMONIC = 'IMPORT_MNEMONIC',
  IMPORT_PRIVATE_KEY = 'IMPORT_PRIVATE_KEY',
  IMPORT_MNEMONIC_PRKEY_FAILURE = 'IMPORT_MNEMONIC_PRKEY_FAILURE',
  ACCOUNT_LOGIN = 'ACCOUNT_LOGIN',
  ACCOUNT_LOGIN_SUCCESS = 'ACCOUNT_LOGIN_SUCCESS',
  START_TX_POLLING = 'START_TX_POLLING',
  STOP_TX_POLLING = 'STOP_TX_POLLING',
  GET_MORE_TXS = 'GET_MORE_TXS',
  GET_TXS_RETURN = 'GET_TXS_RETURN',
  SEND_TOKENS = 'SEND_TOKENS',
  SEND_TOKENS_SUCCESS = 'SEND_TOKENS_SUCCESS',
  SEND_TOKENS_FAILURE = 'SEND_TOKENS_FAILURE',
  SEND_QRC_TOKENS = 'SEND_QRC_TOKENS',
  QRC_TOKENS_RETURN = 'QRC_TOKENS_RETURN',
  ADD_TOKEN = 'ADD_TOKEN',
  REMOVE_TOKEN = 'REMOVE_TOKEN',
  LOGOUT = 'LOGOUT',
  CHANGE_NETWORK = 'CHANGE_NETWORK',
  CHANGE_NETWORK_SUCCESS = 'CHANGE_NETWORK_SUCCESS',
  EXTERNAL_RAW_CALL = 'EXTERNAL_RAW_CALL',
  EXTERNAL_SEND_TO_CONTRACT = 'EXTERNAL_SEND_TO_CONTRACT',
  EXTERNAL_CALL_CONTRACT = 'EXTERNAL_CALL_CONTRACT',
  EXTERNAL_RPC_CALL_RETURN = 'EXTERNAL_RPC_CALL_RETURN',
  SAVE_SESSION_LOGOUT_INTERVAL = 'SAVE_SESSION_LOGOUT_INTERVAL',
  GET_NETWORKS = 'GET_NETWORKS',
  GET_NETWORK_INDEX = 'GET_NETWORK_INDEX',
  GET_NETWORK_EXPLORER_URL = 'GET_NETWORK_EXPLORER_URL',
  GET_ACCOUNTS = 'GET_ACCOUNTS',
  GET_LOGGED_IN_ACCOUNT = 'GET_LOGGED_IN_ACCOUNT',
  GET_LOGGED_IN_ACCOUNT_NAME = 'GET_LOGGED_IN_ACCOUNT_NAME',
  GET_WALLET_INFO = 'GET_WALLET_INFO',
  GET_WALLET_INFO_RETURN = 'GET_WALLET_INFO_RETURN',
  GET_MAX_RUNEBASE_SEND = 'GET_MAX_RUNEBASE_SEND',
  GET_MAX_RUNEBASE_SEND_RETURN = 'GET_MAX_RUNEBASE_SEND_RETURN',
  GET_RUNEBASE_USD = 'GET_RUNEBASE_USD',
  GET_RUNEBASE_USD_RETURN = 'GET_RUNEBASE_USD_RETURN',
  GET_QRC_TOKEN_LIST = 'GET_QRC_TOKEN_LIST',
  GET_SESSION_LOGOUT_INTERVAL = 'GET_SESSION_LOGOUT_INTERVAL',
  HAS_ACCOUNTS = 'HAS_ACCOUNTS',
  VALIDATE_WALLET_NAME = 'VALIDATE_WALLET_NAME',
  GET_QRC_TOKEN_DETAILS = 'GET_QRC_TOKEN_DETAILS',
  QRC_TOKEN_DETAILS_RETURN = 'QRC_TOKEN_DETAILS_RETURN',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  GET_INPAGE_RUNEBASECHROME_ACCOUNT_VALUES = 'GET_INPAGE_RUNEBASECHROME_ACCOUNT_VALUES',
  SEND_INPAGE_RUNEBASECHROME_ACCOUNT_VALUES = 'SEND_INPAGE_RUNEBASECHROME_ACCOUNT_VALUES',
}

export enum RESPONSE_TYPE {
  RESTORING_SESSION,
}

export enum STORAGE {
  APP_SALT = 'appSalt',
  REGTEST_ACCOUNTS = 'regtestAccounts',
  TESTNET_ACCOUNTS = 'testnetAccounts',
  MAINNET_ACCOUNTS = 'mainnetAccounts',
  LOGGED_IN_ACCOUNT = 'loggedInAccount',
  NETWORK_INDEX = 'networkIndex',
  ACCOUNT_TOKEN_LIST = 'accountTokenList',
}

export enum IMPORT_TYPE {
  MNEMONIC = 'seed phrase',
  PRIVATE_KEY = 'private key',
}

export enum SEND_STATE {
  INITIAL = 'Confirm',
  SENDING = 'Sending...',
  SENT = 'Sent!',
}

export enum NETWORK_NAMES {
  REGTEST = 'RegTest',
  TESTNET = 'TestNet',
  MAINNET = 'MainNet',
}

export enum INTERVAL_NAMES {
  NONE = 'None',
  ONE_MIN = '1 min',
  TEN_MIN = '10 min',
  THIRTY_MIN = '30 min',
  TWO_HOUR = '2 hr',
  TWELVE_HOUR = '12 hr',
}

export enum TRANSACTION_SPEED {
  SLOW = 'Slow',
  NORMAL = 'Normal',
  FAST = 'Fast',
}

export enum RUNEBASECHROME_ACCOUNT_CHANGE {
  LOGIN = 'Account Logged In',
  LOGOUT = 'Account Logged Out',
  BALANCE_CHANGE = 'RUNEBASE Account Balance Changed',
  DAPP_CONNECTION = 'Account Connected to Dapp',
}
