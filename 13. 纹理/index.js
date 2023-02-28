/*
 * @Author       : shikewen
 * @Date         : 2023-02-28 09:27:38
 * @LastEditors  : shikewen
 * @LastEditTime : 2023-02-28 09:32:49
 * @FilePath     : index.js
 * @Description  : 
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-02-28 09:27:38
 */
/*
 * @Author       : shikewen
 * @Date         : 2023-02-27 15:14:36
 * @LastEditors  : shikewen
 * @LastEditTime : 2023-02-27 16:55:01
 * @FilePath     : index.js
 * @Description  : 
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-02-27 15:14:36
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
    uniform sampler2D u_Sampler;
    varying vec2 v_TexCoord;
    void main() {
        gl_FragColor = texture2D(u_Sampler, v_TexCoord);
    }
    `
// function main() {
//     const canvas = document.getElementById('canvas_webgl');
//     const gl = canvas.getContext("webgl");

//     const program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
//     // gl.useProgram(program);

//     // 顶点坐标和纹理坐标
//     const verticesTexCoords = new Float32Array([
//         -0.5, 0.5, 0.0, 1.0,
//         -0.5, -0.5, 0.0, 0.0,
//         0.5, 0.5, 1.0, 1.0,
//         0.5, -0.5, 1.0, 0.0,
//     ]);
//     // 初始化数据
//     const n = initVertexBuffers(verticesTexCoords, gl);
//     // 配置和加载纹理
//     initTextures(n, gl);
// }


// // ------------------------函数----------------------------

// // 初始化数据
// function initVertexBuffers(verticesTexCoords, gl) {
//     const vertexTexCoordBuffer = gl.createBuffer();

//     // 将顶点坐标和纹理坐标写入缓冲区对象
//     gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

//     // 将顶点坐标分配给a_Position并开启它
//     const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
//     const a_Position = gl.getAttribLocation(gl.program, "a_Position");
//     gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
//     gl.enableVertexAttribArray(a_Position);

//     // 将纹理坐标分配给a_TexCoord并开启它
//     const a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
//     gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
//     gl.enableVertexAttribArray(a_TexCoord);

//     return verticesTexCoords.length / 4;
// }

// // 配置和加载纹理
// function initTextures(n, gl) {
//     // 创建纹理对象
//     const texture = gl.createTexture();
//     // 获取u_Sampler的存储位置
//     const u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
//     // 创建一个Image对象，用来加载图像
//     const image = new Image();
//     image.addEventListener('load', () => {
//         loadTexture(n, texture, u_Sampler, image, gl);
//     });
//     image.src = './image.jpg';
// }

// function loadTexture(n, texture, u_Sampler, image, gl) {
//     // 对纹理图像进行Y轴反转
//     gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
//     // 开启0号纹理单元
//     gl.activeTexture(gl.TEXTURE0);
//     // 绑定纹理对象
//     gl.bindTexture(gl.TEXTURE_2D, texture);
//     // 配置纹理参数
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//     // 将纹理图像分配给纹理对象
//     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
//     // 将0号纹理传递给着色器
//     gl.uniform1i(u_Sampler, 0);

//     draw(n, gl);
// }

// // 绘制
// function draw(n, gl) {
//     // 清除颜色缓冲区
//     gl.clearColor(0, 0, 0, 1);
//     gl.clear(gl.COLOR_BUFFER_BIT);
//     // 绘制矩形
//     gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
// }
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
    const texture = gl.createTexture();     // 创建纹理对象
    const u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');

    const image = new Image();
    image.src = '../static/arrow.png';
    image.onload = function () {
        loadTexture(gl, n, texture, u_Sampler, image);
    }
    return true;
}

function loadTexture(gl, n, texture, u_Sampler, image) {
    // 对纹理图像进行 y 轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // 开启 0 号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    // 向 target 绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // //处理图片像素非2的幂次方的配置
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // 配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // 将 0 号纹理传递给着色器
    gl.uniform1i(u_Sampler, 0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
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

