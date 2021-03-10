import {
  Wallet,
  Contract,
} from 'ethers';
import TLSDIDContract from '@digitalcredentials/tls-did-registry/build/contracts/TLSDID.json';
import {configureProvider} from './utils';

export class TLSDID {
  registry
  provider
  wallet
  contract

  constructor(ethereumPrivateKey, networkConfig) {
    this.registry = networkConfig.registry ? networkConfig.registry : REGISTRY;
    this.provider = configureProvider(networkConfig.providerConfig);
    this.wallet = new Wallet(ethereumPrivateKey, this.provider);
  }

  /**
   * Connects to existing TLS DID contract
   * @param {string} address - ethereum address of existing TLS DID Contract
   */
  async connectToContract(address){
    //Create contract object and connect to contract
    const contract = new Contract(address, TLSDIDContract.abi, this.provider);
    this.contract = contract.connect(this.wallet);
  }


  async setSignature(sig){
    if (this.domain?.length === 0) {
      throw new Error('No domain provided');
    }

    //Update contract with new invalid signature
    const tx = await this.contract.setSignature(sig);
    const receipt = await tx.wait();
    if (!receipt.status === 1) {
      throw new Error('setSignature unsuccessful');
    }
  }
}
