import { ethers, network, artifacts } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  // 1. Deploy Ticket Contract
  const VendorTicket = await ethers.getContractFactory("VendorTicket");
  const ticket = await VendorTicket.deploy(ethers.parseEther("1.0"), 100);
  await ticket.waitForDeployment();
  const ticketAddress = await ticket.getAddress();
  console.log(`🎟️ VendorTicket deployed to: ${ticketAddress}`);

  // 2. Deploy Vault Contract
  const VendorVault = await ethers.getContractFactory("VendorVault");
  const vault = await VendorVault.deploy();
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log(`🏦 VendorVault deployed to: ${vaultAddress}`);

  // 3. AUTO-WIRE: Write config to Frontend
  // This assumes your frontend is at ../frontend relative to blockchain folder
  const frontendDir = path.join(__dirname, "../../frontend/src/contracts");
  
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  const config = {
    ticketAddress,
    vaultAddress,
    network: network.name,
    chainId: network.config.chainId
  };

  fs.writeFileSync(
    path.join(frontendDir, "contract-address.json"),
    JSON.stringify(config, null, 2)
  );

  // 4. Copy ABI Artifacts
  const ticketArtifact = artifacts.readArtifactSync("VendorTicket");
  const vaultArtifact = artifacts.readArtifactSync("VendorVault");

  fs.writeFileSync(
    path.join(frontendDir, "VendorTicket.json"),
    JSON.stringify(ticketArtifact, null, 2)
  );
  fs.writeFileSync(
    path.join(frontendDir, "VendorVault.json"),
    JSON.stringify(vaultArtifact, null, 2)
  );

  console.log("✅ Frontend auto-wired successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});