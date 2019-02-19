var THREEDFOX = function( element, model ) {

	/*
	* Properties
	*/
	// this
	var _this = this;

	// scene
	this.scene = new THREE.Scene();

	// camera
	this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	// mesh
	this.mesh;

	// cursor position
	this.cursorPos = {
		x: 0,
		y: 0
	};

	// max angle y
	this.maxAngles = {
		x: 1,
		y: 1
	};

	// current model position
	this.modelPos = {
		x: 0,
		y: 0
	};

	/*
	* init
	*/
	this.init = function() {
		
		// check browser abilities
		if ( WEBGL.isWebGLAvailable() ) {

			// window attr
			this.windowAttrs();

			// light
			this._light();

			// loader
			this._loader();

			// settings
			this.settings();

			// cursor position
			_this.cursorPosition();

			// render
			_this.renderer = this._renderer();

			// run loop
			this.render();

		} else {

			var warning = WEBGL.getWebGLErrorMessage();

			document.getElementById( element ).appendChild( warning );

		}
	}

	/*
	* renderer
	*/
	this._renderer = function() {

		var renderer = new THREE.WebGLRenderer( {

			canvas: document.getElementById( element ),

			antialias: true

		} );

		renderer.setClearColor( 0xffffff );

		renderer.setPixelRatio( window.devicePixelRatio );

		renderer.setSize( window.innerWidth, window.innerHeight );

		return renderer;

	}

	/*
	* loader
	*/	
	this._loader = function() {

		this.loader = new THREE.GLTFLoader();

		this.loader.load( model, _this.handle_load );

	}
		// handle load
		this.handle_load = function( gltf ) {

			// console.log( gltf.scene );

			_this.mesh = gltf.scene;

			_this.mesh.children[2].material = new THREE.MeshLambertMaterial({
				color: 0xfee3ac
			});	
			_this.mesh.children[3].material = new THREE.MeshLambertMaterial({
				color: 0xe98223
			});	
			
			_this.scene.add( _this.mesh );

		}

	/*
	* light
	*/	
	this._light = function() {

		// AmbientLight
		this._AmbientLight = new THREE.AmbientLight( 0xffffff, 0.5 );

		_this.scene.add( _this._AmbientLight );

		// PointLight
		_this._PointLight = new THREE.PointLight( 0xffffff, 0.5 );

		_this.scene.add( _this._PointLight );	

	}

	/*
	* settings
	*/
	this.settings = function() {

		_this.camera.position.z = 14;

	}

	/*
	* cursor position
	*/
	this.cursorPosition = function() {		

		document.addEventListener( 'mousemove', function( event ) {

			_this.cursorPos.x = event.clientX;

			_this.cursorPos.y = event.clientY;			

		} );

	}

	/*
	* calculation model position
	*/
	this.calcPosition = function() {

		var halfWidth = _this._innerWidth / 2;

		var halfHeight = _this._innerHeight / 2;

		// Y
			_this.modelPos.y = ( _this.cursorPos.x - halfWidth ) * ( _this.maxAngles.x / _this._innerWidth );
	
		// X
			_this.modelPos.x = ( _this.cursorPos.y - halfHeight ) * ( _this.maxAngles.y / _this._innerHeight );

		if( _this.mesh ) {

			_this.mesh.rotation.y = _this.modelPos.y;

			_this.mesh.rotation.x = _this.modelPos.x;
			
			// console.log( _this.mesh.rotation.y );

		}		

	}

	/*
	* window attributes
	*/
	this.windowAttrs = function() {

		this._innerWidth = window.innerWidth;

		this._innerHeight = window.innerHeight;

	}

	/*
	* loop
	*/	
	_this.render = function() {		

		_this.renderer.render( _this.scene, _this.camera );
		//		
		_this.calcPosition();

		requestAnimationFrame( _this.render );

	}

	// initialization
	return this.init();

}