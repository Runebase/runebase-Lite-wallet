import { each, findIndex, isEmpty } from 'lodash';
import BigNumber from 'bignumber.js';
import { RunebaseInfo } from 'runebasejs-wallet';
// eslint-disable-next-line @typescript-eslint/naming-convention
const { Rweb3 } = require('rweb3');

import RunebaseChromeController from '.';
import IController from './iController';
import { MESSAGE_TYPE, STORAGE, NETWORK_NAMES } from '../../constants';
import QRCToken from '../../models/QRCToken';
import rrc223TokenABI from '../../contracts/rrc223TokenABI';
import mainnetTokenList from '../../contracts/mainnetTokenList';
import testnetTokenList from '../../contracts/testnetTokenList';
import regtestTokenList from '../../contracts/regtestTokenList';
import { generateRequestId } from '../../utils';
import { IRPCCallResponse } from '../../types';

const INIT_VALUES = {
  tokens: undefined,
  getBalancesInterval: undefined,
};
const rweb3 = new Rweb3('null');

export default class TokenController extends IController {
  private static GET_BALANCES_INTERVAL_MS: number = 60000;

  public tokens?: QRCToken[] = INIT_VALUES.tokens;

  private getBalancesInterval?: any = INIT_VALUES.getBalancesInterval;

  constructor(main: RunebaseChromeController) {
    super('token', main);

    chrome.runtime.onMessage.addListener(this.handleMessage);
    this.initFinished();
  }

  public resetTokenList = () => {
    this.tokens = INIT_VALUES.tokens;
  };

  /*
  * Init the token list based on the environment.
  */
  public initTokenList = () => {
    if (this.tokens) {
      return;
    }

    chrome.storage.local.get([this.chromeStorageAccountTokenListKey()], (res: any) => {
      if (!isEmpty(res)) {
        this.tokens = res[this.chromeStorageAccountTokenListKey()];
      } else if (this.main.network.networkName === NETWORK_NAMES.MAINNET) {
        this.tokens = mainnetTokenList;
      } else if (this.main.network.networkName === NETWORK_NAMES.TESTNET) {
        this.tokens = testnetTokenList;
      } else {
        this.tokens = regtestTokenList;
      }
    });
  };

  /*
  * Starts polling for periodic info updates.
  */
  public startPolling = async () => {
    await this.getBalances();
    if (!this.getBalancesInterval) {
      this.getBalancesInterval = setInterval(() => {
        this.getBalances();
      }, TokenController.GET_BALANCES_INTERVAL_MS);
    }
  };

  /*
  * Stops polling for the periodic info updates.
  */
  public stopPolling = () => {
    if (this.getBalancesInterval) {
      clearInterval(this.getBalancesInterval);
      this.getBalancesInterval = undefined;
    }
  };

  /*
  * Fetch the tokens balances via RPC calls.
  */
  private getBalances = () => {
    each(this.tokens, async (token: QRCToken) => {
      await this.getQRCTokenBalance(token);
    });
  };

