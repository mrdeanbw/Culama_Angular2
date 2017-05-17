$(document).ready(function () {
    if (window.File && window.FileList && window.FileReader) {
        $("#files").on("change", function (e) {
            var files = e.target.files,
              filesLength = files.length;
            for (var i = 0; i < filesLength; i++) {
                var f = files[i]
                var fileReader = new FileReader();
                fileReader.onload = (function (e) {
                    var file = e.target;

                    var cusomeimages = $("<span class=\"pip pip-container add-new-img\">" +
                      "<img class=\"imageThumb\" src=\"" + e.target.result + "\" title=\"" + file.name + "\"/>" +
                      "<br/><span class=\"remove remove-icon\"><a class=\"\"><i class=\"material-icons\"></i></a></span>" +
                      "</span>");

                    $("#preview_images").append(cusomeimages);

                    //$("<span class=\"pip\">" +
                    //  "<img class=\"imageThumb\" src=\"" + e.target.result + "\" title=\"" + file.name + "\"/>" +
                    //  "<br/><span class=\"remove abcdd\">Remove image</span>" +
                    //  "</span>").insertAfter("#files");

                    //$(".remove").click(function () {
                    //    $(this).parent(".pip").remove();
                    //});

                    $(document).on("click", ".remove", function () {
                        debugger;
                        $(this).parent(".pip").remove();
                    });

                });
                fileReader.readAsDataURL(f);
            }
        });
    } else {
        alert("Your browser doesn't support to File API")
    }
});