$(document).ready(()=> {
    $('.page-control').on("click", function() {
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
                loadPageEventListeners();
                //window.location.replace('/page/' + $(this).data("section")  + '/'+ $(this).data("id"));
            }
            return false;
        })
    })


});

let loadPageEventListeners = () => {
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
                    }
                    return false;
                });
            }
            return false;
        })
    })
}

let loadPageSectionsEventListeners = () => {
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
                //window.location.replace('/page/' + $(this).data("section")  + '/'+ $(this).data("id"));
            }
            return false;
        })
    })
}

