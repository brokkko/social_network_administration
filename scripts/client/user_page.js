$(document).ready(()=> {
    dayNightMode();

    const pupil = $('.pupil');
    document.onmousemove = (event) => {
        const x = event.clientX * 100 / window.innerWidth + '%'
        const y = event.clientY * 100 / window.innerHeight + '%'
        for(let i =0; i<2; i++){
            pupil[i].style.left = x
            pupil[i].style.top = y
            pupil[i].style.transform = `translate( -${x}, -${y})`
        }
    }

    $('.page-control').on("click", function() {
        $('.logo').hide();
        $('.page-control').each(function() {
            $(this).css("border", "1px solid rgba(0, 0, 0, .0)");
        })
        $(this).css("border", "1px solid rgba(0, 0, 0, 1)");

        let body;
        fetch('/page/' + $(this).data("section"),{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then(async (response) => {
            if(response.ok) {
                $('.content-page').html(await response.text());
                if ($(this).data("section") === "blocked") {
                    loadBlockedPageEvents();
                } else {
                    fetch('/page/users/list',{
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(body)
                    }).then(async (response) => {
                        if(response.ok) {
                            $('.users-list-section').html(await response.text());
                            loadPageEventListeners();
                            loadUsersListSearch();
                            dayNightMode();
                        }
                        return false;
                    });
                }
            }
            return false;
        })
    })

    // day-night mode
    $('#chk').on('change', function () {
        if($('#chk').data("mode") === "day")
            $('#chk').data("mode", "night");
        else $('#chk').data("mode", "day");
        dayNightMode();
        // $(this).attr('class', 'body.dark');
    })

});

let dayNightMode = () => {
    if($('#chk').data("mode") !== "day") {
        $('body, .section-dark').addClass('dark');
        $('.data, .list-box').addClass('data-dark');
        $('.row, .photo-data').addClass('profile-dark');
        $('.post, .card-body').addClass('post-dark');
        $('span, p, h5, h3, .module-name, .name').addClass('text-dark');
        $('.icon').addClass('image-dark');
        $('.icon-0').addClass('selector-image-dark');
        $('.img-background').addClass('img-background-dark');
        $('button').addClass('button-style-dark');
    } else{
        $('body, .section-dark').removeClass('dark');
        $('.data, .list-box').removeClass('data-dark');
        $('.row, .photo-data').removeClass('profile-dark');
        $('.post, .card-body').removeClass('post-dark');
        $('span, p, h5, h3, .module-name, .name').removeClass('text-dark');
        $('.icon').removeClass('image-dark');
        $('.icon-0').removeClass('selector-image-dark');
        $('.img-background').removeClass('img-background-dark');
        $('button').removeClass('button-style-dark');
    }
}

let loadBlockedPageEvents = () => {
    dayNightMode();
    $('.button-style').on("click", function() {
        let body = {user_id: $(this).data("user")};
        fetch('/page/unblock/' + $(this).data("id"),{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then(async (response) => {
            if(response.ok) {
                $('.content-page').html(await response.text());
                dayNightMode();
                loadBlockedPageEvents();
            }
            return false;
        })
    })
}

let loadUsersListSearch = () => {
    dayNightMode();
    $('#search').on('input', function(){
        console.log($(this).val())
        let body = {input: $(this).val()};
        fetch('/page/user-list/search',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then(async (response) => {
            if(response.ok) {
                $('.users-list-section').html(await response.text());
                loadPageEventListeners();
                dayNightMode();

            }
            return false;
        })
    });
    $("form").on("submit", function(){
        event.preventDefault();
        return false;
    })
}

let loadPageEventListeners = () => {
    dayNightMode();
    $('.user-card').on("click", function() {
        let body;
        fetch('/page/' + $(this).data("id"),{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then(async (response) => {
            if(response.ok) {
                $('.content-page').html(await response.text());
                fetch('/page/photos/' + $(this).data("id"),{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)
                }).then(async (response) => {
                    if(response.ok) {
                        $('.section').html(await response.text());
                        loadPageSectionsEventListeners();
                        dayNightMode();
                    }
                    return false;
                });
            }
            return false;
        })
    })
}

let loadPageSectionsEventListeners = () => {
    dayNightMode();
    $("#photo-section").css("border", "1px solid rgba(0, 0, 0, 1)");
    $('.user-page-control').on("click", function() {
        $('.user-page-control').each(function() {
            $(this).css("border", "1px solid rgba(0, 0, 0, .0)");
        })
        $(this).css("border", "1px solid rgba(0, 0, 0, 1)");

        let body;
        fetch('/page/' + $(this).data("section")  + '/'+ $(this).data("id"),{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then(async (response) => {
            if(response.ok) {
                $('.section').html(await response.text());
                loadPageEventListeners();
                dayNightMode();
                if($(this).data("section") === "notes" || $(this).data("section") === "news")
                    loadPostsSectionEventListeners();
            }
            return false;
        })
    })
    $('.select-role').on('change', function () {
        let valueSelected = this.value;
        let body = {role: valueSelected};
        fetch('/page/role' + '/'+ $(this).data("id"),{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then(async (response) => {
            if(response.ok) {
                loadPageEventListeners();
                dayNightMode();
            }
            return false;
        })
    })

    $('.select-status').on('change', function () {
        let valueSelected = this.value;
        let body = {status: valueSelected};
        fetch('/page/status' + '/'+ $(this).data("id"),{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then(async (response) => {
            if(response.ok) {
                loadPageEventListeners();
                dayNightMode();
            }
            return false;
        })
    })
}

let loadPostsSectionEventListeners = () => {
    dayNightMode();
    let sub = $('.sub');
    $(".main li").hover(
        function(){
            $('>ul.sub:not(:animated)', this).slideDown(300);
        },
        function(){
            $('>ul.sub',this).slideUp(500);
        }
    );
    sub.hover(
        function(){
            $(this).css("background-color", "#EFEFEF");
        },
        function(){
            $(this).css("background-color", "#FFFFFF");
        },
    );

    sub.on('click', function () {
        let body = {user_id: $(this).data("user")};
        fetch('/page/' + $(this).data("section") + '/block' + '/'+ $(this).data("id"),{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then(async (response) => {
            if(response.ok) {
                $('.section').html(await response.text());
                loadPageEventListeners();
                dayNightMode();
                if($(this).data("section") === "notes" || $(this).data("section") === "news")
                    loadPostsSectionEventListeners();
            }
            return false;
        })
    });
}

