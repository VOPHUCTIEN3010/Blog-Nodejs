$(document).ready(function() {
    $('#inputImage').change(function(event) {
        var input = event.target;
        var reader = new FileReader();
        reader.onload = function() {
            var output = $('#imagePreview');
            output.attr('src', reader.result);
        };
        reader.readAsDataURL(input.files[0]);
    });
});
