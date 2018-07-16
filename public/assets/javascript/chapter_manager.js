"use strict";

class ChapterManager {
  constructor(theUser, bookid) {
    //console.log(theUser);
    this.theUser = theUser;
    this.bookid = bookid;

     // need to save the user so we can get it later
    
    // jquery to get the coure-table-body element and make it sortable
    //$('#book-table-body').sortable();
    
    // jquery to get the add button and when user clicks it, it will call our method
    $('.btncreate').click(() => this.addChapter());
    

    
    // This reads the current books from the database and
    // adds them to the webpage so we can see them.
    // UI means User Inteface.
    var chapterRef = firebase.database().ref('list_of_chapter/' + this.theUser.uid + '/' + this.bookid + '/chapters/');
        
    // This gets the value one time so we can discover the book we
    // saved previously.
    
    // See documentation here: https://firebase.google.com/docs/database/web/read-and-write
    chapterRef.once('value', 
      // We will define a callback function here.
      // We won't get the books right away.
      // So this function will be called later.
      (snapshot /* argument (or parameter) to the callback */) => {
      // This is inside the body of the callback function.
      // It is called with the books.
      // The snapshot has a method val() which will get the books.
      let chapters = snapshot.val();
      if (chapters) {
        // The books looks like this
        // { 
        //   "bookId1": { title: "title1", description: "description1" }, 
        //   "bookId2": { title: "title2", description: "description2" }
        // }
        // the for loop will set id to "bookId1" then "bookId2"
        for (let id in chapters) {
          // set book to { title: "title1", description: "description1" }
          let chapter = chapters[id];
          this.insertChapterInTable(id, chapter);
        }

      }
    });
  }

  insertChapterInTable(id, chapter) {
    var list = $('#chapter-container').append(
        `<div class="demo-card-square mdl-card mdl-shadow--2dp" style="color: gray;" id="bookid_${id}">
            <div class="mdl-card__title mdl-card--expand" style="background-color: gray;">
                <h2 class="mdl-card__title-text course-title">${ chapter.title }</h2>
            </div>
            <div class="mdl-card__supporting-text course-des">
            ${ chapter.description }
            </div>
            <div class="mdl-card__actions mdl-card--border">
                <a href="#" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect take-book" style="text-decoration: none;">
                    View Chapter
                </a>
            </div>
        </div>`);
  }

  validateCharacterInfo() {
    if ($('#txttitle').val() == "") {
      alert("please enter your title");
      $('#txttitle').focus();
      return false;
    }
    if ($('#txtdescription').val() == "") {
      alert("please enter your description");
      $('#txtdescription').focus();
      return false;
    }
    return true;
  }

  addChapter() {
    if (!this.validateCharacterInfo()) {
      return;
    }

    // Make up our own book id
    var id = (new Date()).getTime().toString(36);
    var database = firebase.database();

        //initialize book data to be save
        let chapter = {
          title: $('#txttitle').val(),
          description: $('#txtdescription').val()
        };

      var updates = {};
      updates['list_of_chapter/' + this.theUser.uid + '/' + this.bookid + '/chapters/' + id] = chapter;
      //updates['character/'+ id];

      firebase.database().ref().update(updates)
      .then(() => {

      $('#txttitle').val("");
      $('#txtdescription').val("");
    

      console.log("Upload Successfully!");

      location.href = "buttoncharacter.html?bookid="+this.bookid;

    }).catch(()=>{
      console.log("failed to insert");
       });
  }
}