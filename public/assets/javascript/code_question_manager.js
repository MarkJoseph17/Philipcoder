"use strict";

class CodeQuestionManager {
    constructor(carditemid, itemtype, id = null) {
        this.carditemid = carditemid; //also get the parent readinglist item id of this newly created item, we pass it through our constructor of this class
        this.itemid;

        if (id) {
            this.itemid = id;
        } else {
            let newitemid = (new Date()).getTime().toString(36); //creates new item id
            this.itemid = newitemid; //Initialize item id
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
            <div>
                <label style="margin-left: 100px;">Starting Point For the Student:</label>
            </div>
        </div>
            <textarea id="htmlText" cols="50" rows="20"></textarea>
        <div>
            <label>Correct Answer:</label>
        </div>
        <br>
        <!--This is for CSS-->
        <div class="form-check form-check-inline">
            <input type="checkbox" id="showCssCheckbox${this.itemid}" check="checked" />
            <label class="form-check-label" for="showCssCheckbox">Use CSS</label>
            <div>
                <label style="margin-left: 100px;">Starting Point For the Student:</label>
            </div>
        </div>
            <textarea id="cssText" cols="50" rows="20"></textarea>
        <div>
            <label>Correct Answer:</label>
        </div>
        <br>

        <!--This is for JS-->
        <div class="form-check form-check-inline">
            <input type="checkbox" id="showJavascriptCheckbox${this.itemid}" check="checked" />
            <label class="form-check-label" for="showJavascriptCheckbox">Use JavaScript</label>
            <div>
                <label style="margin-left: 100px;">Starting Point For the Student:</label>
            </div>
        </div>
            <textarea id="javascriptText" cols="50" rows="20"></textarea>
        <div>
            <label>Correct Answer:</label>
        </div>
        <br>
        <div id="output" style="width:100%; height: 400px; border: 2px solid black; padding: 20px;">
        </div>
        <br>
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
        
        $('#item-id-' + this.itemid).focus();
        this.setEventHandlerListener();
        this.setTextarea();
    }

    setEventHandlerListener() {

        $('#item-id-' + this.itemid).parents('li').hover(function() {
            $(this).find('.item-close-but').css({
                'display': 'block'
            });
        }, function() {
            $(this).find('.item-close-but').css({
                'display': 'none'
            });
        });

        $('#item-id-' + this.itemid).parents('li').find('.item-close-but').click((e) => {
            var c = e.currentTarget;
            if (confirm('Delete this item?')) {
                $(c).parent().fadeOut('slow', (e) => {
                    $(c).parent().remove();
                });
            }
        });

        $('#item-id-' + this.itemid).find('.addanswer').click(() => {
            this.addAnswer();
        });

        $('#item-id-' + this.itemid).find('.addoption').click(() => {
            this.addOption();
        });
        //this.setupUploadImageDialog();
    }

    setTextarea() {
        //This is for html
        var htmlText = document.getElementById("htmlText");
        this.editor2Html = CodeMirror.fromTextArea(htmlText, {
            lineNumbers: true,
            mode: "html",
            theme: "night.css"
        });

        $(`#showHtmlCheckbox${this.itemid}`).change((e) => {
            var shouldBeShow = e.currentTarget.checked;
            if (shouldBeShow) {
                this.editor2Html.setOption("readOnly", false);
            } else {
                this.editor2Html.setOption("readOnly", true);
            }
        });

        var htmlText = document.getElementById("htmlText");
        this.editorhtml = CodeMirror.fromTextArea(htmlText, {
            lineNumbers: true,
            mode: "html"
        });

        $(`#showHtmlCheckbox${this.itemid}`).change((e) => {
            var shouldBeShow = e.currentTarget.checked;
            if (shouldBeShow) {
                this.editorhtml.setOption("readOnly", false);
            } else {
                this.editorhtml.setOption("readOnly", true);
            }
        });

        //This is for css
        var cssText = document.getElementById("cssText");
        this.editor2Css = CodeMirror.fromTextArea(cssText, {
            lineNumbers: true,
            mode: "css",
            theme: "night.css"
        });

        $(`#showCssCheckbox${this.itemid}`).change((e) => {
            var shouldBeShow = e.currentTarget.checked;
            if (shouldBeShow) {
                this.editor2Css.setOption("readOnly", false);
            } else {
                this.editor2Css.setOption("readOnly", true);
            }
        });

        var cssText = document.getElementById("cssText");
        this.editorcss = CodeMirror.fromTextArea(cssText, {
            lineNumbers: true,
            mode: "css"
        });
        $(`#showCssCheckbox${this.itemid}`).change((e) => {
            var shouldBeShow = e.currentTarget.checked;
            if (shouldBeShow) {
                this.editorcss.setOption("readOnly", false);
            } else {
                this.editorcss.setOption("readOnly", true);
            }
        });

        //This is for javascript
        var javascriptText = document.getElementById("javascriptText");
        this.editor2Javascript = CodeMirror.fromTextArea(javascriptText, {
            lineNumbers: true,
            mode: "javascript",
            theme: "night.css"
        });

        $(`#showJavascriptCheckbox${this.itemid}`).change((e) => {
            var shouldBeShow = e.currentTarget.checked;
            if (shouldBeShow) {
                this.editor2Javascript.setOption("readOnly", false);
            } else {
                this.editor2Javascript.setOption("readOnly", true);
            }
        });

        var javascriptText = document.getElementById("javascriptText");
        this.editorjavascript = CodeMirror.fromTextArea(javascriptText, {
            lineNumbers: true,
            mode: "javascript",
        });

        $(`#showJavascriptCheckbox${this.itemid}`).change((e) => {
            var shouldBeShow = e.currentTarget.checked;
            if (shouldBeShow) {
                this.editorjavascript.setOption("readOnly", false);
            } else {
                this.editorjavascript.setOption("readOnly", true);
            }
        });

        $('#doit').click(() => {
            $('#output').empty();

            $('#output')
                .append("<style>" + this.editor2Css.getValue() + "</style>")
                .append("<script>" + this.editor2Javascript.getValue() + "<" + "/" + "script" + ">")
                .append(this.editor2Html.getValue());
        });
    }
}