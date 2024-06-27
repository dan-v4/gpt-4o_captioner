# gpt-4o_captioner
Electron + ReactJS app utilizing OpenAI GPT-4o model for image captioning

## Running The App
1. First create a `.env` file. In this file, include your OPEN_API_KEY, PROJECT_ID, and ORGANIZATION_ID.  
In your `.env` file located at the same level as `main.js`:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OPEN_API_KEY=YOUR_API_KEY  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PROJECT_ID=YOUR_PROJECT_ID_KEY  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ORGANIZATION_ID=YOUR_ORG_ID  
2. Start the Electron app by running `npm start` in a terminal.
3. In the app, upload the images and click "Analyze".
4. After all the images have been captioned, a "Save Captions" button will appear. When clicked, it will save all the captions under the `captions/` folder. Note that the text files will have the same name as the image name. 