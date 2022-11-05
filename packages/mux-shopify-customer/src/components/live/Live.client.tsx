// @ts-nocheck
import {useState, useEffect, useCallback} from 'react';
import firebaseApp from '../../services/firebase.js';
import {getFirestore, doc, onSnapshot} from 'firebase/firestore';
import MuxPlayer from '@mux/mux-player-react';
import {Image} from '@shopify/hydrogen';

const db = getFirestore(firebaseApp);

export function Live({products}: {products: any}) {
  const [merchantIsLive, setMerchantIsLive] = useState(true);
  const [playbackId, setPlaybackId] = useState();
  const [featuredItem, setFeaturedItemState] = useState();
  const [variant, setVariant] = useState();

  const setFeaturedItem = useCallback(
    (featuredItemId) => {
      const item = products.find((product: any) => {
        const splitId = product.id.split('/');
        return parseInt(splitId[splitId.length - 1]) === featuredItemId;
      });

      setFeaturedItemState(item);
    },
    [products, setFeaturedItemState],
  );

  const getAndSetVariant = useCallback(
    (id) => {
      const variant = featuredItem?.variants.nodes.find(
        (variant) => variant.id === id,
      );
      setVariant(variant);
    },
    [featuredItem, setVariant],
  );

  const unsubscribe = onSnapshot(
    doc(db, 'stores', Oxygen?.env?.PUBLIC_STORE_NAME),
    (doc) => {
      // @ts-ignore
      const {isLive, playbackId, featuredItemId} = doc.data();
      setMerchantIsLive(isLive);

      if (isLive) {
        setPlaybackId(playbackId);
        setFeaturedItem(featuredItemId);
      } else {
        setPlaybackId(undefined);
        setFeaturedItem(undefined);
      }
    },
  );

  useEffect(() => {
    if (featuredItem) {
      getAndSetVariant(featuredItem.variants.nodes[0].id);
    }
  }, [products, featuredItem, setFeaturedItem, getAndSetVariant]);

  useEffect(() => () => unsubscribe(), [unsubscribe]);

  return (
    <div className="my-8 mx-auto max-w-4xl">
      {merchantIsLive ? (
        <>
          <MuxPlayer playbackId={playbackId} streamType="live" />
          {featuredItem && variant && (
            <div>
              <h4 className="text-xl mb-2 flex-1">{featuredItem.title}</h4>
              <div className="flex">
                <Image
                  width={150}
                  height={150}
                  src={featuredItem.images.nodes[0].src}
                  alt={`An image of ${featuredItem.title}`}
                  className="mr-4"
                />
                <div>
                  <div className="mb-3">{featuredItem.description}</div>
                  <select
                    className="mb-3 "
                    onChange={(e) => getAndSetVariant(parseInt(e.target.value))}
                  >
                    {featuredItem.variants?.nodes.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.title}
                      </option>
                    ))}
                  </select>
                  <div>
                    <p>ID: {variant.id} </p>
                    <p>
                      Price:{' '}
                      <span className="line-through">
                        ${variant.priceV2.amount} {variant.priceV2.currencyCode}
                      </span>{' '}
                      ${variant.compareAtPriceV2.amount}{' '}
                      {variant.priceV2.currencyCode}
                    </p>
                    <p>Inventory: {variant.quantityAvailable}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="h-48 items-center text-center text-xl">
          <p>Merchant is not live at the moment</p>
        </div>
      )}
    </div>
  );
}
