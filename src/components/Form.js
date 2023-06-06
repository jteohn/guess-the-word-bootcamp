import React from "react";

export class Form extends React.Component {
  render() {
    return (
      <div>
        <form>
          <input
            name="guess"
            type="text"
            maxlength="1"
            placeholder="guess a letter"
            value={this.props.updateGuess}
            onChange={(e) => this.props.handleChange(e)}
            disabled={this.props.disable}
          />
          <input
            name="submit"
            type="submit"
            value="submit"
            onClick={this.props.submit}
            disabled={this.props.disable}
          />
        </form>
      </div>
    );
  }
}

export default Form;
