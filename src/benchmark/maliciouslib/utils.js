import { providers } from 'ethers';

/**
 * Returns the configured provider
 * @param {ProviderConfig} conf - Configuration for provider
 */
export function configureProvider(conf) {
  if (conf.provider) {
    return conf.provider;
  } else if (conf.rpcUrl) {
    return new providers.JsonRpcProvider(conf.rpcUrl);
  } else if (conf.web3) {
    return new providers.Web3Provider(conf.web3.currentProvider);
  } else {
    return new providers.JsonRpcProvider('http://localhost:8545');
  }
}
