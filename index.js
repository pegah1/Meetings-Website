var config = require('./package.json').config;
var flyTemplate = require('fly-template');
var querystring = require('querystring');
var fs = require('node-fs')
var hapi = require('hapi');
var path = require('path');
var crypto = require('crypto');
var pg = require('pg');
var async = require('async');
var nodemailer = require("nodemailer");
var CONNECTION_STRING = 'postgres://' + config.database.username + ':' + config.database.password
  + '@' + config.database.host + ':' + config.database.port + '/' + config.database.dbname;

var webServer = new hapi.Server();
var apiServer = new hapi.Server();

webServer.connection({
	host: config.webserver.host,
	port: config.webserver.port
});

apiServer.connection({
	host: config.apiserver.host,
	port: config.apiserver.port,
  routes: {
    cors: true
  }
});

var generateHash = function (bytes, callback) {

   return crypto.randomBytes(bytes, function (err, buffer) {
   if (err) {
   return callback(err);
   }

   return callback(null, buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_'));
   });
};

var sendMail = function (to, subject, text, html, callback) {
    
          /*https://console.developers.google.com/ --> for create project and get client secret and clientID
          http://masashi-k.blogspot.fr/2013/06/sending-mail-with-gmail-using-xoauth2.html -->
          use clientID and client secret to get refresh key then use email*/
       
         var options = {
         from: 'ptorkamandi@gmail.com',
         to: to,
         subject: subject,
         text: text,
         html: html
         };
        
         var smtp ={
           port: 465,
           host: 'smtp.gmail.com',
           secure: true,
           auth: {
             user: 'pegah torkamandi',
             pass: '123456789'
           },
           ignoreTLS: false,
           connectionTimeout: 5000,
           greetingTimeout: 5000,
           socketTimeout: 5000
           };

          var generator = require('xoauth2').createXOAuth2Generator({
             user: 'ptorkamandi@gmail.com',
             clientId: '437841355045-71n6dkt5dre7ve54ggc0upr8e9faccse.apps.googleusercontent.com',
             clientSecret: 'AdSlA-CT2tUg-7AUeswmb8pU',
             //accessUrl: 'https://mail.google.com/',
             refreshToken: '1/z9x_QSRxQQZJ4Ter-fCKAm-or3vcGGK-3EnCX7e1XAtIgOrJDtdun6zK6XiATCKT'
          });

          generator.on('token', function (token) {
          });

          smtpConfig = {
             service: 'gmail',
             auth: {
             xoauth2: generator
             }
          }
         

         var transporter = nodemailer.createTransport(smtpConfig);
         return transporter.sendMail(options, function (err, info) {
         if (err) {
         return callback(err);
         }
          
         return callback(null, info.response);
         });
      };

      
var sendMailTemplate = function (to, subject, text, html, options, callback) {
   var render = flyTemplate(html);
   var render1 = flyTemplate(text);
   render(options);
   render1(options);
  
   return sendMail(to, subject, render1(options), render(options), function(err,result){
          if(err){
          return callback(err);
          }
          
           return callback(null,result.response);
       });
   
};

      
var sendMailTemplateFile = function (to, subject, textTemplateFile, htmlTemplateFile, options, callback) {

   return fs.readFile(textTemplateFile, 'utf8', function (err, text) {
   if (err) {
   return callback(err);
   }
   
   return fs.readFile(htmlTemplateFile, 'utf8', function (err, html) {
     if (err) {
     return callback(err);
     }
    var result;
    for(var i=0; i<to.length; i++){
     if(options.length === 1){
     
        sendMailTemplate(to[i], subject, text.toString(), html.toString(), options[0], function(err,result){
       
        if(err){
          return callback(err);
        }
       
       
       });
     
     }
     else{
       sendMailTemplate(to[i], subject, text.toString(), html.toString(), options[i], function(err,result){
       
        if(err){
          return callback(err);
        }
       
       
       });
     }
     console.log(i);
     
     }
    return callback(result);
      
   });
  });
 
};

//delete comment
apiServer.route({
  method: 'POST',
  path: '/delete/comment',
  handler: function (request, reply) {
    console.log("yees");
    var time = request.payload.time;
    var email = request.payload.email;
    var poll = request.payload.poll;
    var caller = request.payload.caller;
    
   
    var query = 'delete from "comment" where pollid = ' + "'" + parseInt(poll) + "'" + ' and  email = ' + "'" + email + "'" +
    ' and time = ' + "'" + time + "'" + ';';
      
console.log(query);      
      return pg.connect(CONNECTION_STRING, function (err, client, done) {
        if (err) {
            var response = reply('database connection failed');
            return response.statusCode = 500;
        }
       
        return client.query(query, function (err,result) {
        done();
          if (err) {
            return console.log('[Err]',err);
          }
          
          return reply("OK");
          
      });
    });
    
  }
});

//add comment
apiServer.route({
  method: 'POST',
  path: '/insert/comment',
  handler: function (request, reply) {
    var time = request.payload.time;
    var email = request.payload.email;
    var pm = request.payload.pm;
    var pollid = request.payload.pollid;
    var name = request.payload.name;
    var caller = request.payload.caller;
    var pollname = request.payload.pollname;
    var caller_name = request.payload.caller_name;
    var group_count = request.payload.group_count;
    var most_date = request.payload.most_date;
    
    var query = 'insert into "comment" (time, email, name, pm, pollid) values(' +
        "'" + time + "','" + email + "','" + name +"','"+ pm + "','" + pollid + "');";
        
      return pg.connect(CONNECTION_STRING, function (err, client, done) {
        if (err) {
            var response = reply('database connection failed');
            return response.statusCode = 500;
        }
       
        return client.query(query, function (err,result) {
          done();
          if (err) {
            return console.log('[Err]',err);
          }
          var options=[];
          var invite=[];
          subject = "MEETING: "+pollname;
          text = 'static/text.txt';
          html = 'static/email_comment_poll.html';        
          options[0]={"caller_name":caller_name, "name":name, "msg":pm, "pollname":pollname,
          "pollID":pollid, "caller":caller, "group_count":group_count, "date":most_date, "email":email};
          invite[0]= caller;
          return sendMailTemplateFile(invite, subject, text, html, options, function(err,result){
              if(err){
                return console.log('[Err]',err);
                  
              }
          
              return reply("OK");
          });
        });
      });
  }
});

//delete participate
apiServer.route({
  method: 'POST',
  path: '/delete/participate',
  handler: function (request, reply) {
    console.log("yees");
    
    var email = request.payload.email;
    var poll = request.payload.poll;
    var guests = request.payload.guests;
    console.log(guests);
    if(guests[0] !== 'empty') var _guests = '{' + guests.join(',') + '}';
    if(guests[0] === 'empty') {
      guests=[];
      var _guests = '{' + guests + '}';
    }
    var query = 'delete from "participatePoll" where poll = ' + "'" + parseInt(poll) + "'" + ' and  email = ' + "'" + email + "'" +';';
    var query1 = 'delete from "comment" where pollid = ' + "'" + parseInt(poll) + "'" + ' and  email = ' + "'" + email + "'" +';';
    var query2 = 'update "poll" set guests = '+"'"+_guests+"'"+' where id = '+"'"+poll+"'"+';';
    
    var queries =[query, query1, query2];
    return pg.connect(CONNECTION_STRING, function (err, client, done) {
    
        if (err) {
            var response = reply('database connection failed');
            return response.statusCode = 500;
        }
        
        return async.eachSeries(queries, function (item, callback) {
        return client.query(item, callback);
        }, function (err) {
        done();
        if (err) {
          return console.log('[ERR]', err);
        }
        
        return reply("OK");
      });
  });
    
  }
});
//show poll

var showPoll = function(pollID,email,callback){
  
  var query,flag,caller;
  flag = false;
  caller = false;
  var _response = [];
  var caller_flag=false;
  return pg.connect(CONNECTION_STRING, function (err, client, done) {
      if (err) {
          var response = reply('database connection failed');
          return response.statusCode = 500;
      }
      query = 'select * from "poll" where id = '+"'"+ pollID +"'"+';'
      return client.query(query, function (err,result) {
          
        if (err || (result.rows.length === 0)) {
          
          return console.log('[ERR]', err);
        }
        if(result.rows[0]["caller"] === email){
          caller = true;
        }
        
        _response.push(result.rows);
        
        query = 'select * from "participatePoll" where poll = '+"'"+ pollID +"'"+';'
        
        return client.query(query, function (err,result) {
          
          if (err || (result.rows.length === 0)) {
            
            return console.log('[ERR]', err);
          }
          
          _response.push(result.rows);
           
          for(var i =0; i<result.rows.length; i++){
            if(result.rows[i]["email"] === email){
              flag = true;
            }
          }
          
          if(flag === false){
            

            var participate_date =[];
            var length = _response[0][0]["dates"].length;
            for(var i=0; i<length; i++){
              participate_date[i] = false;
            }
            var participate_date_flag = '{' + participate_date.join(',') + '}';
            var _participate_date = '{' + _response[0][0]["dates"].join(',') + '}';
            
            var name = "Name";
            query = 'insert into "participatePoll" (caller, poll, email, name, dates, dates_flag) values(' +
            "'" + false + "','" + pollID + "','" + email + "','" + name +"','" + _participate_date +"','" + participate_date_flag +"');";
        
            return client.query(query, function (err,result) {
              
              if (err) {
               
                return console.log('[ERR]', err);
              }
              done();
              
              _response[1].push({"caller":caller_flag, "poll":pollID, "email":email, "name":"", "dates":_response[0][0]["dates"], "dates_flag":participate_date});
             
              return callback(null, _response);
        });
        }
        if(flag === true){
            done();
             return callback(null, _response);
        }
      });
  });

});


};
//delete poll by caller
apiServer.route({
  method: 'POST',
  path: '/user/delete/poll',
  handler: function (request, reply) {
    var id = request.payload.id;
    
    var query = 'delete from "poll" where id = '+"'"+ id +"'"+';'
    var query1 = 'delete from "participatePoll" where poll = '+"'"+ id +"'"+';'
    var query2 = 'delete from "comment" where pollid = '+"'"+ id +"'"+';'
    
    var queries =[query, query1, query2];
    return pg.connect(CONNECTION_STRING, function (err, client, done) {
    
        if (err) {
            var response = reply('database connection failed');
            return response.statusCode = 500;
        }
        
        return async.eachSeries(queries, function (item, callback) {
        return client.query(item, callback);
        }, function (err) {
        done();
        if (err) {
          return console.log('[ERR]', err);
        }
        
        return reply("OK");
      });
  });

}
});

//schedul poll with participate
apiServer.route({
  method: 'POST',
  path: '/schedul/poll',
  handler: function (request, reply) {
   
    var dates = request.payload.dates;
    var _dates = '{' + dates.join(',') + '}';
    var caller_email = request.payload.caller_email;
    var caller_name = request.payload.caller_name;
    var pollid = request.payload.poll;
    var name = request.payload.name;
    var pollname = request.payload.pollname;
    var group_count = request.payload.group_count;
    var most_date = request.payload.most_date;
    
    var options={"caller":request.payload.caller, "poll":pollid, "email":request.payload.email,
    "name":name, "dates":_dates};
    
    var query = 'update "participatePoll" set name = '+"'"+ options["name"] +"'"+', dates_flag = '+"'"+options["dates"]+"'"+' where caller = '+"'"+ options["caller"] +
    "'"+'and poll = '+"'"+ options["poll"]+"'"+' and email='+"'"+options["email"]+"'"+';'
    return pg.connect(CONNECTION_STRING, function (err, client, done) {
        if (err) {
            var response = reply('database connection failed');
            return response.statusCode = 500;
        }
        
          return client.query(query, function (err,result) {
            
            if (err) {
             
              return console.log('[ERR]', err);
            }
            done();
            var options=[];
            var invite=[];
            subject = "MEETING: "+pollname;
            text = 'static/text.txt';
            html = 'static/email_editpoll.html';        
            options[0]={"caller_name":caller_name, "name":name, "pollname":pollname,
            "pollID":pollid, "caller":caller_email, "group_count":group_count, "date":most_date,
            "email":options["email"]};
            invite[0]= caller_email;
            return sendMailTemplateFile(invite, subject, text, html, options, function(err,result){
                if(err){
                  return console.log('[Err]',err);
                    
                }
            
                return reply("OK");
            });
          });
    });  
  }
});

//editpoll information
apiServer.route({
  method: 'POST',
  path: '/user/edit/poll/information',
  handler: function (request, reply) {
  
    var pollid = request.payload.pollid;
    var caller = request.payload.caller;
    var title = request.payload.title;
    var location = request.payload.location;
    var description = request.payload.description;
    var caller_name = request.payload.caller_name;
    var change_date = request.payload.change_date;
    var change_invite = request.payload.change_invite;
    console.log(change_date);
    console.log(change_invite);
    
    var dates = request.payload.dates;
    var _dates = '{' + dates.join(',') + '}';
    var guests = request.payload.guests;
    var _guests = '{' + guests.join(',') + '}';
  
    var query = 'update "poll" set title = '+"'"+ title +"'"+', _location = '+ "'" + location + "'" +
    ', description = ' + "'" + description + "'" + ', dates =' + "'" + _dates + "'" + ', guests =' +
    "'" + _guests+"'" + 'where id = ' + "'" + pollid + "'" + ';'
    console.log("yees");
    return pg.connect(CONNECTION_STRING, function (err, client, done) {
      if (err) {
          var response = reply('database connection failed');
          return response.statusCode = 500;
      }
      
      return client.query(query, function (err,result) {
          
        if (err) {
          return console.log('[ERR]', err);
        }
        console.log(change_date);
        if(change_date === 'true'){
          console.log("yees");
          var guestinfo = request.payload.guestinfo;
          console.log(guestinfo);
          
          var queries=[];
          for(var i=0; i<guestinfo.length; i++){
          
            var dates_change = '{' + guestinfo[i]["dates_flag"].join(',') + '}';
            console.log(dates_change);
            
            queries.push('update "participatePoll" set dates = '+"'"+ _dates +"'"+', dates_flag = '+ "'" + dates_change +"'"+
            'where poll = ' + "'" + pollid + "'" + ' and caller = ' + "'" + guestinfo[i]["caller"] + "'" + ' and email = ' +
            "'" + guestinfo[i]["email"] + "'" + ';');
            
            
          }
           
           
           return async.eachSeries(queries, function (item, callback) {
                return client.query(item, callback);
              }, function (err) {
                
                if (err) {
                  return console.log('[ERR]', err);
                }
                console.log(change_invite);
                
                if(change_invite === 'true'){
                  console.log("yeees");
                  var add_participate = request.payload.add_participate;
                  console.log(add_participate);
                  var options=[];
                  for(var i=0; i<add_participate.length; i++){  
                  
                  options[i]={"caller":caller_name,"guest":add_participate[i],"pollName":title, "pollID":pollid };
                  }
                  var subject = "MEETING";
                  var text = 'static/text.txt';
                  var html = 'static/email_participate_poll.html';
                  
                  return sendMailTemplateFile(add_participate, subject, text, html, options, function(err,result){
                    if(err){
                      var response = reply('occuring Error.');
                      return response.statusCode = 500;
                    }
                    console.log("mail");
                    done();
                    return reply("OK"); 
                
                    
                  });
        
                }
                done();
                return reply("OK"); 
                
              });
             
        }
        if(change_invite === 'true'){
                  console.log("yeees");
                  var add_participate = request.payload.add_participate;
                  console.log(add_participate);
                  var options=[];
                  for(var i=0; i<add_participate.length; i++){  
                  
                  options[i]={"caller":caller_name,"guest":add_participate[i],"pollName":title, "pollID":pollid };
                  }
                  var subject = "MEETING";
                  var text = 'static/text.txt';
                  var html = 'static/email_participate_poll.html';
                  
                  return sendMailTemplateFile(add_participate, subject, text, html, options, function(err,result){
                    if(err){
                      var response = reply('occuring Error.');
                      return response.statusCode = 500;
                    }
                    console.log("mail");
                    done();
                  return reply("OK"); 
                  });
                  
                }
                
             done();
                  return reply("OK");    
        
      });
    });
  }
});



//create poll by admin
apiServer.route({
  method: 'POST',
  path: '/user/createPoll',
  handler: function(request, reply){
    var cod = request.payload.cod;
    var email = request.payload.email;
    var name = request.payload.name;
    var title = request.payload.tiltle;
    var location = request.payload.location;
    var description = request.payload.description;
    var invite = request.payload.invite;
    var dates = request.payload.dates;
    
    
    var caller_date = []
    for(var i=0; i<dates.length; i++){
      caller_date[i] = false;
    }
    console.log(caller_date);
    
    var _dates = '{' + dates.join(',') + '}';
    var _invite = '{' + invite.join(',') + '}';
    var _participate_date = '{' + caller_date.join(',') + '}';
    
   var options=[];
    var subject, text, html, query, pollID;
    return pg.connect(CONNECTION_STRING, function (err, client, done) {
      if (err) {
          var response = reply('database connection failed');
          return response.statusCode = 500;
      }
       
           query = 'select * from "user_id" where email = '+"'"+ email +"'"+';'
        return client.query(query, function (err,result) {
          
          if (err || (result.rows.length === 0) || (result.rows[0]["cod"] !== cod)) {
          
            return console.log('[ERR]', err);
          }
          
          
          query = 'insert into "poll" (caller, title, _location, description, dates, guests) values(' +
          "'" + email + "','" + title + "','" + location + "','" + description + "','" + _dates + "', '" + _invite +"');";
          
        console.log("done query");
        return client.query(query, function (err,result) {
          
            if (err) {
              
              return console.log('[ERR]', err);
            }
            query = 'select max(id) from "poll";';
            return client.query(query, function (err,result) {
            
                if (err) {
                  
                  return console.log('[ERR]', err);
                }
                
                pollID = parseInt(result.rows[0]["max"]);
                console.log(pollID);
                subject = "MEETING";
                text = 'static/text.txt';
                html = 'static/email_participate_poll.html';
                
                for(var i=0; i<invite.length; i++){  
                  
                  options[i]={"caller":name,"guest":invite[i],"pollName":title, "pollID":pollID };
                  }
                  
                  return sendMailTemplateFile(invite, subject, text, html, options, function(err,result){
                        if(err){

                          var query1='delete from "poll" where id = "' + pollID + '";';
                          return client.query(query1, function (err,result) {
                              done();
                              if (err) {
                                
                                return console.log('[ERR]', err);
                              }
                              
                               var response = reply('occuring Error.');
                              return response.statusCode = 500;
                          });
                      }
                     
                   
             console.log("send e-mail");
              query = 'insert into "participatePoll" (caller, poll, email, name, dates, dates_flag) values(' +
              "'" + true + "','" + pollID + "','" + email + "', '" + name +"','"+_dates+"','"+_participate_date+"');";
              return client.query(query, function (err,result) {
                done();
                if (err) {
                              
                  return console.log('[ERR]', err);
                }
                var _response = {"pollID":pollID};
                return reply(_response);
                
              });
              
             });
            });
        });
       
    });
    });
  }
});

//show current poll 
apiServer.route({
  method: 'POST',
  path: '/user/showPoll',
  handler: function(request, reply){
    var pollID = request.payload.pollID;
    var email = request.payload.email;
    var cod = request.payload.cod;
    
    return pg.connect(CONNECTION_STRING, function (err, client, done) {
      if (err) {
          var response = reply('database connection failed');
          return response.statusCode = 500;
      }
       
        var query = 'select * from "user_id" where email = '+"'"+ email +"'"+';'
        return client.query(query, function (err,result) {
          
          if (err || (result.rows.length === 0) || (result.rows[0]["cod"] !== cod)) {
          
            return console.log('[ERR]', err);
          }
          done();
          
          return showPoll(parseInt(pollID), email, function(err,result){
                    if(err){
                      return console.log('[ERR]', err);
                    }
                   
             
                    console.log(result);
                    return reply("OK");
                });
    
    });
    });
  }
});



//change the password by user
apiServer.route({
  method: 'POST',
  path: '/user/changepass',
  handler: function (request, reply) {
  
    var email = request.payload.email;
    var oldpass = request.payload.oldpass;
    var newpass = request.payload.newpass;
    var cod = request.payload.cod;
    
    var query = 'select * from "user_id" where email = '+"'"+ email +"'"+';'
    var query1 = 'select * from "user" where email = '+"'"+ email +"'"+';'
    var query2 = 'update "user" set password = '+"'"+ newpass +"'"+' where email = '+"'"+ email +"'"+';'
    
    return pg.connect(CONNECTION_STRING, function (err, client, done) {
      if (err) {
          var response = reply('database connection failed');
          return response.statusCode = 500;
      }
      
        return client.query(query, function (err,result) {
          
          if (err || (result.rows.length === 0) || (result.rows[0]["cod"] !== cod)) {
          
            return console.log('[ERR]', err);
          }
          
          return client.query(query1, function (err,result) {
            
          if (err || (result.rows.length===0)) {
          
            return console.log('[ERR]', err);
          }
          
          if(result.rows[0]["password"] !== oldpass){
            var response = reply('The old password is not correct.');
            return response.statusCode = 500;
          }
          return client.query(query2, function (err,result) {
          done();
          if (err) {
          
           return console.log('[ERR]', err);
          }
          
          return reply("OK");
          });
          
           
         
        });
       
    });
    });
  
  
  }
});

//change username

apiServer.route({
  method: 'POST',
  path: '/user/changeUsername',
  handler: function (request, reply) {
  
    var name = request.payload.new_name;
    var email = request.payload.email;
    var cod = request.payload.cod;
    
    var query = 'select * from "user_id" where email = '+"'"+ email +"'"+';'
    var query1 = 'update "user" set username = '+"'"+ name +"'"+' where email = '+"'"+ email +"'"+';'
    
    return pg.connect(CONNECTION_STRING, function (err, client, done) {
      if (err) {
          var response = reply('database connection failed');
          return response.statusCode = 500;
      }
      
        return client.query(query, function (err,result) {
          
          if (err || (result.rows.length === 0) || (result.rows[0]["cod"] !== cod)) {
          
            return console.log('[ERR]', err);
          }
          
          return client.query(query1, function (err,result) {
            done();
          if (err) {
          
            return console.log('[ERR]', err);
          }
          
          return reply("OK");
          }); 
    });
    });
  }
});


//forgot password and change the password by user
apiServer.route({
  method: 'POST',
  path: '/user/forgotPassword/resetpass',
  handler: function (request, reply) {
  console.log("get new pass");
    var email = request.payload.email;
    var username = request.payload.username;
    var newpass = request.payload.newpass;
    return pg.connect(CONNECTION_STRING, function (err, client, done) {
        if (err) {
            var response = reply('database connection failed');
            return response.statusCode = 500;
        }
      var query1 = 'select * from "forgotPass" where email = '+"'"+ email +"'"+';'
        
        return client.query(query1, function (err,result) {
            if (err) {
            
              var response = reply('occuring Error.');
                    return response.statusCode = 500;
            }
            
            var flag = true; //update
            if (result.rows.length === 0){
              flag =false; //insert
            }
       
              return generateHash(32,function(err,result){
                if(err){
                  var response = reply('occuring Error.');
                    return response.statusCode = 500;
                }
                
                var cod = result;
                
                var query2 = 'update "forgotPass" set cod = '+"'"+ cod +"'"+', newpass = '+"'"+newpass+"'"+' where email = '+"'"+ email +"'"+';'
                var query3 = 'insert into "forgotPass" (email, cod, newpass) values(' +
                "'" + email + "','" + cod + "','" + newpass +"');";
                if(flag === false){
                return client.query(query3, function(err,result){
                      done();
                      if(err){
                        
                       
                        var response = reply('occuring Error.');
                        return response.statusCode = 500;
                      }
                      
                      var subject = "MEETING";
                      var text = 'static/text.txt';
                      var html = 'static/email_resetpass.html';
                      var _email=[];
                      _email[0]=email;
                      var options=[];
                      options[0] = {"name":username,"cod":cod,"email":email};
                      
                      return sendMailTemplateFile(_email, subject, text, html, options, function(err,result){
                        if(err){
                         
                          var response = reply('occuring Error.');
                          return response.statusCode = 500;
                        }
                       console.log("mail the link");
                        return reply("OK"); 
                      });
                });
                }
                if(flag === true){
                
                  return client.query(query2, function(err,result){
                      done();
                      if(err){
                        
                        
                        var response = reply('occuring Error.');
                        return response.statusCode = 500;
                      }
                     
                      var subject = "MEETING";
                      var text = 'static/text.txt';
                      var html = 'static/email_resetpass.html';
                      var options=[];
                      
                      options[0]={"name":username,"cod":cod,"email":email};
                      var _email=[];
                      _email[0]=email;
                      
                      
                      return sendMailTemplateFile(_email, subject, text, html, options, function(err,result){
                        if(err){
                         
                          var response = reply('occuring Error.');
                          return response.statusCode = 500;
                        }
                        console.log("mail the link");
                        return reply("OK"); 
                      });
                });
                
                }
                
            });//generate cod
        }); //exist cod?
    
  
  });
  }
});

//click the forgot password button
apiServer.route({
  method: 'POST',
  path: '/user/forgotPassword',
  handler: function (request, reply) {
    var email = request.payload.email;
    var query = 'select * from "user" where email = '+"'"+ email +"'"+';'
    if(email === "Email"){
      var response = reply('please enter your e-mail.');
          return response.statusCode = 500;
    }
    return pg.connect(CONNECTION_STRING, function (err, client, done) {
      if (err) {
          var response = reply('database connection failed');
          return response.statusCode = 500;
      }
      
      return client.query(query, function (err,result) {
        done();
        
        if (err || (result.rows.length===0)) {
        
          var response = reply('This MEETING account does not exist.');
          return response.statusCode = 500;
        }
        
        var username=result.rows[0]["username"];
        var options = {"username": username, "email":email};
    
        return reply(options);
      });//exist user?
    });//pgconnect
    
  }
});

//click resend activation cod button
apiServer.route({
  method: 'POST',
  path: '/user/activationCod',
  handler: function (request, reply) {
    var email = request.payload.email;
    console.log(email);
    var password = request.payload.password;
    var query = 'select * from "user" where email = '+"'"+ email +"'"+';'
    
    if(email === "Email"){
      var response = reply('please enter your e-mail.');
          return response.statusCode = 500;
    }
    return pg.connect(CONNECTION_STRING, function (err, client, done) {
      if (err) {
          var response = reply('database connection failed');
          return response.statusCode = 500;
      }
      
      return client.query(query, function (err,result) {
      
        if (err || (result.rows.length===0)) {
        
          var response = reply('This MEETING account does not exist.');
          return response.statusCode = 500;
        }
        if(result.rows[0]["valid"]=== true){
        
          var response = reply('you actived your account!!!');
          return response.statusCode = 500;
        }
        var username = result.rows[0]["username"];
        
        return generateHash(32,function(err,result){
          var cod = result;
          var query1 = 'update "activeAccount" set cod = '+"'"+ cod +"'"+' where email = '+"'"+ email +"'"+';'
          return client.query(query1, function(err,result){
             done();
            if(err){
            
              var response = reply('occuring Error.');
              return response.statusCode = 500;
            }
                console.log("update");
                var subject = "MEETING";
                var text = 'static/text.txt';
                var html = 'static/email_activecod.html';
                var options=[];
                options[0]={"name":username,"cod":cod,"email":email};
                var _email=[];
                _email[0]=email;
                
                return sendMailTemplateFile(_email, subject, text, html, options, function(err,result){
                  if(err){
                   
                    var response = reply('occuring Error.');
                    return response.statusCode = 500;
                  }
                 
                  return reply("OK"); 
                });
          });
          
      });
      });
    });
    
  }
});

//show polls
apiServer.route({
  method: 'GET',
  path: '/user/{email}/{cod}/show/polls',
  handler: function(request, reply){
    console.log("yees");
    var email= request.params.email;
    var cod= request.params.cod;
    var query = 'select * from "user_id" where email='+"'"+email+"'"+';';
    var _response =[];
    return pg.connect(CONNECTION_STRING, function (err, client, done) {
      if (err) {
          var response = reply('database connection failed');
          return response.statusCode = 500;
      }
       
      return client.query(query, function (err,result) {
         
        if (err || (result.rows.length===0) || (result.rows[0]["cod"] !== cod)) {
          return console.log('[ERR]', err);
        }
        query = 'select * from "poll" where caller='+"'"+email+"'"+';';
        return client.query(query, function (err,result) {
        
          if (err) {
            return console.log('[ERR]', err);
          }
          
          _response = result.rows;
          
          query = 'select * from "poll" ;';
          return client.query(query, function (err,result) {
            done();
            if (err) {
              return console.log('[ERR]', err);
            }
            var index;
            for(var i=0; i<result.rows.length; i++){
                index = result.rows[i]["guests"].indexOf(email);
                
                if( index > 0 || index === 0){
                  _response.push(result.rows[i]);
                }
            }
            
            var query = querystring.stringify({a: JSON.stringify(_response)});
            
            return reply.redirect("http://localhost:8000/showpolls.html?"+query);
          });
        });
    });
    });
  }
});

//ignore email

apiServer.route({
  method: 'GET',
  path: '/{email}/ignore/email',
  handler: function(request, reply){
    var email= request.params.email;
    var query = 'insert into "ignorEmail" (email) values(' +"'"+ email + "'"+');';
    
    return pg.connect(CONNECTION_STRING, function (err, client, done) {
      if (err) {
          var response = reply('database connection failed');
          return response.statusCode = 500;
      }
       
      return client.query(query, function (err,result) {
          done();
        if (err) {
              
          return console.log('[ERR]', err);
        }
        console.log("yes ignore email");
        return reply.redirect('http://localhost:8000/ignore_email.html');
      });
    });
  }
  
});

//signout
apiServer.route({
  method: 'GET',
  path: '/{email}/signout',
  handler: function(request, reply){
  var email= request.params.email;
    var query = 'delete from "user_id" where email ='+"'"+ email + "'"+';';
     return pg.connect(CONNECTION_STRING, function (err, client, done) {
      if (err) {
          var response = reply('database connection failed');
          return response.statusCode = 500;
      }
       
      return client.query(query, function (err,result) {
          done();
        if (err) {
              
          return console.log('[ERR]', err);
        }
    return reply.redirect("http://localhost:8000/home.html");
    });
    });
    }
    });

//click the link in email and go to schedul
apiServer.route({
  method: 'GET',
  path: '/{email}/{pollID}/participate',
  handler: function(request, reply){
    var email= request.params.email;
    var pollID= request.params.pollID;
    var _response ={};
    
    return pg.connect(CONNECTION_STRING, function (err, client, done) {
      if (err) {
          var response = reply('database connection failed');
          return response.statusCode = 500;
      }
       
        query = 'select * from "comment" where pollid = '+"'"+ pollID +"'"+';'
        return client.query(query, function (err,result) {
              done();
              if (err) {
              
                return console.log('[ERR]', err);
              }
              
              _response["pm"] = result.rows;
              
              return showPoll(parseInt(pollID), email, function(err,result){
                  if(err){
                   
                    return console.log('[ERR]', err);
                  }
                 
                  
                 
                  _response["pollInfo"] = result[0][0];
                  _response["email"] = email;
                  _response["participateInfo"] = result[1];
                  
                  
                  var query = querystring.stringify({a: JSON.stringify(_response)});
                  
                  console.log("done show");
                  return reply.redirect("http://localhost:8000/poll.html?"+query);
              });
        });
    });
  
  }
});

//click the link in email and go to the change password page
apiServer.route({
  method: 'GET',
  path: '/user/{resetPass}/forgotPassword/resetpass',
  handler: function (request, reply) {
    
    var cod = request.params.resetPass;
    
    var query = 'select * from "forgotPass" where cod = '+"'"+ cod +"'"+';'
    return pg.connect(CONNECTION_STRING, function (err, client, done) {
      if (err) {
         console.log('database connection failed');
      }
      
      return client.query(query, function (err,result) {
        
        if (err || result.rows.length===0) {
          return result.statusCode = 500;
          }
        var email= result.rows[0]["email"];
        var newpass = result.rows[0]["newpass"];
        console.log(email);
        console.log(newpass);
       var query='delete from "forgotPass" where email = '+"'"+ email +"'"+';'
        
        return client.query(query, function (err,result) {
        
          if (err) {
            return console.log('[ERR]', err);
            }
            
          
           var query = 'update "user" set password = '+"'"+ newpass +"'"+' where email = '+"'"+ email +"'"+';'
          return client.query(query, function (err,result) {
            done();
            if (err) {
              return console.log('[ERR]', err);
              }
              
            return reply.redirect('http://localhost:8000/signin.html');
         });
       });
      });
    });
    
  }
});

//click the link in email and active account
apiServer.route({
  method: 'GET',
  path: '/user/{codActive}/active/account',
  handler: function (request, reply) {
    
    var cod = request.params.codActive;
    
    var query = 'select * from "activeAccount" where cod = '+"'"+ cod +"'"+';'
    return pg.connect(CONNECTION_STRING, function (err, client, done) {
      if (err) {
         console.log('database connection failed');
      }
      
      return client.query(query, function (err,result) {
        
        if (err || result.rows.length===0) {
          return response.statusCode = 500;
          }
          
        var email= result.rows[0]["email"];
        console.log(email);
        
          var query = 'update "user" set valid = '+"'"+ true +"'"+' where email = '+"'"+ email +"'"+';'
          return client.query(query, function (err,result) {
            done();
            if (err) {
              return response.statusCode = 500;
              }
             
            return reply.redirect('http://localhost:8000/signin.html');
         
         
        });
       
      });
    });
    
  }
});
//click the sign in button 
apiServer.route({
  method: 'POST',
  path: '/user/signin',
  handler: function (request, reply) {
    var email = request.payload.email;
    var password = request.payload.password;
    var username;
    
    var query = 'select * from "user" where email = '+"'"+ email +"'"+';'
    
        
    return pg.connect(CONNECTION_STRING, function (err, client, done) {
      if (err) {
          var response = reply('database connection failed');
          return response.statusCode = 500;
      }
      
      return client.query(query, function (err,result) {
        //done();
        if (err || (result.rows.length===0)) {
        
          var response = reply('This MEETING account does not exist.');
          return response.statusCode = 500;
        }
        if(result.rows[0]["password"] !== password){
        
        var response = reply('The password is not correct.');
          return response.statusCode = 500;
        }
        if(result.rows[0]["valid"] === false){
        
        var response = reply('Please check your e-mail and activate your MEETING account');
          return response.statusCode = 500;
        }
        
        username = result.rows[0]["username"];
        return generateHash(32,function(err,result){
          if(err){
            var response = reply('occuring Error.');
              return response.statusCode = 500;
          }
          
           var cod =result;
           var query1 = 'insert into "user_id" (email, cod) values(' +
            "'" + email + "','" + cod + "');";
            var query2 = 'update "user_id" set cod = '+"'"+ cod +"'"+' where email = '+"'"+ email +"'"+';'
            var query3 = 'select * from "user_id" where email = '+"'"+ email +"'"+';'
           
           return client.query(query3, function (err,result) {
            
              
              if (err) {
              var response = reply('occuring Error.');
              return response.statusCode = 500;
              }
              
              var flag = true; // update
              if(result.rows.length === 0){
                flag = false; //insert
              }
              
              if(flag === false){
              
                  return client.query(query1, function (err,result) {
            
                    done();
                      if (err) {
                      var response = reply('occuring Error.');
                      return response.statusCode = 500;
                      }
                      var resp={"id":cod, "username" : username, "email":email};
                      return reply(resp);
                  });
                
              }
              if(flag === true){
              
                return client.query(query2, function (err,result) {
            
                    done();
                      if (err) {
                      var response = reply('occuring Error.');
                      return response.statusCode = 500;
                      }
                      var resp={"id":cod, "username" : username, "email":email};
                      
                     
                      
                      return reply(resp);
                  });
                
              }
              
          
        });
      });
      });
    });
    
  }
});


//click the sign up button
apiServer.route({
  method: 'POST',
  path: '/user/signup',
  handler: function (request, reply) {
    var username = request.payload.username;
    var email = request.payload.email;
    var password = request.payload.password;
    var cod;
    return generateHash(32,function(err,result){
     
      if(err){
      return console.log('[ERR]', err);
      }
      cod = result;
    
      var num = false;
      
      var query = 'insert into "user" (username, email, valid, password) values(' +
        "'" + username + "','" + email + "','" + num + "','" + password + "');";
        
      return pg.connect(CONNECTION_STRING, function (err, client, done) {
        if (err) {
            var response = reply('database connection failed');
            return response.statusCode = 500;
        }
        
        return client.query(query, function (err,result) {
          if (err) {
            var response = reply('This e-mail address is already in use. Please use another one.');
            return response.statusCode = 500;
          }
          
         
          var query1 = 'insert into "activeAccount" (email, cod) values(' +
         "'" + email + "','" + cod + "');";
         
          return client.query(query1, function (err,result) {
           done();
            
            if (err) {
            var response = reply('occuring Error.');
            return response.statusCode = 500;
            }
            
            var subject = "MEETING";
            var text = 'static/text.txt';
            var html = 'static/email_activecod.html';
            var options=[];
            options[0]={"name":username,"cod":cod,"email":email};
            var _email=[];
            _email[0] = email
            return sendMailTemplateFile(_email, subject, text, html, options, function(err,result){
              if(err){
               
                var response = reply('occuring Error.');
                return response.statusCode = 500;
              }
             
              return reply("OK"); 
            });
          
        });
        
        });
      });
    });
  }
});

webServer.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    return reply.redirect('/home.html');
  }
});

