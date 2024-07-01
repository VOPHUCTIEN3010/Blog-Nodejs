$(document).ready(function() {
    $('.del-record').on('click', function(event) {
        event.preventDefault(); 
        const userId = $(this).attr('alt'); 
        const row = $(this).closest('tr'); 
        if (confirm('Are you sure you want to delete this user?')) { 
            $.ajax({
                url: `/admin/delete_user/${userId}`, 
                type: 'POST',
                data: { _method: 'DELETE' },  // Method override for DELETE
                dataType: 'json',
            })
            .done((response) => { 
                if (response.success) { 
                    alert(response.message);
                    row.remove();
                } else { 
                    alert(`Error: ${response.message}`);
                }
            })
            .fail((jqXHR, textStatus) => {
                const errorMessage = jqXHR.responseJSON && jqXHR.responseJSON.message ? 
                                     jqXHR.responseJSON.message : 
                                     textStatus;
                alert(`Error deleting user: ${errorMessage}`);
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

    $('#image').change(function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $('#image-preview').attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });    
});