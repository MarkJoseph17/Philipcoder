"use strict";

class CodeQuestionManager {
    constructor(theUser, cardid, carditemid, itemtype, id = null) {
        this.theUser = theUser;
        this.cardid = cardid;//also get the parent card id of this newly created item, we pass it through our constructor of this class
        this.carditemid = carditemid; //also get the parent readinglist item id of this newly created item, we pass it through our constructor of this class
        this.itemid;

        if(id){
            this.itemid = id;
            setTimeout(()=>{
                this.updateReadingItemsList();
            }, 1000);   
        }else{
            return;
        }

        var element = `<div id="item-id-${this.itemid}" class="item code_question" data-type="cq">
            <div class="question-menu-row">
                <div class="question-col">
                </div>
                <div class="mdl-textfield mdl-js-textfield" style="width: 90%;">
                    <input class="mdl-textfield__input txtquestion" type="text" id="questionField${this.itemid}">
                    <label class="mdl-textfield__label" for="questionField${this.itemid}" style="margin-bottom: 0px;">question</label>
                </div>
                <!-- Icon button -->
                <button id="show-dialog-${this.itemid}" class="mdl-button mdl-js-button mdl-button--icon" style="position: absolute; top: 30%; right: 5%; outline: none; color: gray;">
                    <i class="material-icons" style="font-size: 20px;">image</i>
                </button>
            </div>
        </div>
        <!--This is for HTML-->
        <div class="form-check form-check-inline">
            <input type="checkbox" id="showHtmlCheckbox${this.itemid}" check="checked" />
            <label class="form-check-label" for="showHtmlCheckbox">Use HTML</label>
        </div>
            <label style="margin-left: 100px;">Starting Point For the Student:</label>
            <br>
            <textarea id="startingHtmlText" cols="50" rows="20"></textarea> 
            <br>
            <label>Correct Answer:</label>
        <br/>
            <textarea id="correctHtmlText" cols="50" rows="20"></textarea>          
        <br>
        <div id="item-id-${this.itemid}" class="item code_question" data-type="cq">
            <div class="question-menu-row">
                <div class="question-col">
            </div>
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 90%;">
                <input class="mdl-textfield__input cssquestion" type="text" id="cssquestionField${this.itemid}">
                <label class="mdl-textfield__label" for="cssquestionField${this.itemid}" style="margin-bottom: 0px;">cssquestion</label>
                </div>
            </div>
        </div>
        <!--This is for CSS-->
        <div class="form-check form-check-inline">
            <input type="checkbox" id="showCssCheckbox${this.itemid}" check="checked" />
            <label class="form-check-label" for="showCssCheckbox">Use CSS</label>
            <div>
                <label style="margin-left: 100px;">Starting Point For the Student:</label>
            </div>
        </div>
            <textarea id="startingCssText" cols="50" rows="20"></textarea>
        <div>
            <label>Correct Answer:</label>
        </div>
            <textarea id="correctCssText" cols="50" rows="20"></textarea>
        <br>

        <!--This is for JS-->
        <div class="form-check form-check-inline">
            <input type="checkbox" id="showJsCheckbox${this.itemid}" check="checked" />
            <label class="form-check-label" for="showJsCheckbox">Use JavaScript</label>
            <div>
                <label style="margin-left: 100px;">Starting Point For the Student:</label>
            </div>
        </div>
            <textarea id="startingJavaScriptText" cols="50" rows="20"></textarea>
        <div>
            <label>Correct Answer:</label>
        </div>
            <textarea id="correctJavaScriptText" cols="50" rows="20"></textarea>
        <br>
        <div id="output" style="width:100%; height:300px; border: 2px solid black;">
        </div>
        <br/>
        <button id="doit" style="padding: 10px; width: 20%;">Run</button>`;

         //Initialize element 
         $('#readingitem-id-' + this.carditemid).find('.items-container > ul').append(`
        <li>
            <span class="item-close-but">
                <i class="material-icons">close</i>
            </span>
            <div id="item-con-id-${this.itemid}" class="item-container">
                ${element}
            </div>
        </li>`);

        // This required to make the UI look correctly by Material Design Lite
        componentHandler.upgradeElements(document.getElementById('item-id-'+this.itemid));
        
        $('#item-id-' + this.itemid).focus();
        this.setEventHandlerListener();
        this.setTextarea();
    }

    setEventHandlerListener() {

        $('#item-id-' + this.itemid).parents('li').hover(()=> {
            $(this).find('.item-close-but').css({
                'display': 'block'
            });
        }, ()=> {
            $(this).find('.item-close-but').css({
                'display': 'none'
            });
        });

        $('#item-id-' + this.itemid).parents('li').find('.item-close-but').click((e) => {
            var c = e.currentTarget;
            if(confirm('Delete this item?')){
                this.deleteItem();
            }  
        });

        $('#questionField'+this.itemid).change((e)=>{
            this.saveItemInfo('question', e.currentTarget.value);
        });

        $('#cssquestionField'+this.itemid).change((e)=>{
            this.saveItemInfo('cssquestion', e.currentTarget.value);
        });
    }

