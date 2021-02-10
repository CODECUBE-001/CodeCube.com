const amvc = new AMVC();


$('#open-nav').on('click', function() {
    $('.tecx-nav-responsive').show();
    setTimeout(() => $('.tecx-nav-responsive').css('opacity', '100'), 1);
    overlay.open(() => {
        S('.tecx-nav-responsive').css('opacity', '0');
        setTimeout(() => $('.tecx-nav-responsive').hide(), 700);
        overlay.close();
    });
});

$('#close-nav').on('click', function() {
    $('.tecx-nav-responsive').css('opacity', '0');
    setTimeout(() => {
        $('.tecx-nav-responsive').hide();
    }, 700);
    overlay.close();
});

const overlay = {
    open: function(closefunc) {
        $('.tecx-overlay').addClass('active');
        setTimeout(() => {
            $('.tecx-overlay').css('opacity', '100');
            $('.tecx-overlay').on('click', closefunc);
        }, 40);
    },

    close: function() {
        $('.tecx-overlay').css('opacity ', '0');
        setTimeout(() => $('.tecx-overlay').removeClass('active'), 400);
    }
};


const controlNav = () => {
    var wScroll = $(this).scrollTop();

    if (wScroll > $('#tecx-nav').height()) {
        $('#tecx-nav').css('top', wScroll > lastScrollTop ? '-70px' : '0');
        $('#tecx-nav').addClass('active');

    } else
        $('#tecx-nav').removeClass('active');

    lastScrollTop = wScroll;
};

var lastScrollTop = 0;

window.onscroll = controlNav;
controlNav();


if (document.querySelector(".tecx") && document.querySelector(".body-loader")) {
    loader = {
        start: () => {
            $(".tecx").css('opacity', '0');
            $(".body-loader").addClass('loading');
        },
        stop: () => {
            $(".tecx").css('opacity', '100');
            $(".body-loader").removeClass('loading');
        }
    };

    document.body.onload = () =>
        setTimeout(() => loader.stop(), 100);
}

const processDate = date => {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    date = date.trim().split('/');
    date[0] = date[0].replace(/^[0]/g, '');

    if (typeof(months[date[0] - 1]) !== 'undefined') {
        let month = months[date[0] - 1];
        date = `${month} ${date[1]}, ${date[2]}`;

        return date;
    }
};

const generateShareLink = (socialMedia, data) => {
    switch (socialMedia) {
        case "facebook":
            return 'https://www.facebook.com/sharer/sharer.php?u=' + escape(data.url);
        case "twitter":
            return 'http://twitter.com/home?status=' + escape(data.url) + '\n' + data.description;
        case "mail":
            return 'mailto:?subject=' + data.title + ';body=' + data.description + '\n' + escape(data.url);
        case "pinterest":
            return `http://pinterest.com/pin/create/bookmarklet/?is_video=false&url=${escape(data.url)}&description=${data.description}`;
    }

};

document.getElementById("current-year").innerHTML = new Date().getFullYear();