import React, {useEffect, useState, useCallback} from 'react';
import io from 'Socket.IO-client';

import { useStreamVideo } from '../hooks';
import Image from 'next/image.js';

let socket;

export const Live = () => {  
  const [products, setProducts] = useState();
  const [featuredItem, setFeaturedItem] = useState();
  const [variant, setVariant] = useState();

  const apiRoute = `/api/firebase/store?store=${process.env.NEXT_PUBLIC_SHOPIFY_STORE}`

  const { 
    cameraEnabled, 
    videoRef,
    streaming,
    connected, 
    enableCamera, 
    setConnected, 
    startStreaming, 
    stopStreaming 
  } = useStreamVideo({ 
    socket,
    onStartStream: async () => {
      fetch(`${apiRoute}&isLive=true`, { method: "POST" })
    },
    onStopStream: async () => {
      fetch(`${apiRoute}&isLive=false`, { method: "POST" })
      socket.emit('close');
    },
  })

  const socketInitializer = useCallback(async () => {
    if (socket) return;

    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      setConnected(true);;
    })

    socket.on('close', () => {
      setConnected(false);
      stopStreaming();
    })
  }, [setConnected, stopStreaming])

  const selectFeaturedItem = useCallback(async(item) => {
    setFeaturedItem(item);
    fetch(`${apiRoute}&featuredItemId=${item.id}`, { method: "POST" })
  }, [apiRoute])

  const getAndSetVariant = useCallback((id) => {
    const variant = 
      featuredItem?.variants.find(variant => variant.id === id);
    setVariant(variant)
  }, [featuredItem, setVariant])

  useEffect(() => {
    const getProducts = async() => {
      const res = await fetch('/api/shopify/products')
      const { products } = await res.json()
      setProducts(products);
      selectFeaturedItem(products[0]);
    }

    socketInitializer();
    if (!products) {
      getProducts();
    }
  }, [products, socketInitializer, getAndSetVariant, selectFeaturedItem])


  useEffect(() => { 
    if (featuredItem?.variants) {
      getAndSetVariant(featuredItem.variants[0].id) 
    }
  }, [featuredItem, getAndSetVariant])

  return (
    <div className='my-8 mx-auto max-w-4xl'>
      <h1 className="text-2xl font-bold mb-2">Go Live</h1>

      {!cameraEnabled && (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2" onClick={enableCamera}>
          Enable Camera
        </button>
      )}

      {cameraEnabled &&
        (streaming ? (
          <div>
            <span>{connected ? 'Connected' : 'Disconnected'}</span>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2" onClick={stopStreaming}>
              Stop Streaming
            </button>
          </div>
        ) : (
          <>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
              onClick={startStreaming}
            >
              Start Streaming
            </button>
          </>
        ))}
      <div>
        <div>
          <video
            ref={videoRef}
            controls
            width="100%"
            height="auto"
            muted
          ></video>
        </div>
      </div>
      <div className="my-6">
        <h3 className="text-2xl font-bold mb-2">Featured Item</h3>
        {featuredItem && variant && 
          <div>
            <h4 className="text-xl mb-2 flex-1">{featuredItem.title}</h4>
            <div className="flex">
              <Image
                priority={true}
                width={150} 
                height={150} 
                src={featuredItem.image.src} 
                alt={`An image of ${featuredItem.title}`} className="mr-4"
              />
              <div>
                <div className="mb-3">{featuredItem.body_html}</div>
                <select 
                  className="mb-3" 
                  onChange={(e) => getAndSetVariant(parseInt(e.target.value))}
                >
                  {featuredItem.variants?.map(variant => 
                    <option key={variant.id} value={variant.id}>{variant.title}</option>
                  )}
                </select>
                <div>
                  <p>ID: {variant.id} </p>
                  <p>
                    Price: <span className="line-through">${variant.price}</span> ${variant.compare_at_price}
                  </p>
                  <p>Inventory: {variant.inventory_quantity}</p>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-6">Other Items</h3>
        <ul>
          {products ? 
            products.map(item => 
              <li 
                key={item.id} 
                onClick={() => selectFeaturedItem(item)}
                className={`
                  flex 
                  px-3 
                  py-4 
                  border
                  mb-3 
                  cursor-pointer
                  ${featuredItem?.id === item.id 
                    ? "border-blue-400" 
                    : "hover:border-stone-400"}
                `}
              >
                <Image 
                  width={50} 
                  height={50} 
                  priority={true}
                  src={item.image.src} 
                  alt={`An image of ${item.title}`} 
                  className="mr-4"
                />
                <p className="flex flex-1 items-center">{item.title}</p>
                <button>Feature</button>
              </li>
            ) 
            : <div>Loading</div>
          }
        </ul>
      </div>
    </div>
  );
};

export default Live;
