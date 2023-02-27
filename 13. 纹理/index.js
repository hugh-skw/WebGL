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
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform sampler2D u_Sampler;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
    '}\n';
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
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    const vertices = new Float32Array([
        0.0, 0.5,
        -0.5, 0.5,
        0.5, -0.5,
    ])
    const n = 3;
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error('Failed to create Buffer!');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    return n;

}