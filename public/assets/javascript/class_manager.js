"use strict";

class ClassManager {
  constructor(theUser, courseid, id) {
    this.theUser = theUser;
    this.courseid = courseid;
    this.classid;
    this.cardCount = 0;

    if(id){
      this.classid = id.substring(8, id.length);
      var classe = new UpdateClassManager(this.theUser);
      classe.setclass('classid_'+this.classid);
    }else{
      //creates new class id
      let genclassid = (new Date()).getTime().toString(36);
      this.classid = genclassid;//Initialize class id
      setTimeout(()=>{
        this.saveclassinfo('','', true);
      }, 1000);  
      this.savecardinfo();//display one card
    }

    $('.class-form').attr('id','classid_'+this.classid);

    this.setClassFormInputEventHandlers();
    this.setFloatingMenuButtonEventHandlers();
    this.autoresizeTextarea();
    this.setCardsCount();

    $('.create-card-cont').sortable({//this makes class cards sortable
      update : (event, ui)=>{
        this.updateclasscardslist();
      }
    });
    $('.create-card-cont').sortable({
      forcePlaceholderSize: true
    });
    $('.create-card-cont').sortable('disable');//disable sortable

    var database = firebase.database();
    let classRef = firebase.database().ref('class/'+this.theUser.uid + '/' + courseid);

    var setitemChangeListener = (cardid, carditemid)=>{

      let itemRef = database.ref('item/' + this.theUser.uid + '/readingitem-id-' + carditemid);

      itemRef.on('child_added', (data)=> {
        //var carditemid = data.val().carditemid;
        var itemid = data.key;
        itemid = itemid.substring(8, itemid.length);
        var itemtype = data.val().itemtype;
        var isDeleted = data.val().isDeleted;
  
        if(!isDeleted){

          if(itemtype == 'qa'){
            var quizitem = new QuizItemManager(this.theUser, cardid, carditemid, itemtype, itemid);//create new Quiz item
            quizitem.addQuestion(data.val().text);

            var correct_answers = data.val().correct_answers;
            if(correct_answers){
              correct_answers.forEach(answer => {
                quizitem.addAnswer(answer.textcontent, answer.message);
              });
            }else{
              quizitem.addAnswer('', '');
            }  

            var question_options = data.val().question_options;
            if(question_options){
              question_options.forEach(option => {
                quizitem.addOption(option.textcontent, option.message);
              });
            }else{
              quizitem.addOption('', '');
            }

          }else{
            new ItemManager(this.theUser, cardid, carditemid, itemtype, itemid)//create new item
              .setTextContent(data.val().text);     
          }
  
          itemRef.child('item-id-'+itemid).on('child_changed', (data)=> {
            var field = data.key;
            var value = data.val();
    
            if(field == 'isDeleted'){
              
              if(value){

                $('#item-id-'+itemid).parents('li').find('.item-close-but').parent().fadeOut('slow', ()=>{//apply fadeOut effects before it removes
                  $('#item-id-'+itemid).parents('li').find('.item-close-but').parent().remove();//removes the current card selected
                });

              }else{
                var item = new UpdateClassManager(this.theUser);
                item.setitems(cardid, carditemid, 'item-id-'+itemid);
              }
           
            } 
    
          });
    
        }
       
      });
    }

    var setcarditemChangeListener = (cardid)=>{

      let carditemRef = database.ref('card_item/' + this.theUser.uid + '/cardid_' + cardid);

      carditemRef.on('child_added', (data)=> {
        //var cardid = data.val().cardid;
        var carditemid = data.key;
        var type = data.val().type;
        var idextension;

        if(type == 'videoitem'){
          idextension = 'videoitem-id-';
          carditemid = carditemid.substring(13, carditemid.length);
        }else{
          idextension = 'readingitem-id-';
          carditemid = carditemid.substring(15, carditemid.length);
        }

        var isDeleted = data.val().isDeleted;
  
        if(!isDeleted){

          if(type == 'videoitem'){
            var videoitem = new VideoItemManager(this.theUser, cardid, carditemid);//create new video item
            videoitem.setTitle(data.val().title);
            videoitem.setDescription(data.val().description);
            videoitem.setUrl(data.val().downloadURL);
          }else{
            new ReadingItemManager(this.theUser, cardid, carditemid);//create new readinglist item
            setitemChangeListener(cardid, carditemid);
          }
  
          carditemRef.child(idextension+carditemid).on('child_changed', (data)=> {
            var field = data.key;
            var value = data.val();
    
            if(field == 'isDeleted'){
              
              if(value){

                $('#carditem-con-id-'+carditemid).find('.carditem-close-but').parent().hide('clip', ()=>{//apply clip effects before it removes
                  $('#carditem-con-id-'+carditemid).find('.carditem-close-but').parent().remove();//removes the current card selected
                });

              }else{
                var carditem = new UpdateClassManager(this.theUser);
                carditem.setcarditems(cardid, idextension+carditemid);
              }
           
            } 
    
          });
    
        }
       
      });
    }

    var setcardChangeListener = (classid)=> {
      let cardRef = database.ref('card/' + this.theUser.uid + '/classid_' + classid);
      cardRef.on('child_added', (data)=> {
        //var classid = data.val().classid;
        var cardid = data.key;
        cardid = cardid.substring(7, cardid.length);
        var isDeleted = data.val().isDeleted;
  
        if(!isDeleted){
  
          var card = new CardManager(this.theUser, classid, cardid);
          card.setTitle(data.val().title);
          card.setDescription(data.val().description);

          setcarditemChangeListener(cardid);
    
          cardRef.child('cardid_'+cardid).on('child_changed', (data)=> {
            var field = data.key;
            var value = data.val();
    
            if(field == 'isDeleted'){
              
              if(value){
                $('#cardid_'+cardid).find('.card-close-but').parent().hide('clip', ()=>{
                  $('#cardid_'+cardid).find('.card-close-but').parent().remove();
                });
              }else{
                var card = new UpdateClassManager(this.theUser);
                card.setcards(classid, 'cardid_'+cardid);
              }
           
            } 
    
          });
    
        }
       
      });
    }

    setcardChangeListener(this.classid);

    classRef.child('classid_'+this.classid).on('child_changed', (data)=> {
      var field = data.key;
      var value = data.val();
  
      //if(field == 'isDeleted'){
      
     
      //} 
  
    });
  
  }

