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
		console.log("Failed to get the rendering context for WebGL");
		return;
	}
	//初始化着色器
	if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){
		console.log("Failed to initialize shaders.");
		return
	}
	var a_Position = gl.getAttribLocation(gl.program,'a_Position');
	if(a_Position){
		console.log("Failed to get the storage location of a_Position");
		return
	}
	
	canvas.onmousedown = function(ev){
		click(ev,gl,canvas,a_Position);
	}
	gl.clearColor(0.0,0.0,0.0,1.0)
	gl.clear(gl.COLOR_BUFFER_BIT);
}
var g_points=[];//存放鼠标点击位置
function click(ev,gl,canvas,a_Position){
	var x = ev.clientX;
	var y = ev.clientY;
	var rect = ev.target.getBoundingClientRect();
	
	//计算canvas webgl 坐标   webgl 坐标 -1~1
	x = ((x-rect.left) - canvas.width/2)/(canvas.width/2)
	y = (canvas.height/2 - (y-rect.top))/(canvas.height/2)
	g_points.push(x);
	g_points.push(y)
	//清空缓存区的颜色
	gl.clear(gl.COLOR_BUFFER_BIT);
	let len =g_points.length;
	for(let i=0;i<len;i+=2){
		//设置位置
		gl.vertexAttrib3f(a_Position,g_points[i],g_points[i+1],0.0)
		gl.drawArrays(gl.POINTS,0,1)
	}
	
	
	
	
	
}