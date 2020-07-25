const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");
  const request = require('request');
    var unirest = require("unirest");

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

 app.get("/",function(req,res){
   res.render("home");

 });
 app.post("/",function(req,res){
   res.redirect("home");
 })
 app.get("/about",function(req,res){
   res.render("About_Me");
 })
 app.post("/about",function(req,res){
   res.redirect("/about");
 })
 app.get("/skills",function(req,res){
   res.render("skills");
 });
 app.post("/skills",function(req,res){
   res.redirect("skills");
 });
 app.get("/contact",function(req,res){

   res.render("contact");
 });
 app.post("/contact",function(req,res){
   const name=req.body.name;
   const email=req.body.email;
const data={
  members:[
    {
      email_address:email,
      status: "subscribed",
      merge_fields: {
        FNAME:name
      }
    }
  ]
};
const jsonData=JSON.stringify(data);
const url="https://us17.api.mailchimp.com/3.0/lists/5f5060024d";
const options={
    method:"POST",
    auth:"arvind:3f62571eaba8291a3acc868b99e50c85-us17"
}
const request=https.request(url,options,function(response){
  if(response.statusCode === 200){
    res.render("success");
  }else{
    res.rediretc("contact");
  }
   response.on("data",function(data){
     console.log(JSON.parse(data));
   })
})
request.write(jsonData);
request.end();

   //3f62571eaba8291a3acc868b99e50c85-us17
   //5f5060024d
   res.redirect("contact");

 });
 app.get("/weather",function(req,res){
   res.render("weather");
 });

app.post("/weather",function(req,res){
 var query=req.body.city;
  const url="https://api.openweathermap.org/data/2.5/weather?q="+ query +"&units=metric&appid=1e0d0b162511ebc5335511e184d2bb65";
  https.get(url,function(response){
    console.log(response.statusCode);

    response.on("data",function(data){
      const parse=JSON.parse(data);
      const temp=parse.main.temp;
      const weatherCondition=parse.weather[0].description;
      const image=parse.weather[0].icon;
      const imageUrl="http://openweathermap.org/img/wn/"+image +"@4x.png"
       res.render("weatherData",{temp:temp,weatherCondition:weatherCondition,image:image,query:query,imageUrl:imageUrl});
    })

  });
});
app.get("/movie",function(req,res){
  res.render("search");
})
app.get("/results",function(req,res){

  var movie=req.query.movie;
  const url="https://www.omdbapi.com/?apikey=f00fb3c7&s=" + movie;


  request(url,function(error, response, body)  {
    if (!error && response.statusCode == 200){
       var data =JSON.parse(body);
      res.render("results",{data:data});
    }

  });
});
app.get("/covid",function(req,res){


  var req = unirest("GET", "https://covid-19-data.p.rapidapi.com/country");

  req.query({
  	"format": "json",
  	"name": "india"
  });
  req.headers({
  	"x-rapidapi-host": "covid-19-data.p.rapidapi.com",
  	"x-rapidapi-key": "38e419b03dmsh57ac5742f0544dfp12f085jsn1e2c5937163c",
  	"useQueryString": true
  });


req.end(function (response) {
	if (res.error) throw new Error(response.error);

var result= response.body
var u =JSON.result;
res.render("covid",{result:result})
});
})







 app.listen(3000,function(){
   console.log("Server has Started!!!!!!!!!!!!!!!!!!!!");
 });
