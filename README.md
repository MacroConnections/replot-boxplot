# replot-boxplot
Intelligent and customizable boxplot components to show off your distributions
in style.

## Installation
Only works with React projects. React must be installed separately.
```bash
npm install replot-boxplot
```

Then with a module bundler like webpack/browserify that supports CommonJS/ES2015
modules, use as you would anything else.

```javascript
import BoxPlot from 'replot-boxplot'
```

## API
replot-boxplot is designed to easily create boxplots.
The only *required* input is properly formatted data.

### Basic Usage
In the simplest case, just supply data (as a Javascript array) and specify the
key for the values -:

```javascript
render() {
  let boxData: [
    {score: 93},
    {score: 95},
    {score: 60},
    {score: 74},
    {score: 82},
    {score: 90},
    {score: 96},
    {score: 66},
    {score: 74},
    {score: 77},
  ]

  return(
    <BoxPlot data={boxData} weightKey="score" />
  )
}
```

- `data` is the only required prop
- `weightKey` defaults to `"weight"`

#### Multiple distributions
Replot BoxPlots support displaying multiple boxplots from one data set. In this
case, one must only specify a `groupKey` prop with which to group the data.

```javascript
render() {
  let boxData: [
    {gender: "female", score: 93},
    {gender: "female", score: 95},
    {gender: "female", score: 60},
    {gender: "female", score: 74},
    {gender: "female", score: 82},
    {gender: "female", score: 90},
    {gender: "male", score: 96},
    {gender: "male", score: 66},
    {gender: "male", score: 74},
    {gender: "male", score: 77},
    {gender: "male", score: 80}
  ]

  return(
    <BoxPlot data={boxData} weightKey="score" groupKey="gender"/>
  )
}
```

### Dimensions
Dimensions may be specified by passing in `width` and `height` props. The
unit is pixels, and the BoxPlot defaults to 400 by 400 pixels.

### Colors
Colors may be specified through 2 different mechanisms, both through a `color` prop.
If none of the mechanisms are specified, BoxPlot defaults to a built in
color palette.

#### User-provided Color Palette
The user can specify their own desired colored palette for the boxplots to use.
This is done by passing in an array of color strings to the component with the
`color` prop. The displayed boxplots will cycle through the provided colors.

#### User-provided Color function
The user can specify the color for a certain distribution by provided a function
as well. One can expect to receive the index of the plot (plot on the left has index
0, next plot has index 1, and so on), as well as the groupKey associated with
the plot, if there is one. In the example below, color is decided based on the
groupKey:

```javascript

colorMe(i, group) {
  if (group === "male"){
    return "blue"
  } else if (group === "female") {
    return "pink"
  }
}
render() {
  return(
    <BoxPlot data={boxData} weightKey="score" groupKey="gender" color={this.colorMe}/>
  )
}
```

### Tooltip
BoxPlots are capable of utilizing a tooltip to display more specific information
about the distribution. By default, the tooltip is off, but can be activated by
passing in a `tooltip` prop (no value needed). The tooltip features two different
color schemes, dark and light, which can be specified by a
`tooltipColor` prop, with a value of "dark" or "light".

```javascript
render() {
  ...

  return(
    <BoxPlot data={boxData} tooltip tooltipColor="light" />
  )
}
```

#### Customizing Tooltip contents
By default, the tooltip will display the the five-number summary of a distribution
at the corresponding points. The user can customize exactly what is displayed inside the tooltip by passing in a `tooltipContents` prop in the form of a Javascript function.
The user can expect to receive the name of the stat they are hovering over
(e.g. "Max", "Med"), the value of the respective stat, as well as the entire distribution. The function should return JSX, which can utilize some or all of the provided values.

```javascript
fillTooltip(statName, value, distribution){
  return (
    <div>You are hovering on the stat: {statName}</div>
  )
}

render() {
  ...

  return(
    <BoxPlot data={boxData}
      tooltip tooltipContents={this.fillTooltip}/>
  )
}
```

### Axis Customization
Replot BoxPlots allow for incredible customization of the graph axis. A complete
explanation of axis customization can be found below -:

#### Titles
By default, the BoxPlot does not display any axis titles. If the user wishes to
include titles, they can pass in some or all of the `xTitle`, `yTitle`, and
`graphTitle` props. These props accept a string value, displayed at the appropriate
location on the graph. To compensate for the inclusion of a title, the graph content
will be pushed further in, but overall the size of the component will remain what
was specified by the user.

#### Showing/Hiding Axis Elements
By default, the BoxPlot shows the entirety of the axes, including lines, labels,
and gridlines. These can each individually be disabled by passing in boolean
values of false to the following props:
- showXAxisLine
- showYAxisLine
- showXLabels
- showYLabels
- showGrid

#### Styling the axis
In addition to enabling/disabling titles and axis components, the actual style of
the components can be altered as well, with the use of one `axisStyle` prop that
takes the form of a JavaScript object.

Explanations and defaults follow:

* axisColor
  * modifies the color of the axis line
  * defaults to `#000000`
  * accepts any color string
* labelColor
  * modifies the color of both axis labels
  * defaults to `#000000`
  * accepts any color string
* titleColor
  * modifies the color of all graph titles
  * defaults to `#000000`
  * accepts any color string
* labelColor
  * modifies the color of axis gridlines
  * defaults to `#DDDDDD`
  * accepts any color string
* lineWidth
  * modifies the thickness of axis lines
  * defaults to `2`
  * accepts any number
* lineOpacity
  * modifies the opacity of axis lines
  * defaults to `1`
  * accepts any number

Example of using the axisStyle prop:

```javascript
let style = {
    axisColor: "#f17e33",
    labelColor: "blue",
    titleColor: "#000000",
    gridColor: "#DDDDDD",
    lineWidth: 5,
    lineOpacity: .5
  }

render() {
  ...

  return(
    <BoxPlot data={boxData} axisStyle={style}/>
  )
}
