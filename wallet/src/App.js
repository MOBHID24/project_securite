import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Wallet from './artifacts/contracts/wallet.sol/Wallet.json'; // Corrected import path

function App() {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [amountToSend, setAmountToSend] = useState('');
  const [amountToWithdraw, setAmountToWithdraw] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function connectToMetaMask() {
      try {
        if (typeof window.ethereum !== 'undefined') {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          window.ethereum.on('accountsChanged', (newAccounts) => {
            setAccount(newAccounts[0]);
            fetchBalance(newAccounts[0]);
          });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setConnected(true);
            setAccount(accounts[0]);
            fetchBalance(accounts[0]);
          }
        } else {
          console.log('Please install MetaMask to use this application.');
        }
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    }

    connectToMetaMask();
  }, []);

  async function fetchBalance(account) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract('YOUR_CONTRACT_ADDRESS', Wallet.abi, signer);
      const balance = await contract.getBalance();
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }

  async function sendEther() {
    setError('');
    setSuccess('');
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6', // Replace with recipient address
        value: ethers.utils.parseEther(amountToSend)
      });
      await tx.wait();
      setAmountToSend('');
      setSuccess('Transaction sent successfully!');
      fetchBalance(account);
    } catch (error) {
      console.error('Error sending transaction:', error);
      setError('Error sending transaction.');
    }
  }

  async function withdrawEther() {
    setError('');
    setSuccess('');
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract('0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6', Wallet.abi, signer);
      const tx = await contract.retirer(signer.getAddress(), ethers.utils.parseEther(amountToWithdraw));
      await tx.wait();
      setAmountToWithdraw('');
      setSuccess('Withdrawal successful!');
      fetchBalance(account);
    } catch (error) {
      console.error('Error withdrawing ether:', error);
      setError('Error withdrawing ether.');
    }
  }

  return (
    <div className="App">
      <h1>Made by Gr2 MOBHID/CHAHID/BAKKALI</h1>
      {connected ? (
        <div>
          <p>Connected with account: {account}</p>
          {balance !== null && <h2>Balance: {balance} ETH</h2>}
          <div className="wallet_flex">
            <div className="walletG">
              <h3>transfer</h3>
              <input type='text' placeholder='Amount ' value={amountToSend} onChange={(e) => setAmountToSend(e.target.value)} />
              <button onClick={sendEther}>Send Ether</button>
            </div>
            <div className="walletD">
              <h3>Receive</h3>
              <input type='text' placeholder='Amount ' value={amountToWithdraw} onChange={(e) => setAmountToWithdraw(e.target.value)} />
              <button onClick={withdrawEther}>Withdraw Ether</button>
            </div>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
      ) : (
        <p> connect to MetaMask use the application.</p>
      )}
    </div>
  );
}

export default App;
