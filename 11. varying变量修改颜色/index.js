/*
 * @Author       : shikewen
 * @Date         : 2023-02-20 14:45:03
 * @LastEditors  : shikewen
 * @LastEditTime : 2023-02-20 17:05:00
 * @FilePath     : index.js
 * @Description  : 
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-02-20 14:45:03
 */

const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '    gl_Position = a_Position;\n' +
    '    gl_PointSize = a_PointSize;\n' +
    '    v_Color = a_Color;\n' +
    '}\n';

const FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){ \n' +
    '    gl_FragColor = v_Color;\n' +
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
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
    const verticesWithSize = new Float32Array([
        0.0, 0.5, 10.0, 0.5, 0.6, 0.7,
        -0.5, 0.5, 20.0, 0.6, 0.9, 0.1,
        0.5, -0.5, 30.0, 0.2, 0.8, 0.6
    ])
    const n = 3;

    const vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesWithSize, gl.STATIC_DRAW);

    const FSIZE = verticesWithSize.BYTES_PER_ELEMENT;

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
    gl.enableVertexAttribArray(a_PointSize);

    const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    return n;
}