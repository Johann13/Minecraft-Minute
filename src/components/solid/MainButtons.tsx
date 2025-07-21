import {type Component} from "solid-js";
import {useState} from "./MainStateProvider.tsx";

export const MainButtons: Component = () => {
  const {embed, order, setOrderNewestFirst, setOrderOldestFirst} = useState();

  const updateOrder = (newOrder: 'newestfirst' | 'oldestfirst') => {
    // Update the URL without refreshing the page
    const url = new URL(window.location.href);
    url.searchParams.set('order', newOrder);
    if (embed()) {
      url.searchParams.set('embed', 'true');
    } else {
      url.searchParams.delete('embed');
    }
    window.history.pushState({}, '', url.toString());

    // Update the order state
    if (newOrder === 'newestfirst') {
      setOrderNewestFirst();
    } else {
      setOrderOldestFirst();
    }
  };

  return (
    <>
      <button
        onClick={() => updateOrder('newestfirst')}
        class='button p-4 text-center font-minecraft'
        classList={{
          'underline': order() === 'newestfirst',
        }}>
        Newest First
      </button>
      <button
        onClick={() => updateOrder('oldestfirst')}
        class='button p-4 text-center font-minecraft'
        classList={{
          'underline': order() === 'oldestfirst'
        }}>
        Oldest First
      </button>
    </>
  );
}
