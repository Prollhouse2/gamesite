window.onload = function() {
	(new Stacktris()).start();
};

function Stacktris() {
	
	this.w = 400.0;
	this.h = 600.0;
	this.density = 1.0;
	this.friction = 0.99;
	this.restitution = 0.4;
	this.yStart = 0.0;
	this.speed = 3.0;
	
	Math.fmod = function (a,b) { return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); };
}

Stacktris.prototype.start = function() {
	
	this.renderer = new PIXI.autoDetectRenderer(400, 600, {
//		transparent: true,
		backgroundColor: 0xFFFFFF,
		antialias: true
	});
	
	this.renderer.view.requestFullscreen = this.renderer.view.mozRequestFullScreen || this.renderer.view.webkitRequestFullScreen || this.renderer.view.requestFullScreen;
	
	this.moved = false;
	this.movingLeft = false;
	this.movingRight = false;
	this.movingDown = false;
	this.newPiece = false;
	
	this.renderer.view.onclick = (function(e) {
//		e.preventDefault();
		this.renderer.view.requestFullscreen();
		
		if (this.objects && this.objects.length > 0) {
			var obj = this.objects[this.objects.length-1];
	//		if (!this.moved) {
				obj.b[0].SetAngle((obj.rot - 90.0) * Math.PI/180.0);
	//		}
	//		this.moved = false;
		}
	}).bind(this);
	
	
	
	this.renderer.view.addEventListener('touchstart', (function(e) {
//		e.preventDefault();
		this.renderer.view.requestFullscreen();
		
		if (this.objects && this.objects.length > 0) {
			var obj = this.objects[this.objects.length-1];
			if (!this.moved) {
				obj.b[0].SetAngle((obj.rot - 90.0) * Math.PI/180.0);
			}
			this.moved = false;
		}
		
		this.touchX = e.touches[0].screenX;
		this.touchY = e.touches[0].screenY;
	}).bind(this));
	
	this.renderer.view.addEventListener('touchmove', (function(e) {
//		e.preventDefault();

		if (this.objects && this.objects.length > 0) {
			var obj = this.objects[this.objects.length-1];
			
			console.log(e.ongoingTouches);
			
//			obj.b[0].SetPosition([obj.x + (this.touchX - e.touches[0].screenX), obj.y]);	// TODO: Get this right
			this.moved = true;
		}
		
		
		
	}).bind(this));
	
	this.renderer.view.addEventListener('touchend', (function(e) {
//		e.preventDefault();
//		var obj = this.objects[this.objects.length-1];
//		if (!this.moved) {
//			obj.b[0].SetAngle((obj.rot - 90.0) * Math.PI/180.0);
//		}
		this.moved = false;
		
		this.touchX = e.touches[0].screenX;
		this.touchY = e.touches[0].screenY;
		
	}).bind(this));
	
	
	
	window.addEventListener('keydown', (function(e) {
		
//		console.log(e.keyCode);
		if (this.objects && this.objects.length > 0) {
			var obj = this.objects[this.objects.length-1];
			if (e.keyCode === 32 && !this.moved) {
				obj.b[0].SetAngle((obj.rot - 90.0) * Math.PI/180.0);
			} else if (e.keyCode === 37) {
				this.movingLeft = true;
	//			var pos = obj.b[0].GetPosition();
	//			pos.x -= 5.0;
	//			obj.b[0].SetPosition(pos);
				
			} else if (e.keyCode === 39) {
				this.movingRight = true;
	//			var pos = obj.b[0].GetPosition();
	//			pos.x += 5.0;
	//			obj.b[0].SetPosition(pos);
			} else if (e.keyCode === 40) {
				this.movingDown = true;
			}
			this.moved = false;
		}
	}).bind(this));
	
	window.addEventListener('keyup', (function(e) {
		
//		console.log(e.keyCode);
		if (this.objects && this.objects.length > 0) {
			var obj = this.objects[this.objects.length-1];
			if (e.keyCode === 32 && !this.moved) {
	//			obj.b[0].SetAngle((obj.rot - 90.0) * Math.PI/180.0);
			} else if (e.keyCode === 37) {
				this.movingLeft = false;
	//			var pos = obj.b[0].GetPosition();
	//			pos.x -= 5.0;
	//			obj.b[0].SetPosition(pos);
				
			} else if (e.keyCode === 39) {
				this.movingRight = false;
	//			var pos = obj.b[0].GetPosition();
	//			pos.x += 5.0;
	//			obj.b[0].SetPosition(pos);
			} else if (e.keyCode === 40) {
				this.movingDown = false;
			}
			this.moved = false;
		}
	}).bind(this));
	
	document.body.appendChild(this.renderer.view);
	this.stage = new PIXI.Container();
	
	// Ground
	var g = new PIXI.Graphics();
	g.beginFill(0x000000);
	g.lineStyle(0, 0x000000);
	g.position.x = 0.0;
	g.position.y = this.h;
	g.drawPolygon([0.0, 0.0, this.w, 0.0, this.w, -1.0, 0.0, -1.0]);
	this.stage.addChild(g);	
	
	this.angles = [
       0.0, 
       90.0, 
       180.0, 
       270.0
    ];
	this.shuffle(this.angles);

	var a = this.angles[Math.floor(Math.random()) % this.angles.length];
	
	this.possibleObjects = [
        Asdf,
        Qwas,
        Easd,
        Qasd,
        Wasd
    ];
	
	this.shuffle(this.possibleObjects);
	
	
	var obj = new (this.possibleObjects[Math.floor(Math.random()) % this.possibleObjects.length])(this.w/2, this.yStart, a);
	obj.colour = Math.floor(Math.random()*16777215);
	
	var g = new PIXI.Graphics();
	g.beginFill(obj.colour);
	g.lineStyle(0, 0xFF0000);
	g.position.x = obj.x;
	g.position.y = obj.y;
	g.drawPolygon(obj.vertices);
	this.stage.addChild(g);
	obj.g = g;
	
	this.objects = [
        obj
    ];
	
	this.initPhysics();
		
	this.animate();
};

