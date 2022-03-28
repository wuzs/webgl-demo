var VSHADER_SOURCE=
	'attribute vec4 a_Position;\n'+
	'void main(){\n'+
		'gl_Position = a_Position;\n'+
		'gl_PointSize = 10.0;\n'+
	'}\n'
	
var FSHADER_SOURCE=
	'void main(){\n'+
		'gl_FragColor=vec4(1.0,0.0,0.0,1.0);\n'+
	'}'

function main(){
	var canvas = document.getElementById("webgl");
	var gl = getWebGLContext(canvas);
	if(!gl){
		console.log("Failed to render WebGL");
		return;
	}
	
	//初始化着色器
	if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){
		console.log('init shaders failed');
		return
	}
	var n = initVertexBuffers(gl)
	if(n<0){
		console.log("Failed to set the position of the vertices");
		return ;
	}
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT)
	gl.drawArrays(gl.POINTS,0,n)
}

function initVertexBuffers(gl){
	var vertices = new Float32Array([
		0.0,0.5,-0.5,-0.5,0.5,-0.5
	])
	var n =3;//点的个数
	//创建缓冲区对象
	var vertexBuffer = gl.createBuffer();
	if(!vertexBuffer){
		console.log('Failed to create the buffer object');
		return -1;
	}
	//将缓冲对象与目标绑定
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
	//向缓冲区对象写入数据
	gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
	
	var a_Position = gl.getAttribLocation(gl.program,'a_Position');
	if(a_Position<0){
		console.log("Failed to get the storage location of a_Position");
		return
	}
	//var u_FragColor = gl.getUniformLocation(gl.program,'u_FragColor');
	//将缓冲区对象分配给 a_Position
	gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
	//连接a_Position 变量与分配给他的缓冲区对象
	gl.enableVertexAttribArray(a_Position)
	return n;
}