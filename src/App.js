import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      arrText: '',
      error: '',
      renderedTable: false,
      waterMatrix: [[]],
      waterBlocks: 0
    }
    this.handleChange = this.handleChange.bind(this);
    this.calculateWaterBlocks = this.calculateWaterBlocks.bind(this);
  }
  
 

  calculateWaterBlocks = () => {
    let arr = this.state.arrText.split(',').map(function(item) {
      return parseInt(item, 10);
    });
    let size = arr.length;
    if(size <= 2){
      this.setState({ error: 'Please enter a array containing more than 2 elements'});
      return; 
    }else{
      this.setState({error: ''});
    }
    let waterMatrix = Array(size).fill(0);
    let left = arr[0]
    let right = arr[arr.length - 1]
    let leftSide = Array(size).fill(0);
    let rightSide = Array(size).fill(0);
    for (let i = 1; i < size; i++) {  
      if (arr[i] < left) {
        leftSide[i] = left
      } else {
        left = arr[i]
      }
      if (arr[size-1-i] < right) {
        rightSide[size-1-i] = right
      } else {
        right = arr[size - 1 - i]
      }
    }
    let water = 0
    for (let i = 0; i < size; i++) {
        if (leftSide[i] && rightSide[i]) {
            let min = leftSide[i] < rightSide[i] ? leftSide[i] : rightSide[i]
            water += min - arr[i]
            waterMatrix[i] = min - arr[i];
        }
    }
    let maxBlock = Math.max(...arr);
    this.createWaterMatrix(waterMatrix, this.state.arrText.split(','), maxBlock+1);
  }
  
  handleChange = (event) => {
    this.setState({arrText: event.target.value});
  }

  createWaterMatrix(waterArr, arr, maxBlock){
    let waterMatrix = [], count = 0;;
    for(let i=0; i < maxBlock; i++){
      waterMatrix.push([]);
      waterMatrix[i].push( new Array(arr.length));
      for(var j=0; j < arr.length; j++){
        waterMatrix[i][j] = 0;
      }
    }
    let waterBlocks = 0;
    for(let col = 0; col < waterMatrix[0].length;col ++){
      for(let row = waterMatrix.length-1; row >=0; row--){
        if(arr[count] > 0){
          waterMatrix[row][col] = 1;
          arr[count] = arr[count] -1;
        }else if(waterArr[count]){
          waterMatrix[row][col] = 2;
          waterBlocks++;
          waterArr[count] = waterArr[count] -1;
        }
      }
      count++;
    }
    this.setState({waterMatrix: waterMatrix, renderedTable: true, waterBlocks: waterBlocks});
  }

  
  renderTable(value){
    return (
      this.state.waterMatrix.map((row, index) => {
        return (
            <tr key={"row_" + index}>
                {row.map((cell, index) => {
                    return (
                      value === 2 
                      ?
                        <td key={"cell_" + index} className={cell === 2 ? 'blue' : ''}></td>
                      :
                        <td key={"cell_" + index} className={cell === 1 ? "yellow" : (cell === 2 ? 'blue' : '')}></td>
                    );
                })}
            </tr>
        );
      })
    );
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Water Block Counter</h1>
        </header>
        <div>
          <div className="flexiItem">
            <input type="text" className="selectpicker" onChange={this.handleChange}/>
            <br/>
            <label>ex.: 1,2,3...</label>
          </div>
            {this.state.error && 
              <label className="margintop error">{this.state.error}</label>
            }
            <div className="buttonContainer">
              <button className='button' onClick={this.calculateWaterBlocks}>Submit</button>
            </div>
        </div>
        {this.state.renderedTable && 
          <div>
            <div>
              <table align="center">
                <tbody>
                  {this.renderTable(0)}
                </tbody>
              </table>
            </div>
            <label className="margintop winner">WaterBlocks: {this.state.waterBlocks}</label>
            <div className="margintop">
              <table align="center">
                <tbody>
                  {this.renderTable(2)}
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;
