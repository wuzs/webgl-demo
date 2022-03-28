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
	'uniform sampler2D u_Sampler0;\n'+
	'uniform sampler2D u_Sampler1;\n'+
	'varying vec2 v_TexCoord;\n'+
	'void main(){'+
		'vec4 color0 = texture2D(u_Sampler0,v_TexCoord);\n'+
		'vec4 color1 = texture2D(u_Sampler1,v_TexCoord);\n'+
		'gl_FragColor = color0 * color1;\n'+
	
	'}'
function main(){
	var canvas = document.getElementById("webgl");
	var gl = getWebGLContext(canvas);
	//初始化着色器
	initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE);
	
	var n  = initVertexBuffers(gl);
	//初始化texture
	
	initTextures(gl,n);
	
	
}

function initTextures(gl,n){
	var texture0 = gl.createTexture();
	var texture1 = gl.createTexture();
	var u_Sampler0 = gl.getUniformLocation(gl.program,'u_Sampler0');
	
	var u_Sampler1 = gl.getUniformLocation(gl.program,'u_Sampler1');
	
	var image0 = new Image();
	var image1 = new Image();
	image0.onload = function(){
		loadTexture(gl,n,texture0,u_Sampler0,image0,0)
	}
	image1.onload = function(){
		loadTexture(gl,n,texture1,u_Sampler1,image1,1)
	}
	image0.src = '../resources/redflower.jpg';
	image1.src = '../resources/circle.gif';
	
	
	
}
var g_texUnit0=false,g_texUnit1=false;
function loadTexture(gl,n,texture,u_Sampler,image,texUint){
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1)
	if(texUint  ==0){
		gl.activeTexture(gl.TEXTURE0);
		g_texUnit0=true
	}else if(texUint ==1){
		gl.activeTexture(gl.TEXTURE1);
		g_texUnit1 = true
	}
	//绑定
	gl.bindTexture(gl.TEXTURE_2D,texture);
	//配置纹理参数
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR)
	//设置纹理
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image)
	
	//给取样器赋值
	gl.uniform1i(u_Sampler,texUint);
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	if(g_texUnit0 && g_texUnit1){
		gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
	}
}
function initVertexBuffers(gl){
	var verticesTexCoords = new Float32Array([
		-0.5,0.5,0.0,1.0,
		-0.5,-0.5,0.0,0.0,
		0.5,0.5,1.0,1.0,
		0.5,-0.5,1.0,1.0
	]);
	var n =4;
	
	//创建缓冲区
	var textureCoordBuffer = gl.createBuffer();
	//绑定buffer
	gl.bindBuffer(gl.ARRAY_BUFFER,textureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,verticesTexCoords,gl.STATIC_DRAW);
	var a_Position = gl.getAttribLocation(gl.program,'a_Position')
	var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
	gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSIZE*4,0);
	gl.enableVertexAttribArray(a_Position)
	var a_TexCoord = gl.getAttribLocation(gl.program,'a_TexCoord');
	gl.vertexAttribPointer(a_TexCoord,2,gl.FLOAT,false,FSIZE*4,FSIZE*2);
	gl.enableVertexAttribArray(a_TexCoord)
	return n;
}