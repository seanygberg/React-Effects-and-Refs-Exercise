import React, { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

function Deck() {
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);

    useEffect(function loadDeckFromAPI() {
        async function fetchData() {
          const deck = await axios.get(`${API_BASE_URL}/new/shuffle/`);
          setDeck(deck.data);
        }
        fetchData();
    }, []);

    async function draw() {
        try {
            const drawResponse = await axios.get(`${API_BASE_URL}/${deck.deck_id}/draw/`);
            if (drawResponse.data.remaining === 0) {
                throw new Error("Deck empty!");
            }

            const card = drawResponse.data.cards[0];

            setDrawn(drawnState => [
                ...drawnState,
                {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image,
                },
            ]);
        } catch (error) {
            alert(error);
        }
    }

    async function startShuffling() {
        setIsShuffling(true);
        try {
            await axios.get(`${API_BASE_URL}/${deck.deck_id}/shuffle/`);
            setDrawn([]);
        } catch (error) {
            alert(error);
        } finally {
            setIsShuffling(false);
        }
    }

    function renderDrawButton() {
        if (!deck) {
            return null;
        }

        return (
            <button
              onClick={draw}
              disabled={isShuffling}>
              DRAW
            </button>
        );
    }

    function renderShuffleButton() {
        if (!deck) {
            return null;
        }

        return (
            <button
              onClick={startShuffling}
              disabled={isShuffling}>
              SHUFFLE
            </button>
        );
    }

    return (
        <main>
    
          {renderDrawButton()}
          {renderShuffleButton()}
    
          <div>{
            drawn.map(c => (
              <Card key={c.id} name={c.name} image={c.image} />
            ))}
          </div>
    
        </main>
      );
}

export default Deck;