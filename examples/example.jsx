import React from "react"
import ReactDOM from "react-dom"
import BoxPlot from "../src/BoxPlot.jsx"


class ExampleApp extends React.Component {

  render() {
    return(
      <div>
        <BoxPlot />
      </div>
    )
  }

}


ReactDOM.render(
  <ExampleApp />,
  document.getElementById("react-app")
)
