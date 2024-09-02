function Wasd(x, y, rot, w, h, density, friction, restitution) {
	
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
         -0.75 * scale, -0.25 * scale,
         0.75 * scale, -0.25 * scale,
         0.75 * scale, 0.25 * scale,
         0.25 * scale, 0.25 * scale,
         0.25 * scale, 0.75 * scale,
         -0.25 * scale, 0.75 * scale,
         -0.25 * scale, 0.25 * scale,
         -0.75 * scale, 0.25 * scale
    ];
	
	this.shapes = [
        [
	        [-0.75 * scale, -0.25 * scale],
	        [0.75 * scale, -0.25 * scale],
	        [0.75 * scale, 0.25 * scale],
	        [-0.75 * scale, 0.25 * scale]
        ],
        [
			[-0.25 * scale, 0.25 * scale],
			[0.25 * scale, 0.25 * scale],
			[0.25 * scale, 0.75 * scale],
			[-0.25 * scale, 0.75 * scale]
		]
    ];
	
	this.colour = 0x77AA22;
}

