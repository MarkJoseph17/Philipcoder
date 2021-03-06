"use strict";
class ReadingItemManager{
    constructor(theUser, cardid, id = null){
        this.theUser = theUser;
        this.cardid = cardid;//also get the parent card id of this newly created reading list item, we pass it through our constructor of this class
        this.itemid;
        this.codeQuestionManagers = [];

        if(id){
            this.itemid = id;
            setTimeout(()=>{
                this.updatecarditemslist();
            }, 1000);   
        }else{
            return;
        }

        //this will be the new reading list item for a card
        var element = `<div id="readingitem-id-${this.itemid}" class="readinglist">
                        <div class="contentbar">
                            <!-- Default dropleft button -->
                            <div class="dropleft">
                                <!-- Right aligned menu below button -->
                                <button id="demo-menu-lower-right-${this.itemid}" class="mdl-button mdl-js-button mdl-button--icon" style="outline: none;">
                                    <i class="material-icons">more_vert</i>
                                </button>
                                <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="demo-menu-lower-right-${this.itemid}">
                                    <li class="mdl-menu__item">
                                        <a class="dropdown-item btn-sort-items" style="cursor: pointer; background-color: transparent;">Sort items</a>
                                    </li>
                                    <li class="mdl-menu__item">
                                        <a class="dropdown-item btn-clear-items" style="cursor: pointer; background-color: transparent;">Clear all items</a>
                                    </li>
                                    <!--<li disabled class="mdl-menu__item">Disabled Action</li>-->
                                </ul>
                            </div>
                            <div class="items-container">
                                <ul>
                                    <!-- items appear here -->
                                </ul>                              
                            </div>                    
                        </div>
                        <div class="sidebar">
                            <ul>
                                <li class="btn-textbox">                                   
                                    <span style="cursor: pointer;">
                                        <i class="material-icons">text_fields</i>
                                        Text box
                                    </span>
                                </li>
                                <li class="btn-table">                               
                                    <span style="cursor: pointer;">
                                        <i class="fa fa-table"></i>
                                        Table
                                    </span>
                                </li>
                                <li class="btn-list">                               
                                    <span style="cursor: pointer;">
                                        <i class="fa fa-list"></i>
                                        List
                                    </span>
                                </li>
                                <li class="btn-image">
                                    <span style="cursor: pointer;">
                                        <i class="material-icons">image</i>
                                        Image
                                    </span>
                                </li>
                                <li class="btn-qa">
                                    <span style="cursor: pointer;">
                                        <i class="material-icons">question_answer</i>
                                        Question-Options
                                    </span>
                                </li>
                                <li class="btn-cq">
                                    <span style="cursor: pointer;">
                                    <i class="material-icons">code</i>
                                        Code-Question
                                    </span>
                                </li>
                            </ul>
                        </div>
                      </div>`;

        //This will be container of every card items it includes the close and drag button
        var carditem = `<div id="carditem-con-id-${this.itemid}" class="carditem-container">
                            <span class="carditem-close-but">
                                <i class="material-icons">close</i>
                            </span>
                            <span class="carditem-drag-but">
                                <i class="material-icons">reorder</i>
                            </span>
                            ${element}
                        </div>`;
        
        $(carditem).appendTo($('#cardid_'+this.cardid).find('.carditems-container')).hide().show('clip');//apply clip effects 

        this.setupEventHandlerListener();
        this.readingItemSortableManager();

        // This required to make the UI look correctly by Material Design Lite 
        componentHandler.upgradeElements(document.getElementById('carditem-con-id-'+this.itemid));
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

    //This method holds all of the click event listener for this reading list item
    setupEventHandlerListener(){
        
        $('#carditem-con-id-'+this.itemid).find('.btn-sort-items').click((e)=>{
            var itemslength = $('#readingitem-id-'+this.itemid).find('.items-container ul').children().length;
            console.log('items length='+itemslength);

            if(parseInt(itemslength) <= 0){
                alert('Items is empty');
                return;
            }

            if($(e.currentTarget).text() === 'Sort items'){
                $('#readingitem-id-'+this.itemid).find('div.items-container > ul').sortable('enable');//enable sortable 
                $('#readingitem-id-'+this.itemid).find('div.items-container > ul').css({'background-color':'yellowgreen'});
                $('#readingitem-id-'+this.itemid).find('div.items-container > ul > li').css({'background-image':'url(assets/icons/baseline-dehaze-black-18/2x/baseline_dehaze_black_18dp.png)','cursor':'move'});
                $('#readingitem-id-'+this.itemid).find('div.items-container > ul > li .editable').css({'cursor':'move'});
                $(e.currentTarget).text('Disable sort');
                $('#readingitem-id-'+this.itemid).find('div.sidebar ul li span').css({'cursor':'not-allowed'});
            }else{
                $('#readingitem-id-'+this.itemid).find('div.items-container > ul').sortable('disable');//disable sortable 
                $('#readingitem-id-'+this.itemid).find('div.items-container > ul').css({'background-color':'white'});
                $('#readingitem-id-'+this.itemid).find('div.items-container > ul > li').css({'background-image':'none','cursor':'text'});
                $('#readingitem-id-'+this.itemid).find('div.items-container > ul > li .editable').css({'cursor':'text'});
                $(e.currentTarget).text('Sort items');
                $('#readingitem-id-'+this.itemid).find('div.sidebar > ul > li > span').css({'cursor':'pointer'});
            }        
        });

        $('#carditem-con-id-'+this.itemid).find('.btn-clear-items').click((e)=>{
            var itemslength = $('#readingitem-id-'+this.itemid).find('.items-container ul').children().length;
            console.log(itemslength);

            if(parseInt(itemslength) <= 0){
                alert('Items is empty');
                return;
            }else{

                if(confirm('Delete all items?')){
                    $('#readingitem-id-'+this.itemid).find('.items-container ul').empty();//removes all items
                }
            }

        });

        $('#carditem-con-id-'+this.itemid).find('.btn-textbox').click((e)=>{
            var isDisabled = $('#readingitem-id-'+this.itemid).find('div.items-container ul').sortable( "option", "disabled" );
            if(isDisabled){//we dont allow to insert new item when sortable is enabled
                //new ItemManager(this.theUser, this.itemid, "textbox");//create new item
                this.saveItem('textbox');//create new item
            }          
        });

        $('#carditem-con-id-'+this.itemid).find('.btn-table').click((e)=>{
            var isDisabled = $('#readingitem-id-'+this.itemid).find('div.items-container ul').sortable( "option", "disabled" );
            if(isDisabled){//we dont allow to insert new item when sortable is enabled
                this.saveItem('table');//create new item
            }
        });

        $('#carditem-con-id-'+this.itemid).find('.btn-list').click((e)=>{
            var isDisabled = $('#readingitem-id-'+this.itemid).find('div.items-container ul').sortable( "option", "disabled" );
            if(isDisabled){//we dont allow to insert new item when sortable is enabled
                this.saveItem('list');//create new item
            }
        });

        $('#carditem-con-id-'+this.itemid).find('.btn-image').click((e)=>{
            var isDisabled = $('#readingitem-id-'+this.itemid).find('div.items-container ul').sortable( "option", "disabled" );
            if(isDisabled){//we dont allow to insert new item when sortable is enabled
                this.saveItem('image');//create new item
            }
        });

        $('#carditem-con-id-'+this.itemid).find('.btn-qa').click((e)=>{
            var isDisabled = $('#readingitem-id-'+this.itemid).find('div.items-container ul').sortable( "option", "disabled" );
            if(isDisabled){//we dont allow to insert new item when sortable is enabled
                this.saveItem('qa');//create new item
            }
        });

        $('#carditem-con-id-'+this.itemid).find('.btn-cq').click((e)=>{
            var isDisabled = $('#readingitem-id-'+this.itemid).find('div.items-container ul').sortable( "option", "disabled" );
            if(isDisabled){//we dont allow to insert new item when sortable is enabled
                 this.saveItem('cq');//create new item
            }
        });

        $('#carditem-con-id-'+this.itemid).find('.carditem-close-but').click((e)=>{//setup delete handler                                             
            var c = e.currentTarget;
            if(confirm('Are you sure you want to remove this item?')){   
                this.deleteReadingItem();
            }
        });

        this.setItemsChangesListener();
        this.autoresizeDiv();
    }

    autoresizeDiv(){
        //creadits to the author: https://stephanwagner.me/auto-resizing-textarea
       $.each($('div[data-autoresize]'), function() {
           var offset = this.offsetHeight - this.clientHeight;
        
           var resizeDiv = function(el) {
               $(el).css('height', 'auto').css('height', el.scrollHeight + offset);
           };
           $(this).on('keyup input', function() { resizeDiv(this); }).removeAttr('data-autoresize');
       });
    }

    setItemsChangesListener(){
        // select the target node
        //var target = document.querySelector('.items-container > ul');
        var target = $('#readingitem-id-'+this.itemid).find('.items-container > ul');
        //console.log(target[0]);

        // Callback function to execute when mutations are observed
        var callback = (mutations)=> {
            mutations.forEach((mutation)=> {
                if (mutation.type == 'childList') {
                    console.log('A child node has been added or removed.');
                    this.confirmDisableReadingitemSortable();
                }
                else if (mutation.type == 'attributes') {
                    //console.log('The ' + mutation.attributeName + ' attribute was modified.');
                }
            });
        };
        
        // create an observer instance
        var observer = new MutationObserver(callback);
        
        // configuration of the observer:
        var config = { attributes: true, childList: true, characterData: true }
        
        // pass in the target node, as well as the observer options
        observer.observe(target[0], config);
        
        // later, you can stop observing
        //observer.disconnect();
    }

    //confirm disable sortable when items are empty
    confirmDisableReadingitemSortable(){
        var itemslength = $('#readingitem-id-'+this.itemid).find('.items-container > ul').children().length;
        //console.log('items length='+itemslength);

        if(parseInt(itemslength) <= 0){
            $('#readingitem-id-'+this.itemid).find('div.items-container ul').sortable('disable');//disable sortable 
            $('#readingitem-id-'+this.itemid).find('div.items-container ul').css({'background-color':'white'});
            $('#readingitem-id-'+this.itemid).find('div.items-container ul li').css({'background-image':'none','cursor':'text'});
            $('#readingitem-id-'+this.itemid).find('div.items-container ul li .editable').css({'cursor':'text'});
            $('#carditem-con-id-'+this.itemid).find('.btn-sort-items').text('Sort items');
            $('#readingitem-id-'+this.itemid).find('div.sidebar ul li span').css({'cursor':'pointer'});
            return;
        }
    }

    //This method is responsible for the sorting item feature 
    readingItemSortableManager(){

        $('#readingitem-id-'+this.itemid).find('div.items-container ul').sortable({//this makes carditem items sortable
            update : (event, ui)=>{
              //console.log(ui.item);
              //var cardid = $(ui.item).parents('.class-card').attr('id');
              //console.log(cardid);
              this.updatereadingitemslist();//update list items in database when item changes the sort order
            }
        }).sortable('disable');//temporary disable sortable    
    }

    getCarditemCount(){
        // select the target node
        var target = $('#cardid_'+this.cardid).find('.carditems-container');
        console.log(target[0].childElementCount);
        return target[0].childElementCount;       
    }

    deleteReadingItem(){
        firebase.database().ref('card_item/' + this.theUser.uid + '/cardid_' + this.cardid + '/readingitem-id-' + this.itemid).update({'isDeleted':true})
        .then(() => {   
            console.log('Reading Item Deleted');
            this.showUndoSnackBar();
        }).catch((err)=>{
          console.log(err);  
        }); 
    }

    updatecarditemslist(){
        var updates = {}, classid = $('.class-form').attr('id');
        classid = classid.substring(8, classid.length);
        
        var carditemsidlist = [], carditems = $('#cardid_'+this.cardid).find('div.carditems-container').children();//get all card items
        if(carditems.length > 0){
            for(let e=0; e < carditems.length; e++){
                var span_closed_but = carditems[e].firstElementChild;
                var span_drag_but = span_closed_but.nextElementSibling;
                var item_el = span_drag_but.nextElementSibling;
                var carditemid = item_el.getAttribute('id');
                    
                carditemsidlist.push(carditemid);
            }
            updates['card/' + this.theUser.uid + '/classid_' + classid + '/cardid_' + this.cardid + '/item_list'] = carditemsidlist;   
        }else{
            updates['card/' + this.theUser.uid + '/classid_' + classid + '/cardid_' + this.cardid + '/item_list'] = null;   
        }
     
        firebase.database().ref().update(updates)
        .then(() => {     
            console.log('Card item list Updated succesfull!');
        }).catch((err)=>{
            console.log(err);  
        });
    }
    
    //This method updates the items list sort order in database, we call this method when items changes the sort order
    updatereadingitemslist(){

        var updates = {};
  
        var items = $('#readingitem-id-'+this.itemid).find('div.items-container ul').children();//get all card items
        var itemsidlist = [];
  
        for(let b=0; b < items.length; b++){
            var editable = $(items[b]).find('.item');
            var itemid = $(editable[0]).attr('id');
            
            if(itemid){
                itemsidlist.push(itemid);
            }   
        }
              
        updates['card_item/' + this.theUser.uid + '/cardid_' + this.cardid + '/readingitem-id-'+ this.itemid  +'/item_list'] = itemsidlist;      
                
        firebase.database().ref().update(updates)
        .then(() => {
          console.log('Reading item list Updated succesfull!');
        }).catch((err)=>{
          console.log(err);
          console.log("failed to update");
        });
    }

    showUndoSnackBar(){
        var snackbarContainer = document.querySelector('.mdl-snackbar');

        var handler = (event)=> {
            firebase.database().ref('card_item/' + this.theUser.uid + '/cardid_' + this.cardid + '/readingitem-id-' + this.itemid).update({'isDeleted':false})
            .then(() => {   
            }).catch((err)=>{
                console.log(err);  
            }); 
        };

        var data = {
            message: 'Reading item deleted',
            timeout: 5000,
            actionHandler: handler,
            actionText: 'Undo'
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }

    saveItem(itemtype){

        let itemid = (new Date()).getTime().toString(36);//creates new item id

        var iteminfo = {
            carditemid: 'readingitem-id-' + this.itemid,
            isDeleted: false,
            itemtype: itemtype
        };
       
        firebase.database().ref('item/' + this.theUser.uid + '/readingitem-id-' + this.itemid + '/item-id-' + itemid).set(iteminfo)
        .then(() => {     
            console.log('Item saved');
        }).catch((err)=>{
            console.log(err);  
        });
    }
}