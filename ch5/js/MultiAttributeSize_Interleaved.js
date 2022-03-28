var VSHADER_SOURCE=
	'attribute vec4 a_Position;\n'+
	'attribute float a_PointSize;\n'+
	'void main(){\n'+
		'gl_Position = a_Position;\n'+
		'gl_PointSize = a_PointSize;\n'+
	'}'
var FSHADER_SOURCE=
	'void main(){'+
		'gl_FragColor=vec4(1.0,0.0,0.0,1.0);\n'+
	'}'
	
function main(){
	let canvas = document.getElementById("webgl");
	let gl = getWebGLContext(canvas);
	if(!gl){
		console.log("Failed to render WebGL;");
		return;
	}
	//初始化着色器
	if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){
		console.log("Failed to init shaders");
		return;
	}
	//设置顶点信息
	let n = initVertexBuffers(gl);
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.POINTS,0,n)
	
	
	
}

function initVertexBuffers(gl){
	
	let verticsSizes = new Float32Array([
		0.0,0.5,10.0,
		-0.5,-0.5,20.0,
		0.5,-0.5,30.0
	])
	let n=3;
	// let sizes= new Float32Array([
	// 	10.0,20.0,30.0
	// ])
	//创建缓冲区
	let vertexBuffer = gl.createBuffer();
	if(!vertexBuffer){
		console.log("Failed to create buffer object");
		return -1;
	}
	
	let FSIZE = verticsSizes.BYTES_PER_ELEMENT;
	console.log("FSIZE:"+FSIZE)
	//绑定缓冲区
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
	
	//设置缓冲区数据
	gl.bufferData(gl.ARRAY_BUFFER,verticsSizes,gl.STATIC_DRAW);
	
	let a_Position = gl.getAttribLocation(gl.program,'a_Position');
	let a_PointSize = gl.getAttribLocation(gl.program,'a_PointSize');
	if(a_Position<0 ){
		console.log('Failed to load the location of a_Position');
		return -1;
	}
	gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSIZE*3,0);
	gl.enableVertexAttribArray(a_Position);
	
	// let sizeBuffer = gl.createBuffer();
	// gl.bindBuffer(gl.ARRAY_BUFFER,sizeBuffer);
	// gl.bufferData(gl.ARRAY_BUFFER,sizes,gl.STATIC_DRAW);
	// let a_PointSize = gl.getAttribLocation(gl.program,'a_PointSize');
	
	gl.vertexAttribPointer(a_PointSize,1,gl.FLOAT,false,FSIZE*3,FSIZE*2);
	gl.enableVertexAttribArray(a_PointSize);
	return n;
}