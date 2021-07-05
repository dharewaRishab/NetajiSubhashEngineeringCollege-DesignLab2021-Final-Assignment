/*var mongoose = require('mongoose');

const URI = "mongodb+srv://rishab:dharewa123@cluster0.fwhe1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"



const connectDB = async()=> {
     await mongoose.connect(URI,{ 
         useUnifiedTopology : true , 
         useNewUrlParser: true 
        });

     console.log('db connected...');
}

module.exports = connectDB;
*/

var mysql=require('mysql');

var connection=mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'',
   database:'user'
});

connection.connect(function(error){
   if(!!error){
     console.log(error);
   }else{
     console.log('Connected!:)');
   }
 });  
 
module.exports = connection;
 



