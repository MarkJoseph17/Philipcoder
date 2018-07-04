"use strict";

class ClassManager {
  constructor(theUser,courseid) {
    console.log(theUser);
    this.theUser = theUser;
    this.courseid = courseid;

    //creates new class id
    let classid = (new Date()).getTime().toString(36);
    this.classid = classid;//Initialize class id
    $('.class-form').attr('id','classid_'+this.classid);

    new CardManager(this.theUser, this.courseid, this.classid);//display one card

    this.setClassFormInputEventHandlers();
    this.setFloatingMenuButtonEventHandlers();

    $('.btncreate').click((e)=>{
      this.addclass();
      //alert("Temporary disabled!");
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
      new CardManager(this.theUser, this.courseid, this.classid);
      $("[data-toggle='tooltip']").tooltip('hide');//this makes tooltip refresh its text content
    });

    $('#floating-menu button.listview').click((e)=>{
      var c = e.currentTarget;

      if(c.firstElementChild.textContent === 'view_list'){

        this.setcardlistTitleDes();//this function set title and description for every card

        $('.class-card').css({'height':'80px','cursor':'default','overflow':'hidden'});//sets all cards height to max-content
        $('.elements-items-container').css({'display':'none'});//Hides all cards contents
        $('.card-panel').css({'display':'block'});//Displays the cards panel for listview

        c.firstElementChild.textContent = 'view_module';//changes the listview button icon to large view
        c.setAttribute('data-original-title','Large view');//makes this button tooltip text to "Large view"

        $('.card-view-but').children('i').text('view_module');//this makes all cards view button(beside close button) to be large view

      }else{

        $('.class-card').css({'height':'auto','cursor':'default','overflow':'unset'});//sets all cards height to 350 pixels (default)
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

      elements[0].textContent = card_title;//set title to h5 tag
      elements[1].textContent = card_des;//set description to paragraph tag

      if(!card_title){
        elements[0].textContent = 'Card title here..';//set empty title to h5 tag
      }
      if(!card_des){
        elements[1].textContent = 'Card description here';//set empty description to paragraph tag
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
              updates['card_item/'+ carditemid] = carditeminfo;
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
              var editable = $(items[z]).find('.editable');
              var itemid = $(editable[0]).attr('id');
              var itemtype = $(editable[0]).attr('data-type');
              var content = $(editable[0]).html();

              var iteminfo = {
                type : itemtype,
                text : null
              }

              if(itemtype === 'image'){
                var imgcontent = '';
                var images = $(editable[0]).children("div.medium-insert-images")
                for(let a=0; a < images.length; a++){
                  var dclass = $(images[a]).attr('class');
                  imgcontent += '<div class="' + dclass + '">' + $(images[a]).html() + '</div>';
                }
                iteminfo.text = imgcontent;
              }else{
                iteminfo.text = content;
              }

              updates['item/'+ itemid] = iteminfo;   

              itemsidlist.push(itemid);
  
            }
            carditeminfo = {
              type : 'readinglist',
              item_list: itemsidlist
            }      
            updates['card_item/'+ carditemid] = carditeminfo;
          }
          
          carditemsidlist.push(carditemid);
        }
        cardinfo.item_list = carditemsidlist;
        updates['card/'+ cardid] = cardinfo;      
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
        card_list: cardidlist
      };

      updates['class/' + classid] = classes;
      updates['course_class_list/' + this.courseid + '/classes/' + classid] = classes;

      firebase.database().ref().update(updates)
      .then(() => {
        console.log('New class has succesfully submitted!');
        $('.btncreate').attr('disabled','true');//disable create button
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
        card_list: cardidlist
      };

      updates['class/' + classid] = classes;
      updates['course_class_list/' + this.courseid + '/classes/' + classid] = classes;

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
}