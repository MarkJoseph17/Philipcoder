"use strict";
class CardManager {
    constructor(theUser, courseid, classid) {
        console.log('The user'+theUser);
        console.log('The course id'+courseid);
        console.log('The class id'+classid);

        this.theUser = theUser;
        this.courseid = courseid;
        this.classid = classid;
        this.cardid;

        let id = (new Date()).getTime().toString(36);//creates new card id
        this.cardid = id;//Initialize card id

        console.log('The card id'+id);

        $('.create-card-cont').append(`
            <div id="cardid_${id}" class="class-card">
                <span class="card-close-but">
                    <i class="material-icons">close</i>
                </span>

                <div class="elements-items-container">
                    <div class="eic-col-1">
                        <div class="elements-container">
                            <!-- display items here -->
                            Select items:                           
                                <ul>
                                    <li>
                                        <h1 class="dis-h1">Heading</h1>    
                                    </li>
                                    <li>
                                        <p class="dis-p1">Paragraph</p> 
                                    </li>
                                    <li>                                  
                                      list                                     
                                    </li>
                                    <li>
                                        <img src="#" alt="Image" class="img-thumbnail">       
                                    </li>
                                </ul>                                                                                                                                                                                                                                     
                            </ul>                     
                        </div>
                    </div>          
                    <div class="eic-col-2">
                        <form>
                            <table sytle="width:100%;">
                            <tr class="card-title-des-row">
                                <td style="width: 30%;">
                                    <div class="form-group">
                                        <!--<label for="exampleFormControlInput1">Card title</label>-->
                                        <input type="text" class="form-control card_title" id="exampleFormControlInput1" placeholder="title">
                                    </div>
                                </td>
                                <td style="width: 70%;">
                                    <div class="form-group">
                                        <!--<label for="exampleFormControlTextarea1">Card description</label>-->
                                        <textarea class="form-control card_des" id="exampleFormControlTextarea1" rows="1" placeholder="description"></textarea>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="btn btn-light btn-add-item" style="margin-bottom: 5px;">Add Item</div>
                                </td>
                            </tr>
                            </table>
                        </form>
                        <div class="items-container">
                            <!-- add items here -->
                        </div>
                    </div>                   
                </div>
            </div>
        `);

        $('#cardid_'+id).find('div.items-container').sortable({
            update : (event, ui)=>{
              console.log(ui.item);
              var cardid = $(ui.item).parent('.class-card').attr('id');
              console.log(cardid);
              this.updatecarditems();
            }
        });//this makes card items sortable

        $('#cardid_'+id).find('.btn-add-item').click((e)=>{//add item button click event handlers
            var c = e.currentTarget;//get the add item node object
            $('#cardid_'+id).find(".eic-col-1").slideToggle('fast', ()=>{
                c.innerHTML === 'Add Item' ? c.innerHTML = '<i class="material-icons">keyboard_arrow_up</i>' : c.innerHTML = 'Add Item';//dynamically change the button text node after toggle event
            });
            return;
        });

        $('#cardid_'+id).find('.dis-h1').click((e)=>{//heading display click event handlers
            $('#cardid_'+id).find(".eic-col-1").slideUp('fast', ()=>{
                $('#cardid_'+id).find('.btn-add-item').html('Add Item');//sets add item button text content back to "Add Item"
            });

            var c = e.currentTarget;      
            new ItemManager(id, 'h1');//create new heading item
            return;
        });

        $('#cardid_'+id).find('.dis-p1').click((e)=>{//paragraph display click event handlers
            $('#cardid_'+id).find(".eic-col-1").slideUp('fast', ()=>{
                $('#cardid_'+id).find('.btn-add-item').html('Add Item');//sets add item button text content back to "Add Item"
            });

            var c = e.currentTarget;        
            new ItemManager(id, 'p1');//create new paragraph item
            return;
        });

        $('.card-close-but').click(function(e){//set up close button event handler
            $(this).parent().remove();//removes the current card selected
        });


    }

    updatecarditems(){

        if(!$('.btncreate').attr('disabled')){
            console.log('Unable to update card items list because the class isnt saved yet');
            return;
        }//This cancel the update when the class hasn't submitted yet

        var updates = {};
        
        var items = $('#cardid_'+this.cardid).find('.items-container').children();//get all card items
        var itemidlist = [];
    
        for(let y=0; y < items.length; y++){
            var span_closed_but = items[y].firstElementChild;
            var span_drag_but = span_closed_but.nextElementSibling;
            var item_el = span_drag_but.nextElementSibling;
            var itemid = item_el.getAttribute('id');
            var itemtagname = item_el.tagName;
            var itemclass = item_el.getAttribute('class');
            var itemtext = item_el.textContent;
            var item_content = '<' + itemtagname + ' class="'+itemclass+'">' +itemtext+'</' +itemtagname+ '>';
    
            var iteminfo = {
              content : item_content,
              type : "html"
            }
    
            updates['_items/' + itemid] = iteminfo;
            itemidlist.push(itemid);
        }
        updates['_card_item_list/' + 'cardid_'+this.cardid + '/items'] = itemidlist;
        
        firebase.database().ref().update(updates)
        .then(() => {
            console.log('cards items list updated!');
        }).catch((err)=>{
          console.log(err);
          console.log("failed to insert");
        });
    }
    
}

