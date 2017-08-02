import React from "react"
import PropTypes from "prop-types"
import {Motion, spring} from "react-motion"
import Distribution from "./Distribution.js"
import {Resize, Tooltip} from "replot-core"
import Axis from "../../replot-core/src/Axis.jsx"


class Plot extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      spread: (this.props.initialAnimation ? false : true)
    }
  }

  calculatePositions(){
    let positions = {}
    positions.maxY = this.props.buffer+((this.props.max+this.props.padding-this.props.distribution.max)*this.props.unit)
    positions.q4Y1 = this.props.buffer+((this.props.max+this.props.padding-this.props.distribution.max)*this.props.unit)
    positions.q4Y2 = this.props.buffer+((this.props.max+this.props.padding-this.props.distribution.q3)*this.props.unit)
    positions.rectY = this.props.buffer+((this.props.max+this.props.padding-this.props.distribution.q3)*this.props.unit)
    positions.rectHeight = ((this.props.max+this.props.padding-this.props.distribution.q1)*this.props.unit)-((this.props.max+this.props.padding-this.props.distribution.q3)*this.props.unit)
    positions.medY = this.props.buffer+((this.props.max+this.props.padding-this.props.distribution.median)*this.props.unit)
    positions.cY = this.props.buffer+((this.props.max+this.props.padding-this.props.distribution.mean)*this.props.unit)
    positions.q0Y1 = this.props.buffer+((this.props.max+this.props.padding-this.props.distribution.q1)*this.props.unit)
    positions.q0Y2 = this.props.buffer+((this.props.max+this.props.padding-this.props.distribution.min)*this.props.unit)
    positions.minY = this.props.buffer+((this.props.max+this.props.padding-this.props.distribution.min)*this.props.unit)
    return positions
  }

  render(){
    let positions = this.calculatePositions()

    if (!this.state.spread) {
      return(
        <g>
          <line x1={-this.props.width/2 + this.props.offset} y1={positions.medY}
            x2={this.props.width/2 + this.props.offset} y2={positions.medY}
            stroke={this.props.color(this.props.index, this.props.distribution.group)}
            strokeWidth={this.props.style.lineWidth}
            onMouseOver={this.props.activateTooltip.bind(this, this.props.distribution)}
            onMouseOut={this.props.deactivateTooltip.bind(this)}/>
        </g>
      )
    }

    let initialStyle = {
      maxY: positions.maxY,
      q4Y1: positions.q4Y1,
      q4Y2: positions.q4Y2,
      rectY: positions.rectY,
      rectHeight: positions.rectHeight,
      medY: positions.medY,
      cY: positions.cY,
      q0Y1: positions.q0Y1,
      q0Y2: positions.q0Y2,
      minY: positions.minY,
    }

    if (this.props.initialAnimation){
      initialStyle = {
        maxY: positions.medY,
        q4Y1: positions.medY,
        q4Y2: positions.medY,
        rectY: positions.medY,
        rectHeight: 0,
        medY: positions.medY,
        cY: positions.medY,
        q0Y1: positions.medY,
        q0Y2: positions.medY,
        minY: positions.medY
      }
    }

    return (
      <Motion
        defaultStyle={initialStyle}
        style={{
          maxY: spring(positions.maxY, {stiffness: 50, damping: 12}),
          q4Y1: spring(positions.q4Y1, {stiffness: 50, damping: 12}),
          q4Y2: spring(positions.q4Y2, {stiffness: 50, damping: 12}),
          rectY: spring(positions.rectY, {stiffness: 50, damping: 12}),
          rectHeight: spring(positions.rectHeight, {stiffness: 50, damping: 12}),
          medY: spring(positions.medY, {stiffness: 50, damping: 12}),
          cY: spring(positions.cY, {stiffness: 50, damping: 12}),
          q0Y1: spring(positions.q0Y1, {stiffness: 50, damping: 12}),
          q0Y2: spring(positions.q0Y2, {stiffness: 50, damping: 12}),
          minY: spring(positions.minY, {stiffness: 50, damping: 12}),
        }}
      >
        {(interpolatingStyle) =>
          <g onMouseOver={this.props.activateTooltip.bind(this, this.props.distribution)}
            onMouseOut={this.props.deactivateTooltip.bind(this)}>
            <line x1={-this.props.width/4 + this.props.offset} y1={interpolatingStyle.maxY}
              x2={this.props.width/4 + this.props.offset} y2={interpolatingStyle.maxY}
              stroke={this.props.color(this.props.index, this.props.distribution.group)}
              strokeWidth={this.props.style.lineWidth} />
            <line x1={this.props.offset} y1={interpolatingStyle.q4Y1}
              x2={this.props.offset} y2={interpolatingStyle.q4Y2}
              stroke={this.props.color(this.props.index, this.props.distribution.group)}
              strokeWidth={this.props.style.lineWidth}/>
            <rect x={-this.props.width/2 + this.props.offset} y={interpolatingStyle.rectY}
              width={this.props.width} height={interpolatingStyle.rectHeight}
              stroke={this.props.color(this.props.index, this.props.distribution.group)}
              fill="#f5f5f5" strokeWidth={this.props.style.lineWidth}/>
            <circle cx={this.props.offset} cy={interpolatingStyle.cY} r={3}
              stroke={this.props.color(this.props.index, this.props.distribution.group)}
              fill="#f5f5f5" strokeWidth={this.props.style.lineWidth} />
            <line x1={-this.props.width/2 + this.props.offset} y1={interpolatingStyle.medY}
              x2={this.props.width/2 + this.props.offset} y2={interpolatingStyle.medY}
              stroke={this.props.color(this.props.index, this.props.distribution.group)}
              strokeWidth={this.props.style.lineWidth} />
            <line x1={this.props.offset} y1={interpolatingStyle.q0Y1}
              x2={this.props.offset} y2={interpolatingStyle.q0Y2}
              stroke={this.props.color(this.props.index, this.props.distribution.group)}
              strokeWidth={this.props.style.lineWidth}/>
            <line x1={-this.props.width/4 + this.props.offset} y1={interpolatingStyle.minY}
              x2={this.props.width/4 + this.props.offset} y2={interpolatingStyle.minY}
              stroke={this.props.color(this.props.index, this.props.distribution.group)}
              strokeWidth={this.props.style.lineWidth} />
          </g>
        }
      </Motion>
    )
  }

  componentDidMount(){
    setTimeout(() => {this.setState({spread: true})}, 1500)
  }

}

