var VSHADER_SOURCE=
	'attribute vec4 a_Position;\n'+
	'uniform mat4 u_ModelMatrix;\n'+
	'void main(){'+
		'gl_Position = u_ModelMatrix * a_Position;\n'+
	'}'

var FSHADER_SOURCE=
	'void main(){'+
		'gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n'+
	'}'

var ANGLE_STEP = 45.0;

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
	

	var modelMatrix = new Matrix4();
	var u_ModelMatrix = gl.getUniformLocation(gl.program,'u_ModelMatrix');
	//设置当前的角度
	var currentAngle = 0.0;
	var tick = function(){
		currentAngle = animate(currentAngle);
		draw(gl,n,currentAngle,modelMatrix,u_ModelMatrix);
		requestAnimationFrame(tick)
	}
	tick()
	
}

function draw (gl,n,angle,modelMatrix,u_ModelMatrix){
	modelMatrix.setRotate(angle,0,0,1);
	gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);
	
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES,0,n);
}
var g_last = Date.now();
function animate(angle){
	let now = Date.now();
	var elapsed = now - g_last;
	g_last = now;
	var newAngle = angle+(ANGLE_STEP * elapsed)/1000.0;
	return newAngle %=360;
}
function initVertexBuffers(gl){
	
	var vertiecs = new Float32Array([
		0.0,0.5,-0.5,-0.5,0.5,-0.5
	]);
	var n = 3;
	var vertexBuffer = gl.createBuffer()
	if(!vertexBuffer){
		console.log("Failed to create buffer object");
		return -1;
	}
	//绑定缓冲区
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
	//数据到缓冲区
	gl.bufferData(gl.ARRAY_BUFFER,vertiecs,gl.STATIC_DRAW);
	
	var a_Position  = gl.getAttribLocation(gl.program,'a_Position');
	if(a_Position<0){
		console.log("Failed to load location of a_Position");
		return -1
	}
	gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(a_Position)
	return n;
}