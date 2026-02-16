import { ethers } from 'ethers';
import TicketArtifact from '../contracts/VendorTicket.json';
import VaultArtifact from '../contracts/VendorVault.json';
import ContractConfig from '../contracts/contract-address.json';

export class BlockchainService {
  private signer: ethers.JsonRpcSigner;

  constructor(signer: ethers.JsonRpcSigner) {
    this.signer = signer;
  }

  // --- AUTH & ROLES ---

  async getOwner() {
    const contract = new ethers.Contract(ContractConfig.ticketAddress, TicketArtifact.abi, this.signer);
    return await contract.owner();
  }

  async isVendor(address: string) {
    const contract = new ethers.Contract(ContractConfig.vaultAddress, VaultArtifact.abi, this.signer);
    return await contract.isRegisteredVendor(address);
  }

  // --- TICKET OPERATIONS ---
  
  async buyTicket(tokenURI: string) {
    const contract = new ethers.Contract(ContractConfig.ticketAddress, TicketArtifact.abi, this.signer);
    
    // Get the price directly from the contract
    const price = await contract.TICKET_PRICE();
    
    const tx = await contract.mintTicket(tokenURI, {
      value: price
    });
    return await tx.wait();
  }

  async getMyTickets() {
    // This is a simplified check. In production, you'd query the graph or events.
    // For the hackathon, we just check balance.
    const contract = new ethers.Contract(ContractConfig.ticketAddress, TicketArtifact.abi, this.signer);
    const balance = await contract.balanceOf(await this.signer.getAddress());
    return balance.toString();
  }

  // --- VENDOR OPERATIONS ---

  async registerAsVendor() {
    // Only the Organizer (Owner) can register vendors.
    // For the demo, we assume the current user is the Organizer.
    const contract = new ethers.Contract(ContractConfig.vaultAddress, VaultArtifact.abi, this.signer);
    const tx = await contract.registerVendor(await this.signer.getAddress());
    return await tx.wait();
  }

  async payVendor(vendorAddress: string, amountETH: string) {
    const contract = new ethers.Contract(ContractConfig.vaultAddress, VaultArtifact.abi, this.signer);
    const tx = await contract.payVendor(vendorAddress, {
      value: ethers.parseEther(amountETH)
    });
    return await tx.wait();
  }

  async withdrawVendorFunds() {
    const contract = new ethers.Contract(ContractConfig.vaultAddress, VaultArtifact.abi, this.signer);
    const tx = await contract.withdraw();
    return await tx.wait();
  }
  
  async getVendorBalance(address: string) {
      const contract = new ethers.Contract(ContractConfig.vaultAddress, VaultArtifact.abi, this.signer);
      const balance = await contract.vendorBalances(address);
      return ethers.formatEther(balance);
  }

  // --- HISTORY & EVENTS ---

  async getVendorHistory(vendorAddress: string) {
    const contract = new ethers.Contract(ContractConfig.vaultAddress, VaultArtifact.abi, this.signer);
    
    // Create a filter to find ONLY events related to this specific vendor
    // Event signature: PaymentProcessed(address indexed vendor, uint256 amount, uint256 fee)
    const filter = contract.filters.PaymentProcessed(vendorAddress);
    
    // Query the blockchain from Block 0 to "Latest"
    const logs = await contract.queryFilter(filter);
    
    // Format the messy blockchain data into clean JSON
    const history = logs.map((log: any) => ({
      hash: log.transactionHash,
      vendor: log.args[0],
      amount: ethers.formatEther(log.args[1]),
      fee: ethers.formatEther(log.args[2]),
      block: log.blockNumber

      
    }));

    

    // Return newest transactions first
    return history.reverse();
  }
}