class BoxPlot extends React.Component {

  constructor(){
    super()
    this.state = {
      tooltipContents: null,
      mouseOver: false,
      mouseX: null,
      mouseY: null
    }
  }

  activateTooltip(distribution) {
    let newContents
    if (this.props.tooltipContents){
      newContents = this.props.tooltipContents(distribution)
    }
    else {
      newContents = (
        <div>
          <span>Max: {distribution.max}</span><br/>
          <span>Q3: {distribution.q3}</span><br/>
          <span>Median: {distribution.median}</span><br/>
          <span>Mean: {distribution.mean}</span><br/>
          <span>Q1: {distribution.q1}</span><br/>
          <span>Min: {distribution.min}</span><br/>
        </div>
      )
    }
    this.setState({
      tooltipContents: newContents,
      mouseOver: true,
    })
  }

  deactivateTooltip() {
    this.setState({
      mouseOver: false
    })
  }

  updateMousePos(e) {
    this.setState({
      mouseX: e.pageX + 8,
      mouseY: e.pageY
    })
  }

  colorPlot(i, group) {
    if (this.props.color instanceof Array) {
      return this.props.color[i%this.props.color.length]
    } else {
      return this.props.color(i, group)
    }
  }

  draw(distributions, min, max, labels){
    let axes = []
    let plots = []
    let padding = (max-min) / 3
    let buffer = {
      left: (this.props.yTitle ? 75 : 50),
      top: (this.props.graphTitle ? 30 : 5),
      bot: (this.props.xTitle ? 50 : 25)
    }
    let unit = (this.props.height-buffer.bot-buffer.top) / ((max+padding) - (min-padding))

    axes.push(
      <Axis key="axis" graphTitle={this.props.graphTitle} width={this.props.width}
        height={this.props.height} minY={min-padding} maxY={max+padding}
        ySteps={this.props.ySteps} yTitle={this.props.yTitle}
        showYAxisLine={this.props.showYAxisLine}
        showYLabels={this.props.showYLabels} showGrid={this.props.showGrid}
        xTitle={this.props.xTitle} showXAxisLine={this.props.showXAxisLine}
        showXLabels={this.props.showXLabels} labels={labels}
        axisStyle={this.props.axisStyle} xAxisMode="discrete" />
    )

    let plotWidth = (this.props.width-buffer.left)/distributions.length/2
    for (let i = 0; i < distributions.length; i++){
      plots.push(
        <Plot key={"plot"+i} distribution={distributions[i]} width={plotWidth}
          offset={buffer.left + (this.props.width-buffer.left)/distributions.length/2 + i*((this.props.width-buffer.left)/distributions.length)}
          buffer={buffer.top} max={max} min={min} unit={unit}
          padding={padding} index={i} color={this.colorPlot.bind(this)}
          style={this.props.graphStyle}
          initialAnimation={this.props.initialAnimation}
          activateTooltip={this.activateTooltip.bind(this)}
          deactivateTooltip={this.deactivateTooltip.bind(this)}/>
      )
    }

    let series = axes.concat(plots)
    return series
  }

