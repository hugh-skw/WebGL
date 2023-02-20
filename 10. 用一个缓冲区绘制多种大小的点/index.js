/*
 * @Author       : shikewen
 * @Date         : 2023-02-20 13:45:57
 * @LastEditors  : shikewen
 * @LastEditTime : 2023-02-20 14:14:50
 * @FilePath     : index.js
 * @Description  : 
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-02-20 13:45:57
 */
const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main() {\n' +
    '    gl_Position = a_Position;\n' +
    '    gl_PointSize = a_PointSize;\n' +
    '}\n';

const FSHADER_SOURCE = 
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main() {\n' +
    '    gl_FragColor = u_FragColor;\n' +
    '}\n';

function main() {
    const canvas = document.getElementById('canvas_webgl');
    const gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Failed to intialize shaders.');
        return;
    }
    const n = initVertexBuffers(gl);
    if( n < 0 ) {
        console.log('Failed to set the positions of the vertices');
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
    const verticesWithSize = new Float32Array([
        0.0, 0.5, 10.0,
        -0.5, 0.5, 20.0,
        0.5, -0.5, 30.0
    ]);
    const n = 3;
    // 创建缓冲区对象
    const vertexSizeBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesWithSize, gl.STATIC_DRAW);

    const FSIZE =verticesWithSize.BYTES_PER_ELEMENT;
    console.log(FSIZE);

    // 获取 a_Position 的存储位置，分配缓冲区并开启
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(a_Position);

    // 获取 a_PointSize 的存储位置，分配缓冲区并开启
    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
    gl.enableVertexAttribArray(a_PointSize);

    // 颜色
    const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    gl.uniform4f(u_FragColor, 1.0, 0.5, 0.5, 1.0);

    return n;
}