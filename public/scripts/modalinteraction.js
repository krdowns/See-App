// ----- On render -----
$(function() {
    document.title = "New Tab"
    var tip;
    var defaultBehavior = {
      url: 'https://www.google.com/search?q=',
      firstHit: 'https://www.google.com/search?btnI&q='
    };

    var final_transcript = '';
    var recognizing = false;
    var cancel = false;
  
    if (!('webkitSpeechRecognition' in window)) {
      unsupported();
    } else {
      var recognition = new webkitSpeechRecognition();
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.onstart = function() {}
      recognition.onresult = function(e) {
        var interim_transcript = '';
  
        for (var i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) {
            final_transcript = final_transcript + e.results[i][0].transcript;
          } else {
            interim_transcript = interim_transcript + e.results[i][0].transcript;
          }
        }
        // final_transcript variable stores results
        final_transcript = capitalize(final_transcript);
        $('#final_span').empty().html(linebreak(final_transcript));
        $('#interim_span').empty().html(linebreak(interim_transcript));
      };
    }
    recognition.onerror = function(e) {}
  
    function startButton(event) {
      final_transcript = '';
      recognition.start();
    }
  
    function unsupported() {
      console.log('Webkit speech api not supported in your browser');
    }
  
    // Main start event
    $('#button').on('mousedown touchstart', function() {
      if (cancel) {
        TweenMax.killAll();
        reset();
      } else {
        startRecog();
      }
    });
  
    function startRecog() {
      if (!recognizing) {
        recognition.start();
        final_transcript = '';
        $('#final_span').empty();
        $('#interim_span').empty();
        $(this).text('done');
        recognizing = true;
      }
    };
  
    $(document).on('touchend mouseup', function() {
      endRecog();
    })
  
    function endRecog() {
      if (recognizing) {
        recognizing = false;
        recognition.stop();
      }
    }
  
    recognition.onend = function() {
      var string = final_transcript.toLowerCase(); 
      if (string.trim() != '') {
        recognizing = false;
        cancel = true;
        var counter = {
            t: 0
          },
          loading = $('<div class="element"><div class="loading"></div><div class="slice"></div></div>'),
          fill = $('<div class="loading ring">')
        $('#button #contents').append(loading).append(fill);
        $('#button').addClass('cancel');
        TweenMax.to(counter, 2, {
          t: 10000,
          ease: Linear.easeNone,
          onUpdate: function() {
            TweenMax.set($('#button .element .loading'), {
              rotation: (counter.t * 3.6) - 45
            });
            if (counter.t >= 25) {
              $('#button > #contents > .loading.ring').css('border-top', border);
            };
            if (counter.t >= 50) {
              $('#button > #contents > .loading.ring').css('border-right', border);
              $('#button .element .slice').remove();
            }
            if (counter.t >= 75) {
              $('#button > #contents > .loading.ring').css('border-bottom', border);
            }
          },
          onComplete: function() {
            process(string);
            reset();
          }
        });
      } else {
        showTip();
      }
    }
  
    function process(string) {
      string = string.toLowerCase();
      success = false;
      $.each(keywords, function() {
        if ($.isArray(this.keyword)) {
          var self = this;
          $(this.keyword).each(function() {
            var keyword = this.toLowerCase();
            if (String(string).indexOf(keyword) > -1) {
              //string ops
              console.log(string, self);
              var passIt = self;
              passIt.keyword = keyword;
              string = parseString(string, self);
              success = true;
              return false;
            }
          });
        } else {
          var keyword = this.keyword;
          keyword = keyword.toLowerCase();
          if (String(string).indexOf(keyword) > -1) {
            //string ops
            string = parseString(string, this);
            success = true;
            return false;
          }
        }
      });
      if (!success) {
        noKeyword(string);
      }
    }
  
    function parseString(string, keyword) {
      var found = false;
      // strip out useless human context
      $(worthlessPrefixes).each(function() {
        if (string.indexOf(this) == 0) {
          string = string.substring(this.length + 1);
          return false;
        }
      });
      if (string.trim() == keyword.keyword.toLowerCase()) {
        console.log('no string')
          // There is no string here, so go to the root domain
        var pathArray = keyword.url.split('/'),
          protocol = pathArray[0],
          host = pathArray[2],
          url = protocol + '//' + host;
        newKeyword = {
          url: url
        };
        getThat(newKeyword, '');
      } else {
        // There is a string here, so query it
  
        $(precursors).each(function() {
          var onKeyword = String(this) + ' ' + keyword.keyword.toLowerCase();
          if (string.indexOf(onKeyword) > -1 && string.indexOf(onKeyword) == string.length - onKeyword.length) {
            string = string.substring(0, string.length - onKeyword.length).trim();
            found = true;
            return false
          }
        });
  
        var searchXFor = keyword.keyword.toLowerCase() + ' for';
        if (string.indexOf(searchXFor) == 0 && !found) {
          string = string.substring(searchXFor.length + 1);
        }
  
        if (!found) {
          string = string.replace(keyword.keyword.toLowerCase(), '')
        }
        getThat(keyword, string.trim());
      }
    }
  

    function openInNewTab(url) {
      var win = window.open(url, '_blank');
      win.focus();
    }
  
    function reset() {
      TweenMax.set($("#button .loading"), {
        clearProps: "all"
      });
      $('#button').removeClass('cancel');
      $('#button #contents').empty();
      cancel = false;
      final_transcript = '';
      $('#final_span').text('');
    }
  
    function showTip() {
      reset();
      $('#tip').addClass('show');
      if (tip) {
        window.clearTimeout(tip);
      }
      tip = setTimeout(function() {
        $('#tip').removeClass('show');
      }, 5000);
      console.log('press and hold to speak');
  
    }
  
    /// ##### VISUALIZATION STUFF #####
  
    var liveSource;
    var analyser;
    var frequencyData;
    var scaling = 1.5;
  
    function update() {
        requestAnimationFrame(update);
  
        if (recognizing) {
          analyser.getByteFrequencyData(frequencyData);
          TweenMax.set($('.visual'), {
              autoAlpha: 0.75
            })  
          TweenMax.set($('#viz1'), {
            scale: (((frequencyData[8] + 1) / 100) / scaling)
          });
          TweenMax.set($('#viz2'), {
            scale: (((frequencyData[15] + 1) / 100) / scaling)
          });
          TweenMax.set($('#viz3'), {
            scale: (((frequencyData[21] + 1) / 100) / scaling)
          });
        } else {
          TweenMax.set($('.visual'), {
            autoAlpha: 0
          })
        }
      }
      // creates an audiocontext and hooks up the audio input
    var context = new AudioContext();
    navigator.webkitGetUserMedia({
      audio: true
    }, function(stream) {
      console.log("Connected live audio input");
      if (!analyser) {
        liveSource = context.createMediaStreamSource(stream);
        // Create the analyser
        analyser = context.createAnalyser();
        analyser.smoothingTimeConstant = 0.3;
        analyser.fftSize = 64;
        frequencyData = new Uint8Array(analyser.frequencyBinCount);
        liveSource.connect(analyser);
      };
      update();
    }, function() {
      console.log('Error connecting to audio')
    });
  
  });
  
  /// ##### BASIC UTILS #####
  
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  function linebreak(s) {
    var two_line = /\n\n/g;
    var one_line = /\n/g;
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
  }






  window.onload = function() {

  // ####### ACCORDION #######
  var acc = document.getElementsByClassName("accordion");
  var i;
  
  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight){
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      } 
    });
  }
  
  // ####### MIC MODAL ########
  var feedModal = document.getElementById('feedModal');
  var feedBody = document.getElementById('opaqueContainer')

  // Get the button that opens the feedModal
  var btn = document.getElementById("feedBtn");

  // Get the <span> element that closes the feedModal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the feedModal 
  btn.onclick = function() {
  feedModal.style.display = "block";
  
  }

  // When the user clicks on <span> (x), close the feedModal
  span.onclick = function() {
  feedModal.style.display = "none";
 
  }

  // When the user clicks anywhere outside of the feedModal, close it
  window.onclick = function(event) {
      if (event.target == feedModal) {
          feedModal.style.display = "none";
      }
    }
  }