"use strict";
class ReadingItemManager{
    constructor(cardid, itemtype){
        this.cardid = cardid;//also get the parent card id of this newly created reading list item, we pass it through our constructor of this class
        let readingitemid = (new Date()).getTime().toString(36);//creates new item id
        this.itemid = readingitemid;//Initialize card item id

        //this will be the new reading list item for a card
        var element = `<div id="readingitem-id-${this.itemid}" class="${itemtype}">
                        <div class="contentbar">
                            <!-- Default dropleft button -->
                            <div class="btn-group dropleft">
                                <button type="button" class="btn btn-light" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa fa-ellipsis-v"></i>
                                </button>
                                <div class="dropdown-menu">
                                    <!-- Dropdown menu links -->
                                    <a class="dropdown-item btn-sort-items" style="cursor: pointer;">Sort items</a>
                                    <a class="dropdown-item btn-clear-items" style="cursor: pointer;">Clear all items</a>
                                </div>
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
        this.ReadingitemSortableManager();

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
                new ItemManager(this.cardid, this.itemid, "textbox");//create new item
            }          
        });

        $('#carditem-con-id-'+this.itemid).find('.btn-table').click((e)=>{
            var isDisabled = $('#readingitem-id-'+this.itemid).find('div.items-container ul').sortable( "option", "disabled" );
            if(isDisabled){//we dont allow to insert new item when sortable is enabled
                new ItemManager(this.cardid, this.itemid, "table");//create new item
            }
        });

        $('#carditem-con-id-'+this.itemid).find('.btn-list').click((e)=>{
            var isDisabled = $('#readingitem-id-'+this.itemid).find('div.items-container ul').sortable( "option", "disabled" );
            if(isDisabled){//we dont allow to insert new item when sortable is enabled
                new ItemManager(this.cardid, this.itemid, "list");//create new item
            }
        });

        $('#carditem-con-id-'+this.itemid).find('.btn-image').click((e)=>{
            var isDisabled = $('#readingitem-id-'+this.itemid).find('div.items-container ul').sortable( "option", "disabled" );
            if(isDisabled){//we dont allow to insert new item when sortable is enabled
                new ItemManager(this.cardid, this.itemid, "image");//create new item
            }
        });

        $('#carditem-con-id-'+this.itemid).find('.btn-qa').click((e)=>{
            var isDisabled = $('#readingitem-id-'+this.itemid).find('div.items-container ul').sortable( "option", "disabled" );
            if(isDisabled){//we dont allow to insert new item when sortable is enabled
                new QuizItemManager(this.cardid, this.itemid, "qa");//create new Quiz item
            }
        });

        $('#carditem-con-id-'+this.itemid).find('.carditem-close-but').click(function(e){//setup delete handler
            if(confirm('Are you sure you want to remove this item?')){
                $(this).parent().hide('clip', function(){//apply clip effects before it removes
                    $(this).remove();//removes the current card item (reading list) selected
                });
            }
        });

        this.setItemsChangesListener();
    }

    setItemsChangesListener(){
        // select the target node
        var target = document.querySelector('.items-container > ul');
        //var target = $('#readingitem-id-'+this.itemid).find('.items-container ul');
        console.log(target);

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
        observer.observe(target, config);
        
        // later, you can stop observing
        //observer.disconnect();
    }

    //confirm disable sortable when items are empty
    confirmDisableReadingitemSortable(){
        var itemslength = $('#readingitem-id-'+this.itemid).find('.items-container ul').children().length;
        console.log('items length='+itemslength);

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
    ReadingitemSortableManager(){

        $('#readingitem-id-'+this.itemid).find('div.items-container ul').sortable({//this makes carditem items sortable
            forcePlaceholderSize: true,
            update : (event, ui)=>{
              //console.log(ui.item);
              //var cardid = $(ui.item).parents('.class-card').attr('id');
              //console.log(cardid);
              this.updatereadingitemslist();//update list items in database when item changes the sort order
            }
        }).sortable('disable');//temporary disable sortable    
    }

    autoresize(){
        //creadits to the author: https://stephanwagner.me/auto-resizing-textarea
        var offset;
   
        var resizeTextarea = function(el) {
            offset = el.offsetHeight - el.clientHeight;
            $(el).css('height', 'auto').css('height', el.scrollHeight + offset);
        };
  
        $('readingitem-id-'+this.itemid).on('change', function() { 
          resizeTextarea(this); 
        });
    }

    //This method updates the items list sort order in database, we call this method when items changes the sort order
    updatereadingitemslist(){

        if(!$('.btncreate').attr('disabled') === true){
            console.log('Unable to update, the class is not yet submitted.');
            return;
        }
  
        var updates = {};
  
        var items = $('#readingitem-id-'+this.itemid).find('div.items-container ul').children();//get all card items
        var itemsidlist = [];
  
        for(let b=0; b < items.length; b++){
            var editable = $(items[b]).find('.editable');
            var itemid = $(editable[0]).attr('id');

            itemsidlist.push(itemid);
        }
              
        updates['card_item/readingitem-id-'+ this.itemid  +'/item_list'] = itemsidlist;      
                
        firebase.database().ref().update(updates)
        .then(() => {
          console.log('Update succesfull!');
        }).catch((err)=>{
          console.log(err);
          console.log("failed to update");
        });
    }
}