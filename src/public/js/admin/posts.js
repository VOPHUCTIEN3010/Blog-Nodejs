$(document).ready(function() {
    $('.postStatusCheckbox').change(function() {
        var status = this.checked ? 1 : 0;
        var postId = $(this).data('post-id');
        if (confirm('Are you sure you want to change ')) {
            $.ajax({
                url: '/updatePostStatus', 
                type: 'POST',
                data: { postId: postId, status: status }
            })
            .done(function(response) {
                if (response.success) {
                    alert(response.message); 
                } else {
                    alert('Error: ' + response.message);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                alert('Error deleting post: ' + (jqXHR.responseJSON ? jqXHR.responseJSON.message : textStatus));
            });
        }
    });

    $('.del-record').on('click', function(event) {
        event.preventDefault();
        var postId = $(this).attr('alt');
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

    var urlParams = new URLSearchParams(window.location.search);
    var keyword = urlParams.get('kw');
    
    if (keyword) {
        $('#searchInput').val(keyword);
        searchPosts(keyword); 
    }
    
    $('#searchInput').on('input', function() {
        var searchTerm = $(this).val().trim(); 
        searchPosts(searchTerm);
    });

});       
