
class Distribution {

  constructor(data, weightKey, drawOutliersAsPoints, groupKey, group) {
    this.data = []
    this.outliers = []
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
    this.getSummary(drawOutliersAsPoints)
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

  getSummary(drawOutliersAsPoints){
    let quartiles = this.getQuartiles(this.data)
    this.q1 = quartiles.q1
    this.median = quartiles.med
    this.q3 = quartiles.q3

    if (drawOutliersAsPoints) {
      let iqr = this.q3 - this.q1
      let threshold = 1.5 * iqr

      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i] < this.q1 - threshold) {
          this.outliers.push(this.data[i])
        } else {
          this.min = this.data[i]
          break
        }
      }

      for (let j = this.data.length-1; j >= 0; j--) {
        if (this.data[j] > this.q3 + threshold) {
          this.outliers.push(this.data[j])
        } else {
          this.max = this.data[j]
          break
        }
      }
    } else {
      this.min = this.data[0]
      this.max = this.data[this.data.length-1]
    }

    this.mean = this.getMean(this.data)
    this.summary = {
      max: this.max,
      q3: this.q3,
      median: this.median,
      mean: this.mean,
      q1: this.q1,
      min: this.min,
      outliers: this.outliers
    }
  }
}

export default Distribution
