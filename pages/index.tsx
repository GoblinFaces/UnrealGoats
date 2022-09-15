import {
  ChainId,
  useClaimedNFTSupply,
  useContractMetadata,
  useNetwork,
  useNFTDrop,
  useUnclaimedNFTSupply,
  useActiveClaimCondition,
  useClaimNFT,
  useWalletConnect,
  useCoinbaseWallet,
} from '@thirdweb-dev/react';
import { useNetworkMismatch } from '@thirdweb-dev/react';
import { useAddress, useMetamask } from '@thirdweb-dev/react';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import type { NextPage } from 'next';
import { useState } from 'react';
import styles from '../styles/Theme.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Put Your NFT Drop Contract address from the dashboard here
const myNftDropContractAddress = '0x322067594DBCE69A9a9711BC393440aA5e3Aaca1';

const Home: NextPage = () => {
  const nftDrop = useNFTDrop(myNftDropContractAddress);
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const connectWithCoinbaseWallet = useCoinbaseWallet();
  const isOnWrongNetwork = useNetworkMismatch();
  const claimNFT = useClaimNFT(nftDrop);
  const [, switchNetwork] = useNetwork();

  // The amount the user claims
  const [quantity, setQuantity] = useState(1); // default to 1

  // Load contract metadata
  const { data: contractMetadata } = useContractMetadata(
    myNftDropContractAddress,
  );

  // Load claimed supply and unclaimed supply
  const { data: unclaimedSupply } = useUnclaimedNFTSupply(nftDrop);
  const { data: claimedSupply } = useClaimedNFTSupply(nftDrop);

  // Load the active claim condition
  const { data: activeClaimCondition } = useActiveClaimCondition(nftDrop);

  // Check if there's NFTs left on the active claim phase
  const isNotReady =
    activeClaimCondition &&
    parseInt(activeClaimCondition?.availableSupply) === 0;

  // Check if there's any NFTs left
  const isSoldOut = unclaimedSupply?.toNumber() === 0;

  // Check price
  const price = parseUnits(
    activeClaimCondition?.currencyMetadata.displayValue || '0',
    activeClaimCondition?.currencyMetadata.decimals,
  );

  // Multiply depending on quantity
  const priceToMint = price.mul(quantity);

  // Loading state while we fetch the metadata
  if (!nftDrop || !contractMetadata) {
    return <div className={styles.container}>Loading...</div>;
  }

  // Function to mint/claim an NFT
  const mint = async () => {
    if (isOnWrongNetwork) {
      switchNetwork && switchNetwork(ChainId.Mumbai);
      return;
    }

    claimNFT.mutate(
      { to: address as string, quantity },
      {
        onSuccess: () => {
          alert(`Successfully minted NFT${quantity > 1 ? 's' : ''}!`);
        },
        onError: (err: any) => {
          console.error(err);
          alert(err?.message || 'Something went wrong');
        },
      },
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.mintInfoContainer}>
        <div className={styles.infoSide}>
          {/* Title of your NFT Collection */}
          <h1>Unreal Goats</h1>
          {/* Description of your NFT Collection */}
          <p className={styles.description}>------------- BEST WAY TO GET WHITELIST! -------------</p>

          <p className={styles.description}>- ʀᴇᴘʀᴇꜱᴇɴᴛ <b>UREAL GOATS</b> ᴏɴ ʏᴏᴜʀ ᴛᴡɪᴛᴛᴇʀ ᴘꜰᴘ & ʙɪᴏ!</p>

          <p className={styles.description}>- ʙᴇ ᴀᴄᴛɪᴠᴇ ᴏɴ ᴏᴜʀ ᴛᴡɪᴛᴛᴇʀ ᴘᴀɢᴇ!</p>

          <p className={styles.description}>- ᴍᴀᴋᴇ ꜱᴜʀᴇ ᴛᴏ ʙᴇ ᴀ ᴘᴀʀᴛ ᴏꜰ ᴛʜᴇ ᴄᴏᴍᴍᴜɴɪᴛʏ!</p>
          <p><a href="https://twitter.com/unrealgoats"><FontAwesomeIcon icon={['fab', 'twitter']} size="6x" /></a></p>

        </div>


      </div>

    </div>
  );
};

export default Home;