webServer.route({
  method: 'GET',
	path: '/{param*}',
	handler: {
		directory: {
			path: path.join(__dirname, 'static')
		}
	}
});

return pg.connect(CONNECTION_STRING, function (err, client, done) {
  if (err) {
      return console.log('[ERR]', err);
  }
   
    var CREATE_TABLE_POLL_PARTICIPATE = 'create table if not exists "participatePoll" (' +
    'caller boolean not null,' +'poll int not null,' + 'email text not null,'+
    'name text not null,'+'dates text[],' +' dates_flag boolean[], ' +'primary key (caller, email, poll));';
    
  
    
    var CREATE_TABLE_ACTIVEACCOUNT = 'create table if not exists "activeAccount" (' +
    'email text primary key not null,' + 'cod text not null);';
    
    var CREATE_TABLE_FORGOTPASS_RESETPASS = 'create table if not exists "forgotPass" (' +
    'email text primary key not null,' + 'cod text not null,' + 'newpass text not null);';
    
    var CREATE_TABLE_USER = 'create table if not exists "user" (' +
    'username text not null,' +
    'email text primary key not null,' + 'valid boolean not null,' +
    'password text not null);';
    
    var CREATE_TABLE_POLL = 'create table if not exists "poll" (' +
    'id serial primary key,' + 'caller text not null,' +
    'title text not null,' + '"_location" text not null,' + 'description text,' +
    'dates text[],' + 'guests text[]);';
    
    var CREATE_TABLE_ID_USER = 'create table if not exists "user_id" (' +
    'email text primary key not null,' + 'cod text not null,'+
    'IssueTime int);';
    
    var CREATE_TABLE_COMMENT = 'create table if not exists "comment" (' +
    'time text not null,' + 'email text not null,'+ 'name text not null,' +
    'pm text not null,' + 'pollid int not null,'+
    'primary key (time, email, pollid));';
    
    var USER_IGNORE_EMAIL = 'create table if not exists "ignorEmail" (' +
    'email text primary key not null);';
 
    var queries = [
    CREATE_TABLE_USER,CREATE_TABLE_POLL, CREATE_TABLE_ID_USER, CREATE_TABLE_ACTIVEACCOUNT,
    CREATE_TABLE_FORGOTPASS_RESETPASS, CREATE_TABLE_POLL_PARTICIPATE, CREATE_TABLE_COMMENT,
    USER_IGNORE_EMAIL
  ];
  
  
  return async.eachSeries(queries, function (item, callback) {
    return client.query(item, callback);
  }, function (err) {
    //done();
    if (err) {
      return console.log('[ERR]', err);
    }
     
     
      
      webServer.start(function () {
      console.log('web server running at:', webServer.info.uri)
    });

    apiServer.start(function () {
      
      console.log('api server running at:', apiServer.info.uri)
    });
    
  });
    
   
});

process.on('uncaughtException', function (err) {
 console.log('Caught exception: ');
 });
