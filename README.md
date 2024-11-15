# Ethers Fans

A DApp on the web3 platform with a landing page and three different products:

## 1. Sending ERC-20 Tokens

Users can send ERC-20 tokens to others. For test networks, we've deployed proprietary standard ERC-20 tokens. Users can select one of our platform tokens or add any other token not listed. To send a token, users choose the token, input the recipient's wallet address, and specify the amount to send. They then click "Send". No additional smart contract is required for this functionality since ERC-20 tokens come with default methods like `transfer`, `approve`, and `balanceOf`. We use an ABI imported from viem, considering legacy ABI specifics for USDT.

## 2. Creating and Accepting ERC-20 Swap Offers

Users can create token swap offers by filling out a form with details of the token and amount they are offering, the token they wish to receive, and optionally, the recipient's address. If a recipient address is specified, only that wallet can accept the offer; otherwise, it’s open to anyone. Users can copy the offer link to share with others. They can view all offers they've created, in various statuses, and offers directly addressed to them. Users can cancel their offers or accept others'. A smart contract was developed to handle this functionality.

## 3. Minting an NFT Collection in Three Phases: Airdrop, Private Presale, Public Sale

An admin panel allows the product owner to manage minting phases and whitelists. Each phase can be in one of three states: Soon, Available, Finished, with no set sequence. The typical order is Airdrop, Private Presale, Public Sale.

- During **Airdrop**, users on the whitelist can mint 2 NFTs for free, covering only gas fees, by clicking mint on our site and confirming the wallet transaction. The admin can manage the airdrop whitelist.
- In **Private Presale**, users in the whitelist can purchase up to 3 NFTs at a reduced price using the network’s native currency (e.g., ETH for the mainnet). They specify the number to mint and confirm the wallet transaction, with the admin managing this whitelist as well.
- For **Public Sale**, anyone can buy NFTs from our site with a higher price than in Private Presale, with a 10 NFT limit per user. The total NFT collection is capped at 10,000.

Users can view all NFTs they own in their wallet from our collection. A smart contract manages this, with roles for the admin to control sales phases and whitelists: `DEFAULT_ADMIN_ROLE`, `SELL_PHASE_MANAGER_ROLE`, `WHITE_LIST_MANAGER_ROLE`, and `PRICE_MANAGER_ROLE`.

---

### Whitelist Management with Merkle Tree

Two of the three phases are whitelist-restricted. Admins manage whitelists through a Merkle Tree using `merkletreejs`. Via the admin panel, admins can add/remove addresses and set the whitelist on the contract. The leaf nodes are hashed wallet addresses using `keccack256`. Proof data for each address is uploaded to IPFS, then read by the main app, and the necessary proof is passed to the contract.

---

**Technologies Used:**
wagmi, viem, react-query, MUI, rainbowkit, react-hook-form, thirdweb, merkletreejs, TypeScript, React, Vite, HTML5, CSS3.
