const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    void main() {
        gl_Position = u_ModelMatrix * a_Position;
    }
`;

const FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

function main() {
    const canvas = document.getElementById('canvas_webgl');
    const gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    const n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    const n = 3;
    const vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ])
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');

    // 设置平移距离和旋转角度
    const Tx = 0.35;    // 沿x轴平移
    const ANGLE = -60.0;
    // 为旋转矩阵创建 Matrix4 对象
    const modelMatrix = new Matrix4();
    // 将 modelMatrix 设置为旋转矩阵（3个参数，旋转角、旋转轴xyz）
    modelMatrix.setRotate(ANGLE, 0, 0, 1);    // 这样是平移，再旋转
    modelMatrix.translate(Tx, 0, 0);     
    // modelMatrix.setTranslate(Tx, 0, 0);    // 这样是先旋转，再平移
    // modelMatrix.rotate(ANGLE, 0, 0, 1);    
    // modelMatrix.setTranslate(0.5, 0.5, 0.0);
    // 将旋转矩阵传输给顶点着色器
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    return n;
}