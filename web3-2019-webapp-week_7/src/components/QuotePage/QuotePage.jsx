import React from "react";
import Quote from "../Quote/Quote";
import Title from "../Title/Title";
const { ipcRenderer } = window.require('electron')

const QUOTES_API_URL = "http://127.0.0.1:8080/quotes/"
const IPC_MAIN_QUOTES_CHANNEL = "QuotesChannel"

class QuotePage extends React.Component {
  constructor() {
    super()
    this.state = {
      quotes: [],
      clickNotif: "",
    }
  }

  render() {
    return (
      <>
        <Title>Citations</Title>
        {
          this.state.quotes.map((item, index) => {
            const { _author, _value } = item
            return (
              <Quote
                author={_author}
                message={_value}
              />
            )
          })
        }
        {this.state.clickNotif}
      </>
    )
  }


  async componentDidMount(){
    this.fetchQuotes()
    ipcRenderer.on(IPC_MAIN_QUOTES_CHANNEL, (e, args) => {
      if(args){
        const quote = <Quote author={args.author} message={args.message}/>
        this.setState({clickNotif: quote})
      }
    })
  }

  fetchQuotes = () => {
    fetch(QUOTES_API_URL)
      .then(response => response.json())
      .then(data => {
        if (data.error)
          return alert ("Error:" + data.error)
        this.setState({quotes: data})
        ipcRenderer.send(IPC_MAIN_QUOTES_CHANNEL, "Les citations ont été chargées depuis mongodb")
      })
      .catch(err => {
        console.error("[Quotes] Error when fetching quotes API:", err)
      })
  }
}

export default QuotePage;
