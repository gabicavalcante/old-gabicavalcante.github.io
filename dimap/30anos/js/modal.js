              $("#myModal").on("show", function() {    // wire up the OK button to dismiss the modal when shown
                  $("#myModal a.btn").on("click", function(e) {
                      console.log("button pressed");   // just as an example...
                      $("#myModal").modal('hide');     // dismiss the dialog
                  });
              });

              $("#myModal").on("hide", function() {    // remove the event listeners when the dialog is dismissed
                  $("#myModal a.btn").off("click");
              });
              
              $("#myModal").on("hidden", function() {  // remove the actual elements from the DOM when fully hidden
                  $("#myModal").remove();
              });
              
              $("#myModal").modal({                    // wire up the actual modal functionality and show the dialog
                "backdrop"  : "static",
                "keyboard"  : true,
                "show"      : true                     // ensure the modal is shown immediately
              }); 