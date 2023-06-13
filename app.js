const express = require("express");
const bodyParser = require("body-parser");
const request = require("request"); 
const https = require("https");
const { dirname } = require("path");

const app= express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res)
{
res.sendFile(__dirname+"/signup.html");
})
app.post("/",function(req,res){

    const firstname=req.body.firstname;
    const secondname = req.body.secondname;
    const email = req.body.email;

    var data = 
    {

        members: 
        [
            {
                email_address:email,
                status :"subscribed",
                merge_fields : 
                {
                    FNAME : firstname,
                    LNAME : secondname
                }
            }



        ]
    };

    const jsonData =  JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/7b806bc230";

    const options ={
        method : "POST",
        auth :  "aash:8bad4e53facbab42c3fd4d960ba12b11-us14"
    }

    const request = https.request(url , options , function(resposne){
           
        if(resposne.statusCode  === 200){
            res.sendFile(__dirname+"/succes.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        
        
        resposne.on("data",function(data){
                console.log(JSON.parse(data));
            });
    });
   
        request.write(jsonData); ///comment this line to check failure page.
        request.end();


});
app.post("/failure",function(req,res){
    res.redirect("/");
});


app.listen(process.env.PORT||3000,function()
{
    console.log("The server is running at port 3000");
})


//api key
//8bad4e53facbab42c3fd4d960ba12b11-us14
//7b806bc230