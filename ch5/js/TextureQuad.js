var VSHADER_SOURCE=
	'attribute vec4 a_Position;\n'+
	'attribute vec2 a_TexCoord;\n'+
	'varying vec2 v_TexCoord;\n'+
	'void main(){\n'+
		'gl_Position = a_Position;\n'+
		'v_TexCoord = a_TexCoord;\n'+
	
	'}'
var FSHADER_SOURCE=
	'precision mediump float;\n'+
	'uniform sampler2D u_Sampler;\n'+
	'varying vec2 v_TexCoord;\n'+
	'void main(){'+
		'gl_FragColor = texture2D(u_Sampler,v_TexCoord);\n'+
	'}'
	
function main(){
	var canvas = document.getElementById("webgl");
	var gl = getWebGLContext(canvas);
	initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE);
	var n = initVertexBuffers(gl);
	if(!initTextures(gl,n)){
		
	}
	
}

function initVertexBuffers(gl){
	var verticesTexCoords=new Float32Array([
		//顶点坐标 纹理坐标
		-0.5,0.5,0.0,1.0,
		-0.5,-0.5,0.0,0.0,
		0.5,0.5,1.0,1.0,
		0.5,-0.5,1.0,1.0
	])
	var n =4;
	var vertexTexCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexTexCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,verticesTexCoords,gl.STATIC_DRAW);
	
	var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
	var a_Position = gl.getAttribLocation(gl.program,'a_Position');
	gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSIZE*4,0);
	var a_TexCoord = gl.getAttribLocation(gl.program,'a_TexCoord');
	gl.vertexAttribPointer(a_TexCoord,2,gl.FLOAT,false,FSIZE*4,FSIZE*2);
	gl.enableVertexAttribArray(a_Position);
	gl.enableVertexAttribArray(a_TexCoord);
	return n;
}

function initTextures(gl,n){
	
	//创建纹理对象
	var texture = gl.createTexture();
	var u_Sampler = gl.getUniformLocation(gl.program,'u_Sampler');
	var image = new Image();
	image.onload = function(){
		loadTexture(gl,n,texture,u_Sampler,image)
	}
	image.src='../resources/sky.jpg'
	return true
	
	
}

function loadTexture(gl,n,texture,u_Sampler,image){
	//对纹理对象进行y轴反转
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
	//开启0号纹理单元
	gl.activeTexture(gl.TEXTURE0);
	//绑定纹理对象
	gl.bindTexture(gl.TEXTURE_2D,texture);
	
	//配置纹理对象参数
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
	//配置纹理图像
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);
	//将0号纹理传递给着色器
	gl.uniform1i(u_Sampler,0)
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
}