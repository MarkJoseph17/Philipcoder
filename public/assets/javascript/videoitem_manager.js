"use strict";
class VideoItemManager{
    constructor(cardid, id = null){
        this.cardid = cardid;
        this.itemid;

        if(id){
            this.itemid = id;
        }else{
            let videoitemid = (new Date()).getTime().toString(36);//creates new item id
            this.itemid = videoitemid;//Initialize card item id
        }

        var element = `
                <div id="videoitem-id-${this.itemid}" class="videoitem">
                    <div class="vid-col-1">
                        <video id="video-${this.itemid}" width="100%" height="max-content" controls>
                            <source src="#" type="video/mp4">
                        </video>
                    </div>
                    <div class="vid-col-2">
                        <form action="#" style="padding: 10px;">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input videoitem-input-vid">
                                <label class="custom-file-label" for="customFile">Choose file</label>
                            </div>
                            <div class="mdl-textfield mdl-js-textfield" style="width: 100%; margin: 0px;">
                                <input class="mdl-textfield__input carditem-vid-title" type="text">
                                <label class="mdl-textfield__label" for="sample1" style="margin-bottom: 0px">Title...</label>
                            </div>
                            <div class="mdl-textfield mdl-js-textfield" style="width: 100%; margin: 0px;">
                                <textarea class="mdl-textfield__input carditem-vid-des" type="text" rows= "3"></textarea>
                                <label class="mdl-textfield__label" for="sample5" style="margin-bottom: 0px">Description...</label>
                            </div>
                        </form>
                    </div>
               </div>`;

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

        $('#carditem-con-id-'+this.itemid).find(".videoitem-input-vid").change((e)=> {
            this.readURL(e.currentTarget, "video-"+this.itemid);
            //console.log("redurl");
        });

        this.setupDeleteHandler();

        // This required to make the UI look correctly by Material Design Lite
        componentHandler.upgradeElements(document.getElementById('carditem-con-id-'+this.itemid));
    }

    setupDeleteHandler(){
        $('#carditem-con-id-'+this.itemid).find('.carditem-close-but').click(function(e){//setup delete handler
            if(confirm('Are you sure you want to remove this item?')){
                $(this).parent().hide('clip', function(){//apply clip effects before it removes
                    $(this).remove();//removes the current card selected
                });
            }
        });
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

    setUrl(url){
        $('#video-'+this.itemid).attr('src', url);
    }

    setTitle(title){
        $('#videoitem-id-'+this.itemid).find('.carditem-vid-title').val(title);
    }

    setDescription(description){
        $('#videoitem-id-'+this.itemid).find('.carditem-vid-des').text(description);
    }
}