  /*
  * Makes an RPC call to the contract to get the token balance of this current wallet address.
  * @param token The QRCToken to get the balance of.
  */
  private getQRCTokenBalance = async (token: QRCToken) => {
    if (!this.main.account.loggedInAccount
      || !this.main.account.loggedInAccount.wallet
      || !this.main.account.loggedInAccount.wallet.qjsWallet
    ) {
      console.error('Cannot getQRCTokenBalance without wallet instance.');
      return;
    }

    const methodName = 'balanceOf';
    const data = rweb3.encoder.constructData(
      rrc223TokenABI,
      methodName,
      [this.main.account.loggedInAccount.wallet.qjsWallet.address],
    );
    const args = [token.address, data];
    const { result, error } = await this.main.rpc.callContract(generateRequestId(), args);

    if (error) {
      console.error(error);
      return;
    }

    // Decode result
    const decodedRes = rweb3.decoder.decodeCall(result, rrc223TokenABI, methodName);
    const bnBal = decodedRes!.executionResult.formattedOutput[0]; // Returns as a BN instance
    const bigNumberBal = new BigNumber(bnBal.toString(10)); // Convert to BigNumber instance
    const balance = bigNumberBal.dividedBy(new BigNumber(10 ** token.decimals)).toNumber(); // Convert to regular denomination

    // Update token balance in place
    const index = findIndex(this.tokens, { name: token.name, symbol: token.symbol });
    if (index !== -1) {
      this.tokens![index].balance = balance;
    }

    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.QRC_TOKENS_RETURN, tokens: this.tokens });
  };

  /**
   * Gets the QRC token details (name, symbol, decimals) given a contract address.
   * @param {string} contractAddress QRC token contract address.
   */
  private getQRCTokenDetails = async (contractAddress: string) => {
    let msg;

    /*
    * Further contract address validation - if the addr provided does not have name,
    * symbol, and decimals fields, it will throw an error as it is not a valid
    * qrc20TokenContractAddr
    */
    try {
      // Get name
      let methodName = 'name';
      let data = rweb3.encoder.constructData(rrc223TokenABI, methodName, []);
      let { result, error }: IRPCCallResponse =
        await this.main.rpc.callContract(generateRequestId(), [contractAddress, data]);
      if (error) {
        throw Error(error);
      }
      result = rweb3.decoder.decodeCall(result, rrc223TokenABI, methodName) as RunebaseInfo.IContractCall;
      const name = result.executionResult.formattedOutput[0];

      // Get symbol
      methodName = 'symbol';
      data = rweb3.encoder.constructData(rrc223TokenABI, methodName, []);
      ({ result, error } = await this.main.rpc.callContract(generateRequestId(), [contractAddress, data]));
      if (error) {
        throw Error(error);
      }
      result = rweb3.decoder.decodeCall(result, rrc223TokenABI, methodName) as RunebaseInfo.IContractCall;
      const symbol = result.executionResult.formattedOutput[0];

      // Get decimals
      methodName = 'decimals';
      data = rweb3.encoder.constructData(rrc223TokenABI, methodName, []);
      ({ result, error } = await this.main.rpc.callContract(generateRequestId(), [contractAddress, data]));
      if (error) {
        throw Error(error);
      }
      result = rweb3.decoder.decodeCall(result, rrc223TokenABI, methodName) as RunebaseInfo.IContractCall;
      const decimals = result.executionResult.formattedOutput[0];

      if (name && symbol && decimals) {
        const token = new QRCToken(name, symbol, decimals, contractAddress);
        msg = {
          type: MESSAGE_TYPE.QRC_TOKEN_DETAILS_RETURN,
          isValid: true,
          token,
        };
      } else {
        msg = {
          type: MESSAGE_TYPE.QRC_TOKEN_DETAILS_RETURN,
          isValid: false,
        };
      }
    } catch (err) {
      console.error(err);
      msg = {
        type: MESSAGE_TYPE.QRC_TOKEN_DETAILS_RETURN,
        isValid: false,
      };
    }

    chrome.runtime.sendMessage(msg);
  };

  private sendQRCToken = async (
    receiverAddress: string,
    amount: number,
    token: QRCToken,
    gasLimit: number,
    gasPrice: number
  ) => {
    try {
      // bn.js does not handle decimals well (Ex: BN(1.2) => 1 not 1.2) so we use BigNumber
      const bnAmount = new BigNumber(amount).times(new BigNumber(10 ** token.decimals));
      const data = rweb3.encoder.constructData(rrc223TokenABI, 'transfer', [receiverAddress, bnAmount]);
      const args = [token.address, data, null, gasLimit, gasPrice];

      console.log('Sending QRCToken with the following arguments:', args);

      const requestId = generateRequestId();
      const { error } = await this.main.rpc.sendToContract(requestId, args);

      if (error) {
        console.error('Error sending QRCToken:', error);
        chrome.runtime.sendMessage({ type: MESSAGE_TYPE.SEND_TOKENS_FAILURE, error });
        return;
      }

      console.log('QRCToken sent successfully!');
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.SEND_TOKENS_SUCCESS });
    } catch (e: any) {
      console.error('An unexpected error occurred:', e);
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.SEND_TOKENS_FAILURE, error: e.message });
    }
  };


  private addToken = async (contractAddress: string, name: string, symbol: string, decimals: number) => {
    const newToken = new QRCToken(name, symbol, decimals, contractAddress);
    this.tokens!.push(newToken);
    this.setTokenListInChromeStorage();
    await this.getQRCTokenBalance(newToken);
  };

  private removeToken = (contractAddress: string) => {
    const index = findIndex(this.tokens, { address: contractAddress });
    this.tokens!.splice(index, 1);
    this.setTokenListInChromeStorage();
  };

  private setTokenListInChromeStorage = () => {
    chrome.storage.local.set({
      [this.chromeStorageAccountTokenListKey()]: this.tokens,
    }, () => {
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPE.QRC_TOKENS_RETURN,
        tokens: this.tokens,
      });
    });
  };

  private chromeStorageAccountTokenListKey = () => {
    return `${STORAGE.ACCOUNT_TOKEN_LIST}-${this.main.account.loggedInAccount!.name}-${this.main.network.networkName}`;
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private handleMessage = (request: any, _: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    try {
      switch (request.type) {
      case MESSAGE_TYPE.GET_QRC_TOKEN_LIST:
        sendResponse(this.tokens);
        break;
      case MESSAGE_TYPE.SEND_QRC_TOKENS:
        this.sendQRCToken(request.receiverAddress, request.amount, request.token, request.gasLimit, request.gasPrice);
        break;
      case MESSAGE_TYPE.ADD_TOKEN:
        this.addToken(request.contractAddress, request.name, request.symbol, request.decimals);
        break;
      case MESSAGE_TYPE.GET_QRC_TOKEN_DETAILS:
        this.getQRCTokenDetails(request.contractAddress);
        break;
      case MESSAGE_TYPE.REMOVE_TOKEN:
        this.removeToken(request.contractAddress);
        break;
      default:
        break;
      }
    } catch (err) {
      console.error(err);
      this.main.displayErrorOnPopup(err as any);
    }
  };
}
