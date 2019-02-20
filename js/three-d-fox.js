var THREEDFOX = function( model ) {

	/*
	* Properties
	*/
	// this
	var _this = this;

	// id of wrap
	this.wrapId = 'mx_fox_wrapper';

	// check date
	this.dateNow = Date.now();

	// duration
	this.duration = 4000;

	// opacity canvas
	this.canvasOpacity = 1;

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
			this.cursorPosition();

			// render
			_this.renderer = this._renderer();

			// custom styles
			this.customStyles();

			// window resize
			this.windowResize();

			// run loop
			this.render();

		} else {

			var warning = WEBGL.getWebGLErrorMessage();

			document.body.appendChild( warning );

		}
	}

	/*
	* renderer
	*/
	this._renderer = function() {

		var renderer = new THREE.WebGLRenderer();

		renderer.setClearColor( 0x000000 );

		renderer.setPixelRatio( window.devicePixelRatio );

		renderer.setSize( window.innerWidth, window.innerHeight );

		// 
		var canvasWrapper = document.createElement( 'div' );

		canvasWrapper.setAttribute( 'id', _this.wrapId );

		canvasWrapper.appendChild( renderer.domElement );

		document.body.appendChild( canvasWrapper );

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
	* window resize
	*/
	this.windowResize = function() {

		window.addEventListener( 'resize', function() {

			var width = window.innerWidth;

			var height = window.innerHeight;

			_this.renderer.setSize( width, height );

			_this.camera.aspect = width / height;

			_this.camera.updateProjectionMatrix();

		} );

	}

	// fade canvas
	this.fadeCanvas = function() {

		var intervalOpacity = ( 1 / _this.duration ) * ( 1000 / 60 );

		_this.canvasOpacity -= intervalOpacity;		

		// check date
		if( Date.now() <= _this.dateNow + _this.duration ) {

			document.getElementById( _this.wrapId ).style.opacity = _this.canvasOpacity;

		} else {

			document.getElementById( _this.wrapId ).remove();

			return false;

		}

	}

	/*
	* style box
	*/	
	this.customStyles = function() {

		var styleElement = document.createElement( 'style' );

		styleElement.type = 'text/css';

		var css = '#' + _this.wrapId + '{ position: fixed; top: 0; left: 0; } ';

		var cssText = document.createTextNode( css );

		styleElement.appendChild( cssText );

		document.body.appendChild( styleElement );

	}

	/*
	* loop
	*/	
	_this.render = function() {		

		// render
		_this.renderer.render( _this.scene, _this.camera );

		// position of model
		_this.calcPosition();

		// fade canvas
		var loop = _this.fadeCanvas();

		if( loop !== false ) {

			requestAnimationFrame( _this.render );

		}		

	}

	// initialization
	return this.init();

}