"use strict";

class CourseManager {
  constructor(theUser) {
    this.theUser = theUser;
    //this.nextkey = 0;
    //$('#course-table-body').sortable();
    $('#add-course').one("click", () => this.addCourse());
    $('#edit-course-image').one("click", () =>this.editCourseimage());

    // This reads the current courses from the database and
    // adds them to the UI so we can see them.
    var courseRef = firebase.database().ref('course/' + this.theUser.uid);
    courseRef.once('value', (snapshot) => {

      let courses = snapshot.val();
      if (courses) {
        for (let id in courses) {
          let course = courses[id];
          this.insertCourseInTable(id, course);
        }
        // This required to make the UI look correctly by Material Design Lite
        componentHandler.upgradeElements(document.getElementById('course-container'));
      }
    });

    this.viewclasses();
  }

  generateid(ref){
    // Get a key for a new Post.
    return firebase.database().ref(ref).push().key;
  }

  setupEditHandler(courseid) {
    $('#courseid_'+courseid).find('.edit-course').click((e) => {
      //console.log("triggered!");
      var a = e.currentTarget;
      var div1 = a.parentElement;
      var div2 = div1.parentElement;
      var fc = div2.firstElementChild;
      var sc = fc.nextElementSibling;
      var tc = sc.nextElementSibling;
      var h2 = sc.firstElementChild;

      var title = h2.textContent;
      var des = tc.textContent;

      var courseid = div2.id.substr("courseid_".length);//get the course id

      //Put desire data to update
      $("#add-edit-dialog").find("h4").text("Modify this course");//change the title of dialog box
      $('#course-id').val(courseid);//hidden
      $('#course-title').val(title);
      $('#course-description').val(des.toString().trim());

       //Disable upload form
       $(".image-cont").css("display","none");
       $('#imagepreview').attr('src', '#');
       $('.formupload')[0].reset();
       $('.formupload').css("display","none");

      var dialog = document.querySelector('#add-edit-dialog');
        //var showDialogButton = document.querySelector('.show-dialog');
        if (! dialog.showModal) {
          dialogPolyfill.registerDialog(dialog);
        }
        //showDialogButton.addEventListener('click', function() {
          dialog.showModal();
        //});
        dialog.querySelector('.close').addEventListener('click', function() {
          dialog.close();
        });

    }).css('cursor', 'pointer');
  }

  editCourseimage(){
    var courseid = $('#course-id-edit-image').val();

    firebase.database().ref('user_course/' + this.theUser.uid + '/courses/'+courseid).once('value').then((snapshot)=> {
      //var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
      // ...
      var title = snapshot.val().title;
      var des = snapshot.val().description;
      var imgname = snapshot.val().imagename;
      //var imgurl = snapshot.val().imageurl;

      console.log("course info: "+snapshot.val());

      this.deleteimage(courseid,imgname);

      //Upload course image first
      //get image
      const imagefile = document.querySelector('#editimagefile').files[0];
      this.uploadimage(imagefile, courseid, (imageurl,imagename)=>{
        if(imageurl === null){//cancel this operation when upload image failed
          return;
        }
        console.log(imageurl);
        //initialize course data to be save
        let course = {
          title: title,
          description: des,
          imageurl: imageurl,
          imagename:imagename
        };

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['courses/' + courseid] = course;
        updates['user_course/' + this.theUser.uid + '/courses/' + courseid] = course;

        firebase.database().ref().update(updates)
        //firebase.database().ref('users/' + this.theUser.uid + '/courses/'+id).set(course)
        .then(() => {
          // We want to make sure we update the UI only if firebase succeeds
          //this is for edit function it removes existing cards and changes by the new card
          $(".flex-container #courseid_"+courseid).remove();

          // if it works then ...
          this.insertCourseInTable(courseid, course);
          
          //componentHandler.upgradeElements(list.children().last());

          //set all input fields to empty including edit id
          $('#course-id-edit-image').val('');
          $('#editimagepreview').attr('src', "#");
          $('.form-edit-image')[0].reset();

          //get the dialog ref and closed it
          var dialog = document.querySelector('#edit-image-dialog');
          dialog.close();

          //again set a click event handlers for edit image course button because it was set to to click only once
          $('#edit-course-image').one("click", () =>this.editCourseimage());

        }).catch((err)=>{
          console.log(err);
          console.log("failed to insert");
        });
      });

    });
  }

