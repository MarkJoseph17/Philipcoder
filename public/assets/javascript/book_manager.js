
"use strict";

class BookManager {
  constructor(theUser, courseid) {
    this.theUser = theUser;
    this.courseid = courseid;
     
    $('.btncreate').click(() => this.addCreateBook());
    


   
    var bookRef = firebase.database().ref('user_books/' + this.theUser.uid + '/' + this.courseid + '/books/');
        
   
    bookRef.once('value', 
      
      (snapshot) => {
      let books = snapshot.val();
      if (books) {
        for (let id in books) {
          let book = books[id];
          this.insertBookInTable(id, book);

        }
      }
    });
    this.setBookFormInputEventHandlers();
  }

  setBookFormInputEventHandlers(){
    $("#book-input-img").change((e)=> {
      this.readURL(e.currentTarget, "book-img-prev-elid");
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

  setupDeleteHandler() {
    // When we create a row in the table, we will use the class book-delete-row
    // so we can find it using $('.book-delete-row').
    // We set the click handler to delete the book.
    $('.book-delete-row').click((e) => {
      // e.currentTarget is the delete icon
      var i = e.currentTarget;
      // it is inside a td
      var td = i.parentElement;
      // The td is inside a tr
      var tr = td.parentElement;
      // The tr is inside a tbody
      var tbody = tr.parentElement;
      // The format of the id is "book_<id>"
      // We want to get the <id> part.
      var id = tr.id.substr("book_".length);
      var testDataRef = firebase.database().ref('users/' + this.theUser.uid + '/course/'+ this.courseid + '/books/' + bookid);

      testDataRef.remove() // This makes request to firebase
        .then(()=>{// if it succeeds we will go there
        
          // We want to make sure we update the UI only if firebase succeeds
          tbody.removeChild(tr);
          
        }).catch(()=>{ // if it fails we will go here
          console.log("failed to delete");
        });
    }).css('cursor', 'pointer');
  }

  setupTitleChangeHandler() {
    $('.book-title').click((e) => {
      var td = e.currentTarget;
      let oldTitle = $(td).text();
      let newTitle = prompt("Enter book title", oldTitle);
      if (oldTitle != newTitle) {
        
        // This id is the book id
        var bookId = td.parentElement.id.substr("book_".length);

        var updates = {
          title: newTitle
        };
        var testDataRef = firebase.database().ref('users/' + this.theUser.uid + '/books/' + bookId);
        testDataRef.update(updates)
          .then(()=>{ // if it worked then we go here
          
            $(td).text(newTitle);
            
          }).catch(()=>{ // if failed we go here
            console.log("failed to update");
          });
      }
    }).css('cursor', 'pointer');
  }

  getMdlTableSelector() {
    var mdlclass = "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select mdl-js-ripple-effect--ignore-events is-upgraded";
    return `<td>
      <label class="${mdlclass}" data-upgraded=",MaterialCheckbox,MaterialRipple">
        <input type="checkbox" class="mdl-checkbox__input">
        <span class="mdl-checkbox__focus-helper"></span>
        <span class="mdl-checkbox__box-outline">
          <span class="mdl-checkbox__tick-outline"></span>
        </span>
        <span class="mdl-checkbox__ripple-container mdl-js-ripple-effect mdl-ripple--center" data-upgraded=",MaterialRipple">
          <span class="mdl-ripple"></span>
        </span>
      </label>
    </td>`;
  }

  uploadimage(imagefile, bookid , callback){
    //get file
    var file = imagefile;
    // Create the file metadata
    var metadata = {
      contentType: 'image/jpeg'
    };
    // Points to the root reference
    var storageRef = firebase.storage().ref('book_images/'+ this.theUser.uid+'/'+bookid+'/'+file.name);
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

  insertBookInTable(id, book) {
    var list = $('#book-container').append(
      `<div class="demo-card-square mdl-card mdl-shadow--2dp" id="bookid_${id}">
          <div class="mdl-card__title mdl-card--expand" data-imgname="${ book.imagename }" data-imgurl="${ book.imageurl }" style="background: url('${ book.imageurl }'); background-position: center; background-repeat: no-repeat; background-size: cover;">
              <h2 class="mdl-card__title-text course-title">${ book.title }</h2>
          </div>
          <div class="mdl-card__supporting-text course-des">
          ${ book.description }
          </div>
          <div class="mdl-card__actions mdl-card--border">
              <a href="buttoncharacter.html?bookid=${id}" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect take-book" style="text-decoration: none;">
                  View Book
              </a>
          </div>
      </div>`);
}

  validateBookInfo() {
    if ($('#txtbooktitle').val() == "") {
      alert("please enter book title");
      $('#txtbooktitle').focus();
      return false;
    }
    if ($('#txtbookdes').val() == "") {
      alert("please enter book description");
      $('#txtbookdes').focus();
      return false;
    }

    return true;
  }

  addCreateBook() {
    if (!this.validateBookInfo()) {
      return;
    }

    // Make up our own book id
    var id = (new Date()).getTime().toString(36);
    var database = firebase.database();

    const imagefile = document.querySelector('#book-input-img').files[0];
      this.uploadimage(imagefile, id, (imageurl,imagename)=>{
        if(imageurl === null){//cancel this operation when upload image failed
          return;
        }
        console.log(imageurl);
        //initialize book data to be save
        let book = {
          title: $('#txtbooktitle').val(),
          description: $('#txtbookdes').val(),
          imageurl: imageurl,
          imagename:imagename
        };

      var updates = {};
      //updates['course_booklist/'+ id] = id;
      updates['user_books/' + this.theUser.uid + '/' + this.courseid + '/books/' + id] = book;

      firebase.database().ref().update(updates)
      .then(() => {

      $('#txtbooktitle').val("");
      $('#txtbookdes').val("");
      $('#book-input-img').val("");

      console.log("Upload Successfully!");

      location.href = "vcourse.html?courseid="+this.courseid;

    }).catch(()=>{
      console.log("failed to insert");
       });
    });
  }
}