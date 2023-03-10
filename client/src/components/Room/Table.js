import React, { useEffect, useState } from "react";
import Card from "./Card.js";
import { addPlayer, removePlayer } from "../../controllers/playerController.js";
import {
  checkEmptyness,
  resetTable,
  setIsHidden,
} from "../../controllers/roomController.js";

export default function Table(props) {
  return (
    <div id='table'>
      <List seatedPlayers={props.seatedPlayers} showResults={!props.isHidden} />

      {!props.disabled && (
        <Admin roomID={props.roomID} isHidden={props.isHidden} />
      )}

      <Bouncer
        roomID={props.roomID}
        playerID={props.playerID}
        lock={props.lock}
      />
    </div>
  );
}

function Admin(props) {
  function handleReset() {
    setIsHidden(props.roomID, true);
    resetTable(props.roomID);
  }

  function handleReveal() {
    setIsHidden(props.roomID, !props.isHidden);
  }

  return (
    <div>
      <button className='table-buttons' onClick={handleReveal}>
        {props.isHidden ? (
          <span className='material-symbols-outlined'>visibility</span>
        ) : (
          <span className='material-symbols-outlined'>visibility_off</span>
        )}
      </button>

      <button className='table-buttons' onClick={handleReset}>
        <span className='material-symbols-rounded'>refresh</span>
        <span>reset</span>
      </button>
    </div>
  );
}

function Bouncer(props) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSeated, setIsSeated] = useState(false);
  const [name, setName] = useState("");

  // Focus on the input field after clicking "join table".
  useEffect(() => {
    const nameInput = document.getElementById("name-input");

    if (isFormVisible && nameInput) {
      (function () {
        nameInput.focus();
      })();
    }
  }, [isFormVisible]);

  function handleChange(e) {
    setName(e.target.value);
  }

  async function handleJoin(e) {
    e.preventDefault(); // Prevents page redirection.
    addPlayer(name, props.roomID, props.playerID);
    setName("");
    setIsFormVisible(!isFormVisible);
    setIsSeated(!isSeated);
    props.lock();
  }

  function handleCancelation() {
    setName("");
    setIsFormVisible(!isFormVisible);
  }

  function handleLeave() {
    removePlayer(props.roomID, props.playerID);
    checkEmptyness(props.roomID, props.seatedPlayers);
    setIsSeated(!isSeated);
    props.lock();
  }

  return (
    <div>
      {isFormVisible ? (
        <form onSubmit={handleJoin} onReset={handleCancelation}>
          <input
            type='text'
            id='name-input'
            name='name'
            autoComplete='off'
            placeholder='enter your username'
            value={name}
            onChange={handleChange}
          />
          <br></br>
          <button className='table-buttons' type='submit'>
            join
          </button>
          <button className='table-buttons' type='reset'>
            cancel
          </button>
        </form>
      ) : (
        <div>
          {isSeated ? (
            <div>
              <button className='table-buttons' onClick={handleLeave}>
                <span className='material-icons'>logout</span>
                <span>leave</span>
              </button>
            </div>
          ) : (
            <button
              id='join-table-button'
              className='table-buttons'
              onClick={() => setIsFormVisible(!isFormVisible)}
            >
              <span>join table</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function List(props) {
  const seatedPlayers = props.seatedPlayers;
  const length = seatedPlayers && seatedPlayers.length;

  function computeAverage() {
    const playedCards = seatedPlayers
      // Get the card values.
      .map((player) => {
        if (player.card === "??") {
          return "0.5"; // For easier number conversion.
        }
        return player.card;
      })
      // Excludes the players that did not vote or voted on "?".
      .filter((card) => {
        switch (card) {
          case "":
          case "?":
            return false;

          default:
            return true;
        }
      })
      .map((string) => Number(string));
    return playedCards.reduce((a, b) => a + b, 0) / playedCards.length;
  }

  return (
    <ul>
      <div>players seated</div>
      {props.showResults && <div>average: {computeAverage()}</div>}
      {length < 1 && <div>empty table</div>}

      {length >= 1 &&
        props.seatedPlayers.map((player) => {
          return (
            <li
              className={"player" + (player.card ? "-ready" : "")}
              key={player.ID}
            >
              {player.card ? (
                // <span className='material-icons'>check_circle</span>
                <Card
                  key={player.ID}
                  value={player.card}
                  owner={player.name}
                  revealOwner={true}
                  isFacingUp={props.showResults}
                  isSelected={true}
                  onClick={() => {}}
                  width='44px'
                  height='66px'
                />
              ) : (
                <div>
                  <div className='still-choosing'></div>
                  <div className='owner'>{player.name}</div>
                </div>
              )}
            </li>
          );
        })}
    </ul>
  );
}
