cos = Math.cos
sin = Math.sin
pi = Math.PI


// we will be using touch event data
// this section of code will provide us start coords
// and coord deltas during a touch event
document.addEventListener("mousemove", mouseMove, false);
document.addEventListener("touchstart", touchStart, false);
document.addEventListener("touchmove", touchMove, false);

var start = {x:0,y:0};
var touch_delta = {x:0,y:0}
var radians_current = 0

function mouseMove(event) {
	// reset_timeout()
}

function touchStart(event) {
	// reset_timeout()
	start.x = event.touches[0].pageX;
	start.y = event.touches[0].pageY;
}

function touchMove(event){

	// reset_timeout()

	touch_delta.x = start.x - event.touches[0].pageX;
	touch_delta.y = start.y - event.touches[0].pageY;
	start.x = event.touches[0].pageX;
	start.y = event.touches[0].pageY;

	delta_to_width_ratio = touch_delta.x
	delta_to_width_ratio/= document.documentElement.clientWidth*2
	conversion_factor = 2*pi // radians
	radians_delta = delta_to_width_ratio * conversion_factor

	radians_current += radians_delta
	radians_current %= 2*pi

	position_animals(radians_current) 

}

function position_animals(radians) {
	// first, we define our origins and such
	w = document.documentElement.clientWidth
	h = document.documentElement.clientHeight
	x0 = 0
	y0 = 0

	num_animals = $('.animals li').length

	theta = 360/num_animals
	r=1

	// we will animate between these coordinates
	// when the user clicks some buttons
	origins = []
	for (i=0; i<num_animals; i++){
		x = x0 + r * cos((((theta/360)*i)*2*pi)+radians)
		y = y0 + r * sin((((theta/360)*i)*2*pi)+radians)
		origins[i] = [x,y]
	}

	// here we pick where our wheel will be placed
	// and we will scale the x/y/z of the images using 
	// the 'coordinates' from above (they are between -1 and 1)
	wheel_origin = [w/2, (h/2)-20] // right in the middle of the window
	
	// radius x range is half the viewport, minus some margin, y is around 500
	wheel_xy_radius = [(w/3), 80]

	// the depth will scale the picture up or down by this much
	// this will be determined by the y-axis
	wheel_z_scale_factor = 0.65

	// let's calculate the actual origins of the images
	image_origins=[]
	for (i in origins) {
		image_origins[i] = {
			top: (wheel_origin[1] + origins[i][1]*wheel_xy_radius[1]) ,
			left: (wheel_origin[0] + origins[i][0]*wheel_xy_radius[0])
		}
	}


	$('.animals li').each(function(index){
		i=index
		
		y = image_origins[i].top
		x = image_origins[i].left

		max_y_delta = 2*wheel_xy_radius[1]
		lowest_y = wheel_origin[1] + wheel_xy_radius[1]

		// depth scale factor
		depth_sf = y - lowest_y // gives us something +/- the y radius
		depth_sf /= max_y_delta // something between 0 and 1, based on the delta
		depth_sf += 1
		depth_sf *= wheel_z_scale_factor
		depth_sf += wheel_z_scale_factor/2
		
		$(this).css({
			top:y - $(this).outerHeight()/2,
			left:x - $(this).outerWidth()/2,
			transform: 'scale(' + String(depth_sf) + ')',
			'z-index': parseInt(depth_sf * 500)+500,
		}).find('img').css({opacity:depth_sf+0.5})
	})
}

$(document).ready(function(){
	// we will make a spinning wheel with all of the animal images
	// so that we can easily update with more animals and not change
	// our code at all!
	position_animals(radians_current)

})