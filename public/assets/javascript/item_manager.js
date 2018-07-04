"use strict";
class ItemManager{
    constructor(cardid, elementtype){
        this.cardid = cardid;
        let newitemid = (new Date()).getTime().toString(36);//creates new item id
        this.itemid = newitemid;//Initialize item id

        var element = null;//Initialize element 
        if(elementtype === "h1"){
            element = `<h1 id="item-id-${this.itemid}" class="${elementtype}">Heading</h1>`;
        }else if(elementtype === "p1"){
            element = `<p id="item-id-${this.itemid}" class="${elementtype}">Paragraph</p>`;
        }

        $('#cardid_'+cardid).find('.items-container').append(`
            <div id="item-con-id-${this.itemid}" class="item-container">
              <span class="close-but">
                <i class="material-icons">close</i>
              </span>
              <div class="drag-but">
                <i class="material-icons">reorder</i>
              </div>
                ${element}
            </div>
        `);

        $('.close-but').click(function(e){
          $(this).parent().remove();
        });

        this.sethandler(this.itemid, elementtype);
    }

    autoresize(itemid){
        //creadits to the author: https://stephanwagner.me/auto-resizing-textarea
        var offset;
   
        var resizeTextarea = function(el) {
            offset = el.offsetHeight - el.clientHeight;
            $(el).css('height', 'auto').css('height', el.scrollHeight + offset);
        };
  
        $('#item-id-'+itemid).on('keyup input', function() { 
          resizeTextarea(this); 
        });
    }

    sethandler(itemid, elementtype){

        var c, id, textcontent, classname, tagname, elementtoadd;
        
        if(elementtype === "input"){
            $('#item-id-'+itemid).keypress((e)=>{//Event handler when enter key pushes
              if(e.which == 13){ // the enter key code
                  var item = e.currentTarget;//gets the current element the "this" keyword isn't working

                  textcontent = $(item).val();
                  
                  var prevtagname = item.getAttribute("data-tn").toString().toLowerCase();
                  var prevclassname = item.getAttribute("data-cn").toString().toLowerCase();
          
                  elementtoadd = `
                          <${prevtagname} id="item-id-${itemid}" class="${prevclassname}">${textcontent}</${prevtagname}>
                      `;
                  
                  $(item).remove();
                  $('#item-con-id-'+itemid).append(elementtoadd);
                  $('#item-id-'+itemid).focus();   
                  this.sethandler(itemid, prevtagname);   
                  return false;  
                }
            }).focus().select(); 

            $('#item-id-'+itemid).focusout((e)=>{//Event handler when textarea lost focus           
                var item = e.currentTarget;//gets the current element the "this" keyword isn't working

                  textcontent = $(item).val();
                  
                  var prevtagname = item.getAttribute("data-tn").toString().toLowerCase();
                  var prevclassname = item.getAttribute("data-cn").toString().toLowerCase();
          
                  elementtoadd = `
                          <${prevtagname} id="item-id-${itemid}" class="${prevclassname}">${textcontent}</${prevtagname}>
                      `;
                  
                  $(item).remove();
                  $('#item-con-id-'+itemid).append(elementtoadd);
                  $('#item-id-'+itemid).focus();   
                  this.sethandler(itemid, prevtagname);   
                  return false;  
            }); 

        }else{
            $('#item-id-'+itemid).click((e)=>{
                var item = e.currentTarget;
                //id = $(this).attr('id');
                textcontent = $(item).text();
                classname = $(item).attr('class');
                tagname = item.tagName;
        
                elementtoadd = `
                        <textarea data-autoresize rows="1" type="text" id="item-id-${itemid}" data-tn="${tagname}" data-cn="${classname}">${textcontent}</textarea>
                    `;

                /*elementtoadd = `
                    <input type="text" id="item-id-${itemid}" value="${textcontent}" data-tn="${tagname}" data-cn="${classname}">
                `;*/
                
                $(item).remove();
                $('#item-con-id-'+itemid).append(elementtoadd);
                
                /*var textarea = document.getElementById('item-id-'+itemid);//get the new textarea after creation
                var offset = textarea.offsetHeight - textarea.clientHeight;
                textarea.style.height="auto";
                textarea.style.height = (textarea.scrollHeight + offset);*/

                this.autoresize(itemid);//set the textarea to be resizeable
                this.sethandler(itemid, "input");   
            });
        }  
    }
}