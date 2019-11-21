import React from 'react';
import '../styles/App.css';
import Cloud from './Cloud';
import Word from './Word';

class App extends React.Component {
  state = {
    blogContent: null,
    blogUrl: null
  }

  handleChange = (e) => {
    this.setState({blogUrl: e.target.value});
  }

  handleClick = () => {
    if (this.state.blogUrl) {
      // fetch html page content by url

      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      const url = this.state.blogUrl;
      fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
      .then(response => response.text())
      .then(contents => {
        let result = extractContent(contents);
        this.setState({blogContent: result});
      })
      .catch(() => {console.log("Something Wrong")})
    }
  }

  render() {
    return (
      <div className="App">
        <input
          onChange={this.handleChange} />
        <button onClick={this.handleClick}>Please Enter Blog Url</button>
        <Word value={this.state.blogContent} />
        <Cloud value={this.state.blogContent} />
      </div>
    )
  }
}

export default App;



// get blog html post body text
function extractContent(html) {
    let result = (new DOMParser).parseFromString(html, "text/html");
    let element = result.getElementsByClassName("post-body")[0];

    return element.textContent;
}