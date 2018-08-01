"use strict";
class QuizItemManager{
    constructor(theUser, cardid, carditemid,  elementtype, id){
        this.theUser = theUser;
        this.cardid = cardid;//also get the parent card id of this newly created item, we pass it through our constructor of this class
        this.carditemid = carditemid;//also get the parent readinglist item id of this newly created quiz item, we pass it through our constructor of this class
        this.itemid;
        this.type = elementtype;
        
        if(id){
            this.itemid = id;
            setTimeout(()=>{
                this.updatereadingitemslist();
            }, 1000);   
        }else{
            return;
        }

        var element = `<div id="item-id-${this.itemid}" class="item question_answer" data-type="${elementtype}">
                        <div class="question-menu-row">
                            <div class="question-col">

                            <!--<dialog class="mdl-dialog" id="dialog-${this.itemid}">
                                <h5 class="mdl-dialog__title">Upload an image</h5>
                                <div class="mdl-dialog__content">
                                    <form class="formupload">
                                        <div class="form-group">
                                        <label for="exampleFormControlFile1">Upload image</label>
                                        <input type="file" class="form-control-file" id="imagefile" style="outline: none;">
                                        <div class="image-cont" style="display: none; margin-top: 8px;">
                                            <img id="imagepreview" src="#" alt="..." class="img-thumbnail float-right" width="50px" height="50px">
                                            <span style="float: right; margin: 5px;">Image preview</span>
                                        </div>
                                        </div>
                                    </form>
                                </div>
                                <div class="mdl-dialog__actions">
                                    <button type="button" class="mdl-button" style="outline: none;">Ok</button>
                                    <button type="button" class="mdl-button close" style="outline: none;">Cancel</button>
                                </div>
                            </dialog>-->

                                <div class="mdl-textfield mdl-js-textfield" style="width: 90%;">
                                    <!--<input class="mdl-textfield__input txtquestion" type="text">-->
                                    <textarea class="mdl-textfield__input txtquestion" rows="1" type="text" style="box-sizing: border-box; resize: none;" data-autoresize></textarea>
                                    <label class="mdl-textfield__label" for="sample3" style="margin-bottom: 0px;">question</label>
                                </div>
                                <!-- Icon button -->
                                <button id="show-dialog-${this.itemid}" class="mdl-button mdl-js-button mdl-button--icon" style="position: absolute; top: 30%; right: 5%; outline: none; color: gray;">
                                    <i class="material-icons" style="font-size: 20px;">image</i>
                                </button>
                            </div>
                            <div class="menu-col">
                                <!-- Flat button with ripple -->
                                <select style="outline: none;">
                                    <option>Multiple choice</option>
                                    <option>Paragraph</option>
                                </select>             
                            </div>
                        </div>

                        <hr>

                        <div class="answer-row"> 
                            <!-- new answer appear here -->         
                        </div>
                        <div class="add-answer-row">
                            <button class="mdl-button mdl-js-button mdl-button--fab addanswer" style="outline: none; height: 30px; min-width: 30px; width: 30px; color: gray;">
                                <i class="material-icons">add</i>
                            </button>
                        </div>

                        <hr>

                        <div class="option-row">
                            <!-- new option appear here -->                                               
                        </div>  
                        <div class="add-option-row">
                            <button class="mdl-button mdl-js-button mdl-button--fab addoption" style="outline: none; height: 30px; min-width: 30px; width: 30px; color: gray;">
                                <i class="material-icons">add</i>
                            </button>
                        </div>     

                        <hr>            

                      </div>`;//Initialize element 

        $('#readingitem-id-'+this.carditemid).find('.items-container > ul').append(`
            <li>
                <span class="item-close-but">
                    <i class="material-icons">close</i>
                </span>
                <div id="item-con-id-${this.itemid}" class="item-container">
                    ${element}
                </div>
            </li>
        `);

        $('#item-id-'+this.itemid).focus();

        this.setEventHandlerListener();
       
        // This required to make the UI look correctly by Material Design Lite
        componentHandler.upgradeElements(document.getElementById('item-id-'+this.itemid));
    }

    readURL(input, preview_element_id) {
        if (input.files && input.files[0]) {
          var reader = new FileReader();
    
          reader.onload = function(e) {
            $('#'+preview_element_id).attr('src', e.target.result);
          }
         
          reader.readAsDataURL(input.files[0]);
        }
    }

