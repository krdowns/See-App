/// CREATE FORM ///
$('#save_entry').on('click', function (e) {
    console.log('clicked')
    e.preventDefault();
    var elements = $('#newEntryForm')[0].elements
    var content = elements[0].value
    // var content = elements[1].value
    var author = localStorage.userID
        $.ajax({
            url: '/api/entries',
            method: 'POST',
            data: {
                // title,
                content,
                author
            },
            success: function (res) {
                window.location.href = "./history";
                console.log("Post worked")
            },

            error: function (err) {
                console.log(err);
                alert(`Sorry, your post didn't go through`);
            }
        });
});


