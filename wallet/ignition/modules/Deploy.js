const fs = require("fs");
const path = require("path");
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("ethers");

module.exports = buildModule("WalletModule", (m) => {
  // Chemin vers le fichier JSON d'artefact
  const artifactPath = path.join(__dirname, "src", "artifacts", "contracts", "wallet.sol", "Wallet.json");

  // Charger le fichier JSON d'artefact
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

  // Accéder au bytecode du contrat
  const bytecode = artifact.bytecode;
  const abi = artifact.abi;

  const provider = new ethers.providers.JsonRpcProvider();

  function deployWallet() {
    const signer = provider.getSigner();
    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    return factory.deploy().then((contract) => contract.deployed());
  }

  let walletInstance;

  if (!walletInstance) {
    walletInstance = deployWallet();
  }

  return { wallet: walletInstance };
});
