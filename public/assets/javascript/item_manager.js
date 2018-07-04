"use strict";
class ItemManager{
    constructor(cardid, carditemid,  elementtype){
        this.cardid = cardid;//also get the parent card id of this newly created reading list item, we pass it through our constructor of this class
        this.carditemid = carditemid;//also get the parent readinglist item id of this newly created item, we pass it through our constructor of this class
        let newitemid = (new Date()).getTime().toString(36);//creates new item id
        this.itemid = newitemid;//Initialize item id

        var element = null;//Initialize element 

        //this conditional statements filters which item type to be created
        if(elementtype === "textbox"){
            element = `<div id="item-id-${this.itemid}" class="editable" data-type="textbox"></div>`;
        }else if(elementtype === "table"){
            element = `<div id="item-id-${this.itemid}" class="editable" data-type="table"></div>`;
        }else if(elementtype === "list"){
            element = `<div id="item-id-${this.itemid}" class="editable" data-type="list"></div>`;
        }else if(elementtype === "image"){
            element = `<div id="item-id-${this.itemid}" class="editable" data-type="image"></div>`;
        }

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

        this.initializeMediumEditor(elementtype);
        this.setEventHandlerListener();

        $('#item-id-'+this.itemid).focus();
    }

    initializeMediumEditor(elementtype){

        var buttons = [];
        var placeholderText;
        var disableEditing;

        if(elementtype === "textbox"){
            disableEditing = false;
            buttons = ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote','justifyLeft','justifyCenter','justifyRight'];
            placeholderText = 'Type your text';
        }else if(elementtype === "table"){
            disableEditing = false;
            buttons = ['bold', 'italic', 'underline', 'justifyLeft', 'justifyCenter', 'justifyRight', 'table'];
            placeholderText = 'Insert table';
        }else if(elementtype === "list"){
            disableEditing = false;
            buttons = ['bold', 'italic', 'underline', 'justifyLeft','justifyCenter','justifyRight','unorderedlist','orderedlist',];
            placeholderText = 'Insert list';
        }else if(elementtype === "image"){
            disableEditing = true;
            buttons = [];
            placeholderText = 'input/drag image here';
        }

        var editor = new MediumEditor('#item-id-'+this.itemid, {
            disableEditing: disableEditing,
            buttonLabels: 'fontawesome',
            placeholder: {
                text: placeholderText,
                hideOnClick: true
            },  
            extensions: {
                table: new MediumEditorTable()
              },
            toolbar: {
                buttons: buttons,
                static: true,
                sticky: true,
                align: 'left',
                updateOnEmptySelection: true
            }
        });

        if(elementtype === "image"){
            $('#item-id-'+this.itemid).mediumInsert({
                editor: editor
            });
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
    }
}