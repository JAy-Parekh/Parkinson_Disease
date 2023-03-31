import './App.css';
import Nav from './Components/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import React, { Component } from 'react';
import Canvas from './Components/ReactSketch';

class App extends React.Component {
  state = {
    file: null,
    base64URL: "",
    showCanvas: false,
    prediction:"" // added state for toggle button
  };

  getBase64 = file => {
    return new Promise(resolve => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        console.log("Called", reader);
        baseURL = reader.result;
        
        resolve(baseURL);
      };
      
    });
  };

handleFileInputChange = e => {
    console.log(e.target.files[0]);
    let { file } = this.state;

    file = e.target.files[0];
    this.getBase64(file)
      .then(result => {
        file["base64"] = result;
        console.log("File Is", file);
        this.setState({
          base64URL: result,
          file,
          showCanvas: false // hide canvas when file is uploaded
        });
        
      })
      .catch(err => {
        console.log(err);
      });
    
      const formData = new FormData();
      formData.append('imagefile', e.target.files[0]);
      axios.post('http://127.0.0.1:5000/predict', formData)
      .then(response => {
        console.log(response.data.result);
        this.setState({
          prediction:response.data.result
        });
      })
      .catch(error => {
        console.log(error);
      });    
  };


handleSubmit = e => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('imagefile', this.state.file);
  axios.post('http://127.0.0.1:5000/predict', formData)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.log(error);
    });
};


  toggleCanvas = () => {
    this.setState(prevState => ({
      showCanvas: !prevState.showCanvas
    }));
  };



  render() {
    const { showCanvas } = this.state;
    return (
      <>
        <Nav />
        <div className="container" style={{ backgroundColor: "#F5F5F5" }}>
          <div className="text-center my-4">
            <h1 className="display-4">Parkinson's Disease Detection</h1>
            {showCanvas && <Canvas />} {/* show canvas when toggle is on */}
            <div className="text-center my-4">
              {/* show file upload input only if showCanvas is false */}
              {!showCanvas && (
                <div className="my-2">
                  <h2>{this.state.prediction}</h2>
                  <label htmlFor="fileUpload" className="form-label">
                    Choose an image of handwritten drawing to upload:
                  </label>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      id="fileUpload"
                      accept="image/*"
                      onChange={this.handleFileInputChange}
                    />
                  </div>
                </div>
              )}
              <label className="form-label">
                OR
              </label>
              <div className="text-center mt-2">
                <button type="button" className="btn btn-secondary mb-2" onClick={this.toggleCanvas}>
                  {showCanvas ? 'Choose File' : 'Draw Image'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

}

export default App;
