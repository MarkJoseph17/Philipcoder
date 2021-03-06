"use strict";
class CardManager {
    constructor(theUser, classid, id = null) {
        this.theUser = theUser;
        this.classid = classid;
        this.cardid;
        this.readingItemManagers = [];
        
        if(id){
            this.cardid = id;
            setTimeout(()=>{
                this.updateClassCardList();
            }, 1000);   
        }else{
            return;
        }

        var cardelement = `
        <div id="cardid_${this.cardid}" class="class-card">
                <span class="card-close-but">
                    <i class="material-icons">close</i>
                </span>
                <span class="card-view-but">
                    <i class="material-icons">view_list</i>
                </span>

                <div class="card-panel">
                    <h5>title here..</h5>
                    <p>description here..</p>
                </div>

                <div class="elements-items-container">
                    <div class="eic-col-1">
                        <div class="elements-container">
                            <!-- display items here -->
                            Select items:                           
                                <ul>
                                    <li>
                                        <img src="#" alt="Video" class="img-thumbnail btn-vid-thumbnail" style="cursor: pointer;">
                                    </li>
                                    <li>                                  
                                        <p class="btn-readinglist" style="cursor: pointer;">Reading list</p>                                    
                                    </li>
                                </ul>                                                                                                                                                                                                                                     
                            </ul>   
                            <div class="btn-up">
                                <i class="material-icons">keyboard_arrow_up</i>
                            </div>                  
                        </div>
                    </div>          
                    <div class="eic-col-2">
                        <form>
                            <table sytle="width:100%;">
                                <tr class="card-title-des-row">
                                    <td style="width: 30%; padding: 5px;">
                                        <div class="form-group">
                                            <!--<label for="exampleFormControlInput1">Card title</label>-->
                                            <input type="text" class="form-control card_title" id="exampleFormControlInput1" placeholder="card title">
                                        </div>
                                    </td>
                                    <td style="width: 50%; padding: 5px;">
                                        <div class="form-group">
                                            <!--<label for="exampleFormControlTextarea1">Card description</label>-->
                                            <textarea class="form-control card_des" id="exampleFormControlTextarea1" rows="1" placeholder="card description"></textarea>
                                        </div>
                                    </td>
                                    <td style="width: 20%; padding: 5px;">
                                        <div class="btn btn-link btn-add-item" style="cursor: pointer;">
                                            <span class="material-icons">add</span>
                                            Add Item
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </form>
                        <div class="carditems-container">
                            <!-- add items here -->
                        </div>
                    </div>                   
                </div>
            </div>
        `;
        $(cardelement).appendTo('.create-card-cont').hide().show('clip');//apply clip effects 

        $('#cardid_'+this.cardid).find('div.carditems-container').sortable({//this makes card items sortable
            update : (event, ui)=>{
              this.updatecarditemslist();
            }
        }).sortable('disable');//temporary disable sortable 
        
        this.setupEventHandlers();
    }

    setTitle(text){
        $('#cardid_'+this.cardid).find('.card_title').val(text);
    }

    setDescription(text){
        $('#cardid_'+this.cardid).find('.card_des').val(text);
    }

    setupButtonsEventHandlers(){
        let cardid = this.cardid;
        $('#cardid_'+cardid).find('.btn-add-item').click((e)=>{//add item button click event handlers
            var c = e.currentTarget;//get the add item node object
            $('#cardid_'+cardid).find(".eic-col-1").slideDown('slow', ()=>{
                //c.innerHTML === 'Add Item' ? c.innerHTML = '<i class="material-icons">keyboard_arrow_up</i>' : c.innerHTML = 'Add Item';//dynamically change the button text node after toggle event
                c.style.display = "none";
            });
            return;
        });

        $('#cardid_'+cardid).find('.btn-up').click((e)=>{//
            $('#cardid_'+cardid).find(".eic-col-1").slideUp('slow', ()=>{
                $('#cardid_'+cardid).find('.btn-add-item').css({'display':'block'});
            });
            return;
        });

        $('#cardid_'+cardid).find('.btn-vid-thumbnail').click((e)=>{//video display click event handlers
            $('#cardid_'+cardid).find(".eic-col-1").slideUp('slow', ()=>{
                $('#cardid_'+cardid).find('.btn-add-item').css({'display':'block'});
            });

            this.savecarditeminfo('videoitem');
            return;
        });

        $('#cardid_'+cardid).find('.btn-readinglist').click((e)=>{//reading list display click event handlers
            $('#cardid_'+cardid).find(".eic-col-1").slideUp('slow', ()=>{
                $('#cardid_'+cardid).find('.btn-add-item').css({'display':'block'});
            });
            this.savecarditeminfo('readinglist');
            //this.readingItemManagers.push(new ReadingItemManager(this.cardid));
            return;
        });

        $('#cardid_'+cardid).find('.card-close-but').click((e)=>{//set up close button event handler
            var c = e.currentTarget;
            if(confirm('Are you sure you want to remove this card?')){         
                this.deleteCard();             
            }
            return;
        });

        $('#cardid_'+cardid).find('.card-view-but').click((e)=>{//set up view button event handler       
            var c = e.currentTarget; 

            let id = this.cardid;

            if(c.firstElementChild.textContent === 'view_list'){
                this.setcardlistTitleDes('#cardid_'+id);

                $('#cardid_'+id).css({'height':'80px','overflow':'hidden'});//sets all cards height to max-content
                $('#cardid_'+id).find('.elements-items-container').css({'display':'none'});//Hides all cards contents
                $('#cardid_'+id).find('.card-panel').css({'display':'block'});//Displays the cards panel for listview

                c.firstElementChild.textContent = 'view_module';//changes the button icon to large view

            }else{
                $('#cardid_'+id).css({'height':'auto','overflow':'unset'});//sets all cards height to 350 pixels (default)
                $('#cardid_'+id).find('.elements-items-container').css({'display':'block'});//Displays all cards contents
                $('#cardid_'+id).find('.card-panel').css({'display':'none'});//Hides the cards panel

                c.firstElementChild.textContent = 'view_list';//changes the button icon to list view

            }
            this.cardeffect('#cardid_'+id);
            return;
        });
    }