Stacktris.prototype.animate = function() {
	
//	this.updatePhysics();
	this.stepPhysics();
	
    // start the timer for the next animation loop
    requestAnimationFrame(this.animate.bind(this));

    // this is the main render call that makes pixi draw your container and its children.
    this.renderer.render(this.stage);
};

Stacktris.prototype.initPhysics = function() {
	
//	this.dynamicBodies = [];

	var groundBodyDef = new Box2D.Dynamics.b2BodyDef();
	groundBodyDef.position.Set(this.w/2, this.h + 100.0);
	var gravity = new Box2D.Common.Math.b2Vec2(0.0, 500.0);
	this.world = new Box2D.Dynamics.b2World(gravity);
	var groundBody = this.world.CreateBody(groundBodyDef);
	var groundBodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
	groundBodyShape.SetAsBox(this.w/2, 100.0);
	var groundBodyFixtureDef = new Box2D.Dynamics.b2FixtureDef();
	groundBodyFixtureDef.shape = groundBodyShape;
	groundBodyFixtureDef.density = this.density;
	groundBodyFixtureDef.friction = this.friction;
	
	groundBody.CreateFixture(groundBodyFixtureDef);

	for (var i = 0; i < this.objects.length; i++) {
		var obj = this.objects[i];
		
		var dynamicBodyDef = new Box2D.Dynamics.b2BodyDef();
		dynamicBodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
		dynamicBodyDef.position = new Box2D.Common.Math.b2Vec2(obj.x, obj.y);
		dynamicBodyDef.angle = obj.rot * Math.PI / 180.0;
		dynamicBodyDef.bullet = true;
		var dynamicBody = this.world.CreateBody(dynamicBodyDef);
		
		if (obj.shapes && obj.shapes.length == 1) {	// If object is convex.
			
//			console.log('convex');
			
			var dynamicBodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
			
			var vertices = [];
			
			for (var j = 0; j < obj.shapes[0].length; j++) {
				
				var shape = obj.shapes[0][j];
				
				vertices.push(
					new Box2D.Common.Math.b2Vec2(
						shape[0],
						shape[1]
					)
				);
			}
			
			dynamicBodyShape.SetAsArray(vertices, vertices.length);
			
			
			var dynamicBodyFixtureDef = new Box2D.Dynamics.b2FixtureDef();
			dynamicBodyFixtureDef.shape = dynamicBodyShape;

			dynamicBodyFixtureDef.density = this.density;
			dynamicBodyFixtureDef.friction = this.friction;
			dynamicBodyFixtureDef.restitution = this.restitution;
			dynamicBodyFixtureDef.userData = 1;	
			dynamicBody.CreateFixture(dynamicBodyFixtureDef);
			var dynamicBodies = [];
			dynamicBodies.push(dynamicBody);
			obj.b = dynamicBodies;
			
		} else if (obj.shapes && obj.shapes.length > 1) {	// If object is concave.
			
//			console.log('concave');
			var dynamicBodies = [];
			
			for (var j = 0; j < obj.shapes.length; j++) {
			
				var shapes = obj.shapes[j];
				var dynamicBodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
				
				var vertices = [];
				
				for (var k = 0; k < shapes.length; k++) {
					
					var shape = shapes[k];
					
					vertices.push(
						new Box2D.Common.Math.b2Vec2(
							shape[0],
							shape[1]
						)
					);
				}
				
				dynamicBodyShape.SetAsArray(vertices, vertices.length);
				
				var dynamicBodyFixtureDef = new Box2D.Dynamics.b2FixtureDef();
				dynamicBodyFixtureDef.shape = dynamicBodyShape;
				dynamicBodyFixtureDef.density = this.density;
				dynamicBodyFixtureDef.friction = this.friction;
				dynamicBodyFixtureDef.restitution = this.restitution;
				dynamicBodyFixtureDef.userData = 1;
				
				dynamicBody.CreateFixture(dynamicBodyFixtureDef);
				
				dynamicBodies.push(dynamicBody);
				
			}
			
			obj.b = dynamicBodies;
		}
		
		obj.visible = true;
	}
	
	this.world.SetContactListener(new MyContactListener());
};

