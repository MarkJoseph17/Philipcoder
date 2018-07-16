"use strict";

class CharacterManager {
  constructor(theUser, bookid) {
    //console.log(theUser);
    this.theUser = theUser;
    this.bookid = bookid;
     // need to save the user so we can get it later
    
    // jquery to get the coure-table-body element and make it sortable
    //$('#book-table-body').sortable();
    
    // jquery to get the add button and when user clicks it, it will call our method
    $('.btncreate').click(() => this.addcharacter());
    

    
    // This reads the current books from the database and
    // adds them to the webpage so we can see them.
    // UI means User Inteface.
    var characterRef = firebase.database().ref('character_list/' + this.theUser.uid + '/' + this.bookid + '/characters/');
        
    // This gets the value one time so we can discover the book we
    // saved previously.
    
    // See documentation here: https://firebase.google.com/docs/database/web/read-and-write
    characterRef.once('value', 
      // We will define a callback function here.
      // We won't get the books right away.
      // So this function will be called later.
      (snapshot /* argument (or parameter) to the callback */) => {
      // This is inside the body of the callback function.
      // It is called with the books.
      // The snapshot has a method val() which will get the books.
      let characters = snapshot.val();
      if (characters) {
        // The books looks like this
        // { 
        //   "bookId1": { title: "title1", description: "description1" }, 
        //   "bookId2": { title: "title2", description: "description2" }
        // }
        // the for loop will set id to "bookId1" then "bookId2"
        for (let id in characters) {
          // set book to { title: "title1", description: "description1" }
          let character = characters[id];
          this.insertCharacterInTable(id, character);
        }
        this.setCharacterFormInputEventHandlers();

      }
    });
  }

  setCharacterFormInputEventHandlers(){
    $("#character-input-img").change((e)=> {
      this.readURL(e.currentTarget, "character-img-prev-elid");
    });
  }

  readURL(input, preview_element_id) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function(e) {
        $('#'+preview_element_id).attr('src', e.target.result).parent('.prev-cont').css("display","block");
      }
     
      reader.readAsDataURL(input.files[0]);
    }
  }

  uploadimage(imagefile, characterid , callback){
    //get file
    var file = imagefile;
    // Create the file metadata
    var metadata = {
      contentType: 'image/jpeg'
    };
    // Points to the root reference
    var storageRef = firebase.storage().ref('character_images/'+ this.theUser.uid+'/'+characterid+'/'+file.name);
    // File path is 'images/space.jpg'
    var path = storageRef.fullPath
    // File name is 'space.jpg'
    var name = storageRef.name
    // Points to 'images'
    var imagesRef = storageRef.parent;
    //Upload file
    var task = storageRef.put(file, metadata);
    //update progress bar

    task.on('state_changed',
      (snapshot) =>{
      },
      (err) =>{
        console.log(err);
      },
      ()=>{
        // Upload completed successfully, now we can get the download URL
        task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          //console.log('File available at', downloadURL);
          callback(downloadURL,name);
          console.log(downloadURL);
        });
      }
    );
  }

  insertCharacterInTable(id, character) {
    var list = $('#character-container').append(
      `<div class="demo-card-square mdl-card mdl-shadow--2dp" id="characterid_${id}">
          <div class="mdl-card__title mdl-card--expand" data-imgname="${ character.imagename }" data-imgurl="${ character.imageurl }" style="background: url('${ character.imageurl }'); background-position: center; background-repeat: no-repeat; background-size: cover;">
              <h2 class="mdl-card__title-text course-title">${ character.firstname } ${ character.lastname }</h2>
          </div>
          <div class="mdl-card__supporting-text course-des">
          birthday: ${ character.birthday }
          </div>
          <div class="mdl-card__actions mdl-card--border">
              <a href="character.html?bookid=${id}" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect take-book" style="text-decoration: none;">
                  View Character
              </a>
          </div>
      </div>`);
  }

  validateCharacterInfo() {
    if ($('#txtfirstname').val() == "") {
      alert("please enter your firstname");
      $('#txtfirstname').focus();
      return false;
    }
    if ($('#txtlastname').val() == "") {
      alert("please enter your lastname");
      $('#txtlastname').focus();
      return false;
    }
    if ($('#txtbirthday').val() == "") {
        alert("please enter your birthday");
        $('#txtbirthday').focus();
        return false;
      }

    return true;
  }

  addcharacter() {
    if (!this.validateCharacterInfo()) {
      return;
    }

    // Make up our own book id
    var id = (new Date()).getTime().toString(36);
    var database = firebase.database();

    const imagefile = document.querySelector('#character-input-img').files[0];
      this.uploadimage(imagefile, id, (imageurl,imagename)=>{
        if(imageurl === null){//cancel this operation when upload image failed
          return;
        }
        console.log(imageurl);
        //initialize book data to be save
        let character = {
          firstname: $('#txtfirstname').val(),
          lastname: $('#txtlastname').val(),
          birthday: $('#txtbirthday').val(),
          imageurl: imageurl,
          imagename:imagename
        };

      var updates = {};
      updates['character_list/' + this.theUser.uid + '/' +this.bookid + '/characters/' + id] = character;
      //updates['character/'+ id];

      firebase.database().ref().update(updates)
      .then(() => {

      $('#txtfirstname').val("");
      $('#txtlastname').val("");
      $('#txtbirthday').val("");
      $('#character-input-img').val("");

      console.log("Upload Successfully!");

      location.href = "buttoncharacter.html?bookid="+this.bookid;

    }).catch(()=>{
      console.log("failed to insert");
       });
    });
  }
}