import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Deck.css";

const Deck = () => {
  const BASEURL = "https://deckofcardsapi.com/api/deck";
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const remainingRef = useRef();

  useEffect(() => {
    async function loadDeck() {
      const res = await axios.get(`${BASEURL}/new/shuffle/?deck_count=1`);
      setDeck(res.data.deck_id);
    }
    loadDeck();
  }, []);

  const handleClick = async () => {
    const res = await axios.get(`${BASEURL}/${deck}/draw`);
    const { success, cards, remaining } = res.data;
    remainingRef.current = remaining;

    if (!success) {
      alert("Error: no cards remaining!");
      return;
    }

    const { code, image } = cards[0];

    setCards((oldCards) => {
      //oldCards mean cards
      return [...oldCards, { code, image }];
    });
  };

  const reshuffle = async () => {
    const res = await axios.get(`${BASEURL}/${deck}/shuffle`);
    setCards([]);
  };

  return (
    <div>
      <button onClick={handleClick}> GIMME A CARD </button>
      <div className="container">
        {cards.map((card) => {
          let transform = `rotate(${Math.floor(Math.random() * 300)}deg)`;
          return (
            <div className="card" key={card.code}>
              <p></p>
              <img src={card.image} style={{ transform }} />
            </div>
          );
        })}
        {remainingRef.current === 0 && (
          <button className="hidden" onClick={reshuffle}>
            Reshuffle
          </button>
        )}
      </div>
    </div>
  );
};
export default Deck;
