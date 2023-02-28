/*
 * @Author       : shikewen
 * @Date         : 2023-02-28 09:27:38
 * @LastEditors  : shikewen
 * @LastEditTime : 2023-02-28 10:08:00
 * @FilePath     : index.js
 * @Description  : 
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-02-28 09:27:38
 */
const VSHADER_SOURCE =
    'attribute vec4 a_Position; \n' +
    'attribute vec2 a_TexCoord; \n' +
    'varying vec2 v_TexCoord; \n' +
    'void main() { \n' +
    '    gl_Position = a_Position; \n' +
    '    v_TexCoord = a_TexCoord; \n' +
    '} \n';

const FSHADER_SOURCE =
    `
    precision mediump float;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    varying vec2 v_TexCoord;
    void main() {
        vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
        vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
        gl_FragColor = color0 * color1;
    }
    `

function main() {
    const canvas = document.getElementById('canvas_webgl');
    const gl = getWebGLContext(canvas);
    if (!gl) {
        console.error('Failed to get the rendering context for WebGL');
        return;
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Failed to intialize shaders.');
        return;
    }
    const n = initVertexBuffers(gl);
    if (n < 0) {
        console.error('Failed to set the positions of the vertices');
        return;
    }
    if (!initTextures(gl, n)) {
        console.error('Failed to set the textures');
        return;
    }

}

function initTextures(gl, n) {
    const texture0 = gl.createTexture();     // 创建纹理对象
    const texture1 = gl.createTexture();     // 创建纹理对象
    const u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    const u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');

    const image0 = new Image();
    const image1 = new Image();
    image1.src = '../static/arrow.png';
    image1.onload = function () {
        loadTexture(gl, n, texture1, u_Sampler1, image1, 1, true);
    }
    image0.src = '../static/fire.gif';
    image0.onload = function () {
        loadTexture(gl, n, texture0, u_Sampler0, image0, 0, false);
    }
    return true;
}

// 标记纹理单元是否已经就绪
let g_texUnit0 = false, g_texUnit1 = false;
function loadTexture(gl, n, texture, u_Sampler, image, textUnit, is2M) {
    // 对纹理图像进行 y 轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);


    // 激活纹理
    if(textUnit == 0) {
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit0 = true;
    } else {
        gl.activeTexture(gl.TEXTURE1);
        g_texUnit1 = true;
    }

    // 向 target 绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    if(!is2M){
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //处理图片像素非2的幂次方的配置
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    // 配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // 将 0 号纹理传递给着色器
    gl.uniform1i(u_Sampler, textUnit);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if(g_texUnit0 && g_texUnit1){
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
}

function initVertexBuffers(gl) {
    const vertices = new Float32Array([
        // 顶点坐标、纹理坐标
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ])
    const n = 4;
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error('Failed to create Buffer!');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const FSIZE = vertices.BYTES_PER_ELEMENT;

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    const a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);
    return n;

}

