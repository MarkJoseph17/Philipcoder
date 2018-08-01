"use strict";
class QuizItemManager{
    constructor(carditemid,  elementtype, id){
        this.carditemid = carditemid;//also get the parent readinglist item id of this newly created quiz item, we pass it through our constructor of this class
        this.itemid;
        
        if(id){
            this.itemid = id;
        }else{
            let quizitemid = (new Date()).getTime().toString(36);//creates new quiz item id
            this.itemid = quizitemid;//Initialize quiz item id
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
                                    <input class="mdl-textfield__input txtquestion" type="text">
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
                            <div class="answer-option-flex-cont">
                                <span class="answer-option-close">
                                    <i class="material-icons">delete</i>
                                </span>
                                <div class="answer-option-col">
                                    <div class="mdl-textfield mdl-js-textfield" style="width: 100%;">
                                        <input class="mdl-textfield__input txtanswer" type="text">
                                        <label class="mdl-textfield__label" for="sample3" style="margin-bottom: 0px;">answer</label>
                                    </div>
                                </div>
                                <div class="msg-col">
                                    <div class="mdl-textfield mdl-js-textfield" style="width: 100%;">
                                        <textarea class="mdl-textfield__input txtanswer-msg" rows="1" type="text" style="box-sizing: border-box; resize: none;" data-autoresize></textarea>
                                        <label class="mdl-textfield__label" for="sample3" style="margin-bottom: 0px;">message</label>
                                    </div>
                                </div>
                            </div>  
                            <!-- new answer appear here -->         
                        </div>
                        <div class="add-answer-row">
                            <button class="mdl-button mdl-js-button mdl-button--fab addanswer" style="outline: none; height: 30px; min-width: 30px; width: 30px; color: gray;">
                                <i class="material-icons">add</i>
                            </button>
                        </div>

                        <hr>

                        <div class="option-row">
                            <div class="answer-option-flex-cont">
                                <span class="answer-option-close">
                                    <i class="material-icons">delete</i>
                                </span>
                                <div class="answer-option-col">
                                    <div class="mdl-textfield mdl-js-textfield" style="width: 100%;">
                                        <input class="mdl-textfield__input txtoption" type="text">
                                        <label class="mdl-textfield__label" for="sample3" style="margin-bottom: 0px;">option</label>
                                    </div>
                                </div>
                                <div class="msg-col">
                                    <div class="mdl-textfield mdl-js-textfield" style="width: 100%;">
                                        <textarea class="mdl-textfield__input txtoption-msg" rows="1" type="text" style="box-sizing: border-box; resize: none;" data-autoresize></textarea>
                                        <label class="mdl-textfield__label" for="sample3" style="margin-bottom: 0px;">message</label>
                                    </div>
                                </div>
                            </div> 
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
                });
            }     
        });

        $('#item-id-'+this.itemid).find('.addanswer').click(()=>{
            this.addAnswer();
        });

        $('#item-id-'+this.itemid).find('.addoption').click(()=>{
            this.addOption();
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
        $('#item-id-'+this.itemid).find('.answer-option-close').click(function(){
            $(this).parent('.answer-option-flex-cont').fadeOut(function(){
                $(this).parent('.answer-option-flex-cont').remove();
            });
        });
    }

    addAnswer(text = null, msg = null){
        var option =`<div class="answer-option-flex-cont">
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
            $(option).appendTo($('#item-id-'+this.itemid).find('.answer-row')).hide().show('fadein');//apply fadein effects 
    
            this.setOptionClosedClickEventListener();
            this.autoresizeTextarea();
            // This required to make the UI look correctly by Material Design Lite
            componentHandler.upgradeElements(document.getElementById('item-id-'+this.itemid));
    }

    addOption(text = null, msg = null){
        var option =`<div class="answer-option-flex-cont">
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
            // This required to make the UI look correctly by Material Design Lite
            componentHandler.upgradeElements(document.getElementById('item-id-'+this.itemid));
    }
}