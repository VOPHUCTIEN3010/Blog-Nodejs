$(document).ready(function() {
    var $avatarIcon = $("#avatar-icon");
    var $avatarInput = $("#image");

    $avatarIcon.on("click", function(event) {
        event.preventDefault(); 
        $avatarInput.click(); 
    });

    $('#image').on('change', function(event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var $imgPreview = $('<img>').attr('src', e.target.result).css({
                    'max-width': '100%',
                    'margin-top': '10px'
                });
                var $form = $('.panel-body');
                var $previousImage = $form.find('img');
                if ($previousImage.length) {
                    $previousImage.remove();
                }
                $form.find('.mar-top').before($imgPreview);
            };
            reader.readAsDataURL(file);
        }
    });

    $('.like-form').submit(function(event) {
        event.preventDefault();
        const user_id = $('#user_id').val();
        const $form = $(this);
        const post_id = $form.find('input[name="post_id"]').val();
        const data = {
            post_id: post_id,
            user_id: user_id
        };
        $.ajax({
            type: 'POST',
            url: '/like_post',
            contentType: 'application/json',
            data: JSON.stringify(data)
        })
        .done(function(response) {
            const $likeIcon = $form.find('button>i');
            const $numberLikeSpan = $form.prev().find('.number-like');
            let numberLike = parseInt($numberLikeSpan.text());
    
            if (response.data === 1) {
                $likeIcon.removeClass('active');
                $numberLikeSpan.text(numberLike - 1);
                $form.data('liked', 'false');
                console.log('Post unliked');
            } else {
                $likeIcon.addClass('active');
                $numberLikeSpan.text(numberLike + 1);
                $form.data('liked', 'true');
                console.log('Post liked');
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401 || jqXHR.status === 403) {
                window.location.href = "/login";
            } else {
                console.error('AJAX request error:', textStatus, errorThrown);
                alert('AJAX request failed');
            }
        });
    });


    $('textarea[name="title"]').on('input', function () {
        const title = $(this).val();
        const slug = slugify(title); 
        $('input[name="slug"]').val(slug); 
    });   
    
    $('.post-time').each(function() {
        const postTime = $(this).data('time');
        const elapsedTime = getElapsedTime(postTime);
        $(this).text(elapsedTime);
    });

    // $(window).scroll(function() {
    //     var scrollHeight = $(document).height();
    //     var scrollPosition = $(window).height() + $(window).scrollTop();
    //     if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
    //         $(".pagination").fadeOut();
    //     } else {
    //         $(".pagination").fadeIn();
    //     }
    // });
});

    function slugify(str) {
        str = str.replace(/^\s+|\s+$/g, ''); 
        str = str.toLowerCase(); 
        str = str.replace(/[^a-z0-9 -]/g, '') 
            .replace(/\s+/g, '-') 
            .replace(/-+/g, '-'); 
        
        const now = new Date();
        const timestamp = now.getFullYear().toString() + 
                            (now.getMonth() + 1).toString().padStart(2, '0') + 
                            now.getDate().toString().padStart(2, '0') + 
                            now.getHours().toString().padStart(2, '0') + 
                            now.getMinutes().toString().padStart(2, '0') + 
                            now.getSeconds().toString().padStart(2, '0');
        
        return str + '-' + timestamp;
    }

    function getElapsedTime(date) {
        const now = new Date();
        const postDate = new Date(date);
        const diff = Math.abs(now - postDate) / 1000;
    
        const years = Math.floor(diff / 31536000); // 60 * 60 * 24 * 365
        if (years > 0) return `${years} year${years === 1 ? '' : 's'} ago`;
    
        const months = Math.floor(diff / 2592000); // 60 * 60 * 24 * 30
        if (months > 0) return `${months} month${months === 1 ? '' : 's'} ago`;
    
        const days = Math.floor(diff / 86400); // 60 * 60 * 24
        if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
    
        const hours = Math.floor(diff / 3600) % 24;
        if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    
        const minutes = Math.floor(diff / 60) % 60;
        if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    
        const seconds = Math.floor(diff % 60);
        return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
    }
    
    function validateForm() {
        const title = document.getElementById('title').value;
        const titleError = document.getElementById('title-error');

        if (!title.trim()) {
            titleError.style.display = 'block';
            setTimeout(() => {
                titleError.style.display = 'none';
            }, 3000); 
            return false; 
        } else {
            titleError.style.display = 'none';
        }
        return true; 
    }

    function formatNumber(number) {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        } else {
            return number.toString();
        }
    }

    $(document).ready(function() {
        $('.number-format').each(function() {
            var number = parseInt($(this).data('number'));
            $(this).text(formatNumber(number));
        });
    });