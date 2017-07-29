
class Distribution {

  constructor(data, weightKey, groupKey, group) {
    this.data = []
    this.group = group
    for (let dataPoint of data) {
      if (groupKey && dataPoint[groupKey] === group){
        this.data.push(dataPoint[weightKey])
      }
      else if (!groupKey) {
        this.data.push(dataPoint[weightKey])
      }
    }
    this.data = this.data.sort((a,b) => a-b)
    this.getSummary()
  }

  getMedian(data){
    let midIndex = Math.floor(data.length / 2)
    let isEven = data.length % 2 === 0
    return isEven ? (data[midIndex] + data[midIndex-1]) / 2 : data[midIndex]
  }

  getQuartiles(data){
    let midIndex = Math.floor(data.length / 2)
    let isEven = data.length % 2 === 0
    let lowerData = data.slice(0, midIndex)
    let upperData = data.slice((isEven ? midIndex : midIndex + 1), data.length)
    return {q1: this.getMedian(lowerData), med: this.getMedian(data), q3: this.getMedian(upperData)}
  }

  getMean(data){
    let total = 0
    for (let i = 0; i < data.length; i++){
      total += data[i]
    }
    return total/data.length
  }

  getSummary(){
    this.min = this.data[0]
    this.max = this.data[this.data.length-1]
    let quartiles = this.getQuartiles(this.data)
    this.q1 = quartiles.q1
    this.median = quartiles.med
    this.q3 = quartiles.q3
    this.mean = this.getMean(this.data)
  }
}

export default Distribution
