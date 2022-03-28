var VSHADER_SOURCE=
	'attribute vec4 a_Position;\n'+
	'uniform vec4 u_Translation;\n'+
	'void main(){\n'+
		'gl_Position = a_Position+u_Translation;\n'+
	'}'
var FSHADER_SOURCE=
	'void main(){\n'+
		'gl_FragColor=vec4(1.0,0.0,0.0,1.0);\n'+
	'}'

//定义变换距离
var Tx =0.5,Ty=0.5,Tz = 0.0;

function main(){
	let canvas = document.getElementById("webgl");
	let gl = getWebGLContext(canvas);
	if(!gl ){
		console.log("Failed to render WebGL");
		return
	}
	//初始化着色器
	if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){
		console("Failed to inited sharders");
		return ;
	}
	
	//设置顶点位置
	let  n = initVertexBuffers(gl);
	
	let  u_Translation = gl.getUniformLocation(gl.program,'u_Translation')
	if(!u_Translation){
		console.log("Failed to load the storage loaction of u_Translation");
		return ;
	}
	gl.uniform4f(u_Translation,Tx,Ty,Tz,0.0)
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES,0,n)
	
	
}
function initVertexBuffers(gl){
	var vertices = new Float32Array([
		0.0,0.5,-0.5,-0.5,0.5,-0.5
	])
	let n =3;
	
	//创建缓存区
	var vertexBuffer = gl.createBuffer();
	if(!vertexBuffer){
		console.log("Failed to create buffer object");
		return -1;
	}
	let a_Position = gl.getAttribLocation(gl.program,'a_Position')
	//绑定缓存去
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer)
	//缓冲区 写数据
	gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
	
	gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0)
	//开启缓冲区数据
	gl.enableVertexAttribArray(a_Position)
	return n
}