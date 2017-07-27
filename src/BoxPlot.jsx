import React from "react"
import Distribution from "./Distribution.js"

class Line extends React.Component {

  render() {
    return(
      <g>
        <line
          x1={this.props.x1}
          y1={this.props.y1}
          x2={this.props.x2}
          y2={this.props.y2}
          stroke={this.props.stroke}
          strokeWidth={this.props.strokeWidth}
          opacity={this.props.opacity} />
      </g>
    )
  }

}

Line.defaultProps = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  stroke: "rgb(0,0,0)",
  strokeWidth: 2,
  opacity: 1
}


class YTickLabel extends React.Component {

  render() {
    let printVal = this.props.value
    if (this.props.value >= 1) {
      printVal = this.props.value
    } else {
      printVal = this.props.value.toFixed(4)
    }

    return (
      <g>
        <text x={this.props.x} y={this.props.y+this.props.size/2} fontSize={this.props.size} fill={this.props.color} textAnchor={"end"}>
          {printVal}
        </text>
      </g>
    )
  }

}

class YStep extends React.Component {

  render() {
    let step = []

    if (this.props.yTicks == "on") {
      step.push(
        <Line key={"tick"+this.props.y}
          x1={this.props.x} y1={this.props.y}
          x2={this.props.x-this.props.length} y2={this.props.y}
          stroke={this.props.color} />
      )
    }

    step.push(
      <YTickLabel key={"label"+this.props.y} x={this.props.x-10} y={this.props.y} value={this.props.value} size={15} color={this.props.color} />
    )
    return(
      <g>{step}</g>
    )
  }

}

class YAxis extends React.Component {

  render() {
    let yAxis = []

    if (this.props.yAxisLine == "on") {
      yAxis.push(
        <Line key={"yline"} x1={this.props.x} y1={this.props.y}
          x2={this.props.x} y2={this.props.y+this.props.height}
          stroke={this.props.color} />
      )
    }

    if (this.props.yTitle != "off") {
      let rotation = "rotate(-90,10,"+String(this.props.y+this.props.height/2)+")"
      yAxis.push(
        <text key="yTitle"
          x={0} y={this.props.y+this.props.height/2+10}
          fontSize={18} transform={rotation} fill={this.props.color}>
          {this.props.yTitle}
        </text>
      )
    }

    let ySpace = this.props.height / (this.props.ySteps - 1)

    for (var i=0; i < this.props.ySteps; i++) {
      let tickPos = this.props.height+this.props.y-i*ySpace

      let yVal = 0
      if (this.props.scale == "log") {
        let valueRatio = (Math.log10(this.props.maxY) - Math.log10(this.props.minY)) / (this.props.ySteps - 1)
        let pow10 = Math.log10(this.props.minY) + i * valueRatio
        yVal = Math.pow(10, pow10)
      } else {
        yVal = this.props.minY + i*(this.props.maxY-this.props.minY)/(this.props.ySteps-1)
      }
      yAxis.push(
        <YStep key={"ystep"+i} x={this.props.x} y={tickPos}
          value={yVal} length={10} color={this.props.color} yTicks={this.props.yTicks} />
      )

      if (this.props.grid == "default") {
        if (i != 0) {
          yAxis.push(
            <Line key={"grid"+i} x1={this.props.x} y1={tickPos}
              x2={this.props.x+this.props.width} y2={tickPos}
              stroke={this.props.gridColor} strokeWidth={1} opacity={0.5} />
          )
        }
      }
    }

    return(
      <g>{yAxis}</g>
    )
  }

}

class XAxis extends React.Component {

  render(){
    let xAxis = []
    // if (this.props.xAxisLine == "on") {
    xAxis.push(
      <Line key={"xline"} x1={this.props.x} y1={this.props.y}
        x2={this.props.x+this.props.width} y2={this.props.y}
        stroke={this.props.color} />
    )
    // }
    if (this.props.xTitle != "off") {
      xAxis.push(
        <text key="xTitle" textAnchor="middle"
          x={this.props.buffer + this.props.width / 2} y={this.props.y+45}
          fontSize={18} >
          {this.props.xTitle}
        </text>
      )
    }
    if (this.props.labels){
      let offset = this.props.buffer + this.props.width/this.props.labels.length/2
      for (let i = 0; i < this.props.labels.length; i ++){
        xAxis.push(
          <text key={this.props.labels[i]}
            x={offset + i*(this.props.width/this.props.labels.length)}
            y={this.props.y+20} textAnchor="middle">
            {this.props.labels[i]}
          </text>
        )
      }
    }
    return <g>{xAxis}</g>
  }
}

