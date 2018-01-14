var express = require("express")
    app     = express();

app.use('/',express.static('./public'));

 app.get("/",function (req,res) {

      res.render("landing.ejs");
  });

  app.listen(process.env.PORT || 4000,function () {
      console.log("Server Started !")
  })