Stacktris.prototype.updatePhysics = function() {
	
	var obj = this.objects[this.objects.length-1];
	
//	obj.x = this.w/2 - 25;
//	obj.y = -1.0;
	
//		console.log(obj);
		
//		var g = new PIXI.Graphics();
//		g.beginFill(obj.colour);
//		g.lineStyle(0, 0xFF0000);
//	obj.g.position.x = this.w/2 - 25;
//	obj.g.position.y = -1.0;
//		obj.g.drawPolygon(obj.vertices);
//		this.stage.addChild(g);
//		obj.g = g;
	
	var dynamicBodyDef = new Box2D.Dynamics.b2BodyDef();
	dynamicBodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	dynamicBodyDef.position = new Box2D.Common.Math.b2Vec2(this.w/2, this.yStart);
	dynamicBodyDef.angle = obj.rot * Math.PI / 180.0;
	dynamicBodyDef.bullet = true;
	var dynamicBody = this.world.CreateBody(dynamicBodyDef);
	
//	console.log(dynamicBodyDef.position);
	
	if (obj.shapes && obj.shapes.length == 1) {	// If object is convex.
		
//		console.log('convex');
		
		var dynamicBodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
		
		var vertices = [];
		
		for (var j = 0; j < obj.shapes[0].length; j++) {
			
			var shape = obj.shapes[0][j];
			
			vertices.push(
				new Box2D.Common.Math.b2Vec2(
					shape[0],
					shape[1]
				)
			);
		}
		
		dynamicBodyShape.SetAsArray(vertices, vertices.length);
		
		
		var dynamicBodyFixtureDef = new Box2D.Dynamics.b2FixtureDef();
		dynamicBodyFixtureDef.shape = dynamicBodyShape;

		dynamicBodyFixtureDef.density = this.density;
		dynamicBodyFixtureDef.friction = this.friction;
		dynamicBodyFixtureDef.restitution = this.restitution;
		dynamicBodyFixtureDef.userData = 1;	
		dynamicBody.CreateFixture(dynamicBodyFixtureDef);
		var dynamicBodies = [];
		dynamicBodies.push(dynamicBody);
		obj.b = dynamicBodies;
		
	} else if (obj.shapes && obj.shapes.length > 1) {	// If object is concave.
		
//		console.log('concave');
		var dynamicBodies = [];
		
		for (var j = 0; j < obj.shapes.length; j++) {
		
			var shapes = obj.shapes[j];
			var dynamicBodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
			
			var vertices = [];
			
			for (var k = 0; k < shapes.length; k++) {
				
				var shape = shapes[k];
				
				vertices.push(
					new Box2D.Common.Math.b2Vec2(
						shape[0],
						shape[1]
					)
				);
			}
			
			dynamicBodyShape.SetAsArray(vertices, vertices.length);
			
			var dynamicBodyFixtureDef = new Box2D.Dynamics.b2FixtureDef();
			dynamicBodyFixtureDef.shape = dynamicBodyShape;
			dynamicBodyFixtureDef.density = this.density;
			dynamicBodyFixtureDef.friction = this.friction;
			dynamicBodyFixtureDef.restitution = this.restitution;
			dynamicBodyFixtureDef.userData = 1;
			
			dynamicBody.CreateFixture(dynamicBodyFixtureDef);
			dynamicBodies.push(dynamicBody);
		}
		obj.b = dynamicBodies;
	}
	
	obj.visible = true;
};

