$(document).ready(function() {
    $('.delete-post').on('click', function(event) {
        event.preventDefault(); 

        var postId = $(this).data('post-id');
        var row = $(this).closest('tr');  
        if (confirm('Are you sure you want to delete this post?')) {
            $.ajax({
                url: '/delete_post/' + postId,
                type: 'POST',
                data: { _method: 'DELETE' },
                dataType: 'json'  
            })
            .done(function(response) {
                if (response.success) {
                    alert(response.message);
                    row.remove(); 
                } else {
                    alert('Error: ' + response.message);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                alert('Error deleting post: ' + (jqXHR.responseJSON ? jqXHR.responseJSON.message : textStatus));
            });
        }
    });
});