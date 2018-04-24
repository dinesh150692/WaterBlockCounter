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
    if(arr.length <= 2){
      this.setState({ error: 'Please enter a array containing more than 2 elements'});
      return; 
    }else{
      this.setState({error: ''});
    }
    let first  = arr[0];
    let last = arr[arr.length-1];
    let water = new Array(arr.length).fill(0);
    let water1 = new Array(arr.length).fill(0);
    var count  = 0;
    for(let i = 0; i<arr.length;i++){
      for(let j = i+1; j< arr.length; j++){
        if(arr[j] > 0 && arr[i] > 0 && arr[j] >= arr[i]){
          let max = Math.max(...arr.slice(i,j));
          while(count<j){ 
            if(arr[count] <= arr[j]&& max - arr[count] > water[i]){
              water[count]= max - arr[count];
            }
            count++;
          }
          
          i = count;
        }
      }
    }
    arr =  arr.reverse();
    count  = 0;
    for(let i = 0; i<arr.length;i++){
      for(let j = i+1; j< arr.length; j++){
        if(arr[j] > 0 && arr[i] > 0 && arr[j] >= arr[i]){
          let max = Math.max(...arr.slice(i,j));
          while(count<j){ 
            if(arr[count] <= arr[j]&& max - arr[count] > water1[i]){
              water1[count]= max - arr[count];
            }
            count++;
          }
          
          i = count;
        }
      }
    }
    water1 = water1.reverse();
    for(let i = 0; i< water.length; i++){
      if(water[i]>=water1[i]){
        water[i] = water[i];
      }else{
        water[i] = water1[i];
      }
    }
    if(first===0){
      water[0] = 0;
    }
    if(last===0){
      water[arr.length-1] = 0;
    }
    let maxBlock = Math.max(...arr);
    this.createWaterMatrix(water, this.state.arrText.split(','), maxBlock+1);
    
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
