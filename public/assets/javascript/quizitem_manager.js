"use strict";
class QuizItemManager{
    constructor(cardid, carditemid,  elementtype){
        this.cardid = cardid;//also get the parent card id of this newly created quiz item, we pass it through our constructor of this class
        this.carditemid = carditemid;//also get the parent readinglist item id of this newly created quiz item, we pass it through our constructor of this class
        let quizitemid = (new Date()).getTime().toString(36);//creates new quiz item id
        this.itemid = quizitemid;//Initialize quiz item id

        var element = `<div id="item-id-${this.itemid}" class="question_answer" data-type="qa">
                        <div class="question-menu-row">
                            <div class="question-col">
                                <div class="mdl-textfield mdl-js-textfield" style="width: 100%; margin-top: -20px; margin-bottom: -20px;">
                                    <input class="mdl-textfield__input txtquestion" type="text">
                                    <label class="mdl-textfield__label" for="sample3" style="margin-bottom: 0px;">question</label>
                                </div>
                            </div>
                            <div class="menu-col">
                                <!-- drop down menu here soon -->
                            </div>
                        </div>
                        <div class="answer-row">
                            <div class="mdl-textfield mdl-js-textfield" style="width: 100%; margin-top: -20px; margin-bottom: -20px;">
                                <input class="mdl-textfield__input txtanswer" type="text">
                                <label class="mdl-textfield__label" for="sample3" style="margin-bottom: 0px;">answer</label>
                            </div>
                        </div>
                        <div class="option-row">
                            <div class="mdl-textfield mdl-js-textfield option-cont" style="width: 100%; margin-top: -20px;">
                                <span class="option-close">
                                    <i class="material-icons">delete</i>
                                </span>
                                <input class="mdl-textfield__input txtoption" type="text">
                                <label class="mdl-textfield__label" for="sample3" style="margin-bottom: 0px;">option</label>
                            </div>                                                 
                        </div>  
                        <div class="add-option-row">
                            <button class="mdl-button mdl-js-button mdl-button--fab addoption" style="outline: none; height: 30px; min-width: 30px; width: 30px; color: gray; margin-top: -20px;">
                                <i class="material-icons">add</i>
                            </button>
                        </div>                   
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

        $('#item-id-'+this.itemid).find('.addoption').click(()=>{
            var option = `<div class="mdl-textfield mdl-js-textfield option-cont" style="width: 100%; margin-top: -20px;">
                            <span class="option-close">
                                <i class="material-icons">delete</i>
                            </span>
                            <input class="mdl-textfield__input txtoption" type="text">
                            <label class="mdl-textfield__label" for="sample3" style="margin-bottom: 0px;">option</label>
                        </div>`;
            $(option).appendTo($('#item-id-'+this.itemid).find('.option-row')).hide().show('fadein');//apply fadein effects 
    
            this.setOptionClosedClickEventListener();
            // This required to make the UI look correctly by Material Design Lite
            componentHandler.upgradeElements(document.getElementById('item-id-'+this.itemid));
        });

        this.setOptionClosedClickEventListener();
    }

    setOptionClosedClickEventListener(){
        $('#item-id-'+this.itemid).find('.option-close').click(function(){
            $(this).parent('.option-cont').fadeOut(function(){
                $(this).parent('.option-cont').remove();
            });
        });
    }
}