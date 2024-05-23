body=$('body')
background=$('.background')
attract = $('.attract')
intro = $('.intro')
gallery = $('.gallery')
viewer = $('.viewer')
done = $('.done')

objects = {} // for 3d models, will store models after first load

timeout = {} // the timeout object, how we set and reset the attract timeout

resize = {}
resize.body = function(w,h) {
	body.css({
		width:w,
		height:h,
	})
	$('.overlay').css({
		width:w,
		height:h,
	})
}

resize.background = function(w,h) {
	background.css({
		width:w,
		height:h,
	})
}

resize.attract = function(w,h) {
	attract.css({
		width:w,
		height:h,
	})
}

resize.intro = function(w,h) {
	intro.css({
		width:w,
		height:h,
	})
}

resize.gallery = function(w,h) {
	gallery.css({
		width:w,
		height:h,
	})
}

resize.viewer = function(w,h) {
	viewer.css({
		width:w,
		height:h,
	})
	viewer.find('.example').each(function(index){
		if (index == 0) {
			$(this).css({
				top:120,
				left:30,
			})
		}
		if (index == 1) {
			$(this).css({
				top:320,
				left:30,
			})
		}
		if (index == 2) {
			$(this).css({
				top:120,
				right:30,
			})
		}
		if (index == 3) {
			$(this).css({
				top:320,
				right:30,
			})
		}
	})
}

resize.done = function(w,h) {
	done.css({
		width:w,
		height:h,
	})
}


function resize_everything() {
	w = document.documentElement.clientWidth
	h = document.documentElement.clientHeight

	resize.body(w,h)
	resize.background(w,h)
	resize.attract(w,h)
	resize.intro(w,h)
	resize.gallery(w,h)
	resize.viewer(w,h)
	resize.done(w,h)
}

function set_timeout(t=30000) {
	timeout = setTimeout(function(){
		if (! $('.attract').hasClass('active'))
			$('.active').transition_to(attract)
	}, t)
}

function reset_timeout(t=30000) {
	// console.log('resetting timeout to ', t)
	clearTimeout(timeout)
	set_timeout(t)
}

$.fn.transition_to = function(to, time=1000) {
	// fade out active, set as inactive, fade in next and set as active
	if ($(this).hasClass('active'))
		this.stop().removeClass('active').animate({opacity:0}, time, function(){
			$(this).addClass('inactive')
			to.stop().removeClass('inactive').animate({opacity:1}, time, function(){
				$(this).addClass('active')
				$(this).appendTo(body) // append puts it on top of everything
			});
		});
}

$(document).ready(function() {
	resize_everything()

	document.ontouchmove = function(event){
		event.preventDefault(); // prevent overscroll on ipad
	}

	// initial transition
	$('.background, .content').css({opacity:0})
	background.animate({opacity:1}, function(){
		attract.animate({opacity:1}).appendTo(body)
	})

	// content transition logic starts here
	$('.attract').click(function(){
		if (attract.hasClass('active'))
			attract.transition_to(intro)
		reset_timeout()
	})


	$('.intro .button').click(function(){
		if (intro.hasClass('active'))
			intro.transition_to(gallery)
		reset_timeout()
	})


	$('.gallery .animals li img').click(function(){
		if (gallery.hasClass('active')){

			// we need to dynamically change some text for the title on viewer
			title = viewer.find('.title')
			the_animal = $(this).attr('alt')
			title.find('.animal').text(the_animal)

			// and load the right animal
			scene.remove(scene.children[0])
			if (objects[the_animal] == undefined) {
				objLoader.load('/models/'+the_animal+'.obj', function (object) {
					object.traverse(function (child) {
						if (child instanceof THREE.Mesh) {
							child.material = material;
						}
					});

					objects[the_animal] = object
					scene.add(object);
				});
			} else {
				scene.add(objects[the_animal]);
			}

			// and we need to re-scale the title because the words might be too long
			scale_factor = 1.3+((viewer.innerWidth()*0.95)/title.innerWidth())
			title.css({
				transform: 'scale('+ scale_factor +')'
			})

			// and we need to pupolate some images, too!
			viewer.find('.example').each(function(index){
				image_path = './img/' + the_animal + String(index+1) + '.png'
				$(this).attr('src', image_path)
			})

			// finally, we do the transition
			gallery.transition_to(viewer)
			
		}
		reset_timeout()
	})


	$('.viewer .button').click(function(){
		if (viewer.hasClass('active')){
			if ($(this).hasClass('back')) {
				viewer.transition_to(gallery)
			}
			else {
				viewer.transition_to(done)
				setTimeout(function(){reset_timeout(5000)}, 10)
			}
		}
		reset_timeout()
	})




});

$(window).resize(function(){
	resize_everything()
});