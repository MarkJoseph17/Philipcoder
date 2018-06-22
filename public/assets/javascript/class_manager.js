"use strict";

class ClassManager {
  constructor(theUser,courseid) {
    console.log(theUser);
    this.theUser = theUser;
    this.courseid = courseid;
    this.classid ;

    //creates new class id
    let classid = (new Date()).getTime().toString(36);
    this.classid = classid;//Initialize class id
    $('.class-form').attr('id','classid_'+classid);

    new CardManager(this.theUser, this.courseid, classid);//display one card

    $('#floating-menu').click((e)=>{
      new CardManager(this.theUser, this.courseid, classid);
    });

    $('.btncreate').click((e)=>{
      this.addclass();
    });

    $("#class-input-img").change((e)=> {
      this.readURL(e.currentTarget, "class-img-prev-elid");
    });

    $("#class-input-vid").change((e)=> {
      this.readURL(e.currentTarget, "class-video-prev-elid");
    });

    $('.create-card-cont').sortable({
      update : (event, ui)=>{
        //this.printlog(ui);
        this.updateclasscards();
      }
    });

  }

  printlog(obj){
    console.log(obj);
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

  setupAdditemhandler(id){

    function autoresize(itemid){
      //creadits to the author: https://stephanwagner.me/auto-resizing-textarea
      var offset;
 
      var resizeTextarea = function(el) {
          offset = el.offsetHeight - el.clientHeight;
          $(el).css('height', 'auto').css('height', el.scrollHeight + offset);
      };

      $('#item-id-'+itemid).on('keyup input', function() { 
        resizeTextarea(this); 
      });
    }

    function addNewitem(id, newitemid, elementtype){
        var element = null;
        if(elementtype === "h1"){
            element = `<h1 id="item-id-${newitemid}" class="${elementtype}">double click to edit..</h1>`;
        }else if(elementtype === "p1"){
            element = `<p id="item-id-${newitemid}" class="${elementtype}"> double click to edit..</p>`;
        }

        $('#cardid_'+id).children('div.items-container').append(`
            <div id="item-con-id-${newitemid}" style="position: relative; padding: 2px; background-color: transparent;">
              <span class="close-but">
                <i class="material-icons">close</i>
              </span>
                ${element}
            </div>
        `);

        $('.close-but').click(function(e){
          $(this).parent().remove();
        });

        sethandler(newitemid, elementtype);
    }

    function sethandler(itemid, elementtype){

        var c, id, textcontent, classname, tagname, elementtoadd;
        
        if(elementtype === "input"){
            $('#item-id-'+itemid).keypress(function(e){
              if(e.which == 13){ // the enter key code
                  //c = e.currentTarget;
                  //id = $(this).attr('id');
                  //classname = $(this).attr('class');
                  //tagname = this.tagName;

                  textcontent = $(this).val();
                  
                  var prevtagname = this.getAttribute("data-tn").toString().toLowerCase();
                  var prevclassname = this.getAttribute("data-cn").toString().toLowerCase();
          
                  elementtoadd = `
                          <${prevtagname} id="item-id-${itemid}" class="${prevclassname}">${textcontent}</${prevtagname}>
                      `;
                  
                  $(this).remove();
                  $('#item-con-id-'+itemid).append(elementtoadd);
                  $('#item-id-'+itemid).focus();   
                  sethandler(itemid, prevtagname);   
                  return false;  
                }
            }).focus().select(); 
            /*$('#item-id-'+itemid).dblclick(function(e){             
                textcontent = $(this).val();
                  
                var prevtagname = this.getAttribute("data-tn").toString().toLowerCase();
                var prevclassname = this.getAttribute("data-cn").toString().toLowerCase();
          
                elementtoadd = `
                        <${prevtagname} id="item-id-${itemid}" class="${prevclassname}">${textcontent}</${prevtagname}>
                    `;
                  
                $(this).remove();
                $('#item-con-id-'+itemid).append(elementtoadd);
                $('#item-id-'+itemid).focus();   
                sethandler(itemid, prevtagname);   
                return false;                 
            }).focus().select(); */
        }else{
            $('#item-id-'+itemid).dblclick(function(e){
                //c = e.currentTarget;
                //id = $(this).attr('id');
                textcontent = $(this).text();
                classname = $(this).attr('class');
                tagname = this.tagName;
        
                elementtoadd = `
                        <textarea data-autoresize rows="1" type="text" id="item-id-${itemid}" data-tn="${tagname}" data-cn="${classname}">${textcontent}</textarea>
                    `;

                /*elementtoadd = `
                    <input type="text" id="item-id-${itemid}" value="${textcontent}" data-tn="${tagname}" data-cn="${classname}">
                `;*/
                
                $(this).remove();
                $('#item-con-id-'+itemid).append(elementtoadd);
                
                /*var textarea = document.getElementById('item-id-'+itemid);//get the new textarea after creation
                var offset = textarea.offsetHeight - textarea.clientHeight;
                textarea.style.height="auto";
                textarea.style.height = (textarea.scrollHeight + offset);*/

                autoresize(itemid);//set the textarea to be resizeable
                sethandler(itemid, "input");   
            });
        }  
    }

    $('#cardid_'+id).children('div.items-container').sortable();//this makes card items sortable

    $('#additem_'+id).on('change', function(e){
      //var item = $(this).find("option:selected").text();
      var c = e.currentTarget;
      //console.log($(this).parent('.additem-row').find('textarea'));
      //console.log($(this).parent('.additem-row').find('#textcontent_'+selectid));
      var selecteditem = c.options[ c.selectedIndex ].value;//get the selected item 
      //console.log("selected item " + item);
      var newitemid = (new Date()).getTime().toString(36);//create id for an item
      addNewitem(id, newitemid, selecteditem);
      return;
    });

    $('.card-close-but').click(function(e){//set up close button event handler
      $(this).parent().remove();//removes the current card selected
    });

  }

  uploadimagefile(classid, imagefile, callback){
    //get file
    var imagefile = imagefile;
    // Create the file metadata
    var metadata = {
      contentType: 'image/jpeg'
    };
    // Points to the root reference
    var storageRef = firebase.storage().ref('class_images/'+this.courseid+'/'+classid+'/'+imagefile.name);
    // File name is 'space.jpg'
    var imagename = storageRef.name
    //Upload file
    var task = storageRef.put(imagefile, metadata);
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
          callback(downloadURL,imagename);
        });
      }
    );
  }

  savenewclass(imageurl,imagename){

  }

  addclass(){

    if(!$('#txtclasstitle').val()){
      alert('Class title fields cant be empty');
      $('#txtclasstitle').focus();
    }else if(!$('#txtclassdes').val()){
      alert('Class description fields cant be empty');
      $('#txtclassdes').focus();
    }else if(!document.querySelector('#class-input-img').files[0]){
      alert('Please provide an image for your class.');
    }//get confirmation

    // Make up our own class id
    var classid = $('.class-form').attr('id');
    
    //Upload course image first
    //get image
    const imagefile = document.querySelector('#class-input-img').files[0];
    this.uploadimagefile(classid, imagefile, (imageurl,imagename)=>{
      if(imageurl === null){//cancel this operation when upload image failed
        return;
      }

      //initialize course data to be save
      let classes = {
        title: $('#txtclasstitle').val(),
        description: $('#txtclassdes').val(),
        image_url: imageurl,
        image_name: imagename,
        pulished: false,
        rating: 0,
        howmanytimestaken: 0
      };

      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates['_class/' + classid] = classes;
      updates['_course_class_list/' + this.courseid + '/classes/' + classid] = classes;

      var cardidlist = [];

      var cards = $('.create-card-cont').children();//get all cards
      //console.log("cards lenght :"+cards.length);
      for(let i=1; i < cards.length; i++){
        let cardid = cards[i].getAttribute('id');
        let card_title = $(cards[i]).find('.card_title').val();
        let card_des = $(cards[i]).find('.card_des').val();

        var cardinfo = {
          title : card_title,
          description : card_des
        }

        updates['_card/'+ cardid] = cardinfo;
        //updates['_class_card_list/' + classid + '/cards/' + cardid] = cardinfo;
        cardidlist.push(cardid);//it collect all of the card id 

        //console.log("triggerred :" + cards.length);//prints if the cards has got access to it

        var items = $(cards[i]).find('.items-container').children();//get all card items
        var itemidlist = [];

        for(let y=0; y < items.length; y++){
          var span_closed_but = items[y].firstElementChild;
          var span_drag_but = span_closed_but.nextElementSibling;
          var item_el = span_drag_but.nextElementSibling;
          var itemid = item_el.getAttribute('id');
          var itemtagname = item_el.tagName;
          var itemclass = item_el.getAttribute('class');
          var itemtext = item_el.textContent;
          var item_content = '<' + itemtagname + ' class="'+itemclass+'">' +itemtext+'</' +itemtagname+ '>';

          var iteminfo = {
            content : item_content,
            type : "html"
          }

          updates['_items/' + itemid] = iteminfo;
          itemidlist.push(itemid);
        }
        updates['_card_item_list/' + cardid + '/items'] = itemidlist;
      }

      updates['_class_card_list/' + classid + '/cards'] = cardidlist;

      firebase.database().ref().update(updates)
      //firebase.database().ref('users/' + this.theUser.uid + '/courses/'+id).set(course)
      .then(() => {
        console.log('New class has succesfully submitted!');
        $('.btncreate').attr('disabled','true');//disable create button
      }).catch((err)=>{
        console.log(err);
        console.log("failed to insert");
      });
    });
  }

  updateclasscards(){

    if(!$('.btncreate').attr('disabled')){
      console.log('Unable to update class card list because the class isnt saved yet');
      return;
    }//This cancel the update when the class hasn't submitted yet

    var updates = {};
    var cardidlist = [];
    var cards = $('.create-card-cont').children();//get all cards
    for(let i=1; i < cards.length; i++){
      let cardid = cards[i].getAttribute('id');
      let card_title = $(cards[i]).find('.card_title').val();
      let card_des = $(cards[i]).find('.card_des').val();

      var cardinfo = {
        title : card_title,
        description : card_des
      }

      updates['_card/'+ cardid] = cardinfo;
      //updates['_class_card_list/' + classid + '/cards/' + cardid] = cardinfo;
      cardidlist.push(cardid);//it collect all of the card id 

    }
    updates['_class_card_list/' + 'classid_'+this.classid + '/cards'] = cardidlist;
    firebase.database().ref().update(updates)
    .then(() => {
      console.log('class cards list updated!');
    }).catch((err)=>{
      console.log(err);
      console.log("failed to insert");
    });
  }
}