  setClassFormInputEventHandlers(){

    $('.btnsubmitclass').one("click", () =>{
      alert('We are still working on it');
    });

    $("#class-input-img").change((e)=> {
      this.readURL(e.currentTarget, "class-img-prev-elid");
      this.uploadclassimage();
    });

    /*$("#class-input-vid").change((e)=> {
      this.readURL(e.currentTarget, "class-video-prev-elid");
    });*/

    var txtclasstitle = document.getElementById("txtclasstitle"), 
        txtclassdes = document.getElementById("txtclassdes");

    txtclasstitle.addEventListener("change", (e)=>{
      this.saveclassinfo('title', $(e.currentTarget).val());
    });


    txtclassdes.addEventListener("change", (e)=>{
      this.saveclassinfo('description', $(e.currentTarget).val());
    });
  }

  setFloatingMenuButtonEventHandlers(){
    /*$('#floating-menu button.addcard').click((e)=>{
      this.savecardinfo();
      $("[data-toggle='tooltip']").tooltip('hide');//this makes tooltip refresh its text content
    });*/

    $('.btn-add-card').click((e)=>{
      this.savecardinfo();
    });

    $('#floating-menu button.listview').click((e)=>{
      var c = e.currentTarget;

      if(c.firstElementChild.textContent === 'view_list'){

        this.setcardlistTitleDes();//this function set title and description for every card

        $('.class-card').css({'height':'80px','overflow':'hidden'});//sets all cards height to max-content
        $('.elements-items-container').css({'display':'none'});//Hides all cards contents
        $('.card-panel').css({'display':'block'});//Displays the cards panel for listview

        c.firstElementChild.textContent = 'view_module';//changes the listview button icon to large view
        c.setAttribute('data-original-title','Large view');//makes this button tooltip text to "Large view"

        $('.card-view-but').children('i').text('view_module');//this makes all cards view button(beside close button) to be large view

      }else{

        $('.class-card').css({'height':'auto','overflow':'unset'});//sets all cards height to 350 pixels (default)
        $('.elements-items-container').css({'display':'block'});//Displays all cards contents
        $('.card-panel').css({'display':'none'});//Hides the cards panel

        c.firstElementChild.textContent = 'view_list';//changes the listview button icon to list view
        c.setAttribute('data-original-title','List view');//makes this button tooltip text to "List view"

        $('.card-view-but').children('i').text('view_list');//this makes all cards view button(beside close button) to be List view

      }

      $("[data-toggle='tooltip']").tooltip('hide');//this makes tooltip refresh its text content
      
      this.cardsShowEffect();//show all card with effects

    });

    $('#floating-menu button.sortcard').click((e)=>{
      var c = e.currentTarget;

      if(c.firstElementChild.textContent === 'sort'){

        c.firstElementChild.textContent = 'done_all';//changes the sortcard button icon to done_all
        c.setAttribute('data-original-title','Done sort');//makes this sortcard button tooltip text to "Done sort"

        this.setcardlistTitleDes();//this function set title and description for every card

        $('.class-card').css({'height':'80px','cursor':'move','overflow':'hidden'});//sets all cards height to max-content
        $('.elements-items-container').css({'display':'none'});//Hides all cards contents
        $('.card-panel').css({'display':'block'});//Displays the cards panel for listview

        $('.card-view-but').css({'display':'none'});//when sorting are enable for cards we dont to allow the card to be view larger
        $('#floating-menu button.listview').attr('disabled','true');//disable listview button
        //$('#floating-menu button.addcard').attr('disabled','true');//disable add card button
        $('.btn-add-card').attr('disabled','true');//disable add card button

        $( ".create-card-cont" )
        .sortable('enable')//ofcourse enable the sortable feature
        .sortable({
            connectWith: ".create-card-cont",
            start: function(e, ui){
                ui.placeholder.height(ui.item.height());
            }
        });

        this.cardsShowEffect();//show all card with effects

      }else{

        c.firstElementChild.textContent = 'sort';//changes the button icon to list view
        c.setAttribute('data-original-title','Sort cards');//makes this button tooltip text to "List view"

        $('.class-card').css({'cursor':'default'});//sets all cards cursor to default

        $('#floating-menu button.listview')
        .html('<i class="material-icons">view_module</i>')//changes the listview button icon to large view
        .removeAttr("disabled")//enable the listview button
        .attr({'data-original-title':'Large view'});//enable listview button and makes tooltip text to "Large view"
        //$('#floating-menu button.addcard').removeAttr("disabled")//enable the add card button
        $('.btn-add-card').removeAttr("disabled")//enable the add card button
        
        $('.card-view-but')
        .html('<i class="material-icons">view_module</i>')//this makes all cards view button(beside close button) to be large view
        .css({'display':'block'});
        
        $( ".create-card-cont" ).sortable('disable');//disable sortable

      }

      $("[data-toggle='tooltip']").tooltip('hide');//this makes tooltip refresh its text content
    
    });
  }