  setupEditImageHandler(courseid) {
    $('#courseid_'+courseid).find('.edit-option').click((e) => {

      //var imgurl = sc.getAttribute("data-imgurl");//get the image url
      var a = e.currentTarget;
      var p = a.parentElement;
      var imagecont = a.nextElementSibling;
      var imgurl = imagecont.getAttribute("data-imgurl");//get the image url
      var courseid = p.id.substr("courseid_".length);//get the course id

      //Dialog box for editing course image
      var dialog = document.querySelector('#edit-image-dialog');
      //var showDialogButton = document.querySelector('#show-dialog');
      if (! dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
      }
      //showDialogButton.addEventListener('click', function() {
        $('#course-id-edit-image').val(courseid);
        $('#editimagepreview').attr('src', imgurl);
        dialog.showModal();
      //});
      dialog.querySelector('.close').addEventListener('click', function() {
        dialog.close();
        $('#course-id-edit-image').val('');
        $('#editimagepreview').attr('src', "#");
        $('.form-edit-image')[0].reset();
      });

      function readURL(input) {
        if (input.files && input.files[0]) {
          var reader = new FileReader();

          reader.onload = function(e) {
            $('#editimagepreview').attr('src', e.target.result);
          }

          reader.readAsDataURL(input.files[0]);
        }
      }

      $("#editimagefile").change(function() {
        readURL(this);
      });

    }).css('cursor', 'pointer');
  }

  getdeleteConfirmation(){
      var retVal = confirm("Are you sure you want to delete this course?");
      if (retVal){
          return true;
      }
      else{
          return false;
      }
  }

  setupDeleteHandler(courseid) {
    $('#courseid_'+courseid).find('.delete-course').click((e) => {
      if(this.getdeleteConfirmation()){
        //console.log("triggered!");
        var a = e.currentTarget;
        var div1 = a.parentElement;
        var div2 = div1.parentElement;
        var fc = div2.firstElementChild;
        var sc = fc.nextElementSibling;

        var courseid = div2.id.substr("courseid_".length);
        var imgname = sc.getAttribute("data-imgname");//get the image name

        //also delete image for this course
        this.deleteimage(courseid, imgname);

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['courses/' + courseid] = null;
        updates['user_course/' + this.theUser.uid + '/courses/' + courseid] = null;
        firebase.database().ref().update(updates)

        //var testDataRef = firebase.database().ref('users/' + this.theUser.uid + '/courses/' + id);
        //testDataRef.remove() // This makes request to firebase
          .then(()=>{// if it succeeds we will go there

            // We want to make sure we update the UI only if firebase succeeds
            $(".flex-container #courseid_"+courseid).remove();
            console.log("removed success!");

          }).catch(()=>{ // if it fails we will go here
            console.log("failed to delete");
          });

        return false;
      }else{
        return false;
      }
    }).css('cursor', 'pointer');
  }

  insertCourseInTable(courseid, course) {
      var list = $('#course-container').append(
        `<div class="demo-card-square mdl-card mdl-shadow--2dp" id="courseid_${courseid}">
            <a class="edit-option" href="#">
              <i class="material-icons">edit</i>
            </a>
            <div class="mdl-card__title mdl-card--expand" data-imgname="${ course.imagename }" data-imgurl="${ course.imageurl }" style="background: url('${ course.imageurl }'); background-position: center; background-repeat: no-repeat; background-size: cover;">
                <h2 class="mdl-card__title-text course-title">${ course.title }</h2>
            </div>
            <div class="mdl-card__supporting-text course-des">
            ${ course.description }
            </div>
            <div class="mdl-card__actions mdl-card--border">
                <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect edit-course">
                    Update
                </a>
                <!--<a style="float: right;" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect delete-course">
                    Delete
                </a>-->
            </div>
        </div>`);

        // Need to setup handlers for events on the new rows
        //this.setupDeleteHandler(courseid);
        this.setupEditHandler(courseid);
        this.setupEditImageHandler(courseid);

        $('courseid_'+courseid).click(function(){
          
        });
  }

  validateCourseInfo() {
    if ($('#course-title').val() == "") {
      alert("please enter course title");
      $('#course-title').focus();
      return false;
    }
    if ($('#course-description').val() == "") {
      alert("please enter course description");
      $('#course-description').focus();
      return false;
    }

    return true;
  }

