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
	var viewMatrix = new Matrix4();
	var projMatrix = new Matrix4();
	var u_ViewMatrix = gl.getUniformLocation(gl.program,'u_ViewMatrix');
	var u_ProjMatrix = gl.getUniformLocation(gl.program,'u_ProjMatrix');
	viewMatrix.setLookAt(0,0,5,0,0,-100,0,1,0);
	gl.uniformMatrix4fv(u_ViewMatrix,false,viewMatrix.elements);
	projMatrix.setPerspective(30,canvas.width/canvas.height,1,100);
	gl.uniformMatrix4fv(u_ProjMatrix,false,projMatrix.elements);
	gl.clearColor(0.0,0.0,0.0,1.0)
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES,0,n);
	
}


function initVertexBuffers(gl){
	var verticesColors = new Float32Array([
		 // Three triangles on the right side
		    0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
		    0.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
		    1.25, -1.0,  -4.0,  1.0,  0.4,  0.4, 
		
		    0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
		    0.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
		    1.25, -1.0,  -2.0,  1.0,  0.4,  0.4, 
		
		    0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
		    0.25, -1.0,   0.0,  0.4,  0.4,  1.0,
		    1.25, -1.0,   0.0,  1.0,  0.4,  0.4, 
		
		    // Three triangles on the left side
		   -0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
		   -1.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
		   -0.25, -1.0,  -4.0,  1.0,  0.4,  0.4, 
		
		   -0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
		   -1.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
		   -0.25, -1.0,  -2.0,  1.0,  0.4,  0.4, 
		
		   -0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
		   -1.25, -1.0,   0.0,  0.4,  0.4,  1.0,
		   -0.25, -1.0,   0.0,  1.0,  0.4,  0.4, 
		
	])
	var n =18;
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