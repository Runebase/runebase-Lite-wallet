// contentscript/index.ts
import { injectAllScripts } from './inject';
import { IExtensionAPIMessage, IRPCCallRequest, IRPCCallResponse, ICurrentAccount, PodSignResponse, PodSignRequest } from '../types';
import { TARGET_NAME, API_TYPE, MESSAGE_TYPE, RPC_METHOD, PORT_NAME } from '../constants';
import { isMessageNotValid } from '../utils';
import { postWindowMessage } from '../utils/messenger';

let port: any;

// Add message listeners
window.addEventListener('message', handleInPageMessage, false);
chrome.runtime.onMessage.addListener(handleBackgroundScriptMessage);
// Dapp developer triggers this event to set up window.runebasechrome
window.addEventListener('message', setupLongLivedConnection, false);

// Create a long-lived connection to the background page and inject content scripts
async function setupLongLivedConnection(event: MessageEvent) {
  if (event.data.message && event.data.message.type === API_TYPE.CONNECT_INPAGE_RUNEBASECHROME) {
    // Inject scripts
    await injectAllScripts();

    // Setup port
    port = chrome.runtime.connect({ name: PORT_NAME.CONTENTSCRIPT });
    port.onMessage.addListener((msg: any) => {
      if (msg.type === MESSAGE_TYPE.SEND_INPAGE_RUNEBASECHROME_ACCOUNT_VALUES) {
        // content script -> inpage and/or Dapp event listener
        postWindowMessage(TARGET_NAME.INPAGE, {
          type: API_TYPE.SEND_INPAGE_RUNEBASECHROME_ACCOUNT_VALUES,
          payload: msg.accountWrapper,
        });
      }
    });

    /*
    * Triggers when port is disconnected from other end, such as when extension is
    * uninstalled, but only if a long-lived connection was created first.
    * Does not trigger when user closes the tab, or navigates to another page.
    */
    port.onDisconnect.addListener(() => {
      handlePortDisconnected();
    });

    // request inpageAccount values from bg script
    postWindowMessage(TARGET_NAME.CONTENTSCRIPT, {
      type: API_TYPE.GET_INPAGE_RUNEBASECHROME_ACCOUNT_VALUES,
      payload: {},
    });
  }
}

/*
* This only partially resets the webpage to its pre-connected state. We remove the
* event listeners and set window.runebasechrome back to undefined, but there is no
* way to uninject the content scripts. This is not a big deal though as without a
* RunebaseChrome installation, the content scripts won't do anything (neither will the
* event listeners, but we can remove them so we may as well).
* And as long as the dapp implements the handleRunebaseChromeInstalledOrUpdated event
* listener, the page will be refreshed if RunebaseChrome is reinstalled.
*/
function handlePortDisconnected() {
  window.removeEventListener('message', handleInPageMessage, false);
  window.removeEventListener('message', setupLongLivedConnection, false);

  postWindowMessage(TARGET_NAME.INPAGE, {
    type: API_TYPE.PORT_DISCONNECTED,
    payload: {},
  });
}

function handleRPCRequest(message: IRPCCallRequest) {
  const { method, args, id } = message;

  // Check for logged in account first
  chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_LOGGED_IN_ACCOUNT }, (account: ICurrentAccount) => {
    if (!account) {
      // Not logged in, send error response to Inpage
      postWindowMessage<IRPCCallResponse>(TARGET_NAME.INPAGE, {
        type: API_TYPE.RPC_RESPONSE,
        payload: {
          id,
          error: 'Not logged in. Please log in to RunebaseChrome first.',
        },
      });
      return;
    }

    switch (method) {
    case RPC_METHOD.SEND_TO_CONTRACT:
      // Inpage shows sign tx popup
      postWindowMessage<IRPCCallRequest>(TARGET_NAME.INPAGE, {
        type: API_TYPE.RPC_SEND_TO_CONTRACT,
        payload: {
          ...message,
          account,
        },
      });
      break;
    case RPC_METHOD.CALL_CONTRACT:
      // Background executes callcontract
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.EXTERNAL_CALL_CONTRACT, id, args });
      break;
    default:
      throw Error('Unhandled RPC method.');
    }
  });
}

function handleSignPodRequest(message: PodSignRequest) {
  const { superStakerAddress, id } = message;

  // Check for logged in account first
  chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_LOGGED_IN_ACCOUNT }, (account: ICurrentAccount) => {
    if (!account) {
      // Not logged in, send error response to Inpage
      postWindowMessage<PodSignResponse>(TARGET_NAME.INPAGE, {
        type: API_TYPE.SIGN_POD_EXTERNAL_RESPONSE,
        payload: {
          id,
          error: 'Not logged in. Please log in to RunebaseChrome first.',
        },
      });
      return;
    }
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.SIGN_POD_EXTERNAL, id, superStakerAddress });
  });
}

// Forwards the request to the bg script
function forwardInpageAccountRequest() {
  port.postMessage({ type: MESSAGE_TYPE.GET_INPAGE_RUNEBASECHROME_ACCOUNT_VALUES });
}

function handleOpenWalletExtension(payload: any) {
  console.log('Handling OPEN_WALLET_EXTENSION');

  // Send a message to the background script to open the wallet extension
  chrome.runtime.sendMessage({ type: API_TYPE.OPEN_WALLET_EXTENSION, payload });
}

// Handle messages sent from inpage -> content script(here) -> bg script
function handleInPageMessage(event: MessageEvent) {
  if (isMessageNotValid(event, TARGET_NAME.CONTENTSCRIPT)) {
    return;
  }

  const message: IExtensionAPIMessage<any> = event.data.message;
  switch (message.type) {
  case API_TYPE.SIGN_POD_EXTERNAL_REQUEST:
    handleSignPodRequest(message.payload);
    break;
  case API_TYPE.RPC_REQUEST:
    handleRPCRequest(message.payload);
    break;
  case API_TYPE.OPEN_WALLET_EXTENSION:  // Add this case
    handleOpenWalletExtension(message.payload);
    break;
  case API_TYPE.GET_INPAGE_RUNEBASECHROME_ACCOUNT_VALUES:
    forwardInpageAccountRequest();
    break;
  default:
    throw Error(`Contentscript processing invalid type: ${JSON.stringify(message)}`);
  }
}

// Handle messages sent from bg script -> content script(here) -> inpage
function handleBackgroundScriptMessage(message: any) {
  console.log('MESSAGE RECEIVED FROM BACKGROUND SCRIPT');
  console.log(message);
  switch (message.type) {
  case MESSAGE_TYPE.EXTERNAL_RPC_CALL_RETURN:
    postWindowMessage<IRPCCallResponse>(TARGET_NAME.INPAGE, {
      type: API_TYPE.RPC_RESPONSE,
      payload: message,
    });
    break;
  case MESSAGE_TYPE.SIGN_POD_EXTERNAL_RETURN:
    postWindowMessage<IRPCCallResponse>(TARGET_NAME.INPAGE, {
      type: API_TYPE.SIGN_POD_EXTERNAL_RESPONSE,
      payload: message,
    });
    break;
  case MESSAGE_TYPE.SAVE_SEED_TO_FILE_RETURN:
    console.log('SAVE_SEED_TO_FILE_RETURN');
    console.log(message);
    postWindowMessage<IRPCCallResponse>(TARGET_NAME.INPAGE, {
      type: API_TYPE.SAVE_SEED_TO_FILE_RESPONSE,
      payload: message,
    });
    break;
  default:
    break;
  }
}