  uploadimage(imagefile, courseid , callback){
    //get file
    var file = imagefile;
    // Create the file metadata
    var metadata = {
      contentType: 'image/jpeg'
    };
    // Points to the root reference
    var storageRef = firebase.storage().ref('course_images/'+ this.theUser.uid+'/'+courseid+'/'+file.name);
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
        });
      }
    );
  }

  deleteimage(courseid, imagename){
    // Create a reference to the file to delete
    var desertRef = firebase.storage().ref('course_images/' + this.theUser.uid + '/' + courseid +'/'+imagename);

    // Delete the file
    desertRef.delete().then(function() {
      // File deleted successfully
    }).catch(function(error) {
      // Uh-oh, an error occurred!
      console.log(error);
    });
  }

  updateRec(courseid){

    firebase.database().ref('course/' + this.theUser.uid + '/'+courseid).once('value').then((snapshot)=> {
      //initialize course data to be save
      let course = {
        title: $('#course-title').val(),
        description: $('#course-description').val(),
        imageurl: snapshot.val().imageurl,
        imagename: snapshot.val().imagename
      };

      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates['course/' + this.theUser.uid + '/' + courseid] = course;

      firebase.database().ref().update(updates)
      //firebase.database().ref('users/' + this.theUser.uid + '/courses/'+id).set(course)
      .then(() => {
        //this is for edit function it removes existing cards and changes by the new card
        $(".flex-container #courseid_"+courseid).remove();

        // if it works then ...
        this.insertCourseInTable(courseid, course);

        //componentHandler.upgradeElements(list.children().last());

        //get the dialog ref and closed it
        var dialog = document.querySelector('#add-edit-dialog');
        dialog.close();

        //again set a click event handlers for add course button because it was set to to click only once
        $('#add-course').one("click", () => this.addCourse());

      }).catch((err)=>{
        console.log(err);
        console.log("failed to insert");
      });

    });
    
  }

  addCourse() {
    var courseid=null;

    if (!this.validateCourseInfo()) {
      return;
    }

    if( $('#course-id').val() != ""){
      courseid = $('#course-id').val();
      this.updateRec(courseid);
    }else{
      // Make up our own course id
      courseid = (new Date()).getTime().toString(36);

      var database = firebase.database();
      //Upload course image first
      //get image
      const imagefile = document.querySelector('#imagefile').files[0];
      this.uploadimage(imagefile, courseid, (imageurl,imagename)=>{
        if(imageurl === null){//cancel this operation when upload image failed
          return;
        }
        console.log(imageurl);
        //initialize course data to be save
        let course = {
          created_by : this.theUser.uid ,
          title: $('#course-title').val(),
          description: $('#course-description').val(),
          imageurl: imageurl,
          imagename:imagename
        };

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};

        updates['course/' + this.theUser.uid + '/' + courseid] = course;

        firebase.database().ref().update(updates)
        //firebase.database().ref('courses/' + this.theUser.uid + '/'+courseid).set(course)
        .then(() => {
          //this is for edit function it removes existing cards and changes by the new card
          $(".flex-container #courseid_"+courseid).remove();

          // if it works then ...
          this.insertCourseInTable(courseid, course);

          //componentHandler.upgradeElements(list.children().last());

          //get the dialog ref and closed it
          var dialog = document.querySelector('#add-edit-dialog');
          dialog.close();

          //again set a click event handlers for add course button because it was set to to click only once
          $('#add-course').one("click", () => this.addCourse());

        }).catch((err)=>{
          console.log(err);
          console.log("failed to insert");
        });
      });
    }
  }

  viewclasses(){
    var usercourseRef = firebase.database().ref('course/'+this.theUser.uid);
    var classRef = firebase.database().ref('class/'+this.theUser.uid);

    usercourseRef.once('value', (snapcourses) => {   
        snapcourses.forEach((childSnapshot)=> {

          var courseid = childSnapshot.key;
          var classes = childSnapshot.val().class_list;

          for(let key in classes){

            var classid = key;
            var classe = classes[key];

            classRef.child(classid).once('value', (snapclass) => {
          
              var id = snapclass.key;
              var classe = snapclass.val();

              this.insertclasses(id, classe);

            });
            
          };

          // This required to make the UI look correctly by Material Design Lite
          componentHandler.upgradeElements(document.getElementById('class-container'));

        });
      });
  }

  insertclasses(classid, classe){
      var list = $('#class-container').append(
          `<div class="demo-card-square mdl-card mdl-shadow--2dp" id="classid_${classid}">
              <div class="mdl-card__title mdl-card--expand" data-imgname="${ classe.image_name }" data-imgurl="${ classe.image_url }" style="background: url('${ classe.image_url }'); background-position: center; background-repeat: no-repeat; background-size: cover;">
                  <h2 class="mdl-card__title-text course-title">${ classe.title }</h2>
              </div>
              <div class="mdl-card__supporting-text course-des">
              ${ classe.description }
              </div>
              <div class="mdl-card__actions mdl-card--border">
                  <a href="/createclass.html?courseid=${ classe.course_id }&classid=${classid}" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect btn-update-class">
                      Update 
                  </a>
              </div>
          </div>`);
  }
  //class
}
