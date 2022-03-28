var VSHADER_SOURCE=
	'attribute vec4 a_Position;\n'+
	'attribute vec4 a_Color;\n'+
	'uniform mat4 u_ProjMatrix;\n'+
	'varying vec4 v_Color;\n'+
	'void main(){'+
		'gl_Position = u_ProjMatrix * a_Position;\n'+
		'v_Color = a_Color;\n'+
	'}'
	
var FSHADER_SOURCE = 
	'precision mediump float;'+
	'varying vec4 v_Color;\n'+
	'void main(){'+
		'gl_FragColor = v_Color;\n'+
	'}'

function main(){
	var canvas = document.getElementById("webgl");
	var gl = getWebGLContext(canvas)
	var nf = document.getElementById("nearFar");
	initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE);
	var n = initVertexBuffers(gl);
	var u_ProjMatrix = gl.getUniformLocation(gl.program,'u_ProjMatrix');
	var projMatrix = new Matrix4();
	document.onkeydown = function(ev){
		keydown(ev,gl,n,u_ProjMatrix,projMatrix,nf);
	}
	draw(gl,n,u_ProjMatrix,projMatrix,nf);
}
var g_near = 0.0,g_far=0.5;
function keydown(ev,gl,n,u_ProjMatrix,projMatrix,nf){
	switch(ev.keyCode){
		case 39: g_near +=0.01;break;
		case 37: g_near -=0.01;break;
		case 38: g_far +=0.01;break;
		case 40: g_far -=0.01;break;
		default:break;
	}
	draw(gl,n,u_ProjMatrix,projMatrix,nf);
	
}
function draw(gl,n,u_ProjMatrix,projMatrix,nf){
	projMatrix.setOrtho(-1,1,-1,1,g_near,g_far);
	gl.uniformMatrix4fv(u_ProjMatrix,false,projMatrix.elements);
	//gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES,0,n);
	nf.innerHTML = "near:"+Math.round(g_near *100)/100 +',far:'+Math.round(g_far*100)/100;
}

function initVertexBuffers(gl){
	var verticesColors = new Float32Array([
		0.0,0.5,-0.4,0.4,1.0,0.4,
		-0.5,-0.5,-0.4,0.4,1.0,0.4,
		0.5,-0.5,-0.4,1.0,0.4,0.4,
		
		0.5,0.4,-0.2,1.0,0.4,0.4,
		-0.5,0.4,-0.2,1.0,1.0,0.4,
		0.0,-0.6,-0.2,1.0,1.0,0.4,
		
		0.0,0.5,0.0,0.4,0.4,1.0,
		-0.5,-0.5,0.0,0.4,0.4,1.0,
		0.5,-0.5,0.0,1.0,0.4,0.4
		
	])
	var n =9;
	var vertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,verticesColors,gl.STATIC_DRAW);
	
	var a_Position = gl.getAttribLocation(gl.program,'a_Position');
	var a_Color = gl.getAttribLocation(gl.program,'a_Color');
	var FSIZE = verticesColors.BYTES_PER_ELEMENT;
	gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,FSIZE*6,0);
	gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,FSIZE*6,FSIZE*3);
	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Color);
	return n;
}