    setEventHandlerListener(){

        $('#item-id-'+this.itemid).parents('li').hover(function(){
            $(this).find('.item-close-but').css({'display':'block'});
        },function(){
            $(this).find('.item-close-but').css({'display':'none'});
        });

        $('#item-id-'+this.itemid).parents('li').find('.item-close-but').click((e)=>{
            var c = e.currentTarget;
            if(confirm('Delete this item?')){
                $(c).parent().fadeOut('slow', (e)=>{
                    $(c).parent().remove();
                    this.deleteItem();
                });
            }     
        });

        $('#item-id-'+this.itemid).find('.addanswer').click(()=>{
            this.addAnswer();
        });

        $('#item-id-'+this.itemid).find('.addoption').click(()=>{
            this.addOption();
        });

        $('#item-id-'+this.itemid).find('.txtquestion').change((e)=>{
            this.saveItem('text', $(e.currentTarget).val());
        });

        this.setOptionClosedClickEventListener();
        this.autoresizeTextarea();
        //this.setupUploadImageDialog();
    }

    setupUploadImageDialog(){
        var dialog = document.querySelector('#dialog-'+this.itemid);
        var showDialogButton = document.querySelector('#show-dialog-'+this.itemid);
        if (! dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        showDialogButton.addEventListener('click', function() {
            dialog.showModal();
        });
        dialog.querySelector('#dialog-'+this.itemid+' .close').addEventListener('click', function() {
            dialog.close();
        });
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

    setOptionClosedClickEventListener(){
        $('#item-id-'+this.itemid).find('.answer-option-close').click((e)=>{
            var fieldType = $(e.currentTarget).parent('.answer-option-flex-cont').attr('data-type');
            $(e.currentTarget).parent('.answer-option-flex-cont').fadeOut(()=>{
                $(e.currentTarget).parent('.answer-option-flex-cont').remove();
                this.setItemValue(fieldType);
            });
        });
    }

    updatereadingitemslist(){

        var updates = {};
  
        var itemsidlist = [], items = $('#readingitem-id-'+this.carditemid).find('div.items-container ul').children();//get all card items
        if(items.length > 0){
            for(let b=0; b < items.length; b++){
                var editable = $(items[b]).find('.item');
                var itemid = $(editable[0]).attr('id');
                if(itemid){
                    itemsidlist.push(itemid);
                }            
            }        
            updates['card_item/' + this.theUser.uid + '/cardid_' + this.cardid + '/readingitem-id-'+ this.carditemid  +'/item_list'] = itemsidlist;
        }else{
            updates['card_item/' + this.theUser.uid + '/cardid_' + this.cardid + '/readingitem-id-'+ this.carditemid  +'/item_list'] = null;
        }   
                
        firebase.database().ref().update(updates)
        .then(() => {
          console.log('Reading item list Updated succesfull!');
        }).catch((err)=>{
          console.log(err);
          console.log("failed to update");
        });
    }

    addQuestion(intext){
        $('#item-id-'+this.itemid).find('.txtquestion').text(intext);
    }

    addAnswer(intext, inMsg){

        var text, msg;

        if(intext == undefined && inMsg == undefined){
            text = '';
            msg = '';
        }else{
            text = intext;
            msg = inMsg;
        }

        var answer =`<div class="answer-option-flex-cont" data-type="correct_answers">
                            <span class="answer-option-close">
                                <i class="material-icons">delete</i>
                            </span>
                            <div class="answer-option-col">
                                <div class="mdl-textfield mdl-js-textfield" style="width: 100%;">
                                    <input class="mdl-textfield__input txtanswer" type="text" value="${text}">
                                    <label class="mdl-textfield__label" for="sample3" style="margin-bottom: 0px;">answer</label>
                                </div>
                            </div>
                            <div class="msg-col">
                                <div class="mdl-textfield mdl-js-textfield" style="width: 100%;">
                                    <textarea class="mdl-textfield__input txtanswer-msg" rows="1" type="text" style="box-sizing: border-box; resize: none;" data-autoresize>${msg}</textarea>
                                    <label class="mdl-textfield__label" for="sample3" style="margin-bottom: 0px;">message</label>
                                </div>
                            </div>
                        </div> `;
            $(answer).appendTo($('#item-id-'+this.itemid).find('.answer-row')).hide().show('fadein');//apply fadein effects 
    
            this.setOptionClosedClickEventListener();
            this.autoresizeTextarea();

            $('#item-id-'+this.itemid).find('.txtanswer').change((e)=>{
                this.setItemValue('correct_answers', $(e.currentTarget).val());
            });

            $('#item-id-'+this.itemid).find('.txtanswer-msg').change((e)=>{
                this.setItemValue('correct_answers', $(e.currentTarget).val());
            });

            // This required to make the UI look correctly by Material Design Lite
            componentHandler.upgradeElements(document.getElementById('item-id-'+this.itemid));
    }

    addOption(intext, inMsg){

        var text, msg;

        if(intext == undefined && inMsg == undefined){
            text = '';
            msg = '';
        }else{
            text = intext;
            msg = inMsg;
        }
        
        var option =`<div class="answer-option-flex-cont" data-type="question_options">
                            <span class="answer-option-close">
                                <i class="material-icons">delete</i>
                            </span>
                            <div class="answer-option-col">
                                <div class="mdl-textfield mdl-js-textfield" style="width: 100%;">
                                    <input class="mdl-textfield__input txtoption" type="text" value="${text}">
                                    <label class="mdl-textfield__label" for="sample3" style="margin-bottom: 0px;">option</label>
                                </div>
                            </div>
                            <div class="msg-col">
                                <div class="mdl-textfield mdl-js-textfield" style="width: 100%;">
                                    <textarea class="mdl-textfield__input txtoption-msg" rows="1" type="text" style="box-sizing: border-box; resize: none;" data-autoresize>${msg}</textarea>
                                    <label class="mdl-textfield__label" for="sample3" style="margin-bottom: 0px;">message</label>
                                </div>
                            </div>
                        </div>`;
            $(option).appendTo($('#item-id-'+this.itemid).find('.option-row')).hide().show('fadein');//apply fadein effects 
    
            this.setOptionClosedClickEventListener();
            this.autoresizeTextarea();

            $('#item-id-'+this.itemid).find('.txtoption').change((e)=>{
                this.setItemValue('question_options', $(e.currentTarget).val());
            });

            $('#item-id-'+this.itemid).find('.txtoption-msg').change((e)=>{
                this.setItemValue('question_options', $(e.currentTarget).val());
            });

            // This required to make the UI look correctly by Material Design Lite
            componentHandler.upgradeElements(document.getElementById('item-id-'+this.itemid));
    }

    saveItem(fields, value){

        var updates = {};
 
        updates['item/' + this.theUser.uid + '/readingitem-id-' + this.carditemid +  '/item-id-' + this.itemid + '/'+fields+'/'] = value;

        firebase.database().ref().update(updates)
        .then(() => {     
            console.log('Item saved');
        }).catch((err)=>{
            console.log(err);  
        });
    }

    setItemValue(fieldType){

        var listValues = [];

        var values, txtcontent, txtmsg;

        if(fieldType == 'correct_answers'){
            values = $('#item-id-'+this.itemid).find('.answer-row').children();
            txtcontent = '.txtanswer';
            txtmsg = '.txtanswer-msg';
        }else{
            values = $('#item-id-'+this.itemid).find('.option-row').children();
            txtcontent = '.txtoption';
            txtmsg = '.txtoption-msg';
        }

        let i=0;
        while( i < values.length){
          var value = {
            textcontent : $(values[i]).find(txtcontent).val(),
            message : $(values[i]).find(txtmsg).val()
          }
          i++
          listValues.push(value);
        }
        this.saveItem(fieldType, listValues);
    }

    deleteItem(){
        
        firebase.database().ref('item/' + this.theUser.uid + '/readingitem-id-' + this.carditemid +  '/item-id-' + this.itemid).update({'isDeleted':true})
        .then(() => {   
            console.log('Item Deleted');
            this.showUndoSnackBar();
        }).catch((err)=>{
          console.log(err);  
        }); 
    }

    showUndoSnackBar(){
        var snackbarContainer = document.querySelector('.mdl-snackbar');

        var handler = (event)=> {
            firebase.database().ref('item/' + this.theUser.uid + '/readingitem-id-' + this.carditemid +  '/item-id-' + this.itemid).update({'isDeleted':false})
            .then(() => {   
            }).catch((err)=>{
                console.log(err);  
            }); 
        };

        var data = {
            message: 'Quiz item deleted',
            timeout: 5000,
            actionHandler: handler,
            actionText: 'Undo'
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }
}