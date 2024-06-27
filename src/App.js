import React, { useState, useEffect } from 'react';

function App() {
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [filesBase64, setFilesBase64] = useState([]);
  const [resultsReady, setResultsReady] = useState(false);
  const [tag, setTag] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [analyzeStatus, setAnalyzeStatus] = useState(false);
  const [userPrompt, setUserPrompt] = useState('Provide a detailed description of the scene. Refrain from using introductory phrases and focus solely on describing the elements within the scene.')
  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  useEffect(() => {
    if (analysisResults.length === 0) {
      setResultsReady(false);
    } else {
      setResultsReady(true);
    }
  }, [analysisResults]); 

  const handleAnalyze = async () => {
    const results = [];
    const b64 = [];
    const fname = []
    //setResultsReady(false);
    setAnalyzeStatus(true);
    setSaveStatus('')
    for (let file of files) {
      
      const base64 = await toBase64(file);
      const result = await window.api.analyzeImage(base64, userPrompt);
      results.push(result);
      b64.push(base64);
      fname.push(file.name);
    }
    setFileNames(fname)
    setFilesBase64(b64);
    setAnalysisResults(results);
    setAnalyzeStatus(false);
    //setResultsReady(true)
  };

  const saveCaptions = async () => {
    //var index = 0;

    for (let i = 0; i < analysisResults.length; i++) {
      //const base64 = await toBase64(file);
      const caption = await analysisResults[i].message.content
      const filename = fileNames[i]
      console.log(caption)
      //const a = {caption, filename, tag};
      const write_status = await window.api.saveCaption(caption, filename, tag);
      setSaveStatus(write_status);
      //setFilesBase64([...filesBase64, base64]);
      //const result = await window.api.analyzeImage(base64);
    }
    setSaveStatus('Captions saved.');
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });



  return (
    <div>
      <div style={{
        textAlign: 'center'
      }}>
        <h1>GPT-4o Auto Image Captioner for LoRA training of Diffusion Models</h1>
        <h2>Upload Images for Captioning</h2>
        <input type="file" multiple onChange={handleFileChange} />
        <button onClick={handleAnalyze}>Analyze</button><br/><br/><br/>  
        <label for="tag" >Adapter Name/Trigger Word:</label><br/>
        <input type="text" id="tag" name="fname" value={tag} onChange={e => setTag(e.target.value)}/><br/><br/>
        <label for="prompt" >Captioning Prompt:</label><br/>
        <textarea type="text" id="prompt" name="iprompt" value={userPrompt} 
          style={{padding: '12px 20px', width: '25%', height: '80px'}}
         onChange={e => setUserPrompt(e.target.value)}/><br/>
        {/* <label for="tag">File Prefix:</label><br/>
        <input type="text" id="prefix" name="fpfix"/><br/><br/> */}
        <p>
          {analyzeStatus ? 'Analyzing...':''}
        </p>
        <button onClick={saveCaptions} style={{
          display: resultsReady ? 'inline': 'none',
        }}>
          Save Captions
        </button><br/>
        <p>
          {saveStatus}
        </p><br/><br/>
      </div>
      
      <div style={{
        wordWrap: 'break-word',
      }}>
        {analysisResults.map((result, index) => (
          <div key={index}>
            <h3>Image {index + 1}</h3>
            {/* <pre>{JSON.stringify(result, null, 2)}</pre> */}
            <img src={`data:image/jpeg;base64,${filesBase64[index]}`}
            style={{
              display: resultsReady ? 'inline': 'none',
            }}/>
            <div 
              style={{
                width: '50%',
              }}
            >
              <p >
                {result.message.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;