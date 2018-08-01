"use strict";

class ClassManager {
  constructor(theUser, courseid, readingItemManagers, id) {
    console.log(theUser);
    this.theUser = theUser;
    this.courseid = courseid;
    this.readingItemManagers = [];
    this.cardManagers = [];

    if(id){
      this.classid = id;
      this.UpdateClassManager(this.classid);
    }else{
      //creates new class id
      let genclassid = (new Date()).getTime().toString(36);
      this.classid = genclassid;//Initialize class id
      this.cardManagers.push(new CardManager(this.theUser));
    }

    $('.class-form').attr('id','classid_'+this.classid);

    this.setClassFormInputEventHandlers();
    this.setFloatingMenuButtonEventHandlers();

    $('.btncreate').one("click", () =>{
      this.addclass();
    });

    $('.create-card-cont').sortable({//this makes class cards sortable
      update : (event, ui)=>{
        this.updateclasscardslist();
      }
    });
    $('.create-card-cont').sortable({
      forcePlaceholderSize: true
    });
    $( ".create-card-cont" ).sortable('disable');//disable sortable

    this.autoresizeTextarea();
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

  setClassFormInputEventHandlers(){
    $("#class-input-img").change((e)=> {
      this.readURL(e.currentTarget, "class-img-prev-elid");
    });

    $("#class-input-vid").change((e)=> {
      this.readURL(e.currentTarget, "class-video-prev-elid");
    });
  }

  setFloatingMenuButtonEventHandlers(){
    $('#floating-menu button.addcard').click((e)=>{
      new CardManager(this.theUser);
      $("[data-toggle='tooltip']").tooltip('hide');//this makes tooltip refresh its text content
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
        $('#floating-menu button.addcard').attr('disabled','true');//disable add card button

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
        $('#floating-menu button.addcard').removeAttr("disabled")//enable the add card button
        
        $('.card-view-but')
        .html('<i class="material-icons">view_module</i>')//this makes all cards view button(beside close button) to be large view
        .css({'display':'block'});
        
        $( ".create-card-cont" ).sortable('disable');//disable sortable

      }

      $("[data-toggle='tooltip']").tooltip('hide');//this makes tooltip refresh its text content
    
    });
  }