// XAxis.defaultProps = {
//   color: "black"
// }

class BoxPlot extends React.Component {

  draw(distributions, min, max, labels){
    let axes = []
    let plots = []
    let padding = (max-min) / 3
    let buffer = {left: (this.props.yTitle ? 75 : 50), top: (this.props.graphTitle ? 30 : 5), bot: (this.props.xTitle ? 50 : 25)}
    let unit = (this.props.height-buffer.bot-buffer.top) / ((max+padding) - (min-padding))
    axes.push(
      <YAxis x={buffer.left} y={buffer.top} width={this.props.width}
        height={this.props.height-buffer.bot-buffer.top}
        minY={min-padding} maxY={max+padding} yTitle={this.props.yTitle}/>
    )
    axes.push(
      <XAxis x={buffer.left} y={buffer.top+((max+padding-(min-padding))*unit)}
        width={this.props.width-buffer.left} buffer={buffer.left}
        xTitle={this.props.xTitle} labels={labels} />
    )
    if (this.props.graphTitle != "off"){
      axes.push(
        <text key="graphTitle" textAnchor="middle" fontSize={18}
          x={buffer.left + (this.props.width-buffer.left) / 2} y={25}>
          {this.props.graphTitle}
        </text>
      )
    }
    let width = (this.props.width-buffer.left)/distributions.length - 50
    let offset
    for (let i = 0; i < distributions.length; i++){
      offset = buffer.left + (this.props.width-buffer.left)/distributions.length/2 + i*((this.props.width-buffer.left)/distributions.length)
      let d = distributions[i]
      let plot = []
      plot.push(
        <Line x1={-width/2 + offset} y1={buffer.top+((max+padding-d.max)*unit)} x2={width/2 + offset} y2={buffer.top+((max+padding-d.max)*unit)}/>
      )
      plot.push(
        <Line x1={offset} y1={buffer.top+((max+padding-d.max)*unit)} x2={offset} y2={buffer.top+((max+padding-d.q3)*unit)}/>
      )
      plot.push(
        <g>
          <rect x={-width/2 + offset} y={buffer.top+((max+padding-d.q3)*unit)} width={width}
            height={((max+padding-d.q1)*unit)-((max+padding-d.q3)*unit)} stroke="black" strokeWidth="2" fill="none"/>
        </g>
      )
      plot.push(
        <g>
          <circle cx={offset} cy={buffer.top+((max+padding-d.mean)*unit)} r={3}/>
        </g>
      )
      plot.push(
        <Line x1={-width/2 + offset} y1={buffer.top+((max+padding-d.median)*unit)} x2={width/2 + offset} y2={buffer.top+((max+padding-d.median)*unit)}/>
      )
      plot.push(
        <Line x1={offset} y1={buffer.top+((max+padding-d.q1)*unit)} x2={offset} y2={buffer.top+((max+padding-d.min)*unit)}/>
      )
      plot.push(
        <Line x1={-width/2 + offset} y1={buffer.top+((max+padding-d.min)*unit)} x2={width/2+ offset} y2={buffer.top+((max+padding-d.min)*unit)}/>
      )
      plots.push(plot)
    }
    let series = axes.concat(plots)
    return series
  }

  drawPlot(distribution, unit){

  }

  render() {
    let distributions = []
    let max, min, unique
    if (this.props.groupKey){
      unique = [...new Set(this.props.data.map(item => item[this.props.groupKey]))]
      for (let key of unique){
        let d = new Distribution(this.props.data, this.props.weightKey, this.props.groupKey, key)
        if (!max || d.max > max){
          max = d.max
        }
        if (!min || d.min < min){
          min = d.min
        }
        distributions.push(d)
      }
    } else {
      let d = new Distribution(this.props.data, this.props.weightKey)
      if (!max || d.max > max){
        max = d.max
      }
      if (!min || d.min < min){
        min = d.min
      }
      distributions.push(d)
    }

    let series = this.draw(distributions, min, max, unique)
    // let plot = this.drawPlot(distributions[0])

    return (
      <svg width={this.props.width} height={this.props.height}>
        {series}
      </svg>
    )
  }
}

YAxis.defaultProps = {
  x: 0,
  y: 0,
  width: 400,
  height: 350,
  color: "#000000",
  scale: "lin",
  grid: "default",
  gridColor: "#DDDDDD",
  yTitle: "off",
  ySteps: 6,
  yTicks: "on",
  yAxisLine: "on",
  maxY: 100,
  minY: 0
}

BoxPlot.defaultProps = {
  width: 400,
  height: 400,
}

export default BoxPlot
