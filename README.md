# GomyCode Hackathon
VENDORCHAIN - HACKATHON README
"Fix The Fest" Edition | Localhost Supremacy Workflow
================================================================================

[1] PROJECT OVERVIEW
--------------------------------------------------------------------------------
We are building a scalable, trustless ticketing and payment system.
* Architecture: SOLID Principles + Service-Repository Pattern.
* Network: Hardhat Localhost (Chain ID: 31337).
* Frontend: React + Vite + TypeScript + Tailwind.
* Backend: Solidity + Hardhat + Typechain.

[2] REPOSITORY STRUCTURE
--------------------------------------------------------------------------------
vendor-chain/
├── blockchain/         [Hardhat: Contracts, Tests, Deploy Scripts]
│   ├── contracts/      (VendorTicket.sol, VendorVault.sol)
│   ├── scripts/        (deploy.ts - Auto-wires frontend)
│   └── hardhat.config.ts
├── frontend/           [Vite: React UI]
│   ├── src/
│   │   ├── contracts/  (Auto-generated ABIs & Addresses - DO NOT EDIT MANUALLY)
│   │   ├── services/   (BlockchainService.ts - API Layer)
│   │   └── context/    (Web3Context.tsx)
└── README.txt

[3] PREREQUISITES
--------------------------------------------------------------------------------
1. Node.js (v18+)
2. Metamask Extension installed in Chrome/Brave.
3. A code editor (VS Code recommended).

[4] INSTALLATION (DO THIS FIRST)
--------------------------------------------------------------------------------
Step 1: Clone/Create Root
    mkdir vendor-chain
    cd vendor-chain

Step 2: Setup Blockchain (Terminal 1)
    mkdir blockchain && cd blockchain
    npm init -y
    npm install --save-dev hardhat toolbox @nomicfoundation/hardhat-toolbox @openzeppelin/contracts dotenv
    npx hardhat init (Select: TypeScript project)
    Update hardhat.config.ts to use chainId: 31337

Step 3: Setup Frontend (Terminal 2)
    cd ..
    npm create vite@latest frontend -- --template react-ts
    cd frontend
    npm install ethers framer-motion lucide-react react-router-dom
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p

[5] THE "LOCALHOST SUPREMACY" RUNBOOK
--------------------------------------------------------------------------------
This is how we run the project. Follow this EXACT sequence to avoid errors.

1. START THE CHAIN (Terminal 1 - Blockchain Folder)
   Command: npx hardhat node
   Effect: Starts local blockchain. Gives you 20 accounts with 10,000 ETH.
   KEEP THIS TERMINAL OPEN.

2. DEPLOY & WIRE (Terminal 2 - Blockchain Folder)
   Command: npx hardhat run scripts/deploy.ts --network localhost
   *Effect: Compiles contracts, deploys them, and AUTOMATICALLY copies the 
   ABIs and Addresses to frontend/src/contracts/.*

3. START UI (Terminal 3 - Frontend Folder)
   Command: npm run dev
   Effect: Launches React app on localhost:5173.

[6] METAMASK SETUP (CRITICAL FOR DEMO)
--------------------------------------------------------------------------------
Since we are using Localhost, you need to import the "God Mode" accounts.

1. Go to Terminal 1 (where npx hardhat node is running).
2. Scroll up to find "Account #0" and "Account #1".
3. Copy the "Private Key" string (starts with 0x...).
4. Open Metamask -> Click Circle Icon -> Import Account -> Paste Key.
5. Rename Account #0 to "ORGANIZER".
6. Rename Account #1 to "VENDOR".
7. Ensure Metamask Network is set to "Localhost 8545".

[7] TROUBLESHOOTING: THE "NONCE" ERROR
--------------------------------------------------------------------------------
IF you restart the Hardhat Node (Terminal 1), Metamask will get confused 
because the blockchain reset but Metamask remembers old transaction counts.

SYMPTOM: Transactions fail immediately or stay stuck.

FIX:
1. Open Metamask.
2. Go to Settings -> Advanced.
3. Click "Clear Activity Tab Data".
4. Refresh the page.
You must do this every time you restart the hardhat node.

[8] CODING STANDARDS (SOLID)
--------------------------------------------------------------------------------
* FRONTEND:
  - No ethers.js logic inside Components. Use BlockchainService.ts.
  - Components should only handle UI state (loading, inputs).
  - Use useWeb3() hook to get signer/provider.

* BACKEND:
  - Keep contracts simple. Logic > Complexity.
  - Use VendorVault.sol for splitting payments (Pull over Push pattern).

[9] DEMO SCRIPT CHEAT SHEET
----------------------------------------------------------------------------
1. Organizer (Account 0): Deploys contracts (via script).
2. Customer (Account 2): Buys Ticket (Mint 1.0 ETH).
3. Customer (Account 2): Pays Vendor via QR/Input (Pay 1.0 ETH).
4. Vendor (Account 1): Checks Dashboard (Sees 0.9 ETH - 10% auto-deducted).
5. Vendor (Account 1): Clicks Withdraw (Money moves to Wallet).

============================================================================
GOOD LUCK TEAM. LET'S SHIP IT.
============================================================================
