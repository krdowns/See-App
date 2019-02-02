window.onload = function renderChart(data, labels) {
    let toneObject = {};
    
    $.ajax({
        url: '/user/'+localStorage.userID+'/entries',
        dataType: 'json'
    }).done(function(data) {
        data.data.forEach(function(singleEntry) {
            singleEntry.watson.document_tone.tones.forEach(function(singleEmotion) {
                if (toneObject[singleEmotion.tone_name]!==undefined ) {
                    toneObject[singleEmotion.tone_name]+= singleEmotion.score
                } else {
                    toneObject[singleEmotion.tone_name]= singleEmotion.score
                }
            })
        });

        new Chart(myChart, {
            type: "doughnut",
            data: {
               labels: [
               "Analytical", "Anger", "Confident", "Joy", "Sadness", "Tentative"
               ],
               datasets: [{
                  data: [toneObject.Analytical, toneObject.Anger, toneObject.Confident, toneObject.Joy, toneObject.Sadness, toneObject.Tentative],
                  backgroundColor: ["Indigo", "#a91834", "Green", "Orange", "#405074", "Gray "]
               }]
            },
            options: {
               responsive: true,
               legend: {
                  position: "right",
                  labels: {
                     fontSize: 12,
                     usePointStyle: true
                  }
               }
            }
         });
    });
    
    // DROPDOWN //
    function myFunction() {
        document.getElementById("myDropdown").classList.toggle("show");
    }
    

    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
            }
        }
        }
    }

//   GET ALL ENTRIES
    $.ajax({
        method: 'GET',
        url: '/user/'+localStorage.userID+'/entries',
        success: handleSuccess,
        error: handleError
    });


    function handleSuccess(dates) {
        dates.data.forEach(singleEntry => {
            let month=moment(singleEntry.date).format('MMM');
            let day=moment(singleEntry.date).format('DD');
                $('#recent-entry-container').append(`
                <div id="single-entry-row">
                    <div class="recent-entry-date">
                        <p class="day">
                        ${day}
                        </p>
                        <h1 id="date-target" class="month">
                        ${month}
                        </h1>
                    </div>
                    <div class="recent-entry">
                        <p id="entry-target">
                        "${singleEntry.content}"
                        </p>

                    </div>
                </div>
                `)
            })
    }

    function handleError(e) {
        console.log('error', e);
        $('.recent-entry-date').text('Failed to load.');
    }

    // DELETE ENTRIES //

    $('#entry').on('click', '.deleteEntry', function (e) {
        e.preventDefault();

        entryId = $('#deleteEntry').data().id
        console.log(entryId)
        var entriesUrl = `/api/entries/${entryId}`
        console.log(entriesUrl)

        $.ajax({
            method: 'DELETE',
            url: entriesUrl,
            success: onSuccess,
            error: onError,
        });

        function onError(err) {
            console.log(err);
        }

        function onSuccess(entry) {
            console.log(`Entry Deleted:`, entry)
            $('#entry').addClass('hidden')
            alert('Your entry was deleted')
        }
    })
}
