textStream = new Meteor.Stream('text');

//DataArchive = new Meteor.Collection('dataArchive');

ChatStreamDB = new Meteor.Collection('chatStreamDB');

if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to Live-Chatstreams-Meteor.";
  };

  Template.main.events({
    'keyup input': function(event){
      if(event.which == 13){
        updateText(event.currentTarget.value, true);//done
        event.currentTarget.value = "";
        id = undefined;
      }
      else
        updateText(event.currentTarget.value, false);
    }
  })

  var id;

  updateText = function(val, done) {
    var json = {message:val, user:Meteor.user().username, time:new Date(), done:done};
    textStream.emit('val', json);
    console.log(json);
    if(id === undefined)
      id = ChatStreamDB.insert(json);
    else
      ChatStreamDB.update({_id:id},{$set:{message:json.message, user:json.user, time:json.time, done:json.done}});
  };

  textStream.on('val', function(json) {
    console.log(json);
  });


  Template.stream.findAll = function(){
    return ChatStreamDB.find({},{sort:{time:-1}});
  }

  Template.stream.timeFormat = function(date){
    return date.toLocaleTimeString();
  }

  Template.stream.makeColor = function(username){
    return Please.make_color({from_hash: username});
  }


  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
  });


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
