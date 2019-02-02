/// CREATE FORM ///
$('#save_entry').on('click', function (e) {
    e.preventDefault();
    var elements = $('#newEntryForm')[0].elements
    var title = elements[0].value
    var content = elements[1].value
    var author = localStorage.userID
        $.ajax({
            url: '/api/entries',
            method: 'POST',
            data: {
                title,
                content,
                author
            },
            success: function (res) {
                window.location.href = "./history";
            },

            error: function (err) {
                console.log(err);
            }
        });
});


