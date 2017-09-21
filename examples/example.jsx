import React from "react"
import ReactDOM from "react-dom"
import BoxPlot from "../src/BoxPlot.jsx"


class ExampleApp extends React.Component {

  constructor() {
    super()
    this.state = {
      data: [
        {age: "19", gender: "female", height: 63},
        {age: "19", gender: "female", height: 65},
        {age: "19", gender: "female", height: 60},
        {age: "19", gender: "female", height: 64},
        {age: "19", gender: "female", height: 72},
        {age: "19", gender: "female", height: 70},
        {age: "19", gender: "female", height: 71},
        {age: "19", gender: "female", height: 61},
        {age: "19", gender: "female", height: 68},
        {age: "19", gender: "female", height: 65},
        {age: "19", gender: "female", height: 62},
        {age: "19", gender: "male", height: 76},
        {age: "19", gender: "male", height: 66},
        {age: "19", gender: "male", height: 74},
        {age: "19", gender: "male", height: 67},
        {age: "19", gender: "male", height: 76},
        {age: "19", gender: "male", height: 72},
        {age: "19", gender: "male", height: 71},
        {age: "19", gender: "male", height: 68},
        {age: "19", gender: "male", height: 74},
        {age: "19", gender: "male", height: 71}
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
        <BoxPlot data={this.state.data} initialAnimation={false} groupKey="age" weightKey="height" xTitle="Age" yTitle="Height (in.)" />
        <BoxPlot data={this.state.data} groupKey="gender" weightKey="height" xTitle="Gender" yTitle="Height (in.)" />
        <BoxPlot data={this.state.data} color={this.colorMe} groupKey="gender" weightKey="height" xTitle="Gender" yTitle="Height (in.)" />
        <BoxPlot data={this.state.data} graphTitle="A boxplot!" xTitle="Gender" yTitle="Height (in.)" color={this.colorMe} groupKey="gender" weightKey="height"/>
        <BoxPlot data={this.state.data} tooltip graphTitle="A boxplot!" xTitle="Gender" yTitle="Height (in.)" color={this.colorMe} groupKey="gender" weightKey="height"/>
      </div>
    )
  }

}


ReactDOM.render(
  <ExampleApp />,
  document.getElementById("react-app")
)