  printlog(obj){
    console.log(obj);
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

  uploadimagefile(classid, imagefile, callback){
    //get file
    var imagefile = imagefile;
    // Create the file metadata
    var metadata = {
      contentType: 'image/jpeg'
    };
    // Points to the root reference
    var storageRef = firebase.storage().ref('class_images/'+this.courseid+'/'+classid+'/'+imagefile.name);
    // File name 
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
          console.log('Image File available at', downloadURL);
          callback(downloadURL,imagename);
        });
      }
    );
  }

  uploadvideofile(caritemdid, videofile, callback){
    //get file
    var videofile = videofile;
    // Create the file metadata
    var metadata = {
      contentType: 'video/mp4'
    };
    // Points to the root reference
    var storageRef = firebase.storage().ref('carditems_video/'+caritemdid+'/'+videofile.name);
    // File name 
    var videoname = storageRef.name
    //Upload file
    var task = storageRef.put(videofile, metadata);
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
          console.log('Video file available at', downloadURL);
          callback(downloadURL,videoname);
        });
      }
    );
  }

  addclass(){

    if(!$('#txtclasstitle').val()){
      alert('Class title fields cant be empty');
      $('#txtclasstitle').focus();
      return;
    }else if(!$('#txtclassdes').val()){
      alert('Class description fields cant be empty');
      $('#txtclassdes').focus();
      return;
    }else if(!document.querySelector('#class-input-img').files[0]){
      alert('Please provide an image for your class.');
      return;
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

      var updates = {};

      var cardidlist = [];

      var cards = $('.create-card-cont').children();//get all cards
  
      for(let i=0; i < cards.length; i++){
        let cardid = cards[i].getAttribute('id');
        let card_title = $(cards[i]).find('.card_title').val();
        let card_des = $(cards[i]).find('.card_des').val();

        var cardinfo = {
          title : card_title,
          description : card_des,
          item_list : null
        }
        
        cardidlist.push(cardid);//it collect all of the card id 

        var carditems = $(cards[i]).find('.carditems-container').children();//get all card items
        var carditemsidlist = [];

        for(let y=0; y < carditems.length; y++){
          var span_closed_but = carditems[y].firstElementChild;
          var span_drag_but = span_closed_but.nextElementSibling;
          var item_el = span_drag_but.nextElementSibling;
          var carditemid = item_el.getAttribute('id');
          var carditemtype = item_el.getAttribute('class');

          var carditeminfo = {};

          if(carditemtype === 'videoitem'){
            //Upload video
            //get video
            const videofile = document.querySelector('.videoitem-input-vid').files[0];
            this.uploadvideofile(carditemid,videofile,(downloadURL,videoname)=>{
              carditeminfo = {
                type : 'videoitem',
                title: $(item_el).find('.carditem-vid-title').val(),
                description: $(item_el).find('.carditem-vid-des').val(),
                videoname: videoname,
                downloadURL : downloadURL
              }
              updates['card_item/' + this.theUser.uid + '/' + carditemid] = carditeminfo;
              firebase.database().ref().update(updates)
              .then(() => {
                console.log('New video carditem has succesfully saved!');
                $('.btncreate').attr('disabled','true');//disable create button
              }).catch((err)=>{
                console.log(err);
                console.log("failed to insert");
              });
            });

          }else if(carditemtype === 'readinglist'){
            var items = $(item_el).find('.items-container > ul').children();//get all card items
            var itemsidlist = [];

            for(let z=0; z < items.length; z++){
              var itemelement, itemid, itemtype, content;
              var iteminfo = {}
              
              itemtype = $(items[z]).find('.item').attr('data-type');
              
              if(itemtype === 'qa'){
                itemelement = $(items[z]).find('.question_answer');
                itemid = $(itemelement[0]).attr('id');
                
                var correct_answers = [];
                var answers = $(itemelement[0]).find('.answer-row').children();
                let i=0;
                while( i < answers.length){
                  var answer = {
                    answer : $(answers[i]).find('.txtanswer').val(),
                    message : $(answers[i]).find('.txtanswer-msg').val()
                  }
                  i++
                  correct_answers.push(answer);
                }
               
                var question_options = [];
                var options = $(itemelement[0]).find('.option-row').children();
                let i2=0;
                while( i2 < options.length){
                  var option = {
                    option : $(options[i2]).find('.txtoption').val(),
                    message : $(options[i2]).find('.txtoption-msg').val()
                  }
                  i2++
                  question_options.push(option);
                }

                iteminfo = {
                  text : $(itemelement[0]).find('.txtquestion').val(),
                  itemtype : itemtype,
                  quiz_type : '',
                  correct_answers : correct_answers,
                  question_options : question_options
                }

              }else  if (itemtype == 'cq'){
                itemelement = $(items[z]).find('.code_question');
                itemid = $(itemelement[0]).attr('id');
                itemid = itemid.substring("item-id-".length);
                let targetCodeQuestionManager = null;
                for (let cardManager of this.cardManagers) {
                  for (let readItemManager of cardManager.readingItemManagers) {
                    for (let codeQuestionManager of readItemManager.codeQuestionManagers) {
                      if (codeQuestionManager.itemid == itemid) {
                        targetCodeQuestionManager = codeQuestionManager;
                        break;   
                      }
                    }
                  }
                }
                iteminfo = {
                  question : $(`#questionField${itemid}`).val(),
                  itemtype : itemtype,
                  showHtml: $(`#showHtmlCheckbox${itemid}`).is(':checked'),
                  showCss: $(`#showCssCheckbox${itemid}`).is(':checked'),
                  showJavaScript: $(`#showJavaScriptCheckbox${itemid}`).is(':checked'),
                  start_point_html: targetCodeQuestionManager.editorhtml.getValue(),
                  correct_html: targetCodeQuestionManager.editor2Html.getValue(),
                  start_point_css:targetCodeQuestionManager.editorcss.getValue(),
                  correct_css: targetCodeQuestionManager.editor2Css.getValue(),
                  start_point_js: targetCodeQuestionManager.editorjavascript.getValue(),
                  correct_javascript: targetCodeQuestionManager.editor2Javascript.getValue()
                };

              }else{
                itemelement = $(items[z]).find('.editable');
                itemid = $(itemelement[0]).attr('id');
                content = $(itemelement[0]).html();
                iteminfo = {
                  text : '',
                  itemtype : itemtype,
                  quiz_type : '',
                  correct_answer : {},
                  options : {}
                }
                if(itemtype === 'image'){
                  var imgcontent = '';
                  var images = $(itemelement[0]).children("div.medium-insert-images")
                  for(let a=0; a < images.length; a++){
                    var dclass = $(images[a]).attr('class');
                    imgcontent += '<div class="' + dclass + '">' + $(images[a]).html() + '</div>';
                  }
                  iteminfo.text = imgcontent;
                }else{
                  iteminfo.text = content;
                }  
              }
              updates['item/' + this.theUser.uid + '/' + itemid] = iteminfo;   
              itemsidlist.push(itemid); 
            }

            carditeminfo = {
              type : 'readinglist',
              item_list: itemsidlist
            }      
            updates['card_item/' + this.theUser.uid + '/' + carditemid] = carditeminfo;
          }
          
          carditemsidlist.push(carditemid);
        }
        cardinfo.item_list = carditemsidlist;
        updates['card/' + this.theUser.uid + '/' + cardid] = cardinfo;      
      }

      //initialize class data to be save
      let classinfo = {
        title: $('#txtclasstitle').val(),
        description: $('#txtclassdes').val(),
        image_url: imageurl,
        image_name: imagename,
        pulished: false,
        rating: 0,
        howmanytimestaken: 0,
        card_list: cardidlist,
        course_id: this.courseid
      };

      updates['class/' + this.theUser.uid + '/' + classid] = classinfo;
      updates['course/' + this.theUser.uid + '/' + this.courseid + '/class_list/' + classid] = classid;
      //updates['user_class/' + this.theUser.uid + '/' + classid] = classinfo.title;

      firebase.database().ref().update(updates)
      .then(() => {
        console.log('New class has succesfully submitted!');
        $('.btncreate').attr('disabled','true');//disable create button
        alert('New class has succesfully submitted!')
        //location.href = '/vcourse.html?courseid='+this.courseid;    
      }).catch((err)=>{
        console.log(err);
        console.log("failed to insert");
      });
    });
  }

  updateclassinfo(){

    if(!$('.btncreate').attr('disabled') === true){
      console.log('Unable to update, the class is not yet submitted.');
      return;
    }

    if(!$('#txtclasstitle').val()){
      alert('Class title fields cant be empty');
      $('#txtclasstitle').focus();
      return;
    }else if(!$('#txtclassdes').val()){
      alert('Class description fields cant be empty');
      $('#txtclassdes').focus();
      return;
    }else if(!document.querySelector('#class-input-img').files[0]){
      alert('Please provide an image for your class.');
      return;
    }//get confirmation

    // get the class id
    var classid = $('.class-form').attr('id');
    
    //Upload course image first
    //get image
    const imagefile = document.querySelector('#class-input-img').files[0];
    this.uploadimagefile(classid, imagefile, (imageurl,imagename)=>{
      if(imageurl === null){//cancel this operation when upload image failed
        return;
      }

      var updates = {};

      var cardidlist = [];

      var cards = $('.create-card-cont').children();//get all cards
  
      for(let c=0; c < cards.length; c++){
        let cardid = cards[c].getAttribute('id');
    
        cardidlist.push(cardid);//it collect all of the card id 
 
      }

      //initialize class data to be save
      let classes = {
        title: $('#txtclasstitle').val(),
        description: $('#txtclassdes').val(),
        image_url: imageurl,
        image_name: imagename,
        pulished: false,
        rating: 0,
        howmanytimestaken: 0,
        card_list: cardidlist,
        course_id: this.courseid
      };

      updates['class/' + this.theUser.uid + '/' + classid] = classes;
      updates['course_class_list/' + this.theUser.uid + '/classes/' + classid] = classes;

      firebase.database().ref().update(updates)
      .then(() => {
        console.log('Update succesfull!');
      }).catch((err)=>{
        console.log(err);
        console.log("failed to update");
      });
    });
  }

  updateclasscardslist(){

    if(!$('.btncreate').attr('disabled') === true){
      console.log('Unable to update, the class is not yet submitted.');
      return;
    }

    // get the class id
    var classid = $('.class-form').attr('id');
    
    var updates = {};

    var cardidlist = [];

    var cards = $('.create-card-cont').children();//get all cards
    
    for(let d=0; d < cards.length; d++){
      let cardid = cards[d].getAttribute('id');
        
      cardidlist.push(cardid);//it collect all of the card id 

    }

    updates['class/' + classid + '/card_list'] = cardidlist;

    firebase.database().ref().update(updates)
    .then(() => {
      console.log('Update succesfull!');
    }).catch((err)=>{
      console.log(err);
      console.log("failed to update");
    });
  }

  UpdateClassManager(modid){

    var setclass = (classid)=>{
      var classRef = firebase.database().ref('class/'+this.theUser.uid);
      classRef.child(classid).once('value', (snapclass) => {
        var classid = snapclass.key;
        var classe = snapclass.val();
        var class_cardidlist = snapclass.val().card_list;
        $('.class-form').attr('id', classid);
        $('#txtclasstitle').val(classe.title);
        $('#txtclassdes').val(classe.description);
        $('#class-img-prev-elid').attr('src', classe.image_url).parent('.prev-cont').css("display","block");
        $('.action_title').text('Update Class');
        $('.btncreate').text('Update');

        class_cardidlist.forEach(cardid => {
          setcards(cardid);
        });

      });
    }

    var setcards = (cardid)=>{ 

      var cardRef = firebase.database().ref('card/'+this.theUser.uid);
      cardRef.child(cardid).once('value', (snapcard) => {
        var cardid = snapcard.key;
        var id = cardid.substring(7, cardid.length);
        var card_carditemlist = snapcard.val().item_list;
        var card = new CardManager(this.theUser, id);//display one card
        card.setTitle(snapcard.val().title);
        card.setDescription(snapcard.val().description);

        card_carditemlist.forEach(carditemid => {
          setcarditems(id, carditemid);
        });

      });
    }

    var setcarditems = (cardid, carditemid)=>{

      var carditemRef = firebase.database().ref('card_item/'+this.theUser.uid);
      carditemRef.child(carditemid).once('value', (snapcarditem) => {
        var carditemid , id;
        var carditemtype = snapcarditem.val().type;

        if(carditemtype === 'videoitem'){
          carditemid = snapcarditem.key;
          id = carditemid.substring(13, cardid.length);
          var vtitle = snapcarditem.val().title;
          var vdescription = snapcarditem.val().description;
          var vname = snapcarditem.val().videoname;
          var vurl = snapcarditem.val().downloadURL;

          var videoitem = new VideoItemManager(cardid, id);//create new video item
          videoitem.setTitle(vtitle);
          videoitem.setDescription(vdescription);
          videoitem.setUrl(vurl);
        }else{
          carditemid = snapcarditem.key;
          id = carditemid.substring(15, cardid.length);
          var readingitem_itemlist = snapcarditem.val().item_list;
          new ReadingItemManager(cardid, id);//create new readinglist item

          readingitem_itemlist.forEach(itemid => {
            setitems(id, itemid);
          });

        } 
      });
    }

    var setitems = (carditemid, itemid)=>{

      var itemRef = firebase.database().ref('item/'+this.theUser.uid);
      itemRef.child(itemid).once('value', (snapitem) => {
        var itemid = snapitem.key;
        var id = itemid.substring(8, itemid.length);
        var itemtype = snapitem.val().itemtype;

        if(itemtype === 'qa'){

          var quizitem = new QuizItemManager(carditemid, 'qa', id);//create new Quiz item

          var correct_answers = snapitem.val().correct_answers;
          correct_answers.forEach(answer => {
            quizitem.addAnswer(answer.answer, answer.message);
          });

          var question_options = snapitem.val().question_options;
          question_options.forEach(option => {
            quizitem.addOption(option.option, option.message);
          });
          
        }else{
          var item = new ItemManager(carditemid, itemtype, id);//create new item
          item.setTextContent(snapitem.val().text);
        }

      });

    }

    setclass(modid);
  }
}