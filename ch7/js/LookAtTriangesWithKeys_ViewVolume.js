var VSHADER_SOURCE=
	'attribute vec4 a_Position;\n'+
	'attribute vec4 a_Color;\n'+
	'uniform mat4 u_ViewMatrix;\n'+
	'uniform mat4 u_ProjMatrix;\n'+
	'varying vec4 v_Color;\n'+
	'void main(){'+
		'gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;\n'+
		'v_Color = a_Color;\n'+
	'}'
	
var FSHADER_SOURCE =
	'precision mediump float;'+
	'varying vec4 v_Color;\n'+
	'void main(){'+
		'gl_FragColor = v_Color;\n'+
	'}'
	
function main(){
	var canvas=document.getElementById("webgl");
	var gl = getWebGLContext(canvas);
	
	initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE);
	
	var n = initVertexBuffers(gl);
	var u_ViewMatrix = gl.getUniformLocation(gl.program,'u_ViewMatrix');
	var viewMatrix = new Matrix4();
	document.onkeydown = function(ev){
		keydown(ev,gl,n,u_ViewMatrix,viewMatrix)
	}
	
	//正射矩阵
	var projMatrix = new Matrix4();
	projMatrix.setOrtho(-1.0,1.0,-1.0,1.0,0.0,2.0);
	var u_ProjMatrix = gl.getUniformLocation(gl.program,'u_ProjMatrix');
	gl.uniformMatrix4fv(u_ProjMatrix,false,projMatrix.elements);
	draw(gl,n,u_ViewMatrix,viewMatrix);
}
var g_eyeX=0.20,g_eyeY=0.25,g_eyeZ=0.25;
function keydown(ev,gl,n,u_ViewMatrix,viewMatrix){
	if(ev.keyCode ==39){
		//right
		g_eyeX+=0.01
	}else if(ev.keyCode ==37){
		//down
		g_eyeX -=0.01
	}else {
		return;
	}
	draw(gl,n,u_ViewMatrix,viewMatrix);
	
}
function draw(gl,n,u_ViewMatrix,viewMatrix){
	viewMatrix.setLookAt(g_eyeX,g_eyeY,g_eyeZ,0,0,0,0,1,0);
	gl.uniformMatrix4fv(u_ViewMatrix,false,viewMatrix.elements);
	gl.clearColor(0.0,0.0,0.0,1.0)
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES,0,n);
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