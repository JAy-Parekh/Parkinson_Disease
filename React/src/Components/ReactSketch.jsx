import * as React from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import axios from 'axios';
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "0.0625rem solid #9c9c9c",
        borderRadius: "0.25rem",
        padding: "1rem",
        marginBottom: "2rem",
    },
    canvas: {
        marginBottom: "1rem",
    },
    button: {
        backgroundColor: "#4CAF50",
        border: "none",
        color: "white",
        padding: "0.5rem",
        borderRadius: "0.25rem",
        cursor: "pointer",
    },
};

const Canvas = class extends React.Component {
    state = {
        file: null,
        base64URL: "",
        showCanvas: false,
        prediction: "" // added state for toggle button
    };

    constructor(props) {
        super(props);

        this.canvas = React.createRef();
    }




    render() {
        return (
            <div>
                <h2>{this.state.prediction}</h2>
                <div style={styles.container}>

                    <label htmlFor="fileUpload" className="form-label">

                        Draw Spiral here
                    </label>
                    <ReactSketchCanvas
                        style={styles.canvas}
                        width={600}
                        height={250}
                        ref={this.canvas}
                        strokeWidth={5}
                        strokeColor="black"
                    />
                    <button
                        style={styles.button}
                        onClick={() => {
                            this.canvas.current
                                .exportImage("png")
                                .then(data => {
                                    // console.log(data);

                                    var arr = data.split(','),
                                        mime = arr[0].match(/:(.*?);/)[1],
                                        bstr = atob(arr[1]),
                                        n = bstr.length,
                                        u8arr = new Uint8Array(n);

                                    while (n--) {
                                        u8arr[n] = bstr.charCodeAt(n);
                                    }

                                    data = new File([u8arr], "2", { type: mime })

                                    const formData = new FormData();
                                    formData.append('imagefile', data);
                                    axios.post('http://127.0.0.1:5000/predict', formData)
                                        .then(response => {
                                            console.log(response.data.result);
                                            this.setState({
                                                prediction: response.data.result
                                            });
                                        })
                                        .catch(error => {
                                            console.log(error);
                                        });
                                })
                                .catch(e => {
                                    console.log(e);
                                });
                        }}
                    >
                        Upload Image
                    </button>
                </div>
            </div>
        );
    }
};

export default Canvas;