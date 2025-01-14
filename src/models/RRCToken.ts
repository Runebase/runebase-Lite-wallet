import { observable, makeObservable } from 'mobx';

export default class RRCToken {
  @observable public name: string;
  @observable public symbol: string;
  @observable public decimals: number;
  @observable public address: string;
  @observable public balance?: number;

  constructor(
    name: string,
    symbol: string,
    decimals: number,
    address: string
  ) {
    makeObservable(this);
    this.name = name;
    this.symbol = symbol;
    this.decimals = decimals;
    this.address = address;
  }
}
