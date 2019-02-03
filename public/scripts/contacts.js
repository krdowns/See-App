    $('#save-contacts').on('click', function (e) {
    e.preventDefault();
    var elements = $('#newContactForm')[0].elements[0]
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
                            <button data-id=${singleContact._id} class="favorite favorite-contact-button">
                                <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd">
                                    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181"/>
                                </svg>
                            </button>
                            <button data-id=${singleContact._id} class="update update-contact-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 17.292l-4.5-4.364 1.857-1.858 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.643z"/></svg>
                            </button>
                            <button data-id=${singleContact._id} class="delete delete-contact-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                    <path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z"/>
                                </svg>
                            </button>
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
                url: `./api/contacts/${id}`,
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

    localStorage.length > 0 ? console.log(localStorage) : console.log('no local storage');

    let loggedIn ;
    let user ;
  
    checkForLogin();

    $('#logout').on('click', handleLogout);
    function handleLogout(e) {
        e.preventDefault();
        console.log("LOGGED OUT")
        delete localStorage.token;
        delete localStorage.userID;
        $('#yesToken').toggleClass('show');
        $('#message').text('Goodbye!')
        user = null;
        checkForLogin();
        window.location.href = "./";
    }

    function checkForLogin(){
    if(localStorage.token){
        let jwt = localStorage.token
        $.ajax({
        type: "POST", //GET, POST, PUT
        url: '/verify',  
        beforeSend: function (xhr) {   
            xhr.setRequestHeader("Authorization", 'Bearer '+ jwt);
        }
        }).done(function (response) {
        user = { email: response.email, _id: response._id }
        localStorage.userID = user._id;
        }).fail(function (err) {
            console.log(err);
            window.location.href = "./";
        });
        $('#yesToken').toggleClass('show');
    } else {
        $('#noToken').toggleClass('show');
    }
    }

    $('.inactive').click(function() {
        $(this).removeClass('inactive');
        $(this).addClass('active');
    });

}