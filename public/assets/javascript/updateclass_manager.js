"use strict";

class UpdateClassManager {
  constructor(theUser) {
    this.theUser = theUser;

    if(!this.theUser){
        return;
    }

  }

  setclass(classid){
    var classRef = firebase.database().ref('class/' + this.theUser.uid);
    classRef.child(classid).once('value', (snapclass) => {

      var classid = snapclass.key; 
      var classe = snapclass.val();

      //var class_cardidlist = snapclass.val().card_list;
      $('.action_title').text('Update Class');

      if(classe){

        $('#txtclasstitle').val(classe.title);
        $('#txtclassdes').val(classe.description);
        $('#class-img-prev-elid').attr('src', classe.image_url).parent('.prev-cont').css("display","block");

        /*if(class_cardidlist){
          class_cardidlist.forEach(cardid => {
              this.setcards(classid, cardid);
          });
        }*/
      }
      
    });
  }

  setcards(classid, cardid){ 

    console.log('ads');

    var cardRef = firebase.database().ref('card/'+this.theUser.uid + '/classid_' + classid);
    cardRef.child(cardid).once('value', (snapcard) => {
      var cardid = snapcard.key;
      cardid = cardid.substring(7, cardid.length);
      var card_carditemlist = snapcard.val().item_list;
      var isDeleted = snapcard.val().isDeleted;

      if(!isDeleted){     
        var card = new CardManager(this.theUser, classid, cardid);//display one card
        card.setTitle(snapcard.val().title);
        card.setDescription(snapcard.val().description);

        if(card_carditemlist){
          card_carditemlist.forEach(carditemid => {
            this.setcarditems(cardid, carditemid);
          });
        }
      }

    });

  }

  setcarditems(cardid, carditemid){

    var carditemRef = firebase.database().ref('card_item/'+this.theUser.uid + '/cardid_' + cardid);
    carditemRef.child(carditemid).once('value', (snapcarditem) => {
      var carditemid = snapcarditem.key;
      var carditemtype = snapcarditem.val().type;
      var isDeleted = snapcarditem.val().isDeleted;

      if(!isDeleted){
        if(carditemtype === 'videoitem'){
        
          carditemid = carditemid.substring(13, carditemid.length);
          var vtitle = snapcarditem.val().title;
          var vdescription = snapcarditem.val().description;
          var vname = snapcarditem.val().videoname;
          var vurl = snapcarditem.val().downloadURL;

          var videoitem = new VideoItemManager(this.theUser, cardid, carditemid);//create new video item
          videoitem.setTitle(vtitle);
          videoitem.setDescription(vdescription);
          videoitem.setUrl(vurl);

        }else{
          
          carditemid = carditemid.substring(15, carditemid.length);
          var readingitem_itemlist = snapcarditem.val().item_list;
          new ReadingItemManager(this.theUser, cardid, carditemid);//create new readinglist item

          if(readingitem_itemlist){
            readingitem_itemlist.forEach(itemid => {
                this.setitems(cardid, carditemid, itemid);
            });
          }

        } 
      }

    });

  }

  setitems(cardid, carditemid, itemid){

    var itemRef = firebase.database().ref('item/' + this.theUser.uid + '/readingitem-id-' + carditemid);
    itemRef.child(itemid).once('value', (snapitem) => {
      var itemid = snapitem.key;
      itemid = itemid.substring(8, itemid.length);
      var itemtype = snapitem.val().itemtype;
      var isDeleted = snapitem.val().isDeleted;

      if(!isDeleted){

        if(itemtype === 'qa'){

          var quizitem = new QuizItemManager(this.theUser, cardid, carditemid, 'qa', itemid);//create new Quiz item

          quizitem.addQuestion(snapitem.val().text);

          var correct_answers = snapitem.val().correct_answers;

          if(correct_answers){
            correct_answers.forEach(answer => {
              quizitem.addAnswer(answer.textcontent, answer.message);
            });
          }else{
            quizitem.addAnswer('', '');
          }  

          var question_options = snapitem.val().question_options;

          if(question_options){
            question_options.forEach(option => {
              quizitem.addOption(option.textcontent, option.message);
            });
          }else{
            quizitem.addOption('', '');
          }

        }else if(itemtype == 'cq'){
          var targetCodeQuestionManager = new CodeQuestionManager(this.theUser, cardid, carditemid, itemtype, itemid);//create new item
          $(`#questionField${itemid}`).val(data.val().question);
            $(`#showHtmlCheckbox${itemid}`).prop('checked', data.val().showHtml);
            $(`#showCssCheckbox${itemid}`).prop('checked', data.val().showCss);
            $(`#showJsCheckbox${itemid}`).prop('checked', data.val().showJavaScript);
            targetCodeQuestionManager.editorhtml.getValue(data.val().startingHtmlText);
            targetCodeQuestionManager.editor2Html.getValue(data.val().correctHtmlText);
            targetCodeQuestionManager.editorcss.getValue(data.val().startingCssText);
            targetCodeQuestionManager.editor2Css.getValue(data.val().correcCssText);
            targetCodeQuestionManager.editorjavascript.getValue(data.val().startingJavaScriptText);
            targetCodeQuestionManager.editor2JavaScript.getValue(data.val().correctJavaScriptText);
           
        }else{
          var item = new ItemManager(this.theUser, cardid, carditemid, itemtype, itemid);//create new item           
          item.setTextContent(snapitem.val().text);                  
        }

      }

    });

  }
}