    saveItemInfo(fields, value){

        var updates = {};

        updates['item/' + this.theUser.uid + '/readingitem-id-' + this.carditemid +  '/item-id-' + this.itemid + '/'+fields+'/'] = value; 
 
        firebase.database().ref().update(updates)
        .then(() => {     
            console.log('Item saved');
        }).catch((err)=>{
            console.log(err);  
        });
    }

    setTextarea() {
        //This is for html
        var startingHtmlText = document.getElementById("startingHtmlText");
        this.editorhtml = CodeMirror.fromTextArea(startingHtmlText, {
            mode: 'html',
            theme: '3024-day',
            lineNumbers: true,
            firstLineNumber: 1
        });
        
        this.editorhtml.on("change", ()=> {
            this.saveItemInfo('startingHtmlText', this.editorhtml.getValue());
        });
      
        var correctHtmlText = document.getElementById("correctHtmlText");
        this.editor2Html = CodeMirror.fromTextArea(correctHtmlText, {
            mode: 'html',
            theme: '3024-day',
            lineNumbers: true
        }); 
        
        this.editor2Html.on("change", ()=> {
            this.saveItemInfo('correctHtmlText', this.editor2Html.getValue());  
        });
        
        $(`#showHtmlCheckbox${this.itemid}`).change((e) => {
            var shouldBeShow = e.currentTarget.checked;
            this.saveItemInfo('showHtml', shouldBeShow);
            if (shouldBeShow) {
                this.editor2Html.setOption("readOnly", false);
                this.editorhtml.setOption("readOnly", false);
            } else {
                this.editor2Html.setOption("readOnly", true);
                this.editorhtml.setOption("readOnly", true);
            }
        });

        //This is for css
        var startingCssText = document.getElementById("startingCssText");
        this.editorcss = CodeMirror.fromTextArea(startingCssText, {
            mode: "css",
            theme: '3024-day',
            lineNumbers: true,
            tabsize: 2
        });
        this.editorcss.on("change", ()=> {
            this.saveItemInfo('startingCssText', this.editorcss.getValue());
        });

        var correctCssText = document.getElementById("correctCssText");
        this.editor2Css = CodeMirror.fromTextArea(correctCssText, {
            mode: "css",
            theme: '3024-day',
            lineNumbers: true,
            tabsize: 2
        });
        this.editor2Css.on("change", ()=> {
            this.saveItemInfo('correctCssText', this.editor2Css.getValue());
        });

        $(`#showCssCheckbox${this.itemid}`).change((e) => {
            var shouldBeShow = e.currentTarget.checked;
            this.saveItemInfo('showCss', shouldBeShow);
            if (shouldBeShow) {
                this.editor2Css.setOption("readOnly", false);
                this.editorcss.setOption("readOnly", false);
            } else {
                this.editor2Css.setOption("readOnly", true);
                this.editorcss.setOption("readOnly", true);
            }
        });

        //This is for javascript
        var startingJavaScriptText = document.getElementById("startingJavaScriptText");
        this.editorjavascript = CodeMirror.fromTextArea(startingJavaScriptText, {
            mode: "javascript",
            theme: '3024-day',
            lineNumbers: true
        });
        this.editorjavascript.on("change", ()=> {
            this.saveItemInfo('startingJavaScriptText', this.editorjavascript.getValue());
        });

        var correctJavaScriptText = document.getElementById("correctJavaScriptText");
        this.editor2JavaScript = CodeMirror.fromTextArea(correctJavaScriptText, {
            mode: "javascript",
            theme: '3024-day',
            lineNumbers: true
        });
        this.editor2JavaScript.on("change", ()=> {
            this.saveItemInfo('correctJavaScriptText', this.editor2JavaScript.getValue());
        });

        $(`#showJsCheckbox${this.itemid}`).change((e) => {
            var shouldBeShow = e.currentTarget.checked;
            this.saveItemInfo('showJavaScript', shouldBeShow);
            if (shouldBeShow) {
                this.editor2JavaScript.setOption("readOnly", false);
                this.editorjavascript.setOption("readOnly", false);
            } else {
                this.editor2JavaScript.setOption("readOnly", true);
                this.editorjavascript.setOption("readOnly", true);
            }
        });

        $('#doit').click(() => {
            $('#output').empty();

            $('#output')
                .append("<style>" + this.editor2Css.getValue() + "</style>")
                .append("<script>" + this.editor2JavaScript.getValue() + "<" + "/" + "script" + ">")
                .append(this.editor2Html.getValue());
        });
    }

    updateReadingItemsList(){

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
            message: 'Item deleted',
            timeout: 5000,
            actionHandler: handler,
            actionText: 'Undo'
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }
}