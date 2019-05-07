jQuery(document).ready(function($) {
  var windowWidth = $(window).width();

  $.fancybox.defaults.hideScrollbar = false;
  $.fancybox.defaults.touch = false;
  $.fancybox.defaults.btnTpl.smallBtn =
    '<button data-fancybox-close class="modal-close">' +
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" xml:space="preserve" style="enable-background:new 0 0 22 22;"><path d="M11,10.3L21.3,0L22,0.7L11.7,11L22,21.3L21.3,22L11,11.7L0.7,22L0,21.3L10.3,11L0,0.7L0.7,0C0.7,0,11,10.3,11,10.3z"></path></svg>' +
    '</button>';

  $(window).resize(function() {
    windowWidth = $(window).width();
  });

  $(window).on('load', function() {});

  $(document).on('click touchstart', function(event) {
    // if (
    //   !$(event.target.closest('.sidebar')).is(
    //     '.sidebar'
    //   ) &&
    //   $('.sidebar').hasClass('opened') &&
    //   !$(event.target.closest('.sidebar__overlay')).is(
    //     '.sidebar__overlay'
    //   )
    // ) {
    //   $('.catalog__filter-content').removeClass('active');
    // }
  });



  if ('ontouchstart' in document.documentElement) {
    $('body').addClass('touch-device');
  } else {
    $('body').removeClass('touch-device');
  }

  $('.only-text-input').bind('keyup blur', function() {
    var node = $(this);
    node.val(node.val().replace(/[^a-zA-Zа-яА-Я ]/g, ''));
  });

  $('.only-numbers-input').bind('keyup blur', function() {
    var node = $(this);
    node.val(node.val().replace(/[^0-9 ()-+]/g, ''));
  });

  var cursor = {
    $dotEl: $('[data-ref="dot"]'),
    $dotBgEl: $('[data-ref="dotBg"]'),
    $wrap: $('.cursor-wrap'),
    delay: 8,
    bg: {},
    dot: {
      x: 0,
      y: 0
    },
    isVisible: false,
    isLarger: false,
    isInitialized: false,
    initDot: function(e) {
      cursor.dot.x = e.pageX;
      cursor.dot.y = e.pageY;
      cursor.$dotEl[0].style.top = cursor.dot.y + 'px';
      cursor.$dotEl[0].style.left = cursor.dot.x + 'px';
      if (!cursor.isVisible) {
        cursor.isVisible = true;
        cursor.$wrap.addClass('visible');
      }

      if (!this.isInitialized) {
        cursor.isInitialized = true;
        cursor.$wrap.addClass('transition');
      }
    },
    initDotBg: function() {
      cursor.bg.x += (cursor.dot.x - cursor.bg.x) / cursor.delay;
      cursor.bg.y += (cursor.dot.y - cursor.bg.y) / cursor.delay;

      cursor.$dotBgEl[0].style.top = cursor.bg.y + 'px';
      cursor.$dotBgEl[0].style.left = cursor.bg.x + 'px';
      cursor.req = requestAnimationFrame(cursor.initDotBg);
    },
    initLeave: function() {
      cursor.isVisible = false;
      cursor.$wrap.removeClass('visible');
    },
    initEnter: function() {
      cursor.isVisible = true;
      cursor.$wrap.addClass('visible');
    },
    initDown: function() {
      cursor.isLarger = true;
      cursor.$wrap.addClass('large');
    },
    initUp: function() {
      cursor.isLarger = false;
      cursor.$wrap.removeClass('large');
    },
    initHoverIn: function() {
      cursor.isLarger = true;
      cursor.$wrap.addClass('large');
    },
    initHoverOut: function() {
      cursor.isLarger = false;
      cursor.$wrap.removeClass('large');
    },
    initCustomHover: function() {
      $('body').delegate(
        'a, button, .s-calculator__step-item, .s-calculator__steps, li, .s-clients__item, input, textarea',
        'mouseenter',
        cursor.initHoverIn
      );
      $('body').delegate(
        'a, button, .s-calculator__step-item, .s-calculator__steps, li, .s-clients__item, input, textarea',
        'mouseleave',
        cursor.initHoverOut
      );
    },
    onInit: function() {
      document.addEventListener('mousemove', cursor.initDot);
      document.addEventListener('mouseleave', cursor.initLeave);
      document.addEventListener('mouseenter', cursor.initEnter);
      document.addEventListener('mousedown', cursor.initDown);
      document.addEventListener('mouseup', cursor.initUp);

      cursor.bg.x = window.innerWidth / 2;
      cursor.bg.y = window.innerHeight / 2;

      cursor.initCustomHover();
      cursor.initDotBg();
    }
  };

  if (!('ontouchstart' in document.documentElement)) {
    cursor.onInit();
  }

  var sidebar = {
    $toggler: $('.sidebar-toggler-el'),
    $el: $('.sidebar'),
    $header: $('.header'),
    $overlay: $('.sidebar__overlay'),
    tl: new TimelineLite(),
    $arrow: $('.sidebar__arrow'),
    init: function() {
      $.fancybox.defaults.beforeShow = function() {
        if (sidebar.$el.hasClass('opened')) {
          sidebar.close()
        }
      }

      sidebar.$toggler.click(sidebar.toggle);
      sidebar.$arrow.click(sidebar.scrollTop)
      window.addEventListener('scroll', sidebar.handleScroll);

      $(document).on('click touchstart', function(event) {
        if (
          !$(event.target.closest('.sidebar')).is(
            '.sidebar'
          ) &&
          !$(event.target.closest('.sidebar__toggler')).is(
            '.sidebar__toggler'
          ) &&
          $('.sidebar').hasClass('opened') &&
          !$(event.target.closest('.sidebar__overlay')).is(
            '.sidebar__overlay'
          )
        ) {
          sidebar.close()
        }
      });
    },
    scrollTop: function(e) {
      e.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    handleScroll: function(e) {
      if (window.pageYOffset > 300) {
        sidebar.$arrow.addClass('show')
      } else {
        sidebar.$arrow.removeClass('show')
      }
    },
    close: function() {
      if (document.body.clientWidth <= 650) {
        document.documentElement.style.overflow = 'auto';
      }

      sidebar.$toggler.removeClass('active');
      sidebar.$el.removeClass('opened');

      sidebar.tl
        .staggerFromTo($('.sidebar__nav-list li'), .5, {autoAlpha: 1, x: 0}, {autoAlpha: 0, x: 150, onStart: function() {sidebar.$overlay.addClass('prevent'); sidebar.$toggler.addClass('prevent');}}, .15)
        .fromTo($('.sidebar__nav-list .nav__fill'), .5, {x: '0%', autoAlpha: 1}, {x: '100%', autoAlpha: 0, onComplete: () => this.tl.set($('.sidebar__nav-list .nav__fill'), {autoAlpha: 1})}, '-=.25')
        .fromTo($('.sidebar__nav-list'), .5, {x: '0%', autoAlpha: 1}, {x: '100%', autoAlpha: 0, onComplete: function() {
            setTimeout(function() {sidebar.$overlay.removeClass('prevent'); sidebar.$toggler.removeClass('prevent');}, 250)

          }})
    },
    open: function() {
      if (document.body.clientWidth <= 650) {
        document.documentElement.style.overflow = 'hidden';
      }
      sidebar.$toggler.addClass('active');
      sidebar.$el.addClass('opened');

      sidebar.tl.fromTo($('.sidebar__nav-list'), .5, {x: '100%', autoAlpha: 0}, {x: '0%', autoAlpha: 1, onStart: function()  {
          sidebar.$overlay.addClass('prevent'); sidebar.$toggler.addClass('prevent');
        }
      })
        .fromTo($('.sidebar__nav-list .nav__fill'), 1, {x: '100%', scaleX: 1.3, autoAlpha: 0, ease: Elastic.easeOut.config(1.2, 0.9)}, {x: '0%', scaleX: 1, autoAlpha: 1, ease: Elastic.easeOut.config(1.2, 0.9), onComplete: function() {
            setTimeout(function() {
              sidebar.$overlay.removeClass('prevent'); sidebar.$toggler.removeClass('prevent');
            }, 250)
          }}, '+=.085')
        .staggerFromTo($('.sidebar__nav-list li'), .45, {autoAlpha: 0, x: 150}, {autoAlpha: 1, x: 0,}, .15, '-=1.35')
    },
    toggle: function(e) {
        sidebar.$toggler.toggleClass('active');
        sidebar.$el.toggleClass('opened');

        if (sidebar.$el.hasClass('opened')) {
          sidebar.open()
        } else {
          sidebar.close()
        }
    }
  }

  sidebar.init();

  (function initBannerSection() {
    var $banner = $('.s-banner');

    if ($banner.length) {
      var $title = $('[data-banner-title]')
      var $subtitle = $('[data-banner-subtitle]')
      var $descr = $('[data-banner-descr]')
      var tl =  new TimelineLite();
      var bannerStr = $title[0].textContent;
      var $mouse = $('.mouse')

      $title[0].textContent = '';

      var chars = bannerStr.split('')

      for (var i = 0; i < chars.length; i++) {
        var item = document.createElement('span');
        item.textContent = chars[i];
        $title[0].appendChild(item);
      }

      $mouse.click(function(e) {
      e.preventDefault();

      var target = $mouse.attr('href').split('#')[1];
      var offsetY = document.getElementById(target).getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: offsetY,
        behavior: 'smooth'
      })
    })

      tl.set($title, {transformPerspective: 400, transformStyle: 'preserve-3d'});

      tl.to($title, 0, {opacity: 1})
        .staggerFromTo($title[0].querySelectorAll('span'), 1, {opacity: 0, bottom: -50, rotationY: 150, rotationX: 150}, {opacity: 1, bottom: 0, rotationY: 0, rotationX: 0}, 0.1)
        .fromTo($subtitle, 1, {opacity: 0, bottom: -30, scale: .85}, {opacity: 1, bottom: 0, scale: 1}, '-=0.25');

      var typed = new Typed($descr[0], {
        strings: ['Web Development.', 'SEO.', 'SMM.'],
        typeSpeed: 40,
        backSpeed: 40,
        startDelay: 2000,
        onComplete: function(self) {
          self.cursor.style.opacity = '0';
          self.cursor.style.animation = 'none';
        }
      });
    }
  })();

  var calculator = {
    $current: $('.calculator--current'),
    $total: $('.calculator--total'),
    stepCurrent: parseInt($('.calculator--current').text(), 10),
    stepTotal: parseInt($('.calculator--total').text(), 10),
    $progress: $('.s-calculator__progress-line'),
    $items: $('.s-calculator__step-item'),
    $wraper: $('.s-calculator__content'),
    $back: $('.s-calculator__arrow'),
    $topBar: $('.s-calculator__steps'),
    $infoItems: $('.s-calculator__navigation-list li'),
    activeColor: '#cec8f8',
    checkStep() {
      if (calculator.stepCurrent > 1) {
        calculator.$back.addClass('show')
      } else {
        calculator.$back.removeClass('show')
      }

      calculator.$progress.css({
        'width': (calculator.stepCurrent / calculator.stepTotal) * 100 + '%'
      })

      for (var i = calculator.$infoItems.length; i >= calculator.stepCurrent; i--) {
        $(calculator.$infoItems[i - 1]).removeClass('answered')
      }

      for (var j = 0; j  < calculator.stepCurrent - 1; j++) {
        $(calculator.$infoItems[j]).addClass('answered')
      }

      $('.s-calculator__navigation-list li.active').removeClass('active')
      $(calculator.$infoItems[calculator.stepCurrent - 1]).addClass('active')
    },
    init: function() {
      calculator.$items.click(calculator.step)
      calculator.$topBar.click(calculator.step)
      calculator.$infoItems.click(calculator.step)
    },
    step: function(e) {
      $('.s-calculator__content.active').fadeOut(200, function() {
        $('.s-calculator__content.active').removeClass('active');

        if (calculator.stepCurrent === 1 && e.currentTarget.classList.contains('s-calculator__step-item')) {
          calculator.activeColor = $(e.currentTarget).attr('data-color');
          $('.s-calculator__content:not(.s-calculator__content--1)').each(function() {
            $(this).find('.s-calculator__step-item-figure').css({
              'border-color': 'transparent transparent transparent ' + calculator.activeColor
            })
          });
        }

        if (e.currentTarget.classList.contains('s-calculator__steps')) {
          if (calculator.stepCurrent > 1) {
            calculator.stepCurrent--;
          }
        } else if (e.currentTarget.classList.contains('s-calculator__step-item')){
          if (calculator.stepCurrent < 5) {
            calculator.stepCurrent++;
          }
        } else {
          calculator.stepCurrent = parseInt($(e.currentTarget).attr('data-step'), 10)
        }

        calculator.checkStep();

        calculator.$current.text(calculator.stepCurrent);
        $(calculator.$wraper[calculator.stepCurrent - 1]).fadeIn(300, function() {
          $(calculator.$wraper[calculator.stepCurrent - 1]).addClass('active');

        })
      });
    }
  }

  calculator.init();

  (function initClientsSection() {
    var $item = $('.s-clients__item');

    $(document).on('click touchstart', function(event) {
      if (
        $(event.target.closest('.s-clients__item')).length === 0 &&
        $('.s-clients__logotypes').hasClass('active')
      ) {

        $item.removeClass('disabled');
        $item.removeClass('active');
        $('.s-clients__logotypes').removeClass('active');
      }
    });


    $item.click(function(e) {
      var isActive = $(e.currentTarget).hasClass('active');

      if (isActive) {
        $(e.currentTarget).removeClass('active')
        $item.removeClass('disabled');
        $('.s-clients__logotypes').removeClass('active');
      } else {
        $item.addClass('disabled');
        $(e.currentTarget).removeClass('disabled')
        $(e.currentTarget).addClass('active')
        $('.s-clients__logotypes').addClass('active');
      }
    });
  })();

  $('.form-input--textarea').each(function() {
    $(this).find('textarea').on('input', function(e) {

      if (e.target.scrollHeight > e.target.clientHeight) {
        e.target.setAttribute('rows', parseInt(e.target.getAttribute('rows'), 10) + 1)
      }
    })
  });



  $('.form-input--file').each(function() {
    var $self = $(this)

    $self.find('input[type="file"]').change(function(e) {
      if (e.target.files.length > 0) {
        $self.find('label').addClass('file--loaded');
        $($self.find('label span')).text('Загружено')
      } else {
        $self.find('label').removeClass('file--loaded');
        $($self.find('label span')).text('Добавить файл')
      }
    })
  })

  $('input:not([type="submit"]):not([type="file"]), textarea').focus(function(e) {
    $(this).closest('.form-input').addClass('form-input--focused')
  });

  $('input:not([type="submit"]):not([type="file"]), textarea').blur(function(e) {
    $(this).closest('.form-input').removeClass('form-input--focused')
  });



  (function initVideo() {
    var $videoBlocks = $('.video__block');

    $videoBlocks.each(function() {
      var $self = $(this);
      var isPlaying = false;
      var isFullScreen = false;
      var isVideoMuted = false;
      var video = $self.find('video')[0];
      var $toggler = $self.find('.video-toggler')
      var wrap = $self.find('.video__block-inner')[0];
      var $screen = $self.find('.fullscreen')
      var $mute = $self.find('.volume-mute')
      var $volumeIcon = $('.video-volume-icon');
      var $muteIcon = $('.video-mute-icon');
      var $playIcon = $('.video-play-icon');
      var $pauseIcon = $('.video-pause-icon');
      var $duration = $('.duration input')
      var $volume = $('.volume__line input')

      $(video).on('canplay', function() {
        video.volume = 0.5;
        $duration.attr('max', Math.round(video.duration));
        $duration.val(0);
        $volume.val(.5)
        $self.addClass('loaded')
      });

      $volume.on('input', function() {
        video.volume = $volume.val();

        if (video.volume > 0) {
          $volumeIcon.css({
            'display': 'block'
          })

          $muteIcon.css({
            'display': 'none'
          })
        }
      });

      $mute.click(function() {
        isVideoMuted = true;
        video.volume = 0;
        $volume.val(0);

        $volumeIcon.css({
          'display': 'none'
        })

        $muteIcon.css({
          'display': 'block'
        })
      })

      $(video).on('timeupdate', function(e) {
        $duration.val(Math.round(video.currentTime));
      });

      $duration.on('input', function(e) {
        console.log($duration.val())
        video.currentTime = parseInt($duration.val(), 10)
      });

      $toggler.click(function() {
        if (isPlaying) {
          video.pause();
        } else {
          video.play();
        }
      });

      $(video).on('play', function() {
        isPlaying = true;

        $self.addClass('playing')
        $pauseIcon.css({
          'display': 'inline-block'
        });
        $playIcon.css({
          'display': 'none'
        });
      })

      $(video).on('pause ended', function() {
        isPlaying = false;
        $self.removeClass('playing')

        $playIcon.css({
          'display': 'inline-block'
        });
        $pauseIcon.css({
          'display': 'none'
        });
      })


      $(wrap).hover(function() {
        $self.addClass('hovered')
      }, function() {
        $self.removeClass('hovered')
      });

      if ($('body').hasClass('touch-device')) {
        $self.click(function() {
          if (isPlaying) {
            $self.addClass('hovered')
          } else {
            $self.removeClass('hovered')
          }
        })
      }

      $mute.click(function() {
        video.volume = 0;
      })

      $screen.click(function() {
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
          // this.isFullScreen = true;

          if (wrap.requestFullscreen) {
            wrap.requestFullscreen();
          } else if (wrap.mozRequestFullScreen) {
            wrap.mozRequestFullScreen();
          } else if (wrap.webkitRequestFullscreen) {
            wrap.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          }
        } else {
          // this.isFullScreen = false;

          if (document.cancelFullScreen) {
            document.cancelFullScreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          }
        }
      })

    });
  })();

  (function initFluidForm() {
    var $fluid = $('.fluid__form');

    if ($fluid.length) {
      $(window).scroll(function(e) {
        if (window.scrollY > 350) {
          $fluid.addClass('show');
        } else {
          $fluid.removeClass('show');
        }
      })
    }
  })();

  (function initToggleItems() {
    var $items = $('.toggler-item');

    $items.each(function() {
      var $self = $(this);
      var $top = $self.find('.toggler-item__top');
      var $content = $self.find('.toggler-item__bottom');
      var maxHeight = $content[0].scrollHeight;

      $top.click(function() {
        $self.toggleClass('opened');
        if ($self.hasClass('opened')) {
          $content[0].style.maxHeight = maxHeight + 'px';
        } else {
          $content[0].style.maxHeight = null;
        }
      });
    });
  })();

  (function initSelect() {
    var $selects = $('.select');

    $selects.each(function() {
      $(this).find('select').select2({
        dropdownParent: $(this),
        minimumResultsForSearch: -1,
      });
    });
  })();

  (function initInstagram() {
    var $instagram = $('.s-instagram');

    $instagram.each(function() {
      var $self = $(this);
      var $items = $self.find('.s-instagram__items');

      $.ajax({
        url: 'https://api.instagram.com/v1/users/self/media/recent/?access_token=7582844000.1677ed0.4533c36a2dce45b79e7e14a9b2a435a3'
      }).done(function(data) {
        var res = data.data;
        for (var i = 0; i < res.length; i++) {
          if (i < 8) {
            var item = document.createElement('a');
            item.classList.add('s-instagram__item');
            item.classList.add('above-viewport');
            item.setAttribute('href', res[i].link);
            item.setAttribute('target', '_blank');
            item.style.backgroundImage = 'url(' + res[i].images.standard_resolution.url + ')';
            $items[0].appendChild(item);
          }
        }
      }).fail(function() {
        console.log('Error while loading instagram')
      })
    });
  })();

  var blogScroll = {
    left: 0,
    width: 0,
    scrollY: 0,
    innerHeight: 0,
    blogRightInner: $('.p-blog-item__right-inner')[0],
    blogLeft: $('.p-blog-item__left')[0],
    blogRight: $('.p-blog-item__right')[0],
    leftBottom: 0,
    init: function() {
      var rect = blogScroll.blogRightInner.getBoundingClientRect();
      blogScroll.scrollY = window.pageYOffset;

      setTimeout(function() {
        blogScroll.leftBottom = blogScroll.blogLeft.offsetTop + blogScroll.blogLeft.clientHeight - blogScroll.innerHeight;
      }, 100)

      blogScroll.left = rect.left;
      blogScroll.width = rect.width;
      blogScroll.innerHeight = rect.height;

      window.addEventListener('scroll', blogScroll.handleScroll);
      blogScroll.moveBlock();

    },
    moveBlock() {
      if (window.scrollY >= blogScroll.blogRight.offsetTop) {
        if (blogScroll.leftBottom > window.scrollY) {
          blogScroll.blogRightInner.style.left = blogScroll.left + 'px';
          blogScroll.blogRightInner.style.top = '0px';
          blogScroll.blogRightInner.style.width = blogScroll.width + 'px';
          blogScroll.blogRight.classList.add('fixed');
          blogScroll.blogRight.classList.remove('absolute');
        } else {
          blogScroll.blogRightInner.style.top = 'auto';
          blogScroll.blogRightInner.style.bottom = '0px';
          blogScroll.blogRightInner.style.left = '0px';
          blogScroll.blogRight.classList.add('absolute');
          blogScroll.blogRight.classList.remove('fixed');
        }
      } else {
        blogScroll.blogRight.classList.remove('fixed');
        blogScroll.blogRight.classList.remove('absolute');
      }
    },
    handleScroll: function(e) {
      if (window.innerWidth >= 1200) {


        blogScroll.moveBlock();
      } else {
        blogScroll.blogRight.classList.remove('fixed');
        blogScroll.blogRight.classList.remove('absolute');
      }
    }
  }

  if (blogScroll.blogRightInner !== undefined) {
    blogScroll.init();
  }

  function initMap() {
    var $map = $('#contacts-map');

    if ($map.length) {
      var map = new google.maps.Map(
        document.getElementById('contacts-map'),
        {
          center: new google.maps.LatLng(49.985442, 36.234196),
          zoom: 16,
          mapTypeId: 'roadmap',
          disableDefaultUI: true,
        });

      var marker = new google.maps.Marker({
        position: map.getCenter(),
        icon: '../img/placeholder-filled-point.png',
        map: map
      });
    }
  }

  initMap();

  (function initZoom() {
    var $zoom = $('.zoom');
    var type = 'mouseover';
    var $items = $('.p-office__items');
    var $gallery = $('.gallery-item');

    if ($gallery.length) {
      if (!$('body').hasClass('touch-device')) {
        $gallery.click(function(event) {
          event = event || window.event;
          var target = event.target || event.srcElement,
            link = target.src ? target.parentNode : target,
            options = {index: link, event: event},
            links = this.getElementsByTagName('a');
          blueimp.Gallery(links, options);
        });
      }
    }

    if ($items.length) {
      $items.masonry({
        itemSelector: '.p-office__item',
        transitionDuration: '0.45s',
        stagger: '0.03s'
      });
    }

    if ($('body').hasClass('touch-device')) {
      type = 'grab'
    }

    $zoom.each(function() {
      $(this).zoom({
        on: type
      })
    });
  })();



});