    setupEventHandlers(){
        $('#cardid_'+this.cardid).find('.card_title').change((e)=>{         
            this.savecardinfo('title', $(e.currentTarget).val());
        });

        $('#cardid_'+this.cardid).find('.card_des').change((e)=>{        
            this.savecardinfo('description', $(e.currentTarget).val());
        });

        this.setupButtonsEventHandlers();
    }

    setcardlistTitleDes(cardid){

          let card_title = $(cardid).find('.card_title').val();//card title
          let card_des = $(cardid).find('.card_des').val();//card description
    
          var elements = $(cardid).find('.card-panel').children();//get reference to card panel h5(title) and p(description)
          console.log(elements.length);
    
          elements[0].textContent = card_title;//set title to h5 tag
          elements[1].textContent = card_des;//set description to paragraph tag
    
          if(!card_title){
            elements[0].textContent = 'Card title here..';//set empty title to h5 tag
          }
          if(!card_des){
            elements[1].textContent = 'Card description here';//set empty description to paragraph tag
          }
    }

    cardeffect(cardid){
        $(cardid).hide().show('clip');//apply clip effects 
    }

    updateClassCardList(){
        var updates = {};
        
        var cardidlist = [],  cards = $('.create-card-cont').children();//get all cards 
        if(cards.length > 0){
            for(let d=0; d < cards.length; d++){
                let cardid = cards[d].getAttribute('id'); 
                cardidlist.push(cardid);//it collect all of the card id 
            }
            updates['class/' + this.theUser.uid + '/classid_' + this.classid + '/card_list'] = cardidlist;
        }else{
            updates['class/' + this.theUser.uid + '/classid_' + this.classid + '/card_list'] = null;
        }     
           
        firebase.database().ref().update(updates)
        .then(() => {   
            console.log('Class card list updated');
        }).catch((err)=>{
          console.log(err);  
        });
    }

    savecardinfo(fields, value){
        var updates = {}
        //updates['card/' + this.theUser.uid + '/' + this.classid + '/cardid_' + this.cardid + '/modi'] = value;
        updates['card/' + this.theUser.uid + '/classid_' + this.classid + '/cardid_' + this.cardid + '/'+fields] = value;
        firebase.database().ref().update(updates)
        .then(() => {   
            console.log('Card saved');
        }).catch((err)=>{
          console.log(err);  
        });
    }

    deleteCard(){    
        firebase.database().ref('card/' + this.theUser.uid + '/classid_' + this.classid + '/cardid_' + this.cardid).update({'isDeleted':true})
        .then(() => {   
            console.log('Card Deleted');
            this.showUndoSnackBar();
        }).catch((err)=>{
          console.log(err);  
        }); 
    }

    updatecarditemslist(){

        var updates = {};
      
        var carditems = $('#cardid_'+this.cardid).find('div.carditems-container').children();//get all card items
        var carditemsidlist = [];
      
        for(let e=0; e < carditems.length; e++){
            var span_closed_but = carditems[e].firstElementChild;
            var span_drag_but = span_closed_but.nextElementSibling;
            var item_el = span_drag_but.nextElementSibling;
            var carditemid = item_el.getAttribute('id');
                
            carditemsidlist.push(carditemid);
        }

        updates['card/' + this.theUser.uid + '/classid_' + this.classid + '/cardid_' + this.cardid + '/item_list'] = carditemsidlist;      
           
        firebase.database().ref().update(updates)
        .then(() => {
            console.log('Card item list Updated succesfull!');
        }).catch((err)=>{
            console.log(err);
        });
    }

    showUndoSnackBar(){
        var snackbarContainer = document.querySelector('.mdl-snackbar');

        var handler = (event)=> {
            firebase.database().ref('card/' + this.theUser.uid + '/classid_' + this.classid + '/cardid_' + this.cardid).update({'isDeleted':false})
            .then(() => {   
            }).catch((err)=>{
                console.log(err);  
            }); 
        };

        var data = {
            message: 'Card deleted',
            timeout: 5000,
            actionHandler: handler,
            actionText: 'Undo'
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }

    /* Save card item */
    savecarditeminfo(itemtype){

        let type, carditemid = (new Date()).getTime().toString(36);//creates new card id

        if(itemtype == 'videoitem'){
            type = 'videoitem-id-';
        }else{
            type = 'readingitem-id-';
        }

        var carditeminfo = {
            cardid: 'cardid_' + this.cardid,
            isDeleted: false,
            type: itemtype
        };
        
        firebase.database().ref('card_item/' + this.theUser.uid + '/cardid_' + this.cardid + '/'+type + carditemid).set(carditeminfo)
        .then(() => {   
            console.log('Card item saved');
        }).catch((err)=>{
        console.log(err);  
        });
    }

}
