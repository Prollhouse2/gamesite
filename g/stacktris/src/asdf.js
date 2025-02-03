function Asdf(x, y, rot, w, h, density, friction, restitution) {
	
	this.x = x;
	this.y = y;
	this.rot = rot;
	this.w = w;
	this.h = h;
	this.density = density;
	this.friction = friction;
	this.restitution = restitution;
	
	var scale = 40;
	
	this.vertices = [
		-1.0 * scale, -0.25 * scale,
		1.0 * scale, -0.25 * scale,
		1.0 * scale, 0.25 * scale,
		-1.0 * scale, 0.25 * scale
    ];
	
	this.shapes = [
       [
	        [-1.0 * scale, -0.25 * scale],
	        [1.0 * scale, -0.25 * scale],
	        [1.0 * scale, 0.25 * scale],
	        [-1.0 * scale, 0.25 * scale]
        ]
    ];
	
	this.colour = 0xFF33FF;
}