  render() {
    let distributions = []
    let max, min, unique
    if (this.props.groupKey){
      unique = [...new Set(this.props.data.map(item => item[this.props.groupKey]))]
      for (let group of unique){
        let d = new Distribution(this.props.data, this.props.weightKey, this.props.groupKey, group)
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
      max = d.max
      min = d.min
      distributions.push(d)
    }

    let series = this.draw(distributions, min, max, unique)

    return (
      <div onMouseMove={this.props.tooltip ? this.updateMousePos.bind(this) : null}>
        {this.props.tooltip &&
          <Tooltip
            x={this.state.mouseX} y={this.state.mouseY}
            align="right"
            active={this.state.mouseOver}
            contents={this.state.tooltipContents}
            colorScheme={this.props.tooltipColor}
          />
        }
        <svg width={this.props.width} height={this.props.height}>
          {series}
        </svg>
      </div>
    )
  }
}

class BoxPlotResponsive extends React.Component {

  render() {
    return (
      <Resize width={this.props.width}>
        <BoxPlot {...this.props} />
      </Resize>
    )
  }
}


BoxPlot.defaultProps = {
  weightKey: "weight",
  width: 400,
  height: 400,
  color: [
    "#fea9ac", "#fc858f", "#f46b72", "#de836e",
    "#caa56f", "#adcc6f", "#8ebc57", "#799b3f"
  ],
  showXAxisLine: true,
  showXLabels: true,
  showYAxisLine: true,
  showYLabels: true,
  showGrid: true,
  initialAnimation: true,
  graphStyle: {
    lineWidth: 3
  },
  axisStyle: {
    axisColor: "#000000",
    labelColor: "#000000",
    titleColor: "#000000",
    gridColor: "#DDDDDD",
    lineWidth: 2,
    lineOpacity: 1
  }
}

BoxPlotResponsive.defaultProps = {
  width: 400
}

BoxPlot.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  graphTitle: PropTypes.string,
  xTitle: PropTypes.string,
  yTitle: PropTypes.string,
  ySteps: PropTypes.number,
  showXAxisLine: PropTypes.bool,
  showXLabels: PropTypes.bool,
  showYAxisLine: PropTypes.bool,
  showYLabels: PropTypes.bool,
  showGrid: PropTypes.bool,
  initialAnimation: PropTypes.bool,
  tooltip: PropTypes.bool,
  graphStyle: PropTypes.object,
  axisStyle: PropTypes.object
}

export default BoxPlotResponsive
