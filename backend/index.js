const express= require('express')
const {google}=require('googleapis')
const cors = require('cors')
const app =express()
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const credentials = require('path to credential file');
app.use(cors(
  {
   // origin: ["http://localhost:3002"],
      origin: ["https://asteropen.vercel.app"],
    methods:["POST","GET"],
    credentials:true
  }
))

// to test server
app.get("/", (req,res) =>{
  res.json("Hello");
})



  app.post('/api', async (req, res) => {
    const  {text}  = req.body;
    try{
      const auth= new google.auth.GoogleAuth({
        
        credentials:credentials,
        scopes:["https://www.googleapis.com/auth/drive"]
 
      });

      const drive=google.drive({
       version:'v3',
       auth
      })
       
        drive.files.list({

          q: "name = '" + `${text}` + "' and '{path of google drive folder}' in parents", 
          fields: "files(id, name, mimeType, modifiedTime)"

        })
        .then(response => {
          const files = response.data.files;

          if(files.length>0)
          {
            const folder = files[0];
            const fileId=folder['id']
            console.log(fileId); 

            drive.files.export({
              fileId: fileId,
              mimeType: 'text/html' 
             })
            .then(response => {
              console.log(response.data);
              res.json(response.data)
            })
          }
          else
          {
            res.json("There's no file")
          }

        })
    }
    catch(error)
    {
        console.log(error)

    }

})

app.listen(3004, () =>{

console.log('App is lestening on port 3004')

})
