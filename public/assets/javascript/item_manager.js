"use strict";
class ItemManager{
    constructor(theUser, cardid, carditemid,  elementtype, id = null){
        this.theUser = theUser;
        this.cardid = cardid;//also get the parent card id of this newly created item, we pass it through our constructor of this class
        this.carditemid = carditemid;//also get the parent readinglist item id of this newly created item, we pass it through our constructor of this class
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

        var element = null;//Initialize element 

        //this conditional statements filters which item type to be created
        if(elementtype === "textbox"){
            element = `<div id="item-id-${this.itemid}" class="item editable" data-type="textbox"></div>`;
        }else if(elementtype === "table"){
            element = `<div id="item-id-${this.itemid}" class="item editable" data-type="table"></div>`;
        }else if(elementtype === "list"){
            element = `<div id="item-id-${this.itemid}" class="item editable" data-type="list"></div>`;
        }else if(elementtype === "image"){
            element = `<div id="item-id-${this.itemid}" class="item editable" data-type="image"></div>`;
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

        editor.subscribe('editableInput', (event, editable)=> {
            // Do some work
            //console.log(event);
            //console.log(editable);
            if(this.type === 'image'){
                var imgcontent = '';
                var images = $(editable).children("div.medium-insert-images")
                for(let a=0; a < images.length; a++){
                    var dclass = $(images[a]).attr('class');
                    imgcontent += '<div class="' + dclass + '">' + $(images[a]).html() + '</div>';
                }
                this.saveItem('text', imgcontent);
            }else{
                this.saveItem('text', $(editable).html());
            }
        });

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
                this.deleteItem();
            }     
        });
    }

    setTextContent(text){
        $('#readingitem-id-'+this.carditemid).find('#item-id-'+this.itemid).html(text);
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