import './App.css';
import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

function App() {
	const [model, setModel] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [imageURL, setImageURL] = useState(null);
	const [results, setResults] = useState([]);
	const [history, setHistory] = useState([]);

	const imageRef = useRef();
	const textInputRef = useRef();
	const fileInputRef = useRef();

	const loadModel = async() => {
		setIsLoading(true);
		try {
			const model = await mobilenet.load();
			setModel(model);
			setIsLoading(false);
		}
		catch(err) {
			console.log(err.message);
			setIsLoading(false);
		}
	}

	const uploadImage = (event) => {
		const { files } = event.target;
		console.log(files);
		console.log(files[0]);
		if (files.length > 0) {
			const url = URL.createObjectURL(files[0]);
			setImageURL(url);
		}
		else {
			setImageURL(null);
		}
	}

	const handleProcess = async() => {
		textInputRef.current.value = '';
		const answer = await model.classify(imageRef.current);
		setResults(answer);
	}

	const handleOnChange = (event) => {
		setImageURL(event.target.value);
	}

	const triggeredUpload = () => {
		fileInputRef.current.click();
	}

	useEffect(() => {
		loadModel();
	}, []);

	useEffect(() => {
		if(imageURL){
			setHistory([imageURL, ...history]);
		}
	}, [imageURL]);

	// if(isLoading) {
	// 	return <h2>Model Loading...</h2>
	// }


	return (
		<div className="App">
			<h1 className='header'>HELLO ANH EM</h1>
			<div className='inputHolder'>
				<input className='uploadInput' 
					type='file' accept='image/*' 
					capture='camera' 
					onChange={uploadImage}
					ref={fileInputRef}
				/>
				<button className='uploadImage' onClick={triggeredUpload}>Upload Image</button>
				<span className='or'>OR</span>
				<input type="text" placeholder='Paster image URL' ref={textInputRef} onChange={handleOnChange} />

			</div>
			<div className='mainWrapper'>
				<div className='mainContent'>
					<div className='imageHolder'>
						{imageURL && <img src={imageURL} alt='Upload Preview' crossOrigin='anonymous' height={400} width={700} ref={imageRef}></img>}
					</div>
					{results.length > 0 && <div className='resultsHolder'>
                        {results.map((result, index) => {
                            return (
                                <div className='result' key={result.className}>
                                    <span className='name'>{result.className}</span>
                                    <span className='confidence'>Confidence level: {(result.probability * 100).toFixed(2)}% {index === 0 && <span className='bestGuess'>Best Guess</span>}</span>
                                </div>
                            )
                        })}
                    </div>}
				</div>
				{imageURL && <button className='button' onClick={handleProcess}>Process</button>}
			</div>

			<div className='recentPredictions'>
				<h2>Recent Images</h2>
				<div className='recentImages'>
					{history.map((item, index) => {
						return (
							<div className='recentPrediction' key={index}>
								<img src={item} alt=''></img>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	);
}

export default App;
