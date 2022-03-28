var VSHADER_SOURCE=
	'attribute vec4 a_Position;\n'+
	'attribute vec4 a_Color;\n'+
	'varying vec4 v_Color;\n'+
	'void main(){\n'+
		'gl_Position = a_Position;\n'+
		'v_Color = a_Color;\n'+
		
	'}'
var FSHADER_SOURCE=
	'precision mediump float;'+
	'varying vec4 v_Color;\n'+
	'void main(){\n'+
		//'gl_FragColor=vec4(gl_FragCoord.x/u_Width,0.0,gl_FragCoord.y/u_Height,1.0);\n'+
		'gl_FragColor = v_Color;\n'
	
	'}'

function main(){
	var canvas = document.getElementById("webgl");
	var gl = getWebGLContext(canvas);
	if(!gl){
		console.log("Failed to get render WebGL");
		return
	}
	
	if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){
		console.log("Failed to init shaders");
		return;
	}
	var  n = initVertexBuffers(gl);
	if(n <0){
		console.log('Failed to set position');
		return;
	}
	
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES,0,n);

}
function initVertexBuffers(gl){
	
	var vertiecs = new Float32Array([
		0.0,0.5,1.0,0.0,0.0,
		-0.5,-0.5,0.0,1.0,0.0,
		0.5,-0.5,0.0,0.0,1.0
	]);
	var n = 3;
	var vertexBuffer = gl.createBuffer()
	if(!vertexBuffer){
		console.log("Failed to create buffer object");
		return -1;
	}
	let FSIZE = vertiecs.BYTES_PER_ELEMENT;
	//绑定缓冲区
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
	//数据到缓冲区
	gl.bufferData(gl.ARRAY_BUFFER,vertiecs,gl.STATIC_DRAW);
	
	var a_Position  = gl.getAttribLocation(gl.program,'a_Position');
	if(a_Position<0){
		console.log("Failed to load location of a_Position");
		return -1
	}
	gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSIZE*5,0);
	gl.enableVertexAttribArray(a_Position)
	
	var a_Color = gl.getAttribLocation(gl.program,'a_Color');
	gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,FSIZE*3,FSIZE*2)
	gl.enableVertexAttribArray(a_Color)
	return n;
}