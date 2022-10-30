import {
  useClaimedNFTSupply,
  useContractMetadata,
  useUnclaimedNFTSupply,
  useActiveClaimCondition,
  Web3Button,
  useContract,
} from "@thirdweb-dev/react";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import type { NextPage } from "next";
import { useState } from "react";
import styles from "../styles/Theme.module.css";

// Put Your NFT Drop Contract address from the dashboard here
const myNftDropContractAddress = "0xFa2f3C3649394c19539d425956f1E55E0BdeD99D";

const Home: NextPage = () => {
  const { contract: nftDrop } = useContract(myNftDropContractAddress);

  // The amount the user claims
  const [quantity, setQuantity] = useState(1); // default to 1

  // Load contract metadata
  const { data: contractMetadata } = useContractMetadata(nftDrop);

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
    activeClaimCondition?.currencyMetadata.displayValue || "0",
    activeClaimCondition?.currencyMetadata.decimals
  );

  // Multiply depending on quantity
  const priceToMint = price.mul(quantity);

  // Loading state while we fetch the metadata
  if (!nftDrop || !contractMetadata) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className="page-wrapper">
      <div className="profile-bkg-hero-wrapper">
        <div className="slice-div slice-div-large"></div>
      </div>
      <div className="section info-card">
        <div className="section-container">
          <div className="profile-info-wrapper">
            <div className="profile-info-top-wrapper">
              <div className="profile-image-wrapper">
                <img src={contractMetadata?.image} className="profile-image" /></div>
            </div>
            <div className="profile-info-bottom-wrapper">
              <div className="profile-name-wrapper">
                <h1 className="profile-name">Unreal Goats</h1>
                <div className="verified-icon">
                  <img src="https://cdx.solo.to/images/verified.svg" className="verified-icon-image" alt="Verified" title="Verified" /></div>
              </div>
              <div className="profile-location-box">
                <img src="https://cdx.solo.to/images/map-pin.svg" alt="Location" className="location-icon" />
                <div className="profile-location-text">Hawaii</div>
              </div>

              <div className={styles.infoSide}>
                {/* Title of your NFT Collection */}
                {/* Description of your NFT Collection */}
                <p className={styles.description}>{contractMetadata?.description}</p>
              </div>

              <div className={styles.mintCompletionArea}>
                <div className={styles.mintAreaLeft}>
                  <p>Total Minted</p>
                </div>
                <div className={styles.mintAreaRight}>
                  {claimedSupply && unclaimedSupply ? (
                    <p>
                      {/* Claimed supply so far */}
                      <b>{claimedSupply?.toNumber()}</b>
                      {" / "}
                      {
                        // Add unclaimed and claimed supply to get the total supply
                        claimedSupply?.toNumber() + unclaimedSupply?.toNumber()
                      }
                    </p>
                  ) : (
                    // Show loading state if we're still loading the supply
                    <p>Loading...</p>
                  )}
                </div>
              </div>
              {
                // Sold out or show the claim button
                isSoldOut ? (
                  <div>
                    <h2>Sold Out</h2>
                  </div>
                ) : isNotReady ? (
                  <div>
                    <h2>Not ready to be minted yet</h2>
                  </div>
                ) : (
                  <>
                    <p>Quantity</p>
                    <div className={styles.quantityContainer}>
                      <button
                        className={`${styles.quantityControlButton}`}
                        onClick={() => setQuantity(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>

                      <h4>{quantity}</h4>

                      <button
                        className={`${styles.quantityControlButton}`}
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={
                          quantity >=
                          parseInt(
                            activeClaimCondition?.quantityLimitPerTransaction || "0"
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <div className={styles.mintContainer}>
                      <Web3Button
                        contractAddress={myNftDropContractAddress}
                        action={async (contract) =>
                          await contract.erc721.claim(quantity)
                        }
                        // If the function is successful, we can do something here.
                        onSuccess={(result) =>
                          alert(
                            `Successfully minted ${result.length} NFT${result.length > 1 ? "s" : ""
                            }!`
                          )
                        }
                        // If the function fails, we can do something here.
                        onError={(error) => alert(error?.message)}
                        accentColor="#f213a4"
                        colorMode="dark"
                      >
                        {`Mint${quantity > 1 ? ` ${quantity}` : ""}${activeClaimCondition?.price.eq(0)
                          ? " (Free)"
                          : activeClaimCondition?.currencyMetadata.displayValue
                            ? ` (${formatUnits(
                              priceToMint,
                              activeClaimCondition.currencyMetadata.decimals
                            )} ${activeClaimCondition?.currencyMetadata.symbol})`
                            : ""
                          }`}
                      </Web3Button>
                    </div>
                  </>
                )
              }
            </div>
            <div className="social-button-wrapper">
              <div className="social-button-wrapper-row">
                <a href="https://twitter.com/unrealgoats" id="twt" className="minimal-button minimal-button-colorful w-inline-block soc-twitter"><img src="https://cdx.solo.to/images/social/twitter.svg" alt="Twitter" className="minimal-button-icon" /></a>
                <a href="https://www.instagram.com/unrealgoats/" id="ist" className="minimal-button minimal-button-colorful w-inline-block soc-instagram"><img src="https://cdx.solo.to/images/social/instagram.svg" alt="Instagram" className="minimal-button-icon" /></a>
                <a href="https://opensea.io/unrealgoats" id="sea" className="minimal-button minimal-button-colorful w-inline-block soc-opensea"><img src="https://cdx.solo.to/images/social/opensea.svg" alt="OpenSea" className="minimal-button-icon" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section link-section">
        <div className="section-container">
          <div className="profile-link-wrapper">
            <div className="divider-wrapper divider-wrapper-title divider-wrapper-top">
              <h2 className="divider-title">Social Media Profiles</h2>
            </div>
            <div className="link-item-wrapper">
              <a href="https://twitter.com/unrealgoats" id="Mzg3NjczMQ" className="link-button w-inline-block">
                <div className="link-icon-float" >
                  <img src="https://cdx.solo.to/images/link/twitter.svg" className="link-icon-float-image" />
                </div>
                <div className="link-block-text-wrapper">
                  <div className="link-name">Twitter</div>
                  <div className="link-url">twitter.com/unrealgoats</div>
                </div>
                <div className="link-arrow-wrapper"><img src="https://cdx.solo.to/images/link-button-arrow.svg" className="link-arrows" /></div>
              </a>
            </div>
            <div className="link-item-wrapper">
              <a href="https://instagram.com/StarBirdies" id="Mzg3NzEyMg" className="link-button w-inline-block">
                <div className="link-icon-float" >
                  <img src="https://cdx.solo.to/images/link/instagram.svg" className="link-icon-float-image" />
                </div>
                <div className="link-block-text-wrapper">
                  <div className="link-name">Instagram</div>
                  <div className="link-url">instagram.com/unrealgoats</div>
                </div>
                <div className="link-arrow-wrapper"><img src="https://cdx.solo.to/images/link-button-arrow.svg" className="link-arrows" /></div>
              </a>
            </div>
            <div className="divider-wrapper divider-wrapper-title">
              <h2 className="divider-title">Coming Soon</h2>
            </div>
            <div className="link-item-wrapper">
              <a href="https://opensea.io" id="Mzg3NzExMg" className="link-button w-inline-block">
                <div className="link-icon-float">
                  <img src="https://cdx.solo.to/images/link/opensea.svg" className="link-icon-float-image" />
                </div>
                <div className="link-block-text-wrapper">
                  <div className="link-name">Coming Soon</div>
                  <div className="link-url">opensea.io</div>
                </div>
                <div className="link-arrow-wrapper"><img src="https://cdx.solo.to/images/link-button-arrow.svg" className="link-arrows" /></div>
              </a>
            </div>
            <div className="link-item-wrapper">
              <a href="https://discord.com" id="Mzg3NzEyMw" className="link-button w-inline-block">
                <div className="link-icon-float">
                  <img src="https://cdx.solo.to/images/link/discord.svg" className="link-icon-float-image" />
                </div>
                <div className="link-block-text-wrapper">
                  <div className="link-name">Coming soon</div>
                  <div className="link-url">discord.com</div>
                </div>
                <div className="link-arrow-wrapper"><img src="https://cdx.solo.to/images/link-button-arrow.svg" className="link-arrows" /></div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Home;
