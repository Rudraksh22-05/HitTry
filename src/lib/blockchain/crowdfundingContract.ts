import { ethers } from 'ethers';

// Crowdfunding contract deployed on Sepolia network
export const CROWDFUNDING_CONTRACT_ADDRESS = '0x64F472C9224FfBbF288A01088197830f368BE291';

// Crowdfunding contract ABI
export const CROWDFUNDING_CONTRACT_ABI = [
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"campaignId","type":"uint256"},{"indexed":false,"internalType":"address","name":"creator","type":"address"},{"indexed":false,"internalType":"string","name":"title","type":"string"},{"indexed":false,"internalType":"uint256","name":"goal","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"CampaignCreated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"campaignId","type":"uint256"},{"indexed":false,"internalType":"address","name":"creator","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"FundsWithdrawn","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"campaignId","type":"uint256"},{"indexed":false,"internalType":"address","name":"contributor","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Pledged","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"campaignId","type":"uint256"},{"indexed":false,"internalType":"address","name":"contributor","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Refunded","type":"event"},
  {"inputs":[],"name":"campaignCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"campaigns","outputs":[{"internalType":"address","name":"creator","type":"address"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"goal","type":"uint256"},{"internalType":"uint256","name":"pledged","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"completed","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_campaignId","type":"uint256"}],"name":"closeCampaign","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"uint256","name":"_goal","type":"uint256"},{"internalType":"uint256","name":"_durationInDays","type":"uint256"}],"name":"createCampaign","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_campaignId","type":"uint256"}],"name":"getCampaign","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_campaignId","type":"uint256"}],"name":"getMyContribution","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_campaignId","type":"uint256"}],"name":"pledge","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_campaignId","type":"uint256"}],"name":"requestRefund","outputs":[],"stateMutability":"nonpayable","type":"function"}
];

export class CrowdfundingContractService {
  private provider: ethers.BrowserProvider;
  private contract: ethers.Contract | null = null;

  constructor() {
    this.provider = new ethers.BrowserProvider(window.ethereum);
  }

  async connectWallet(): Promise<string> {
    try {
      const accounts = await this.provider.send("eth_requestAccounts", []);
      return accounts[0];
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async initializeContract(): Promise<void> {
    try {
      const signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(
        CROWDFUNDING_CONTRACT_ADDRESS,
        CROWDFUNDING_CONTRACT_ABI,
        signer
      );
    } catch (error) {
      console.error('Error initializing crowdfunding contract:', error);
      throw error;
    }
  }

  async createCampaign(title: string, description: string, goal: number, durationInDays: number): Promise<void> {
    if (!this.contract) throw new Error('Contract not initialized');
    const tx = await this.contract.createCampaign(title, description, goal, durationInDays);
    await tx.wait();
  }

  async pledge(campaignId: number, amount: string): Promise<void> {
    if (!this.contract) throw new Error('Contract not initialized');
    const tx = await this.contract.pledge(campaignId, { value: ethers.parseEther(amount) });
    await tx.wait();
  }

  async getCampaign(campaignId: number): Promise<any> {
    if (!this.contract) throw new Error('Contract not initialized');
    return await this.contract.getCampaign(campaignId);
  }

  async getMyContribution(campaignId: number): Promise<any> {
    if (!this.contract) throw new Error('Contract not initialized');
    return await this.contract.getMyContribution(campaignId);
  }

  async campaignCount(): Promise<number> {
    if (!this.contract) throw new Error('Contract not initialized');
    const count = await this.contract.campaignCount();
    return Number(count);
  }

  async closeCampaign(campaignId: number): Promise<void> {
    if (!this.contract) throw new Error('Contract not initialized');
    const tx = await this.contract.closeCampaign(campaignId);
    await tx.wait();
  }

  async requestRefund(campaignId: number): Promise<void> {
    if (!this.contract) throw new Error('Contract not initialized');
    const tx = await this.contract.requestRefund(campaignId);
    await tx.wait();
  }
}

export const crowdfundingContractService = new CrowdfundingContractService();
