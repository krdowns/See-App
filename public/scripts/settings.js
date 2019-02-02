    
    
    $('#save-contacts').on('click', function (e) {
    e.preventDefault();
    var elements = $('#newContactForm')[0].elements[0]
    // console.log(elements)
    var email = elements.value
    var user = localStorage.userID
    
        $.ajax({
        url: '/api/contacts',
        method: 'POST',
        data: {
            email,
            user
        },

        success: function(res) {
            window.location.reload();

        },
        
        error: function (err) {
            console.log(err);
        }

        });
    });
  
window.onload = function(e) {
    $.ajax({
        method: 'GET',
        url: '/user/'+localStorage.userID+'/contacts',
        success: handleSuccess,
        error: handleError
    });

    function handleSuccess(contacts) {
        contacts.data.forEach(singleContact => {
            $(".current-contacts-container").append(`
            <div class="contact-container">
                <ul class="contact-list">
                    <li class="contact">
                        <span id="${singleContact._id}">${singleContact.email}</span>
                        <div class="edit-delete-buttons">
                            <button data-id=${singleContact._id} class="update update-contact-button">Update</button>
                            <button data-id=${singleContact._id} class="delete delete-contact-button">Delete</button>
                        </div>
                    </li>
                </ul>
            </div>
            `);

            // UPDATE CONTACT
            $('div.current-contacts-container').on('click',`span[id=${singleContact._id}]`,function(){
                console.log("here changing")
               $initProfileVal= $(this).html();
               $(this).replaceWith($(`<input id='${singleContact._id}' value='${$(this).html()}' required>`));
               $(`${'div.current-contacts-container'} input[id=${singleContact._id}]`).focus();
           });
        
            $('div.current-contacts-container').on('blur',`input[id=${singleContact._id}]`,function(){
               var $text= $(this).val();
               if ($text=='') return;
               $(this).replaceWith($(`<span id='${singleContact._id}'>${$text}</span>`));
               if ($text.trim()==$initProfileVal.trim()) return;
               var dataObj={}; dataObj["email"]= $text;
            });
        })

        // UPDATE CONTACT
        $('.update').on('click', function (){
            var id = $(this).data('id');
            console.log(id)
            let email = $(`#${id}`).text();
            let data = JSON.stringify({"email":email})
            // console.log(ip);
            $.ajax({
                type: "PATCH",
                url: `/api/contacts/${id}`,
                data: data,
                contentType: "application/json",
                success: function() {
                    window.location.reload();
                },
                'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
            });
        });
        

         // DELETE CONTACT
         $('.delete').on('click', function () {
            console.log('clicked')
            var id = $(this).data('id');
            console.log(id);
            $.ajax({
                method: 'DELETE',
                url: `/api/contacts/${id}`,
                success: deleteSuccess,
                error: handleError
            })
        });
    
        function deleteSuccess(json) {
            window.location.reload();
            console.log(json);
        };
    };



    function handleError(e) {
        console.log('error', e);
        $('.current-contacts-container').text('No Contacts Available.');
    }; 


}