  setcardlistTitleDes(){
    var cards = $('.create-card-cont').children();//get all cards
    for(let i=0; i < cards.length; i++){
      let cardid = cards[i].getAttribute('id');//get the card id
      let card_title = $(cards[i]).find('.card_title').val();//card title
      let card_des = $(cards[i]).find('.card_des').val();//card description

      var elements = $(cards[i]).find('.card-panel').children();//get reference to card panel h5(title) and p(description)
      console.log(elements.length);

      $(elements[0]).text(card_title);//set title to h5 tag
      $(elements[1]).text(card_des);//set description to paragraph tag

      if(!card_title){
        $(elements[0]).text('Card title here..');//set empty title to h5 tag
      }
      if(!card_des){
        $(elements[1]).text('Card description here');//set empty description to paragraph tag
      }
    }
  }

  cardsShowEffect(){
    var cards = $('.create-card-cont').children();//get all cards
    for(let i=0; i < cards.length; i++){      
      $(cards[i]).hide().show('clip');//apply clip effects 
    }
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

  autoresizeTextarea(){
    //creadits to the author: https://stephanwagner.me/auto-resizing-textarea
   $.each($('textarea[data-autoresize]'), function() {
       var offset = this.offsetHeight - this.clientHeight;
    
       var resizeTextarea = function(el) {
           $(el).css('height', 'auto').css('height', el.scrollHeight + offset);
       };
       $(this).on('keyup input', function() { resizeTextarea(this); }).removeAttr('data-autoresize');
   });
  }

  setCardsCount(){
    // select the target node
    var target = document.querySelector('.create-card-cont');
    //var target = $('#readingitem-id-'+this.itemid).find('.items-container ul');
    //console.log(target);

    // Callback function to execute when mutations are observed
    var callback = (mutations)=> {
        mutations.forEach((mutation)=> {
            if (mutation.type == 'childList') {
                //console.log('A child node has been added or removed.');
                this.cardCount = mutation.target.childElementCount;              
            }
            else if (mutation.type == 'attributes') {
                //console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }
        });
    };
    
    // create an observer instance
    var observer = new MutationObserver(callback);
    
    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true }
    
    // pass in the target node, as well as the observer options
    observer.observe(target, config);
    
    // later, you can stop observing
    //observer.disconnect();
  }

  /* Upload */
  uploadimagefile(imagefile, callback){ 

    let filename = imagefile.name;
    let lastIdx = filename.lastIndexOf(".");

    let extension = "";
    if (lastIdx > 0) {
      extension = filename.substr(lastIdx);
    }

    let newFilename = 'classid_'+this.classid + extension;

    var progressbar = document.getElementById('p1'), class_img_upload_percentage, percentage;

    //get file
    var imagefile = imagefile;
    // Create the file metadata
    var metadata = {
      contentType: 'image/jpeg'
    };
    // Points to the root reference
    var storageRef = firebase.storage().ref('class_images/'+this.theUser.uid+'/'+newFilename);
    // File name 
    var imagename = storageRef.name
    //Upload file
    var task = storageRef.put(imagefile, metadata);
    //update progress bar
    task.on('state_changed',
      (snapshot) =>{
        class_img_upload_percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        percentage = Math.round(class_img_upload_percentage);
        progressbar.style.width = percentage + '%';
        progressbar.setAttribute('aria-valuenow', percentage);
      },
      (err) =>{
        console.log(err);
      },
      ()=>{
        // Upload completed successfully, now we can get the download URL
        task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          callback(downloadURL,imagename);
        });
      }
    );
  }

  deletefile(dir, filename){
    // Create a reference to the file to delete
    var fileRef = firebase.storage().ref(dir+'/' + this.theUser.uid + '/' +filename);

    // Delete the file
    fileRef.delete().then(function() {
      // File deleted successfully
    }).catch(function(error) {
      // Uh-oh, an error occurred!
      console.log(error);
    });
  }
  /* Upload */

  /* Updates Functions  */
  saveclassinfo(field, value, isInit = false){

    var updates = {};

    //updates['class/' + this.theUser.uid + '/' + this.classid + '/modid/'] = key;
    
    if(isInit){
      updates['class/' + this.theUser.uid + '/classid_' + this.classid + '/course_id/'] = this.courseid;
      updates['course/' + this.theUser.uid + '/' + this.courseid + '/class_list/' + 'classid_'+this.classid + '/'] = 'classid_'+this.classid;
    }else{
      //initialize class data to be save
      updates['class/' + this.theUser.uid + '/classid_' + this.classid + '/'+field+'/'] = value;
    }

    firebase.database().ref().update(updates)
    .then(() => {     
      console.log('class saved');
    }).catch((err)=>{
      console.log(err);  
    });
  }

  uploadclassimage(){

    //Upload course image first
    //get image
    const imagefile = document.querySelector('#class-input-img').files[0];
    this.uploadimagefile(imagefile, (imageurl,imagename)=>{
      if(imageurl === null){//cancel this operation when upload image failed
        return;
      }

      var updates = {}, cardidlist = [], cards = $('.create-card-cont').children();//get all cards
  
      for(let c=0; c < cards.length; c++){
        let cardid = cards[c].getAttribute('id');
        cardidlist.push(cardid);//it collect all of the card id 
      }
      //initialize class data to be save
      updates['class/' + this.theUser.uid + '/classid_' + this.classid + '/image_url/'] = imageurl;
      updates['class/' + this.theUser.uid + '/classid_' + this.classid + '/image_name/'] = imagename;

      firebase.database().ref().update(updates)
      .then(() => {    
        console.log('class image saved'); 
      }).catch((err)=>{
        console.log(err);  
      });
    });
  }

  updateclasscardslist(){

    var updates = {};

    var cardidlist = [];

    var cards = $('.create-card-cont').children();//get all cards
    
    for(let d=0; d < cards.length; d++){
      let cardid = cards[d].getAttribute('id');
        
      cardidlist.push(cardid);//it collect all of the card id 

    }

    updates['class/' + this.theUser.uid + '/classid_' + this.classid + '/card_list'] = cardidlist;

    firebase.database().ref().update(updates)
    .then(() => {
      console.log('Class cards list Updated succesfull!');
    }).catch((err)=>{
      console.log(err);
      console.log("failed to update");
    });
  }
  /* Updates Functions  */

  /* Save card */
  savecardinfo(){

    let cardid = (new Date()).getTime().toString(36);//creates new card id

    var cardinfo = {
      classid: 'classid_'+this.classid,
      isDeleted: false
    };
       
    firebase.database().ref('card/' + this.theUser.uid + '/classid_' + this.classid + '/cardid_' + cardid ).set(cardinfo)
    .then(() => {   
        console.log('Card saved');
    }).catch((err)=>{
      console.log(err);  
    });
  }

  /*setcookie(id){

    let key = 'mod_'+(new Date()).getTime().toString(36);
    let mod_session= {
      id: id,
      mod_key: key
    };

    document.cookie.mod_sessions.push(mod_session);
    
  }*/

}