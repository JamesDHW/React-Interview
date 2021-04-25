import { FC, useEffect, useState } from "react";
import Player from "./Player";
import PlayingCards from "./PlayingCards";
import { calculateScore, createShuffledDeck } from "./helpers";

const BlackJackTable: FC = () => {
  const [deck, setDeck] = useState<number[]>(createShuffledDeck());
  const [playerHand, setPlayerHand] = useState<number[]>([]);
  const [dealerHand, setDealerHand] = useState<number[]>([]);
  const [hasStuck, setHasStuck] = useState<boolean>(false);
  const [runningCount, setCount] = useState<number>(0);

  const takeCard = (playerType: "player" | "dealer") => {
    const recievedCard = deck.pop();
    if (!recievedCard) throw new Error("No cards left in deck");
    setDeck((deck) => deck.slice(0, -1));

    if (playerType === "player") {
      setPlayerHand((playerHand) => [...playerHand, recievedCard]);
    }
    if (playerType === "dealer") {
      setDealerHand((dealerHand) => [...dealerHand, recievedCard]);
    }

    if (recievedCard <= 6) {
      setCount((runningCount) => runningCount + 1);
    } else if (recievedCard >= 10) {
      setCount((runningCount) => runningCount - 1);
    }
  };

  const onStick = () => {
    setHasStuck(true);
    while (
      calculateScore(dealerHand) < 22 &&
      calculateScore(dealerHand) < calculateScore(playerHand)
    ) {
      takeCard("dealer");
    }
    if (calculateScore(dealerHand) > 21) {
      setDealerHand(dealerHand.slice(0, -1));
    }
  };

  const resetGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setHasStuck(false);

    takeCard("dealer");
    takeCard("player");
  };

  useEffect(() => {
    takeCard("player");
    takeCard("dealer");
  }, []);

  const displayWinner = () => {
    if (
      calculateScore(playerHand) > 21 ||
      (calculateScore(playerHand) < calculateScore(dealerHand) && hasStuck)
    ) {
      return <span className="badge bg-warning  m-1">Dealer Wins</span>;
    } else if (
      hasStuck &&
      calculateScore(playerHand) === calculateScore(dealerHand)
    ) {
      return <span className="badge bg-info  m-1">Draw</span>;
    } else if (hasStuck) {
      return <span className="badge bg-success  m-1">Player Wins</span>;
    }
  };

  const cardsLeft = deck.length === 0 ? "Deck Empty" : deck.length;

  return (
    <div className="bg-light m-3">
      <PlayingCards cards={playerHand} />
      <Player
        onHit={() => takeCard("player")}
        onStick={onStick}
        cards={playerHand}
        stick={hasStuck}
      />
      <PlayingCards cards={dealerHand} />
      <h1>
        <span className="badge bg-primary  m-1">
          Dealer: {calculateScore(dealerHand)}
        </span>
      </h1>
      <h1>{displayWinner()}</h1>
      <button className="btn btn-large btn-danger" onClick={resetGame}>
        Reset Game
      </button>
      <h2>
        <span className="badge bg-secondary  m-1">Count : {runningCount}</span>
        <span className="badge bg-secondary  m-1">
          Cards Left : {cardsLeft}
        </span>
      </h2>
    </div>
  );
};

export default BlackJackTable;
