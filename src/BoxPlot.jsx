import React from "react"
import PropTypes from "prop-types"
import {Motion, spring} from "react-motion"
import Distribution from "./Distribution.js"
import {Resize, Tooltip, Axis} from "replot-core"


class Plot extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      spread: (this.props.initialAnimation ? false : true)
    }
  }

  calculatePositions(){
    let trueMax = this.props.max+this.props.padding
    let positions = {}
    positions.maxY = ((trueMax-this.props.distribution.max)*this.props.unit)
    positions.q4Y1 = ((trueMax-this.props.distribution.max)*this.props.unit)
    positions.q4Y2 = ((trueMax-this.props.distribution.q3)*this.props.unit)
    positions.rectY = ((trueMax-this.props.distribution.q3)*this.props.unit)
    positions.rectHeight = ((trueMax-this.props.distribution.q1)*this.props.unit)
      - ((trueMax-this.props.distribution.q3)*this.props.unit)
    positions.medY = ((trueMax-this.props.distribution.median)*this.props.unit)
    positions.cY = ((trueMax-this.props.distribution.mean)*this.props.unit)
    positions.q0Y1 = ((trueMax-this.props.distribution.q1)*this.props.unit)
    positions.q0Y2 = ((trueMax-this.props.distribution.min)*this.props.unit)
    positions.minY = ((trueMax-this.props.distribution.min)*this.props.unit)
    positions.outliers = []
    for (let i = 0; i < this.props.distribution.outliers.length; i++) {
      positions.outliers.push((trueMax-this.props.distribution.outliers[i])*this.props.unit)
    }
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
            onMouseOver={this.props.activateTooltip.bind(this, this.props.distribution.data, this.props.distribution.summary)}
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

    let outliers = []
    for (let i = 0; i < this.props.distribution.outliers.length; i++) {
      outliers.push(
        <circle key={"outlier" + i}
          cx={this.props.offset} cy={positions.outliers[i]} r={3}
          fill={this.props.color(this.props.index, this.props.distribution.group)}
          onMouseOver={this.props.activateTooltip.bind(this, this.props.distribution.data,
            this.props.distribution.summary, true, this.props.distribution.outliers[i])}
          onMouseOut={this.props.deactivateTooltip}/>
      )
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
          <g>
            <g onMouseOver={this.props.activateTooltip.bind(this, this.props.distribution.data, this.props.distribution.summary)}
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
                fill={this.props.style.fill} strokeWidth={this.props.style.lineWidth}/>
              <circle cx={this.props.offset} cy={interpolatingStyle.cY} r={3}
                stroke={this.props.color(this.props.index, this.props.distribution.group)}
                fill={this.props.style.fill} strokeWidth={this.props.style.lineWidth} />
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
            <g>
              {outliers}
            </g>
          </g>
        }
      </Motion>
    )
  }

  componentDidMount(){
    if (!this.state.spead){
      setTimeout(() => {this.setState({spread: true})}, 1500)
    }
  }

}

class PlotContainer extends React.Component {

  render() {
    let plots = []
    let unit = (this.props.height) / ((this.props.max+this.props.padding) - (this.props.min-this.props.padding))

    let plotWidth = (this.props.width)/this.props.distributions.length/2

    for (let i = 0; i < this.props.distributions.length; i++){
      plots.push(
        <Plot key={"plot"+i} distribution={this.props.distributions[i]} width={plotWidth}
          offset={(this.props.width)/this.props.distributions.length/2 + i*((this.props.width)/this.props.distributions.length)}
          max={this.props.max} min={this.props.min} unit={unit}
          padding={this.props.padding} index={i} color={this.props.color}
          style={this.props.style}
          initialAnimation={this.props.initialAnimation}
          activateTooltip={this.props.activateTooltip}
          deactivateTooltip={this.props.deactivateTooltip}/>
      )
    }

    return(
      <g>
        {plots}
      </g>
    )
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

  activateTooltip(distribution, summary, outlier, value) {
    let newContents
    if (this.props.tooltipContents){
      newContents = this.props.tooltipContents(distribution, summary)
    }
    else {
      if (outlier === true) {
        newContents = (
          <div>
            <span>Outlier</span><br/>
            <span>Value: {value}</span><br/>
          </div>
        )
      } else {
        newContents = (
          <div>
            <span>Max: {summary.max}</span><br/>
            <span>Q3: {summary.q3}</span><br/>
            <span>Median: {summary.median}</span><br/>
            <span>Mean: {summary.mean}</span><br/>
            <span>Q1: {summary.q1}</span><br/>
            <span>Min: {summary.min}</span><br/>
          </div>
        )
      }
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
    let graph
    let padding = (max-min) / 5

    graph = (
      <Axis key="axis" graphTitle={this.props.graphTitle} width={this.props.width}
        height={this.props.height} minY={min-padding} maxY={max+padding}
        ySteps={this.props.ySteps} yTitle={this.props.yTitle}
        showYAxisLine={this.props.showYAxisLine}
        showYLabels={this.props.showYLabels} showGrid={this.props.showGrid}
        xTitle={this.props.xTitle} showXAxisLine={this.props.showXAxisLine}
        showXLabels={this.props.showXLabels} labels={labels}
        axisStyle={this.props.axisStyle} xAxisMode="discrete" >
        <PlotContainer distributions={distributions} max={max} min={min}
          padding={padding} color={this.colorPlot.bind(this)}
          style={this.props.graphStyle}
          initialAnimation={this.props.initialAnimation}
          activateTooltip={this.activateTooltip.bind(this)}
          deactivateTooltip={this.deactivateTooltip.bind(this)}/>
      </Axis>
    )

    return graph
  }

  render() {
    let distributions = []
    let max, min, unique
    if (this.props.groupKey){
      unique = [...new Set(this.props.data.map(item => item[this.props.groupKey]))]
      for (let group of unique){
        let d = new Distribution(this.props.data, this.props.weightKey, this.props.drawOutliersAsPoints, this.props.groupKey, group)
        if (!max || d.data[d.data.length-1] > max){
          max = d.data[d.data.length-1]
        }
        if (!min || d.data[0] < min){
          min = d.data[0]
        }
        distributions.push(d)
      }
    } else {
      let d = new Distribution(this.props.data, this.props.weightKey, this.props.drawOutliersAsPoints)
      max = d.data[d.data.length-1]
      min = d.data[0]
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
    lineWidth: 3,
    fill: "rgba(245,245,245,.1)"
  },
  axisStyle: {
    axisColor: "#000000",
    labelColor: "#000000",
    titleColor: "#000000",
    gridColor: "#DDDDDD",
    lineWidth: 2,
    lineOpacity: 1
  },
  drawOutliersAsPoints: true
}

BoxPlotResponsive.defaultProps = {
  width: 400
}

BoxPlot.propTypes = {
  data: PropTypes.array.isRequired,
  weightKey: PropTypes.string,
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
  tooltipColor: PropTypes.string,
  tooltipContents: PropTypes.func,
  graphStyle: PropTypes.object,
  axisStyle: PropTypes.object,
  drawOutliersAsPoints: PropTypes.bool
}

export default BoxPlotResponsive
