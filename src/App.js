import React from "react";
import { getRandomWord } from "./utils.js";
import "./App.css";
import Form from "./components/Form.js";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// constant throughout the game
const NUM_OF_GUESSES = 10;

class App extends React.Component {
  constructor(props) {
    // always call super with props in constructor to initialise parent class
    super(props);
    this.state = {
      // currWord is the current secret word for this round. Update this with this.setState after each round.
      currWord: getRandomWord(),
      // guessedLetters stores all the letters a user has guessed so far.
      guessedLetters: [],
      // user gets 10 guesses each game
      numGuessesLeft: NUM_OF_GUESSES,
      userGuess: "",
      isUserWin: true,
      gameCounter: 0,
      totalWinCount: 0,
    };
  }

  generateWordDisplay = () => {
    const wordDisplay = [];
    console.log(this.state.currWord);
    // for...of is a string and array iterator that does not use index
    for (let letter of this.state.currWord) {
      if (
        this.state.guessedLetters.includes(letter) ||
        this.state.numGuessesLeft === 0
      ) {
        wordDisplay.push(letter);
      } else {
        wordDisplay.push("_");
      }
    }
    return wordDisplay.toString();
  };

  handleChange = (event) => {
    console.log(event);
    // event.target -> the element that triggers the event.
    // event.target.value -> "value" retrieves the value of that element (e.g. an input field)
    // ignore all other inputs that are not text
    this.setState({ userGuess: event.target.value.replace(/[^a-z]/gi, "") });
  };

  handleSubmit = (event) => {
    // to prevent the form from refreshing
    event.preventDefault();
    const userGuessedArray = this.state.guessedLetters;
    let currentGuess = this.state.userGuess.toLowerCase();

    // if user guess the same letter again
    if (userGuessedArray.includes(currentGuess)) {
      alert(
        `You have already guessed "${currentGuess}". Please try another letter.`
      );
      currentGuess = "";
      // update state to clear the input field
      this.setState({ userGuess: "" });
      userGuessedArray.split(",").join("");

      // input validation
    } else if (!currentGuess) {
      alert(`Please enter your guess!`);
      userGuessedArray.split(",").join("");
    }

    this.setState({
      // add new guesses to the back of guessedLetters array
      guessedLetters: [...this.state.guessedLetters, currentGuess],
      // if user guess correctly, numGuessesLeft remains unchanged, else numGuessesLeft minus 1
      numGuessesLeft: this.state.currWord.includes(currentGuess)
        ? this.state.numGuessesLeft
        : this.state.numGuessesLeft - 1,
      // reset userGuess input field to accept new guess
      userGuess: "",
      userGuessProgress: this.state.currWord.includes(currentGuess)
        ? this.state.userGuessProgress
        : this.userGuessProgress - 10,
    });
  };

  checkWinLoss = () => {
    const currentWord = this.state.currWord;
    const userGuessedArray = this.state.guessedLetters;
    for (let letter of currentWord) {
      // if user guesses does not include the letters in the current word
      if (!userGuessedArray.includes(letter)) {
        return false;
      }
    }
    // else, user wins.
    return true;
  };

  // user has the option to play the game again
  resetGame = () => {
    let winCount = 0;
    const didUserWin = this.checkWinLoss();
    if (didUserWin) {
      winCount += 1;
    }

    this.setState({
      currWord: getRandomWord(),
      guessedLetters: [],
      numGuessesLeft: NUM_OF_GUESSES,
      userGuess: "",
      gameCounter: this.resetGame
        ? this.state.gameCounter + 1
        : this.state.gameCounter,
      totalWinCount: winCount
        ? this.state.totalWinCount + 1
        : this.state.totalWinCount,
    });
  };

  render() {
    const didUserWin = this.checkWinLoss();
    const resetGameButton = (
      <Button variant="info" onClick={this.resetGame}>
        New Game
      </Button>
    );

    let disableOption = null;
    if (!didUserWin && this.state.numGuessesLeft > 0) {
      disableOption = false;
    } else if (didUserWin && this.state.numGuessesLeft > 0) {
      disableOption = true;
    } else if (!didUserWin && this.state.numGuessesLeft === 0) {
      disableOption = true;
    }

    const displayTotalWins = (
      <div>
        You have won {this.state.totalWinCount} out of {this.state.gameCounter}{" "}
        round(s)
      </div>
    );

    return (
      <div className="App">
        <header className="App-header">
          <Container>
            <Row>
              <Col>
                <h1>Guess The Word 🚀</h1>
              </Col>
            </Row>
          </Container>
          <br />
          <Container>
            <Row>
              <Col>
                <h3>Word Display</h3>
              </Col>
              <Col>
                <h3>Your Guessed Letters</h3>
              </Col>
            </Row>
            <Row>
              <Col>{this.generateWordDisplay()}</Col>
              <Col>
                {this.state.guessedLetters.length > 0
                  ? this.state.guessedLetters.toString()
                  : "-"}
              </Col>
            </Row>
          </Container>
          <br />
          <p>No. of Guesses Left: {this.state.numGuessesLeft}</p>
          {/* Insert form element here */}
          <Form
            updateGuess={this.state.userGuess}
            handleChange={this.handleChange}
            submit={this.handleSubmit}
            disable={disableOption}
          />
          <br />
          {/* if user guesses the word */}
          {didUserWin && (
            <div>
              <p>You got it!! You have won the game!</p> {resetGameButton}
            </div>
          )}
          {/* if user did not guess the word */}
          {!didUserWin && this.state.numGuessesLeft === 0 && (
            <div>
              <p>Sorry, you ran out of guesses. You lost!</p> {resetGameButton}
            </div>
          )}
          {displayTotalWins}
        </header>
      </div>
    );
  }
}

export default App;