Stacktris.prototype.stepPhysics = function() {
	
//	console.log('y vel: ' + this.dynamicBodies[this.dynamicBodies.length-1].GetLinearVelocity().y);
//	console.log('! ' + 4.0 + this.restitution * 10);
//	console.log('y pos: ' + this.dynamicBodies[this.dynamicBodies.length-1].GetPosition().y);
	
	if (this.newPiece || (!this.newPiece && this.objects && this.objects.length > 0 && this.objects[this.objects.length-1].b[0].GetPosition().y > (0.1 + this.restitution) && 
		this.objects[this.objects.length-1].b[0].GetLinearVelocity().y <= (4.0 + this.restitution * 10) && 
		this.objects[this.objects.length-1].b[0].GetLinearVelocity().x <= 0.1 + this.restitution * 10)) {
		
		this.newPiece = false;
//		console.log('settled');
		
		this.shuffle(this.angles);
		
		var a = this.angles[Math.floor(Math.random()) % this.angles.length];
		
		this.shuffle(this.possibleObjects);
		
		var obj = new (this.possibleObjects[Math.floor(Math.random()) % this.possibleObjects.length])(this.w/2, this.yStart, a); 
		
//		obj.x = this.w/2 - 25;
//		obj.y = -1.0;
		
		obj.visible = true;
		
		var g = new PIXI.Graphics();
		obj.colour = Math.floor(Math.random()*16777215);
		g.beginFill(obj.colour);
		g.lineStyle(0, 0xFF0000);
		g.position.x = obj.x;
		g.position.y = obj.y;
		g.drawPolygon(obj.vertices);
		this.stage.addChild(g);
		obj.g = g;
		
		this.objects.push(obj);
		this.updatePhysics();
		
//		this.renderer.render(this.stage);
//		return;
	}
	
	
	
	var timeStep = 1.0 / 60.0;
	var velocityIterations = 6;
	var positionIterations = 2;
	
	this.world.Step(timeStep, velocityIterations, positionIterations);
	this.world.ClearForces();
	
	for (var i = 0; i < this.objects.length; i++) {
		var obj = this.objects[i];
		
		obj.visible = true;
		
		var dynamicBodyPosition = obj.b[0].GetPosition();
		var dynamicBodyAngle = obj.b[0].GetAngle() * 180.0 / Math.PI;
		obj.x = dynamicBodyPosition.x;
		obj.y = dynamicBodyPosition.y;
		obj.rot = Math.fmod(dynamicBodyAngle, 360.0);
		obj.g.position.x = obj.x;
		obj.g.position.y = obj.y;
		obj.g.rotation = obj.rot * Math.PI / 180.0;
		
		if (obj.y > this.h + 10.0) {
//			console.log('removing child');
			this.stage.removeChild(obj.g);
			this.world.DestroyBody(obj.b);
			this.objects.splice(i, 1);
			
		}
	}
	
	if (this.objects && this.objects.length > 0) {
	
		var obj = this.objects[this.objects.length-1];
		
		if (this.movingLeft) {
//			console.log('left');
			var pos = obj.b[0].GetPosition();
			pos.x -= this.movingDown ? this.speed/2: this.speed;
			obj.b[0].SetPosition(pos);
		}
		
		if (this.movingRight) {
//			console.log('right');
			var pos = obj.b[0].GetPosition();
			pos.x += this.movingDown ? this.speed/2: this.speed;
			obj.b[0].SetPosition(pos);
		}
		
		if (this.movingDown) {
//			console.log('down');
			var pos = obj.b[0].GetPosition();
			pos.y += (this.movingLeft || this.movingRight) ? this.speed/2: this.speed;
			obj.b[0].SetPosition(pos);
		}
		
		if (obj.y > this.h + 5.0) {
//			console.log('new piece');
			this.newPiece = true;
		}
	}
};

Stacktris.prototype.shuffle = function(a) {
	var j, x, i;
	for (i = a.length; i; i--) {
		j = Math.floor(Math.random() * i);
		x = a[i - 1];
		a[i - 1] = a[j];
		a[j] = x;
	}
};

function MyContactListener() {

	this.level_completed = false;
};
MyContactListener.prototype = new Box2D.Dynamics.b2ContactListener();
MyContactListener.prototype.constructor = MyContactListener;
