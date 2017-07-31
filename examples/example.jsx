import React from "react"
import ReactDOM from "react-dom"
import BoxPlot from "../src/BoxPlot.jsx"


class ExampleApp extends React.Component {

  constructor() {
    super()
    this.state = {
      data: [
        {gender: "female", score: 93},
        {gender: "female", score: 95},
        {gender: "female", score: 60},
        {gender: "female", score: 74},
        {gender: "female", score: 82},
        {gender: "female", score: 90},
        {gender: "female", score: 71},
        {gender: "female", score: 81},
        {gender: "female", score: 88},
        {gender: "female", score: 85},
        {gender: "female", score: 94},
        {gender: "male", score: 96},
        {gender: "male", score: 66},
        {gender: "male", score: 74},
        {gender: "male", score: 77},
        {gender: "male", score: 76},
        {gender: "male", score: 82},
        {gender: "male", score: 81},
        {gender: "male", score: 88},
        {gender: "male", score: 84},
        {gender: "male", score: 91}
      ]
    }
  }

  colorMe(i, group) {
    if (group === "male"){
      return "blue"
    } else if (group === "female") {
      return "pink"
    }
  }

  render() {
    return(
      <div style={{width: "70%"}}>
        <BoxPlot data={this.state.data} weightKey="score" />
        <BoxPlot data={this.state.data} groupKey="gender" weightKey="score"/>
        <BoxPlot data={this.state.data} color={this.colorMe} groupKey="gender" weightKey="score"/>
        <BoxPlot data={this.state.data} graphTitle="A boxplot!" xTitle="An x axis!" yTitle="A y axis!" color={this.colorMe} groupKey="gender" weightKey="score"/>
        <BoxPlot data={this.state.data} tooltip graphTitle="A boxplot!" xTitle="An x axis!" yTitle="A y axis!" color={this.colorMe} groupKey="gender" weightKey="score"/>
      </div>
    )
  }

}


ReactDOM.render(
  <ExampleApp />,
  document.getElementById("react-app")
)
