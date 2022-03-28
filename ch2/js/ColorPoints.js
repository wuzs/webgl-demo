var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'void main(){\n'+
	'gl_Position = a_Position;\n'+
	'gl_PointSize = 10.0;\n'+

'}'
var FSHADER_SOURCE=
'precision mediump float;\n'+
'uniform vec4 u_FragColor;\n'+
'void main(){\n'+
	'gl_FragColor=u_FragColor;\n'+

'}'

function main(){
	let canvas = document.getElementById("webgl");
	let gl = getWebGLContext(canvas);
	if(!gl){
		console.log("Failed to get the rendering context for WebGL");
		return;
	}
	//初始化着色器
	if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){
		console.log("Failed to initialize shaders.");
		return
	}
	
	let a_Position = gl.getAttribLocation(gl.program,'a_Position');
	if(a_Position<0){
		console.log("Failed to get the storage location of a_Position");
		return
	}
	let u_FragColor = gl.getUniformLocation(gl.program,'u_FragColor');
	
	if(!u_FragColor){
		console.log("Failed to get the storage location of u_FragColor");
		return
	}
	
	canvas.onmousedown = function(ev){
		click(ev,gl,canvas,a_Position,u_FragColor);
	}
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
}

let g_points=[];
let g_colors=[];
function click(ev,gl,canvas,a_Position,u_FragColor){
	
	let x = ev.clientX;
	let y = ev.clientY;
	let rect = ev.target.getBoundingClientRect();
	
	x = ((x-rect.left )-canvas.width/2)/(canvas.width/2)
	y = (canvas.height/2 -(y - rect.top))/(canvas.height/2)
	g_points.push([x,y])
	
	if(x >=0.0 && y>=0.0){
		g_colors.push([1.0,0.0,0.0,1.0])
	}else if(x <0.0 && y<0.0){
		g_colors.push([0.0,1.0,0.0,1.0])
	}else{
		g_colors.push([1.0,1.0,1.0,1.0])
	}
	//清空屏幕
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	let len = g_points.length;
	for(let i=0;i<len;i++){
		let xy = g_points[i]
		let rgba = g_colors[i]
		gl.vertexAttrib3f(a_Position,xy[0],xy[1],0.0)
		gl.uniform4f(u_FragColor,rgba[0],rgba[1],rgba[2],rgba[3])
		gl.drawArrays(gl.POINTS,0,1)
	}
	
	
	
	
	
}